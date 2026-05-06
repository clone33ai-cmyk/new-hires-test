// ─────────────────────────────────────────────
// DISPATCHER CHALLENGES
// ─────────────────────────────────────────────

export const dispatcherChallenges = [
  // 1. DRAG TO RANK — Call script order
  {
    id: "drag_call_script",
    type: "drag_rank",
    title: "Order the Call",
    subtitle: "Drag the steps into the correct order",
    icon: "☎️",
    section: "Call Handling",
    instruction: "A new inbound call just came in from a homeowner who thinks their pool is leaking. Put the following call steps in the correct order from first to last.",
    correctOrder: [
      "Greet the caller: 'Leak Detection, [Name], how can I help you?'",
      "Listen to their concern and confirm leak detection is needed",
      "Explain what the test includes (plumbing, shell, equipment pad, seals)",
      "State the price: $375 in-area, $525 out-of-area",
      "Mention the test takes 1–3 hours, customer doesn't need to be home",
      "Explain they'll receive a full leak report plus repair estimate",
      "Mention the 3-year no-leak warranty on repairs",
      "Ask if they have questions",
      "Offer to send a text to collect their info",
      "Confirm prepayment and that they can cancel anytime",
    ],
    explanation: "This is the core Mr. Pool Leak Repair call flow. Establishing trust early (explaining the test) before stating price is key — customers need to understand the value before hearing the number.",
  },

  // 2. BRANCHING SCENARIO — Price objection
  {
    id: "branch_price_objection",
    type: "branching",
    title: "Handle the Price Objection",
    subtitle: "Customer pushes back on cost",
    icon: "💰",
    section: "Call Handling",
    customerEmoji: "😤",
    setup: "You've explained the leak detection service and quoted $375. The customer responds:",
    start: {
      customerSays: "'$375?! That seems really expensive just to find a leak. My neighbor said his guy did it for $150.'",
      choices: [
        {
          text: "Apologize and offer to see if there's a discount available.",
          next: "discount_bad",
        },
        {
          text: "Validate their concern, then explain what's included — specialized tools, 1–3 hour full test, complete diagnosis report, AND a repair estimate.",
          next: "value_explain",
        },
        {
          text: "'Well, you get what you pay for.' Leave it at that.",
          next: "rude_response",
        },
        {
          text: "Ask what their neighbor's guy found and whether the leak was actually fixed.",
          next: "smart_pivot",
        },
      ],
    },
    nodes: {
      discount_bad: {
        customerSays: "'Oh, so there IS flexibility? Can you do $250?'",
        coachNote: "Never offer discounts without manager approval — it devalues the service and opens the door to further negotiation.",
        choices: [
          { text: "No, I misspoke — the price is $375. Let me explain what that includes.", next: "recover" },
          { text: "Let me check with my manager...", next: "escalate_bad" },
        ],
      },
      escalate_bad: {
        customerSays: "'Forget it, I'll just call someone cheaper.'",
        terminal: true, score: 20,
        outcome: "Call Lost 😬",
        coachNote: "Offering to 'check with a manager' signals the price is negotiable, which it isn't. Always justify value before anything else.",
      },
      recover: {
        customerSays: "'Okay, what does the $375 actually cover?'",
        choices: [
          { text: "It covers everything — all underground plumbing, the entire pool shell, equipment pad, all seals. We use specialized tools including cameras, dye tests, pressure testing, and sonar. It takes 1–3 hours and you get a full written report plus a repair estimate.", next: "booked" },
          { text: "We check for leaks.", next: "vague_bad" },
        ],
      },
      vague_bad: {
        customerSays: "'That's not very helpful. I'm going to think about it.'",
        terminal: true, score: 30,
        outcome: "Customer Undecided 🤔",
        coachNote: "Always be specific. 'We check for leaks' doesn't justify $375. Detail builds trust.",
      },
      value_explain: {
        customerSays: "'Hmm, okay. So it's a full inspection, not just a quick look?'",
        choices: [
          { text: "'Exactly — it's a thorough 1–3 hour test of every possible leak source. And we don't just find them, we also repair them with a 3-year no-leak warranty.'", next: "booked" },
          { text: "'Yeah, pretty thorough.' Leave it there.", next: "weak_close" },
        ],
      },
      weak_close: {
        customerSays: "'Okay I guess... maybe. I'll think about it and call back.'",
        terminal: true, score: 55,
        outcome: "Soft Maybe 🤔",
        coachNote: "Always close with the warranty and the booking offer. Don't let them hang up without scheduling.",
      },
      rude_response: {
        customerSays: "'Wow, rude. I'm calling someone else.' *hangs up*",
        terminal: true, score: 0,
        outcome: "Call Lost — Attitude Problem 😬",
        coachNote: "Never be dismissive. Every objection is an opportunity to add value and build rapport.",
      },
      smart_pivot: {
        customerSays: "'Actually... he said he couldn't find anything. But the pool is still losing water.'",
        choices: [
          { text: "'That's exactly why we do a full test with specialized equipment. A cheap inspection misses things — we use cameras, pressure testing, sonar, and dye tests together. That's why we find what others miss.'", next: "booked" },
          { text: "'Yeah sometimes those guys aren't very good.'", next: "unprofessional" },
        ],
      },
      unprofessional: {
        customerSays: "'I don't want someone who talks trash about other companies...'",
        terminal: true, score: 15,
        outcome: "Trust Lost 😬",
        coachNote: "Never badmouth competitors. Focus on what WE do differently, not what others do wrong.",
      },
      booked: {
        customerSays: "'Okay, that makes sense. How do I get on the schedule?'",
        terminal: true, score: 100,
        outcome: "Booked! 🎉",
        coachNote: "Perfect. You justified the value, built trust, and moved to booking. This is the ideal outcome.",
      },
    },
  },

  // 3. TEXT THREAD — Post-detection follow-up
  {
    id: "text_followup",
    type: "text_thread",
    title: "Post-Detection Follow-Up",
    subtitle: "Handle the customer text thread after their detection",
    icon: "💬",
    section: "Follow-Up & Sales",
    context: "It's the day after a leak detection. The customer, Sarah M., received her report showing a seal failure and a small shell crack. Estimated repair: $3,045. She hasn't responded to your first follow-up text. She just texted.",
    contactName: "Sarah M.",
    steps: [
      {
        customerMessage: "Hi, I got the report. That price seems really high. $3,000 for what exactly?",
        choices: [
          { text: "Hey Sarah! Great question — the Seal Restoration Package ($2,450) fixes all the failing seals which are the primary leak source. The shell crack repair ($595) seals the structural crack we found. Both come with our 3-year no-leak warranty. Want me to get the tech on the phone to walk you through it?", points: 30 },
          { text: "Yes it's $3,045 for the two repairs we found.", points: 5 },
          { text: "The prices are what they are, those are our standard rates.", points: 0 },
        ],
      },
      {
        customerMessage: "Is there any way to just do one of them for now?",
        choices: [
          { text: "Totally understand! The Seal Restoration Package is the priority since that's the main leak source. We can start there for $2,450 and revisit the crack later. Would you like to move forward with that?", points: 25 },
          { text: "We recommend doing both at once but it's up to you.", points: 10 },
          { text: "Sure, whatever you want.", points: 0 },
        ],
      },
      {
        customerMessage: "I'm just not sure I have the budget right now honestly.",
        choices: [
          { text: "Totally get it! We do have financing options available — you can spread the payments out. Want me to send you the link to apply? It only takes a few minutes.", points: 25 },
          { text: "Okay, let us know when you're ready.", points: 5 },
          { text: "We can't do anything about pricing but good luck!", points: 0 },
        ],
      },
      {
        customerMessage: "Oh I didn't know you had financing! Yes please send me that.",
        choices: [
          { text: "Sending it over right now! Once you apply and get approved I'll get you on the repair schedule. Repairs are booking about 5-7 days out right now. 🙂", points: 20 },
          { text: "Okay I'll send it.", points: 10 },
          { text: "Here's the link: [financing link]", points: 8 },
        ],
      },
    ],
    closingMessage: "Perfect, got it! Thanks so much 😊",
    debrief: "The key to this follow-up: always explain what the repairs DO, not just what they cost. Proactively offering financing when a customer mentions budget concerns is a top technique for closing repairs that would otherwise be lost.",
  },

  // 4. TIMED PRESSURE ROUND — Pricing blitz
  {
    id: "timed_pricing",
    type: "timed",
    title: "Pricing Blitz ⚡",
    subtitle: "Answer fast — 60 seconds",
    icon: "⚡",
    section: "Pricing & Policy",
    timeSeconds: 60,
    questions: [
      { question: "Standard in-area leak detection price?", options: ["$275", "$375", "$475", "$325"], correct: 1 },
      { question: "Out-of-area travel fee added to $375?", options: ["$75", "$100", "$125", "$150"], correct: 3 },
      { question: "Realtor leak detection price?", options: ["$495", "$595", "$695", "$795"], correct: 2 },
      { question: "Seal Restoration Package price?", options: ["$1,850", "$2,150", "$2,450", "$2,750"], correct: 2 },
      { question: "Skimmer replacement price?", options: ["$2,150", "$2,450", "$2,850", "$3,200"], correct: 2 },
      { question: "Standard repair warranty length?", options: ["1 year", "2 years", "3 years", "5 years"], correct: 2 },
      { question: "Non-structural shell crack range?", options: ["$275-$595", "$595-$995", "$995-$1,500", "$1,500+"], correct: 1 },
      { question: "Average repair cost reference?", options: ["$1,500", "$2,000", "$2,500", "$3,000"], correct: 2 },
      { question: "Operating hours?", options: ["8AM-5PM Mon-Fri", "7AM-7PM 7 days", "9AM-6PM Mon-Sat", "8AM-6PM 7 days"], correct: 1 },
      { question: "Typical appointment scheduling window?", options: ["Same day", "1-2 days", "3-5 days", "1-2 weeks"], correct: 2 },
    ],
  },

  // 5. SYMPTOM DIAGNOSIS — Qualify the caller
  {
    id: "symptom_diag_dispatcher",
    type: "symptom_diagnosis",
    title: "Qualify the Caller",
    subtitle: "Walk through the diagnostic questions",
    icon: "🔍",
    section: "Call Handling",
    roleLabel: "Caller situation",
    situation: "A homeowner calls and says: 'I think my pool might be losing water but I'm not sure. It seems a little low sometimes.'",
    steps: [
      {
        question: "What's your FIRST qualifying question?",
        hint: "You need to determine if this is actually a leak or something else.",
        choices: [
          { text: "Have you done the bucket test to confirm it's losing more than evaporation?", points: 20, nextStep: 1 },
          { text: "I can schedule you for a detection right now — $375.", points: 0, nextStep: "skip_qualify" },
          { text: "How old is your pool?", points: 5, nextStep: 1 },
        ],
      },
      {
        question: "Customer says: 'I haven't done any test, it just seems low.' What do you ask next?",
        choices: [
          { text: "Is the water level dropping when the pump is on, off, or both?", points: 20, nextStep: 2 },
          { text: "Okay, you probably have a leak.", points: 0, nextStep: 2 },
          { text: "Do you have a pool guy?", points: 5, nextStep: 2 },
        ],
      },
      {
        question: "Customer says: 'Honestly I'm not sure, I just know it looks lower than usual.' How do you proceed?",
        choices: [
          { text: "Walk them through the bucket test: fill a bucket to pool level, set it on a step, check after 24hrs — if pool drops more than bucket, it's a leak.", points: 25, nextStep: 3 },
          { text: "Sounds like a leak — let's get you booked.", points: 10, nextStep: 3 },
          { text: "It might just be evaporation, especially in summer.", points: 15, nextStep: 3 },
        ],
      },
      {
        question: "Customer says they'll do the bucket test. What do you do before ending the call?",
        choices: [
          { text: "Get their info in the system now, explain the service and pricing, and tell them to call back with the bucket test result so you can confirm and schedule.", points: 35, terminal: true },
          { text: "Tell them to call back when they know for sure.", points: 5, terminal: true },
          { text: "Say goodbye and wait for them to call back.", points: 0, terminal: true },
        ],
      },
    ],
    debrief: "Great dispatchers pre-qualify callers AND capture their info early. Even if the customer isn't ready to book today, getting their name and number in the system and explaining the service plants the seed for a future booking.",
  },
];

// ─────────────────────────────────────────────
// TECHNICIAN CHALLENGES
// ─────────────────────────────────────────────

export const technicianChallenges = [
  // 1. DRAG TO RANK — Detection process order
  {
    id: "drag_detection_process",
    type: "drag_rank",
    title: "Order the Detection Process",
    subtitle: "Drag steps into the correct sequence",
    icon: "🔧",
    section: "Detection Process",
    instruction: "You've just arrived at a job. Put the following actions in the correct order for a full pool leak detection.",
    correctOrder: [
      "Click 'On the Way' before departing the previous location",
      "Text the customer 30 minutes before arrival",
      "Arrive and perform a visual inspection of the equipment pad and pool deck",
      "Begin pressure testing all underground plumbing lines",
      "Perform dye testing at fittings, light niches, skimmer, and main drain",
      "Use sonar listening devices to scan for underground pipe sounds",
      "Conduct camera inspection of plumbing lines if needed",
      "Take photos and videos of all findings",
      "Complete the written report: pool condition, leak locations, recommendations",
      "Upload report with photos and submit repair estimate",
    ],
    explanation: "The sequence matters — you always document BEFORE leaving the site. Clicking 'On the Way' triggers the customer notification system, so it must happen before departure, not on arrival.",
  },

  // 2. HOTSPOT — Click the leak source
  {
    id: "hotspot_pressure_off",
    type: "hotspot",
    title: "Find the Leak",
    subtitle: "Tap where you'd investigate first",
    icon: "🎯",
    section: "Detection Methods",
    scenario: "The homeowner says: 'My pool loses about an inch of water a day, but ONLY when the pump is turned OFF overnight. When the pump is running it seems fine.' Where do you investigate first?",
    correctZone: "shell",
    explanation: "Water loss ONLY when the pump is off = gravity-driven structural leak. The pool water is draining passively through a crack or opening in the shell, skimmer, light niche, or main drain — all areas below the waterline. The shell and its fittings are the #1 suspect.",
  },

  // 3. HOTSPOT — Pressure side
  {
    id: "hotspot_pressure_on",
    type: "hotspot",
    title: "Find the Leak",
    subtitle: "Tap where you'd investigate first",
    icon: "🎯",
    section: "Detection Methods",
    scenario: "The customer says: 'I notice air bubbles constantly coming out of my return jets when the pump is running. The pool loses water but only during the day when equipment is on.' Where do you investigate first?",
    correctZone: "equipment",
    explanation: "Air bubbles in return jets = suction-side air leak. Air is entering the system BEFORE the pump. Check equipment pad first: pump lid O-ring, union fittings, valve stems, and all suction-side connections. The equipment pad is the fastest first stop.",
  },

  // 4. BRANCHING — Customer challenges your findings
  {
    id: "branch_customer_dispute",
    type: "branching",
    title: "Customer Disputes Your Findings",
    subtitle: "Handle the pushback professionally",
    icon: "😤",
    section: "On-Site Professionalism",
    customerEmoji: "😤",
    setup: "You've completed the leak detection and found two issues: a failing seal at the light niche and a non-structural shell crack near the steps. Total estimate: $3,045. The customer walks out and says:",
    start: {
      customerSays: "'$3,000?! Another company came out 6 months ago and said everything was fine. I don't think you actually found real leaks — you're just trying to upsell me.'",
      choices: [
        { text: "Apologize and offer to reduce the estimate.", next: "reduce_bad" },
        { text: "Pull up the photos and videos on your tablet and walk them through each finding calmly.", next: "show_evidence" },
        { text: "'The other company was wrong, not us.'", next: "badmouth" },
        { text: "'These are real findings. The report speaks for itself.'", next: "dismissive" },
      ],
    },
    nodes: {
      reduce_bad: {
        customerSays: "'Oh so you admit the price is too high? Can you do $1,500?'",
        terminal: true, score: 10,
        outcome: "Estimate Undermined 😬",
        coachNote: "Never reduce the estimate under pushback without manager approval. It implies your findings weren't legitimate.",
      },
      show_evidence: {
        customerSays: "'Okay... show me what you found.'",
        choices: [
          { text: "Show them the dye test video at the light niche — the dye visibly gets pulled into the fitting. Then show the crack photos with measurement reference. Explain calmly what each means.", next: "convinced" },
          { text: "Show them the photos quickly and say 'see?'", next: "rushed" },
        ],
      },
      convinced: {
        customerSays: "'Okay, I can see the dye getting sucked in... that is a leak. And the crack is clear in the photo. I had no idea it looked like that.'",
        terminal: true, score: 100,
        outcome: "Trust Built 🎉",
        coachNote: "Photos and video are your best tool. Walk through them methodically — let the evidence do the talking. This is why documentation is mandatory.",
      },
      rushed: {
        customerSays: "'Those photos could be from anywhere. I'm not convinced.'",
        terminal: true, score: 40,
        outcome: "Still Skeptical 🤔",
        coachNote: "Take your time with the evidence walkthrough. Rushing through photos suggests uncertainty. Be methodical and explain what each image shows.",
      },
      badmouth: {
        customerSays: "'I'm not going to work with someone who disrespects other companies. I'm calling your manager.'",
        terminal: true, score: 0,
        outcome: "Complaint Filed 😬",
        coachNote: "Never badmouth competitors — ever. It reflects poorly on you and the company. Focus on what YOUR findings show.",
      },
      dismissive: {
        customerSays: "'That's not a satisfying answer. I want to speak to someone else.'",
        terminal: true, score: 20,
        outcome: "Escalated 😬",
        coachNote: "Don't be dismissive. Show the evidence — that's the professional response. The photos exist for exactly this situation.",
      },
    },
  },

  // 5. ESTIMATE BUILDER — Full job scenario
  {
    id: "estimate_builder_tech",
    type: "estimate_builder",
    title: "Build the Repair Estimate",
    subtitle: "Select the right repairs for this job",
    icon: "📋",
    section: "Repair Pricing",
    scenario: "You've completed a detection at a 12-year-old plaster pool. You found: (1) multiple failing seals at fittings throughout the equipment pad, (2) a skimmer that is cracked and leaking, and (3) a non-structural crack near the main drain about 4 inches long. The pool shell shows early signs of foundation movement — you level-checked and it needs 4 piers. What goes on the estimate?",
    lineItems: [
      { id: "seal", name: "Seal Restoration Package", price: 2450, required: true, note: "Recommended on every job — covers all seal failures at fittings" },
      { id: "skimmer", name: "Skimmer Replacement", price: 2850, required: true, note: "Cracked skimmer confirmed leaking" },
      { id: "crack", name: "Shell Crack Repair (non-structural)", price: 795, required: true, note: "4-inch crack near main drain" },
      { id: "piers", name: "Foundation Steel Piers (4 piers × $1,800)", price: 7200, required: true, note: "4 piers assessed by digital level" },
      { id: "concrete", name: "Concrete Replacement (4 breakouts × $275)", price: 1100, required: true, note: "Piers are under concrete deck" },
      { id: "plaster", name: "Full Pool Replaster", price: 12000, required: false, note: "Not indicated — no plaster failure found", optional: false },
      { id: "tile", name: "New Tile", price: 4500, required: false, note: "No tile damage noted", optional: false },
      { id: "backwash", name: "Leaking Backwash Handle", price: 375, required: false, note: "Not found in this job", optional: false },
    ],
    correctItems: ["seal", "skimmer", "crack", "piers", "concrete"],
    explanation: "The Seal Restoration Package goes on every estimate. Skimmer and crack are clear findings. The piers are under concrete deck (not dirt), so concrete replacement charges apply at $275 per breakout × 4 piers. Replastering was NOT indicated — never add repairs that weren't found.",
  },

  // 6. TIMED PRESSURE — Detection methods blitz
  {
    id: "timed_detection",
    type: "timed",
    title: "Detection Blitz ⚡",
    subtitle: "Pricing and methods — 60 seconds",
    icon: "⚡",
    section: "Detection & Pricing",
    timeSeconds: 60,
    questions: [
      { question: "Seal Restoration Package price?", options: ["$1,850", "$2,150", "$2,450", "$2,750"], correct: 2 },
      { question: "Pier cost each?", options: ["$1,200", "$1,500", "$1,800", "$2,200"], correct: 2 },
      { question: "Skimmer replacement?", options: ["$2,150", "$2,450", "$2,850", "$3,200"], correct: 2 },
      { question: "Concrete replacement per breakout?", options: ["$175", "$225", "$275", "$325"], correct: 2 },
      { question: "Under-deck pipe break?", options: ["$1,850", "$2,150", "$2,350", "$2,750"], correct: 2 },
      { question: "Air bubbles in returns = leak on which side?", options: ["Pressure side", "Suction side", "Shell", "Main drain"], correct: 1 },
      { question: "Loss only when pump OFF = focus on?", options: ["Return lines", "Equipment pad", "Structural/shell areas", "Filter"], correct: 2 },
      { question: "What tool assesses pier count?", options: ["Sonar device", "Pressure gauge", "Digital level", "Camera"], correct: 2 },
      { question: "Standard repair warranty?", options: ["1 year", "2 years", "3 years", "Lifetime"], correct: 2 },
      { question: "Recommend Seal Restoration on how many jobs?", options: ["Only if seals are failing", "Most jobs", "Every single job", "Only plaster pools"], correct: 2 },
    ],
  },

  // 7. SYMPTOM DIAGNOSIS FLOW — Field diagnosis
  {
    id: "symptom_diag_tech",
    type: "symptom_diagnosis",
    title: "Field Symptom Diagnosis",
    subtitle: "Work through the detective flow",
    icon: "🔍",
    section: "Detection Methods",
    roleLabel: "Job scenario",
    situation: "You arrive at a job. The homeowner says the pool loses about 1 inch per day consistently, both when the pump is on AND off. The equipment pad looks dry. You've done a visual inspection and see no obvious cracks in the shell.",
    steps: [
      {
        question: "Loss both on AND off — where do you start?",
        hint: "When loss happens regardless of pump state, you need to check both structural and plumbing.",
        choices: [
          { text: "Start with pressure testing the plumbing lines since both-state loss often includes underground pipe issues.", points: 25, nextStep: 1 },
          { text: "Start with the equipment pad since that's where the pipes connect.", points: 10, nextStep: 1 },
          { text: "Do a dye test everywhere at once.", points: 5, nextStep: 1 },
        ],
      },
      {
        question: "Pressure test shows the main return line holds pressure but the skimmer line drops rapidly. What does this tell you?",
        choices: [
          { text: "There's a leak in the skimmer line specifically — the skimmer or its underground pipe is the source.", points: 25, nextStep: 2 },
          { text: "The pressure test equipment might be faulty.", points: 0, nextStep: 2 },
          { text: "The entire plumbing system is bad.", points: 5, nextStep: 2 },
        ],
      },
      {
        question: "You dye-test the skimmer and see the dye get pulled into a crack in the skimmer body. What's your next step?",
        choices: [
          { text: "Document with photos/video right now, then continue testing other areas to make sure nothing is missed.", points: 30, nextStep: 3 },
          { text: "You found it — stop the test and write up the skimmer replacement.", points: 10, nextStep: 3 },
          { text: "Call dispatch to report the finding.", points: 5, nextStep: 3 },
        ],
      },
      {
        question: "After completing the full test, what must your report include?",
        choices: [
          { text: "Only the skimmer issue since that's what you confirmed.", points: 0, terminal: true },
          { text: "Pool condition, all findings (not just the skimmer), all photos/videos, leak locations, AND a repair estimate including the Seal Restoration Package recommendation.", points: 20, terminal: true },
          { text: "The skimmer finding and a quick note about other areas checked.", points: 10, terminal: true },
        ],
      },
    ],
    debrief: "Even when you find a clear leak source early, always complete the full detection — there may be multiple issues. The report must include everything: pool condition, all leak locations, photos/videos, and recommendations including the Seal Restoration Package on every estimate.",
  },

  // 8. PRE-VISIT CHECKLIST
  {
    id: "checklist_tech",
    type: "checklist",
    title: "Pre-Job Checklist",
    subtitle: "Pack your kit before leaving",
    icon: "✅",
    section: "Job Preparation",
    scenario: "You have a leak detection job in 20 minutes. It's a standard residential pool in Plano — 15 years old, homeowner suspects underground plumbing leak. Check off everything you need to bring.",
    items: [
      { id: "camera", name: "Underwater camera / inspection camera", category: "Detection Tools", required: true, note: "For plumbing line inspection" },
      { id: "pressure", name: "Pressure testing equipment", category: "Detection Tools", required: true, note: "To test all plumbing lines" },
      { id: "dye", name: "Dye testing kit", category: "Detection Tools", required: true, note: "For pinpoint visual confirmation" },
      { id: "sonar", name: "Sonar / acoustic listening device", category: "Detection Tools", required: true, note: "For underground pipe sounds" },
      { id: "phone", name: "Phone / tablet with camera", category: "Documentation", required: true, note: "For photos and videos of all findings" },
      { id: "report_access", name: "Access to report submission system", category: "Documentation", required: true, note: "To upload findings from the field" },
      { id: "minor_supplies", name: "Minor repair supplies (epoxy, sealant)", category: "Supplies", required: true, note: "For any small immediate repairs" },
      { id: "level", name: "Digital level", category: "Tools", required: true, note: "Required to assess foundation movement" },
      { id: "pump", name: "Portable pump", category: "Tools", required: true, note: "May be needed for water management" },
      { id: "pool_toys", name: "Pool cleaning net", category: "Unnecessary", required: false, note: "Not part of leak detection" },
      { id: "chemicals", name: "Pool chemicals (chlorine, pH)", category: "Unnecessary", required: false, note: "We don't service chemicals" },
      { id: "power_washer", name: "Power washer", category: "Supplies", required: false, optional: true, note: "Optional — useful for clearing deck debris" },
    ],
    explanation: "All detection tools are mandatory — you cannot perform a complete leak detection without all four methods (camera, pressure, dye, sonar). The digital level is required in case you spot foundation movement. Never leave without your documentation setup — photos and video are non-negotiable.",
  },
];
