const express = require("express");
const router = express.Router();

// The VAPI assistant system prompt - plays a realistic customer calling in
const CUSTOMER_PERSONA = `You are a homeowner calling Mr. Pool Leak Repair. Your name is Mike Rodriguez. 
You have a pool that you think is losing water — about an inch per day. You found the number online.

Personality: You're a busy dad, slightly skeptical about cost, but reasonable. You ask natural questions like:
- "How long does this take?"
- "Do I have to be home?"
- "Why does it cost $375?"
- "Can you guarantee you'll find the leak?"
- "What if you don't find anything?"
- "What happens after you find it, how much to fix it?"

Start the call by simply saying: "Hi, yeah, I think my pool has a leak. Someone gave me your number."

Let the dispatcher lead. Respond naturally to what they say. If they do NOT mention the price, ask about it. If they don't mention the warranty, don't bring it up yourself. 
After about 5-6 natural exchanges, if the dispatcher has covered the key points and asked for your info, agree to move forward and say you're ready to schedule.
If the dispatcher is doing poorly (missing key info, not answering questions), stay on the call but be more resistant.

Keep responses SHORT — 1-3 sentences like a real phone call. Do not over-explain. React naturally.`;

// POST /api/vapi/assistant-config
// Returns the VAPI assistant configuration for the frontend to use
router.get("/assistant-config", (req, res) => {
  res.json({
    assistant: {
      name: "Pool Leak Customer (Mike)",
      firstMessage: "Hi, yeah, I think my pool has a leak. Someone gave me your number.",
      model: {
        provider: "anthropic",
        model: "claude-sonnet-4-20250514",
        systemPrompt: CUSTOMER_PERSONA,
        temperature: 0.7,
      },
      voice: {
        provider: "11labs",
        voiceId: "onwK4e9ZLuTAKqWW03F9", // Daniel - natural male voice
      },
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      endCallMessage: "Thanks for calling, I'll wait to hear back from you.",
      endCallPhrases: ["that's all for now", "goodbye", "talk to you soon", "end call"],
      maxDurationSeconds: 300,
    },
  });
});

// POST /api/vapi/webhook
// Receives call ended events from VAPI with full transcript
router.post("/webhook", (req, res) => {
  const { message } = req.body;
  if (message?.type === "end-of-call-report") {
    // In production, you could store transcripts here
    // For now we just acknowledge
    console.log("Call ended, transcript received:", message.transcript?.length, "chars");
  }
  res.json({ received: true });
});

module.exports = router;
