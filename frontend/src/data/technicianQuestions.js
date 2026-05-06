export const technicianQuestions = [
  // --- COMPANY KNOWLEDGE ---
  {
    id: "t1",
    section: "Company Knowledge",
    type: "multiple_choice",
    question: "What is the standard leak detection price for a residential customer in the DFW service area?",
    options: ["$275", "$325", "$375", "$425"],
    correct: 2,
    explanation: "$375 is the standard residential leak detection price within the service area."
  },
  {
    id: "t2",
    section: "Company Knowledge",
    type: "multiple_choice",
    question: "What is the company's standard warranty on pool leak repairs?",
    options: ["1-year no-leak warranty", "2-year no-leak warranty", "3-year no-leak warranty", "Lifetime warranty on all repairs"],
    correct: 2,
    explanation: "Repairs come with a 3-year no-leak warranty. Foundation pier work comes with a lifetime warranty."
  },
  {
    id: "t3",
    section: "Company Knowledge",
    type: "true_false",
    question: "Mr. Pool Leak Repair offers a Lifetime No-Leak Guarantee on foundation (pier) repairs.",
    correct: true,
    explanation: "Foundation pier repairs carry a lifetime warranty — this is one of our key industry differentiators."
  },
  {
    id: "t4",
    section: "Company Knowledge",
    type: "multiple_choice",
    question: "What action must a technician take BEFORE leaving for a job?",
    options: [
      "Call the customer to confirm",
      "Click 'On the Way' in the system",
      "Submit a pre-visit checklist",
      "Contact dispatch for route confirmation"
    ],
    correct: 1,
    explanation: "Click 'On the Way' before departure — this triggers the customer notification and keeps dispatch informed."
  },
  {
    id: "t5",
    section: "Company Knowledge",
    type: "multiple_choice",
    question: "When should you send the customer a notification that you're on the way?",
    options: ["When you leave the previous job", "30 minutes before arrival", "Upon arrival", "The morning of the appointment"],
    correct: 1,
    explanation: "Send a text message 30 minutes before arrival so the customer is prepared."
  },
  {
    id: "t6",
    section: "Company Knowledge",
    type: "true_false",
    question: "You should recommend the Seal Restoration Package on every single job.",
    correct: true,
    explanation: "The Seal Restoration Package ($2,450) is the most common repair solution and should be included in every estimate."
  },
  {
    id: "t7",
    section: "Company Knowledge",
    type: "multiple_choice",
    question: "How many leak detections does the company typically complete per day?",
    options: ["1-2", "2-4", "5-10", "10-15"],
    correct: 2,
    explanation: "The company completes 5-10 leak detections daily."
  },

  // --- DETECTION METHODS ---
  {
    id: "t8",
    section: "Detection Methods",
    type: "multiple_choice",
    question: "Which of the following is NOT one of the company's leak detection methods?",
    options: ["Camera inspection", "Dye testing", "Moisture meter scanning", "Pressure testing"],
    correct: 2,
    explanation: "The four detection methods are: camera inspection, dye tests, pressure testing, and sonar listening devices. Moisture meters are not part of the standard toolkit."
  },
  {
    id: "t9",
    section: "Detection Methods",
    type: "multiple_choice",
    question: "What is pressure testing primarily used to check?",
    options: [
      "The pool shell for structural cracks",
      "Underground plumbing lines for leaks",
      "The pump's output capacity",
      "Filter efficiency"
    ],
    correct: 1,
    explanation: "Pressure testing involves pressurizing the plumbing lines to check for leaks in underground pipes."
  },
  {
    id: "t10",
    section: "Detection Methods",
    type: "multiple_choice",
    question: "What is a dye test best used for?",
    options: [
      "Testing underground pipes",
      "Locating pinhole leaks in specific visible areas like cracks, fittings, or light niches",
      "Checking water chemistry",
      "Testing the pump seal"
    ],
    correct: 1,
    explanation: "Dye testing uses colored dye near suspected leak points — if there's a leak, the dye gets pulled into the crack or gap, confirming the location."
  },
  {
    id: "t11",
    section: "Detection Methods",
    type: "multiple_choice",
    question: "Sonar listening devices are used primarily for:",
    options: [
      "Listening to pump performance",
      "Detecting underground pipe leaks by sound",
      "Checking water pressure",
      "Finding cracks in the pool shell visually"
    ],
    correct: 1,
    explanation: "Sonar/acoustic listening devices detect the sound of water escaping underground pipes, allowing technicians to pinpoint leak locations without digging."
  },
  {
    id: "t12",
    section: "Detection Methods",
    type: "true_false",
    question: "A camera inspection can be used to visually inspect the inside of plumbing lines.",
    correct: true,
    explanation: "Camera inspection allows visual inspection of plumbing lines from the inside to identify cracks, breaks, or obstructions."
  },
  {
    id: "t13",
    section: "Detection Methods",
    type: "multiple_choice",
    question: "A pool is losing water ONLY when the pump is running. Which system should you test FIRST?",
    options: [
      "The pool shell and tile",
      "The main drain",
      "The pressure/return side plumbing",
      "The skimmer basket"
    ],
    correct: 2,
    explanation: "Water loss only when the pump runs indicates pressure-side issues — start with return lines and pressure-side plumbing."
  },
  {
    id: "t14",
    section: "Detection Methods",
    type: "multiple_choice",
    question: "A pool is losing water ONLY when the pump is OFF. Where should your investigation focus?",
    options: [
      "Return line plumbing",
      "Pump seals and motor",
      "Structural areas: shell cracks, skimmer, light niche, main drain",
      "The filter system"
    ],
    correct: 2,
    explanation: "Loss only when equipment is off = gravity-driven leak. Focus on structural: shell cracks, skimmer leaks, light niche, main drain — anywhere below the water line."
  },
  {
    id: "t15",
    section: "Detection Methods",
    type: "multiple_choice",
    question: "Air bubbles appearing in the return lines indicate:",
    options: [
      "A filter that needs cleaning",
      "A suction-side leak pulling air into the plumbing before the pump",
      "The pump is running too fast",
      "Normal pool circulation behavior"
    ],
    correct: 1,
    explanation: "Air bubbles in returns = suction-side leak. Air is being pulled into the system through a crack or faulty seal somewhere before the pump."
  },
  {
    id: "t16",
    section: "Detection Methods",
    type: "scenario",
    question: "You arrive at a job and the equipment pad is always wet. The customer says it's been wet for months. What do you check?",
    options: [
      "The pool shell immediately",
      "All equipment pad seals, pump lid, valves, union fittings, and filter connections",
      "The underground plumbing only",
      "The skimmer and main drain"
    ],
    correct: 1,
    explanation: "A consistently wet equipment pad means you systematically check all seals, fittings, pump lid O-ring, valve stems, union fittings, and filter connections at the pad."
  },
  {
    id: "t17",
    section: "Detection Methods",
    type: "multiple_choice",
    question: "During a dye test near the light niche, the dye gets sucked into the fitting. This means:",
    options: [
      "The dye test failed — redo it",
      "There is confirmed leakage at the light niche conduit or seal",
      "The water flow is normal",
      "The light needs replacing, not sealing"
    ],
    correct: 1,
    explanation: "Dye being pulled into any fitting or crack confirms a leak at that exact point — the suction from the escaping water draws the dye in."
  },

  // --- DOCUMENTATION ---
  {
    id: "t18",
    section: "Documentation",
    type: "true_false",
    question: "You must take photos and videos of every leak found during a detection.",
    correct: true,
    explanation: "Photos and videos are mandatory proof of leaks. They are uploaded with the report and shared with the customer in their leak diagnosis document."
  },
  {
    id: "t19",
    section: "Documentation",
    type: "multiple_choice",
    question: "What must be included in every leak detection report?",
    options: [
      "Pool condition, leak locations, and repair recommendations",
      "Only the leak locations",
      "Just photos with no written notes",
      "A verbal summary to the customer is sufficient"
    ],
    correct: 0,
    explanation: "Every report must include: pool condition, all leak locations, photos/videos, and additional recommendations (repairs, remodels, foundation issues, etc.)."
  },
  {
    id: "t20",
    section: "Documentation",
    type: "true_false",
    question: "If you find no leaks, you still need to submit a report documenting your findings.",
    correct: true,
    explanation: "A report is always required — documenting what was tested, what was found (or not found), and the condition of the pool."
  },
  {
    id: "t21",
    section: "Documentation",
    type: "multiple_choice",
    question: "Besides leak locations, what additional recommendations should be noted in the report?",
    options: [
      "Nothing — only document leaks",
      "Only structural issues",
      "Any repairs needed, remodel opportunities, foundation concerns, and other recommendations",
      "Only items the customer specifically asks about"
    ],
    correct: 2,
    explanation: "Document everything: repairs, remodel opportunities, foundation concerns, and any other issues observed. This creates upsell opportunities and covers liability."
  },

  // --- REPAIR PRICING ---
  {
    id: "t22",
    section: "Repair Pricing",
    type: "multiple_choice",
    question: "What is the price of the Seal Restoration Package?",
    options: ["$1,850", "$2,150", "$2,450", "$2,750"],
    correct: 2,
    explanation: "The Seal Restoration Package costs $2,450 and is the most common repair — recommend it on every job."
  },
  {
    id: "t23",
    section: "Repair Pricing",
    type: "multiple_choice",
    question: "A skimmer replacement costs:",
    options: ["$2,150", "$2,450", "$2,850", "$3,200"],
    correct: 2,
    explanation: "Skimmer replacement is priced at $2,850."
  },
  {
    id: "t24",
    section: "Repair Pricing",
    type: "multiple_choice",
    question: "Under-concrete deck pipe break repair costs:",
    options: ["$1,850", "$2,350", "$2,850", "$3,500"],
    correct: 1,
    explanation: "Under concrete deck pipe break repairs cost $2,350."
  },
  {
    id: "t25",
    section: "Repair Pricing",
    type: "multiple_choice",
    question: "Non-structural cracks in the pool shell are priced at:",
    options: ["$275 - $495", "$495 - $750", "$595 - $995", "$995 - $1,500"],
    correct: 2,
    explanation: "Non-structural pool shell cracks cost $595 to $995 depending on size and complexity."
  },
  {
    id: "t26",
    section: "Repair Pricing",
    type: "multiple_choice",
    question: "Pool plaster (replastering the entire pool) costs approximately:",
    options: ["$3,500 - $6,000", "$5,000 - $9,000", "$8,500 - $16,000", "$15,000 - $25,000"],
    correct: 2,
    explanation: "Full pool plaster ranges from $8,500 to $16,000 depending on the pool size and finish."
  },
  {
    id: "t27",
    section: "Repair Pricing",
    type: "multiple_choice",
    question: "Foundation steel piers are priced at:",
    options: ["$800 each", "$1,200 each", "$1,500 each", "$1,800 each"],
    correct: 3,
    explanation: "Foundation steel piers cost $1,800 each. Most pools require approximately 10 piers. A digital level is required to assess how many piers are needed."
  },
  {
    id: "t28",
    section: "Repair Pricing",
    type: "multiple_choice",
    question: "Replacing concrete from a pier breakout costs how much per breakout (when piers are under concrete, not dirt)?",
    options: ["$175 each", "$225 each", "$275 each", "$350 each"],
    correct: 2,
    explanation: "$275 per concrete breakout replacement. Note: piers installed in dirt do NOT incur concrete replacement charges."
  },
  {
    id: "t29",
    section: "Repair Pricing",
    type: "multiple_choice",
    question: "A leaking backwash handle costs:",
    options: ["$175", "$275", "$375", "$475"],
    correct: 2,
    explanation: "A leaking backwash handle repair costs $375."
  },
  {
    id: "t30",
    section: "Repair Pricing",
    type: "multiple_choice",
    question: "What tool is required to assess how many foundation piers a pool needs?",
    options: ["Sonar device", "Pressure gauge", "Digital level", "Moisture meter"],
    correct: 2,
    explanation: "A digital level is required to measure foundation movement and determine the number of piers needed."
  },

  // --- POOL STRUCTURE & SYMPTOMS ---
  {
    id: "t31",
    section: "Pool Structure & Symptoms",
    type: "multiple_choice",
    question: "Which of the following is the MOST common source of pool leaks that Mr. Pool Leak Repair deals with?",
    options: ["Underground pipe breaks", "Seal failures at fittings and equipment", "Shell cracks", "Main drain failures"],
    correct: 1,
    explanation: "Seal failures are the most common issue — which is why the Seal Restoration Package is recommended on every job."
  },
  {
    id: "t32",
    section: "Pool Structure & Symptoms",
    type: "multiple_choice",
    question: "A pool losing water at the water line level (water stops dropping at a certain point) typically indicates:",
    options: [
      "Underground pipe leak",
      "A leak at or near the water line — light niche, return fitting, or crack at that elevation",
      "Evaporation",
      "Pump seal failure"
    ],
    correct: 1,
    explanation: "When a pool water level stabilizes at a specific point and stops dropping, the leak source is likely AT that water level — a light niche, return fitting, skimmer, or wall crack at that elevation."
  },
  {
    id: "t33",
    section: "Pool Structure & Symptoms",
    type: "true_false",
    question: "Foundation movement can cause structural damage to a pool.",
    correct: true,
    explanation: "Foundation movement is a serious structural issue — it can crack the shell, break plumbing, and require pier repairs. Always document and report signs of foundation movement."
  },
  {
    id: "t34",
    section: "Pool Structure & Symptoms",
    type: "multiple_choice",
    question: "A customer's pump basket keeps running empty (not filling with water). This most likely indicates:",
    options: [
      "A dirty filter",
      "A suction-side leak before the pump pulling air",
      "Pump motor failure",
      "Low water level in the pool"
    ],
    correct: 1,
    explanation: "When the pump basket won't fill, air is entering the suction side — check all unions, valves, and fittings between the pool and the pump."
  },
  {
    id: "t35",
    section: "Pool Structure & Symptoms",
    type: "multiple_choice",
    question: "50% of calls to Mr. Pool Leak Repair originate from:",
    options: [
      "New pool owners",
      "HOA-managed properties",
      "Post-remodel leaks caused by other companies",
      "Real estate transactions"
    ],
    correct: 2,
    explanation: "Half of all calls come from customers who had pool work done by another company that resulted in a leak — this is a key talking point for building trust."
  },

  // --- SCENARIOS ---
  {
    id: "t36",
    section: "Scenarios",
    type: "scenario",
    question: "You complete a leak detection and find two issues: a seal failure and a non-structural shell crack. What should your estimate include?",
    options: [
      "Only the most urgent repair",
      "The Seal Restoration Package + crack repair + your standard recommendation note",
      "Just the crack since seals are minor",
      "Wait for the customer to ask what they want fixed"
    ],
    correct: 1,
    explanation: "Always include ALL found issues in the estimate, include the Seal Restoration Package recommendation, and document everything with photos."
  },
  {
    id: "t37",
    section: "Scenarios",
    type: "scenario",
    question: "A customer comes outside and starts questioning your findings, saying the previous company said there was no leak. How do you respond?",
    options: [
      "Get defensive and explain the other company was wrong",
      "Show them the photos/videos as proof and calmly walk them through each finding",
      "Agree to remove questionable findings from the report",
      "Ask them to call dispatch"
    ],
    correct: 1,
    explanation: "Always let the documentation speak. Show photos and videos as objective evidence. Walk the customer through each finding professionally — this is why we document everything."
  },
  {
    id: "t38",
    section: "Scenarios",
    type: "scenario",
    question: "You arrive at a job and realize you forgot your sonar listening device. What do you do?",
    options: [
      "Complete the job without it and note it in the report",
      "Contact dispatch immediately — a complete detection requires all tools",
      "Do your best with remaining tools",
      "Ask the customer if they have any listening devices"
    ],
    correct: 1,
    explanation: "A full leak detection requires all specialized tools. Contact dispatch immediately — an incomplete test could miss leaks and damage the company's reputation and warranty."
  },
  {
    id: "t39",
    section: "Scenarios",
    type: "scenario",
    question: "During a detection, you notice significant foundation movement under the pool deck. The customer only asked about a possible plumbing leak. What do you do?",
    options: [
      "Only report what the customer asked about",
      "Note and photograph the foundation issue and include it in recommendations",
      "Tell the customer verbally but don't document it",
      "Don't mention it — it's outside your scope"
    ],
    correct: 1,
    explanation: "Always document and photograph ALL issues found, even if outside the original scope. Foundation problems are critical — they affect the pool's structural integrity and your liability."
  },
  {
    id: "t40",
    section: "Scenarios",
    type: "scenario",
    question: "A customer watches your whole inspection and at the end says 'I think it might also be leaking near the light — did you check that?' What should your answer be?",
    options: [
      "'I don't think that's likely'",
      "'Yes, checking the light niche is part of our standard process — I tested it with dye and it's included in the report'",
      "'We can come back to check that separately'",
      "'I'll note it but we'd need another appointment'"
    ],
    correct: 1,
    explanation: "The light niche is always part of a standard full detection. Confirm this to the customer — it reinforces that the $375 is for a comprehensive test, not a partial inspection."
  },
  {
    id: "t41",
    section: "Scenarios",
    type: "scenario",
    question: "How many areas does a full leak detection cover?",
    options: [
      "Just the underground plumbing",
      "Underground plumbing AND the pool shell",
      "Underground plumbing, pool shell, equipment pad, and all seals",
      "Whatever the customer specifically requests"
    ],
    correct: 2,
    explanation: "A full detection covers ALL possible leak sources: underground plumbing, pool shell, equipment pad, and all seals. This is what justifies the 1-3 hour duration and the price."
  },
  {
    id: "t42",
    section: "Scenarios",
    type: "scenario",
    question: "After completing a repair, what is the close-out message you should communicate to the customer?",
    options: [
      "Job is done, invoice is paid, goodbye",
      "Tell them they can start filling tomorrow (takes 1-1.5 days) and to have their pool guy rebalance the chemicals",
      "Tell them to test the pool in 48 hours and call if leaking",
      "Nothing — dispatch handles all post-job communication"
    ],
    correct: 1,
    explanation: "The close-out message is: repairs are done, start filling tomorrow, it takes 1-1.5 days, have the pool guy rebalance chemicals, and reach out with any concerns."
  },
  {
    id: "t43",
    section: "Scenarios",
    type: "scenario",
    question: "You find strong evidence of an underground pipe break under the concrete deck. Approximately what should the repair cost be per the standard pricing?",
    options: ["$1,850", "$2,150", "$2,350", "$2,850"],
    correct: 2,
    explanation: "Under-concrete deck pipe breaks are priced at $2,350. If concrete replacement is needed post-repair, add $275 per breakout."
  },
  {
    id: "t44",
    section: "Scenarios",
    type: "scenario",
    question: "A customer asks you directly: 'What do you think is the most important repair to do?' You found a seal failure and a small non-structural crack. What do you say?",
    options: [
      "'I can't make recommendations — that's dispatch's job'",
      "'The crack is most urgent'",
      "'The Seal Restoration Package is the most important and is what we recommend first — it addresses the most common leak points'",
      "'They're equally important'"
    ],
    correct: 2,
    explanation: "Always recommend the Seal Restoration Package as the priority — it's the most common solution and is recommended on every job. Be confident in your recommendation."
  },
  {
    id: "t45",
    section: "Scenarios",
    type: "scenario",
    question: "You're at a job and after pressure testing one plumbing line, the pressure drops significantly within 60 seconds. What does this tell you?",
    options: [
      "The line is clear — good pressure means no blockage",
      "There is a significant leak in that plumbing line — it cannot hold pressure",
      "The pump is too powerful",
      "The test equipment may be faulty"
    ],
    correct: 1,
    explanation: "A rapid pressure drop during pressure testing is a clear indicator of a leak in that line — a properly sealed line holds pressure. This is definitive evidence of a plumbing leak."
  }
];

export const technicianSections = [
  "Company Knowledge",
  "Detection Methods",
  "Documentation",
  "Repair Pricing",
  "Pool Structure & Symptoms",
  "Scenarios"
];
