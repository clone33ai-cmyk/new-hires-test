const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");
const router = express.Router();

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// In-memory store keyed by callId
const callResults = {};

const RUBRIC = `You are evaluating a dispatcher trainee for Mr. Pool Leak Repair.

Score these 12 items based on the transcript:
1. Proper greeting with their name and company name (5 pts)
2. Explained test covers: underground plumbing, shell, equipment pad, seals (10 pts)
3. Mentioned test takes 1-3 hours (5 pts)
4. Quoted correct price $375 in-area (10 pts)
5. Said customer does NOT have to be home, just backyard access (5 pts)
6. Mentioned full leak report / diagnosis included (10 pts)
7. Mentioned repair estimates are included (10 pts)
8. Mentioned warranty: 3-year no-leak or lifetime (10 pts)
9. Asked if customer had questions (5 pts)
10. Offered to send a text to collect customer info (10 pts)
11. Mentioned prepayment required, can cancel anytime for full refund (10 pts)
12. Professional, friendly, confident tone overall (10 pts)

Return ONLY raw JSON, no markdown, no backticks:
{
  "rubricResults": [
    { "item": "Proper greeting", "status": "hit", "points": 5, "maxPoints": 5, "note": "..." }
  ],
  "totalScore": 0,
  "coachingNotes": ["...", "..."],
  "recommendation": "STRONG HIRE",
  "summary": "2-3 sentence summary"
}`;

async function gradeTranscript(transcriptText) {
  const response = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 2000,
    messages: [{ role: "user", content: `${RUBRIC}\n\nTRANSCRIPT TO EVALUATE:\n\n${transcriptText}` }],
  });

  const raw = response.content[0].text.trim()
    .replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Could not parse grading response");
  }
}

// POST /api/vapi/webhook
router.post("/webhook", async (req, res) => {
  res.json({ received: true }); // Acknowledge immediately

  try {
    const { message } = req.body;
    console.log("VAPI webhook type:", message?.type, "callId:", message?.call?.id);

    if (message?.type !== "end-of-call-report") return;

    const callId = message.call?.id;
    if (!callId) { console.log("No callId"); return; }

    // Extract transcript — try all formats VAPI uses
    let transcriptText = "";

    if (message.transcript && typeof message.transcript === "string" && message.transcript.length > 10) {
      transcriptText = message.transcript;
      console.log("Format 1 - plain transcript:", transcriptText.length, "chars");
    } else if (message.artifact?.transcript) {
      transcriptText = message.artifact.transcript;
      console.log("Format 2 - artifact transcript:", transcriptText.length, "chars");
    } else if (message.messages?.length > 0) {
      transcriptText = message.messages
        .filter(m => (m.role === "user" || m.role === "assistant") && m.content?.trim())
        .map(m => `${m.role === "user" ? "DISPATCHER" : "CUSTOMER"}: ${m.content.trim()}`)
        .join("\n");
      console.log("Format 3 - messages array:", transcriptText.length, "chars");
    }

    console.log("Transcript preview:", transcriptText.slice(0, 200));

    if (!transcriptText || transcriptText.length < 10) {
      callResults[callId] = {
        status: "done",
        transcript: "",
        evaluation: {
          totalScore: 0,
          recommendation: "NOT RECOMMENDED",
          summary: "No transcript captured from this call.",
          rubricResults: [],
          coachingNotes: ["No transcript was received. Ensure microphone was active."]
        }
      };
      return;
    }

    callResults[callId] = { status: "grading", transcript: transcriptText };

    const evaluation = await gradeTranscript(transcriptText);
    callResults[callId] = { status: "done", transcript: transcriptText, evaluation };
    console.log("Grading done for", callId, "score:", evaluation.totalScore);

  } catch (err) {
    console.error("Webhook error:", err.message);
    const callId = req.body?.message?.call?.id;
    if (callId) {
      callResults[callId] = {
        status: "done",
        transcript: callResults[callId]?.transcript || "",
        evaluation: {
          totalScore: 0,
          recommendation: "MANUAL REVIEW",
          summary: "Grading error: " + err.message,
          rubricResults: [],
          coachingNotes: ["Grading failed: " + err.message]
        }
      };
    }
  }
});

// GET /api/vapi/result/:callId
router.get("/result/:callId", (req, res) => {
  const result = callResults[req.params.callId];
  if (!result) return res.json({ status: "pending" });
  res.json(result);
});

// GET /api/vapi/assistant-config
router.get("/assistant-config", (req, res) => {
  res.json({ assistantId: "beef8108-20f1-4a2f-9a4d-e24052e04d6f" });
});

module.exports = router;
