const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");
const router = express.Router();

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const DISPATCHER_SCRIPT_RUBRIC = `
You are evaluating a dispatcher trainee's call handling for Mr. Pool Leak Repair.

REQUIRED TALKING POINTS (each worth points):
1. Proper greeting: "Hi, this is [Name] with Mr. Pool Leak Repair" (5 pts)
2. Explained what a pool leak detection test is - checks all underground plumbing, shell, equipment pad, seals (10 pts)
3. Mentioned test duration: 1-3 hours (5 pts)
4. Stated correct price: $375 (in-area) or mentioned travel fee for out-of-area (10 pts)
5. Mentioned customer does NOT have to be home, just needs backyard access (5 pts)
6. Mentioned the full leak report / diagnosis they receive (10 pts)
7. Mentioned repairs are also offered with estimates (10 pts)
8. Mentioned the warranty (3-year no-leak warranty or lifetime) (10 pts)
9. Asked if customer had questions (5 pts)
10. Offered to send a text / collect info via text (10 pts)
11. Mentioned prepayment policy and that they can cancel anytime (10 pts)
12. Professional, friendly, and confident tone throughout (10 pts)

TOTAL: 100 points

Analyze the transcript below. For each rubric item, state whether it was hit (✓), missed (✗), or partially covered (~). Give a total score out of 100. Provide 2-3 specific coaching notes about what to improve. End with a hire recommendation: STRONG HIRE (85+), CONSIDER (65-84), or NOT RECOMMENDED (<65).

Format your response as JSON:
{
  "rubricResults": [
    { "item": "Proper greeting", "status": "hit|missed|partial", "points": 0-5, "maxPoints": 5, "note": "..." },
    ...
  ],
  "totalScore": 0-100,
  "coachingNotes": ["...", "...", "..."],
  "recommendation": "STRONG HIRE|CONSIDER|NOT RECOMMENDED",
  "summary": "2-3 sentence overall summary"
}
`;

const TECHNICIAN_SCENARIO_RUBRIC = `
You are evaluating a pool leak detection technician trainee for Mr. Pool Leak Repair.

Their quiz answers and scenario responses are provided below. Score each on correctness, safety, and process adherence.

Company context:
- Detection methods: camera inspection, dye tests, pressure testing, sonar listening devices
- Pre-visit: click "On the Way" before departure, bring all tools
- Documentation: photos and videos of all leaks required
- Seal Restoration Package: $2,450 (most common, recommend on every job)
- Skimmer Replacement: $2,850
- Under Concrete Deck Pipe Breaks: $2,350
- Cracks (non-structural): $595-$995
- Pool Plaster: $8,500-$16,000
- Foundation Steel Piers: $1,800 each (most pools need ~10)
- Always submit photos, notes, pool condition, leak locations, and recommendations in the report
- 3-year no-leak warranty on repairs, lifetime on foundation work

Evaluate the answers provided and return JSON:
{
  "sectionScores": {
    "companyKnowledge": { "score": 0-100, "notes": "..." },
    "detectionMethods": { "score": 0-100, "notes": "..." },
    "repairPricing": { "score": 0-100, "notes": "..." },
    "scenarioHandling": { "score": 0-100, "notes": "..." },
    "documentation": { "score": 0-100, "notes": "..." }
  },
  "totalScore": 0-100,
  "coachingNotes": ["...", "...", "..."],
  "recommendation": "STRONG HIRE|CONSIDER|NOT RECOMMENDED",
  "summary": "2-3 sentence overall summary"
}
`;

// POST /api/evaluate/transcript
router.post("/transcript", async (req, res) => {
  try {
    const { transcript, role } = req.body;
    if (!transcript || !role) return res.status(400).json({ error: "Missing transcript or role" });

    const prompt = role === "dispatcher"
      ? `${DISPATCHER_SCRIPT_RUBRIC}\n\nTRANSCRIPT:\n${transcript}`
      : `${TECHNICIAN_SCENARIO_RUBRIC}\n\nANSWERS:\n${transcript}`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return res.status(500).json({ error: "Failed to parse evaluation" });

    res.json(JSON.parse(jsonMatch[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Evaluation failed" });
  }
});

// POST /api/evaluate/quiz
router.post("/quiz", async (req, res) => {
  try {
    const { answers, role } = req.body;
    if (!answers || !role) return res.status(400).json({ error: "Missing answers or role" });

    const answersText = answers.map((a, i) =>
      `Q${i + 1}: ${a.question}\nAnswer given: ${a.given}\nCorrect answer: ${a.correct}\nCorrect: ${a.isCorrect}`
    ).join("\n\n");

    const prompt = `You are grading a ${role} knowledge quiz for Mr. Pool Leak Repair. 
    
Here are the results:
${answersText}

Provide a JSON response:
{
  "totalCorrect": number,
  "totalQuestions": number,
  "percentage": number,
  "missedTopics": ["topic1", "topic2"],
  "recommendation": "STRONG HIRE|CONSIDER|NOT RECOMMENDED",
  "coachingNotes": ["...", "...", "..."]
}`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return res.status(500).json({ error: "Failed to parse quiz evaluation" });

    res.json(JSON.parse(jsonMatch[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Quiz evaluation failed" });
  }
});

module.exports = router;
