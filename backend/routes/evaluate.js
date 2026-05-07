const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");
const router = express.Router();

// Log key status on startup (masked)
const apiKey = process.env.ANTHROPIC_API_KEY;
console.log("Anthropic API key status:", apiKey ? `set (${apiKey.slice(0,10)}...)` : "NOT SET");

const client = new Anthropic({ apiKey });

const RUBRIC = `You are evaluating a dispatcher trainee for Mr. Pool Leak Repair.

Score these 12 items based on the transcript:
1. Proper greeting with their name and company name (5 pts)
2. Explained test covers: underground plumbing, shell, equipment pad, seals (10 pts)
3. Mentioned test takes 1-3 hours (5 pts)
4. Quoted correct price $375 in-area (10 pts)
5. Said customer does NOT have to be home, just backyard access needed (5 pts)
6. Mentioned full leak report / diagnosis included (10 pts)
7. Mentioned repair estimates are included (10 pts)
8. Mentioned warranty: 3-year no-leak or lifetime on foundation (10 pts)
9. Asked if customer had questions (5 pts)
10. Offered to send a text to collect customer info (10 pts)
11. Mentioned prepayment required, can cancel anytime for full refund (10 pts)
12. Professional, friendly, confident tone overall (10 pts)

IMPORTANT: Return ONLY a raw JSON object. No markdown. No backticks. No explanation before or after.

{
  "rubricResults": [
    { "item": "Proper greeting", "status": "hit", "points": 5, "maxPoints": 5, "note": "Said name and company clearly" },
    { "item": "Explained test coverage", "status": "missed", "points": 0, "maxPoints": 10, "note": "Did not explain what the test covers" },
    { "item": "Test duration 1-3 hours", "status": "hit", "points": 5, "maxPoints": 5, "note": "Mentioned duration" },
    { "item": "Quoted $375 price", "status": "hit", "points": 10, "maxPoints": 10, "note": "Correct price stated" },
    { "item": "Customer does not need to be home", "status": "missed", "points": 0, "maxPoints": 5, "note": "Not mentioned" },
    { "item": "Full report included", "status": "partial", "points": 5, "maxPoints": 10, "note": "Mentioned briefly" },
    { "item": "Repair estimates included", "status": "missed", "points": 0, "maxPoints": 10, "note": "Not mentioned" },
    { "item": "Warranty mentioned", "status": "missed", "points": 0, "maxPoints": 10, "note": "Not mentioned" },
    { "item": "Asked for questions", "status": "hit", "points": 5, "maxPoints": 5, "note": "Asked at end" },
    { "item": "Offered to text for info", "status": "hit", "points": 10, "maxPoints": 10, "note": "Offered text" },
    { "item": "Prepayment and cancellation policy", "status": "missed", "points": 0, "maxPoints": 10, "note": "Not mentioned" },
    { "item": "Professional tone", "status": "hit", "points": 8, "maxPoints": 10, "note": "Generally professional" }
  ],
  "totalScore": 48,
  "coachingNotes": ["Always mention the warranty", "Explain what the test covers in detail", "Mention prepayment policy"],
  "recommendation": "CONSIDER",
  "summary": "The dispatcher handled the basics but missed several key script points."
}`;

// POST /api/evaluate/transcript
router.post("/transcript", async (req, res) => {
  try {
    const { transcript, role } = req.body;

    if (!transcript || !role) {
      return res.status(400).json({ error: "Missing transcript or role" });
    }

    if (!apiKey) {
      return res.status(500).json({ error: "ANTHROPIC_API_KEY not set on server" });
    }

    console.log("Evaluating transcript, length:", transcript.length, "role:", role);

    const prompt = `${RUBRIC}\n\nNow evaluate this actual transcript:\n\n${transcript}`;

    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = response.content[0].text.trim();
    console.log("Claude raw response (first 300 chars):", raw.slice(0, 300));

    // Strip any accidental markdown
    const cleaned = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let result;
    try {
      result = JSON.parse(cleaned);
    } catch (parseErr) {
      // Try to extract JSON from the response
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) {
        result = JSON.parse(match[0]);
      } else {
        throw new Error("Could not parse Claude response as JSON: " + cleaned.slice(0, 100));
      }
    }

    console.log("Evaluation complete, score:", result.totalScore);
    res.json(result);

  } catch (err) {
    console.error("Evaluation error:", err.message);
    console.error("Full error:", err);
    res.status(500).json({
      error: "Evaluation failed: " + err.message,
      totalScore: 0,
      recommendation: "MANUAL REVIEW",
      summary: "Grading failed — see server logs.",
      rubricResults: [],
      coachingNotes: ["Server error: " + err.message]
    });
  }
});

// POST /api/evaluate/quiz
router.post("/quiz", async (req, res) => {
  try {
    const { answers, role } = req.body;
    if (!answers || !role) return res.status(400).json({ error: "Missing answers or role" });

    const answersText = answers.map((a, i) =>
      `Q${i + 1}: ${a.question}\nAnswer given: ${a.given}\nCorrect: ${a.correct}\nWas correct: ${a.isCorrect}`
    ).join("\n\n");

    const prompt = `Grade this ${role} knowledge quiz for Mr. Pool Leak Repair.

${answersText}

Return ONLY raw JSON, no markdown:
{
  "totalCorrect": 0,
  "totalQuestions": 0,
  "percentage": 0,
  "missedTopics": [],
  "recommendation": "CONSIDER",
  "coachingNotes": []
}`;

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = response.content[0].text.trim()
      .replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

    res.json(JSON.parse(raw));
  } catch (err) {
    console.error("Quiz eval error:", err.message);
    res.status(500).json({ error: "Quiz evaluation failed: " + err.message });
  }
});

// GET /api/evaluate/health — quick test endpoint
router.get("/health", async (req, res) => {
  try {
    if (!apiKey) return res.json({ status: "error", message: "ANTHROPIC_API_KEY not set" });
    res.json({ status: "ok", keyPrefix: apiKey.slice(0, 10) + "..." });
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
});

module.exports = router;

// GET /api/evaluate/test — test Claude API directly with a sample transcript
router.get("/test", async (req, res) => {
  try {
    if (!apiKey) return res.json({ status: "error", message: "ANTHROPIC_API_KEY not set" });

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 100,
      messages: [{ role: "user", content: "Say hello in exactly 5 words." }],
    });

    res.json({
      status: "ok",
      keyPrefix: apiKey.slice(0, 14) + "...",
      claudeResponse: response.content[0].text,
    });
  } catch (err) {
    res.json({ status: "error", message: err.message, type: err.constructor?.name });
  }
});
