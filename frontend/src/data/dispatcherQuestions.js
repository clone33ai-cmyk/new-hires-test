export const dispatcherQuestions = [
  // --- COMPANY KNOWLEDGE ---
  {
    id: "d1",
    section: "Company Knowledge",
    type: "multiple_choice",
    question: "What is the standard price for a pool leak detection within the service area?",
    options: ["$275", "$375", "$475", "$595"],
    correct: 1,
    explanation: "The standard leak detection price is $375 for customers within the DFW service area."
  },
  {
    id: "d2",
    section: "Company Knowledge",
    type: "multiple_choice",
    question: "How much is the additional travel fee for customers outside the service area?",
    options: ["$75", "$100", "$150", "$200"],
    correct: 2,
    explanation: "Customers outside the service area pay $375 + $150 travel fee = $525 total."
  },
  {
    id: "d3",
    section: "Company Knowledge",
    type: "multiple_choice",
    question: "What is the leak detection price for realtors?",
    options: ["$375", "$495", "$595", "$695"],
    correct: 3,
    explanation: "Realtors are charged $695 for leak detection services."
  },
  {
    id: "d4",
    section: "Company Knowledge",
    type: "true_false",
    question: "Mr. Pool Leak Repair offers pool cleaning services.",
    correct: false,
    explanation: "We do NOT offer cleaning services. We refer those calls to a pool service company."
  },
  {
    id: "d5",
    section: "Company Knowledge",
    type: "true_false",
    question: "Mr. Pool Leak Repair repairs pool equipment (pumps, filters, heaters).",
    correct: false,
    explanation: "We do not work on equipment — we recommend customers call a pool service company. We do REPLACE equipment but not repair it."
  },
  {
    id: "d6",
    section: "Company Knowledge",
    type: "multiple_choice",
    question: "What are the company's operating hours?",
    options: ["8 AM - 5 PM, Mon-Fri", "7 AM - 7 PM, Mon-Sat", "7 AM - 7 PM, 7 Days a Week", "9 AM - 6 PM, 7 Days a Week"],
    correct: 2,
    explanation: "Mr. Pool Leak Repair operates 7 AM to 7 PM, seven days a week."
  },
  {
    id: "d7",
    section: "Company Knowledge",
    type: "multiple_choice",
    question: "Approximately how many leak detections does the company complete per day?",
    options: ["1-2", "3-4", "5-10", "10-20"],
    correct: 2,
    explanation: "The company completes 5-10 leak detections daily."
  },
  {
    id: "d8",
    section: "Company Knowledge",
    type: "multiple_choice",
    question: "How long has Mr. Pool Leak Repair been in business?",
    options: ["5 years", "8 years", "10 years", "12+ years"],
    correct: 3,
    explanation: "The company was established 12+ years ago, originally as a pool remodeling company."
  },
  {
    id: "d9",
    section: "Company Knowledge",
    type: "multiple_choice",
    question: "Which of the following is a key differentiator of Mr. Pool Leak Repair?",
    options: ["Lowest price in DFW", "Industry-Unique Lifetime No-Leak Guarantee", "Same-day service always", "Free leak detection"],
    correct: 1,
    explanation: "The Lifetime No-Leak Guarantee is an industry-unique differentiator — no other company offers this."
  },
  {
    id: "d10",
    section: "Company Knowledge",
    type: "multiple_choice",
    question: "What percentage of calls stem from post-remodel leaks by OTHER companies?",
    options: ["10%", "25%", "50%", "75%"],
    correct: 2,
    explanation: "About 50% of calls come from customers who had pool work done by other companies that resulted in leaks."
  },

  // --- CALL HANDLING & SCRIPT ---
  {
    id: "d11",
    section: "Call Handling",
    type: "multiple_choice",
    question: "What is the correct way to answer an incoming call?",
    options: [
      "Hello, how can I help you?",
      "Leak Detection, [your name], how can I help you?",
      "Mr. Pool Leak Repair, please hold.",
      "Pool Leak Repair, what do you need?"
    ],
    correct: 1,
    explanation: "The correct greeting is: 'Leak Detection, [dispatcher name], how can I help you?'"
  },
  {
    id: "d12",
    section: "Call Handling",
    type: "multiple_choice",
    question: "A customer calls asking if you offer pool cleaning. What do you say?",
    options: [
      "We might be able to help, let me check",
      "We do not offer cleaning services — we recommend calling a pool service company",
      "We offer cleaning as part of our repair package",
      "We can schedule a consultation"
    ],
    correct: 1,
    explanation: "Clearly state: 'We do not offer cleaning services.' Then refer them to a pool service company."
  },
  {
    id: "d13",
    section: "Call Handling",
    type: "multiple_choice",
    question: "During a sales call, how should you collect the customer's info?",
    options: [
      "Take it all verbally on the phone",
      "Tell them to call back with their info",
      "Offer to send a text so they can respond with name, number, and email",
      "Email them a form to fill out"
    ],
    correct: 2,
    explanation: "The preferred method is to send a text and ask the customer to respond with name, number, and email to build their account."
  },
  {
    id: "d14",
    section: "Call Handling",
    type: "true_false",
    question: "The customer must be home during the leak detection appointment.",
    correct: false,
    explanation: "Customers do NOT have to be home — we just need access to the backyard."
  },
  {
    id: "d15",
    section: "Call Handling",
    type: "multiple_choice",
    question: "How far out are appointments typically scheduled?",
    options: ["Same day", "1-2 days out", "3-5 days out", "1-2 weeks out"],
    correct: 2,
    explanation: "Appointments are typically 3-5 days out."
  },
  {
    id: "d16",
    section: "Call Handling",
    type: "multiple_choice",
    question: "What is the arrival window given to customers?",
    options: ["6 AM - 12 PM", "8 AM - 3 PM", "9 AM - 5 PM", "10 AM - 4 PM"],
    correct: 1,
    explanation: "The arrival window is 8 AM to 3 PM. Routes are finalized nightly with reminder texts sent before appointments."
  },
  {
    id: "d17",
    section: "Call Handling",
    type: "true_false",
    question: "Prepayment is required to book a leak detection appointment.",
    correct: true,
    explanation: "Prepayment is required because only a limited number of leak detections are done per day. However, customers can cancel at any time for a full refund before the test is performed."
  },
  {
    id: "d18",
    section: "Call Handling",
    type: "multiple_choice",
    question: "A customer says '$375 is too expensive.' What is the BEST response?",
    options: [
      "That's our price, take it or leave it",
      "I can give you a discount if you book today",
      "I understand — it requires specialized tools, takes 1-3 hours, and you get a full report plus a repair estimate included",
      "Let me check if I can get manager approval for a lower price"
    ],
    correct: 2,
    explanation: "Justify the value: specialized tools, 1-3 hour full test, complete diagnosis report, AND a repair estimate. Never offer discounts without authorization."
  },
  {
    id: "d19",
    section: "Call Handling",
    type: "multiple_choice",
    question: "How long does a pool leak detection test typically take?",
    options: ["30-60 minutes", "1-3 hours", "3-5 hours", "Half a day"],
    correct: 1,
    explanation: "The leak detection test takes between 1 and 3 hours — it's a full test of all possible leak points."
  },
  {
    id: "d20",
    section: "Call Handling",
    type: "multiple_choice",
    question: "What does the customer receive after the leak detection?",
    options: [
      "A verbal summary from the technician",
      "A full leak report with diagnosis AND a repair estimate",
      "Just an invoice",
      "A text message with findings"
    ],
    correct: 1,
    explanation: "Every customer gets a full leak report/diagnosis showing where all leaks are, PLUS a repair estimate showing how much it will cost to fix everything."
  },

  // --- SCHEDULING & OPERATIONS ---
  {
    id: "d21",
    section: "Scheduling & Operations",
    type: "multiple_choice",
    question: "What status should you mark a customer as if they want to pay by check at the door?",
    options: ["UNPAID", "PAYING CHECK", "PENDING", "HOLD"],
    correct: 1,
    explanation: "Mark the customer as 'PAYING CHECK' if they want to pay at the door rather than prepaying online."
  },
  {
    id: "d22",
    section: "Scheduling & Operations",
    type: "true_false",
    question: "Routes are finalized every morning before technicians leave.",
    correct: false,
    explanation: "Routes are finalized NIGHTLY — the night before appointments, so technicians know their route before the day begins."
  },
  {
    id: "d23",
    section: "Scheduling & Operations",
    type: "multiple_choice",
    question: "When does the technician notify the customer they are on the way?",
    options: ["The night before", "1 hour before", "30 minutes before", "When they arrive"],
    correct: 2,
    explanation: "The technician sends a text message 30 minutes before arriving at the customer's home."
  },
  {
    id: "d24",
    section: "Scheduling & Operations",
    type: "multiple_choice",
    question: "What is the cancellation policy?",
    options: [
      "No refunds after booking",
      "50% refund if cancelled 24 hours in advance",
      "Full refund for cancellations before the test is performed",
      "Refund only if weather prevents the job"
    ],
    correct: 2,
    explanation: "Customers get a full refund for any cancellation before the test is performed — even if the tech is walking up the driveway."
  },
  {
    id: "d25",
    section: "Scheduling & Operations",
    type: "multiple_choice",
    question: "When matching a technician to a repair job, what is the key factor?",
    options: [
      "Who is closest geographically",
      "Who has the most availability",
      "Technician skill level matched to job complexity",
      "First available technician"
    ],
    correct: 2,
    explanation: "Technicians should be matched to jobs based on their skill level relative to the job's complexity."
  },

  // --- FOLLOW-UP & SALES ---
  {
    id: "d26",
    section: "Follow-Up & Sales",
    type: "multiple_choice",
    question: "What is the FIRST follow-up message sent after a leak detection?",
    options: [
      "Calling the customer to discuss findings",
      "Texting to confirm they received their estimate and offering to answer questions",
      "Sending an invoice",
      "Waiting for the customer to reach out"
    ],
    correct: 1,
    explanation: "The first follow-up is a text: 'This is dispatch with Mr. Pool Leak, just checking if you received your estimate from yesterday's leak detection. Let me know if you have questions!'"
  },
  {
    id: "d27",
    section: "Follow-Up & Sales",
    type: "true_false",
    question: "If a customer doesn't respond to follow-ups, you should stop contacting them after 2 attempts.",
    correct: false,
    explanation: "You should continue follow-ups until you receive a response or a clear decline. Persistence is key in the follow-up process."
  },
  {
    id: "d28",
    section: "Follow-Up & Sales",
    type: "multiple_choice",
    question: "A customer says the repair estimate is too high. What should you offer?",
    options: [
      "A discount on the repair",
      "Financing options",
      "A second opinion",
      "A reduced scope of repairs"
    ],
    correct: 1,
    explanation: "Offer financing: 'We offer financing options. Would you like the link?' This keeps the full repair on the table without discounting."
  },
  {
    id: "d29",
    section: "Follow-Up & Sales",
    type: "multiple_choice",
    question: "What is the close-out message sent to customers when repair work is completed?",
    options: [
      "Your pool is fixed. Please pay your balance.",
      "We're done! Fill your pool tomorrow (takes 1-1.5 days). Let your pool guy rebalance chemicals. Contact us with concerns!",
      "Job complete. Thank you for your business.",
      "Repairs finished. We'll follow up in 30 days."
    ],
    correct: 1,
    explanation: "The close-out message tells them: repairs are done, they can start filling tomorrow (1-1.5 days), have their pool guy rebalance chemicals, and reach out with any concerns."
  },
  {
    id: "d30",
    section: "Follow-Up & Sales",
    type: "multiple_choice",
    question: "When converting an approved estimate to a job, what must be sent before work begins?",
    options: [
      "A confirmation text",
      "An invoice — and if split payment, balance is due before job start",
      "The technician's arrival time",
      "A warranty document"
    ],
    correct: 1,
    explanation: "Once estimate is approved, convert to a job and send an invoice. If the customer is splitting payment, the balance must be received before the job begins."
  },

  // --- POOL & LEAK KNOWLEDGE ---
  {
    id: "d31",
    section: "Pool Leak Knowledge",
    type: "multiple_choice",
    question: "A customer says their pool is losing water only when the equipment is ON. This most likely indicates:",
    options: [
      "Evaporation",
      "A shell crack",
      "A pressure-side or return line leak",
      "A main drain issue"
    ],
    correct: 2,
    explanation: "Water loss only when equipment is running typically points to a pressure-side or return line leak — the system pressure pushes water out."
  },
  {
    id: "d32",
    section: "Pool Leak Knowledge",
    type: "multiple_choice",
    question: "A customer says their pool is losing water only when the equipment is OFF. This most likely indicates:",
    options: [
      "A return line leak",
      "A suction side or structural leak (shell, light, skimmer)",
      "A pump seal failure",
      "Evaporation"
    ],
    correct: 1,
    explanation: "Water loss only when equipment is off typically points to structural issues like cracks in the shell, skimmer leaks, or light niches — gravity-driven losses."
  },
  {
    id: "d33",
    section: "Pool Leak Knowledge",
    type: "true_false",
    question: "Evaporation can cause a pool to lose 1 inch of water per day in normal Texas conditions.",
    correct: false,
    explanation: "While evaporation is normal, losing 1 inch per day is a sign of a leak. Normal evaporation is typically 1/4 inch per day or less."
  },
  {
    id: "d34",
    section: "Pool Leak Knowledge",
    type: "multiple_choice",
    question: "What does a customer mean when they report 'air bubbles in the return lines'?",
    options: [
      "The pool needs cleaning",
      "A likely suction-side leak pulling air into the system",
      "The filter needs backwashing",
      "Normal pool operation"
    ],
    correct: 1,
    explanation: "Air bubbles in return lines indicate a suction-side leak — the pump is pulling air in through a crack or faulty seal before the pump."
  },
  {
    id: "d35",
    section: "Pool Leak Knowledge",
    type: "multiple_choice",
    question: "Which of the following is NOT a service Mr. Pool Leak Repair offers?",
    options: [
      "Pool leak detection",
      "Pool remodeling",
      "Pool cleaning/maintenance",
      "Concrete pool deck"
    ],
    correct: 2,
    explanation: "We do NOT offer pool cleaning or maintenance services. We do offer leak detection, repairs, remodeling, concrete decks, and pool demolition."
  },

  // --- REPAIR PRICING ---
  {
    id: "d36",
    section: "Repair Pricing",
    type: "multiple_choice",
    question: "What is the price of the Seal Restoration Package — the most recommended repair?",
    options: ["$1,850", "$2,150", "$2,450", "$2,850"],
    correct: 2,
    explanation: "The Seal Restoration Package is $2,450 and is recommended on every job as the most common repair solution."
  },
  {
    id: "d37",
    section: "Repair Pricing",
    type: "multiple_choice",
    question: "What does a skimmer replacement cost?",
    options: ["$1,850", "$2,350", "$2,450", "$2,850"],
    correct: 3,
    explanation: "Skimmer replacement costs $2,850."
  },
  {
    id: "d38",
    section: "Repair Pricing",
    type: "multiple_choice",
    question: "What is the average repair cost that should be used as a general reference?",
    options: ["$1,500", "$2,000", "$2,500", "$3,000"],
    correct: 2,
    explanation: "The average repair cost is approximately $2,500."
  },
  {
    id: "d39",
    section: "Repair Pricing",
    type: "multiple_choice",
    question: "A customer asks about the warranty on repairs. What is correct?",
    options: [
      "1-year warranty on all repairs",
      "3-year no-leak warranty on repairs; lifetime on foundation work",
      "6-month warranty, extendable",
      "No warranty — we guarantee finding leaks, not preventing them"
    ],
    correct: 1,
    explanation: "Repairs come with a 3-year no-leak warranty. Foundation (pier) work comes with a lifetime warranty."
  },
  {
    id: "d40",
    section: "Repair Pricing",
    type: "multiple_choice",
    question: "Non-structural pool shell cracks are priced at:",
    options: ["$375 - $595", "$595 - $995", "$995 - $1,500", "$1,500 - $2,000"],
    correct: 1,
    explanation: "Non-structural cracks in the pool shell are priced between $595 and $995 depending on size and complexity."
  },

  // --- SCENARIOS ---
  {
    id: "d41",
    section: "Scenarios",
    type: "scenario",
    question: "A customer calls and says: 'I don't want to pay upfront. I'll pay when the tech shows up.' How do you handle this?",
    options: [
      "Agree and schedule them anyway",
      "Explain prepayment is required but mark them as PAYING CHECK if they insist on paying at the door",
      "Tell them we can't help them",
      "Escalate to your manager"
    ],
    correct: 1,
    explanation: "Prepayment policy is firm, but PAYING CHECK status allows the customer to pay by check when the tech arrives. Never turn away a customer — find a solution."
  },
  {
    id: "d42",
    section: "Scenarios",
    type: "scenario",
    question: "A realtor calls wanting a leak detection before closing on a house. What price do you quote?",
    options: ["$375", "$475", "$595", "$695"],
    correct: 3,
    explanation: "Realtors are quoted $695 — a separate pricing tier from the standard residential rate."
  },
  {
    id: "d43",
    section: "Scenarios",
    type: "scenario",
    question: "A customer says: 'I already had another company come out and they couldn't find the leak.' How do you position Mr. Pool Leak Repair?",
    options: [
      "Tell them to call the other company back",
      "Offer a discount since they've already paid someone else",
      "Explain our specialized tools (camera, dye, pressure testing, sonar), full 1-3 hour process, and 12+ years experience — most guesswork is from non-specialists",
      "Tell them we guarantee we'll find it or give a refund"
    ],
    correct: 2,
    explanation: "Position our expertise: we use all detection methods (camera, dye, pressure, sonar), do a complete 1-3 hour full test, and have 12+ years specializing in this. We don't guess — we diagnose."
  },
  {
    id: "d44",
    section: "Scenarios",
    type: "scenario",
    question: "A customer approved repairs but then asks if they can split the payment — half now, half later. What do you tell them?",
    options: [
      "Sorry, full payment is required upfront",
      "Split payments are allowed; however, the full balance is due before the job begins",
      "You can pay the second half after the job is complete",
      "We only accept split payments with manager approval"
    ],
    correct: 1,
    explanation: "Split payments are allowed, but the FULL balance must be collected before work begins — not after."
  },
  {
    id: "d45",
    section: "Scenarios",
    type: "scenario",
    question: "After a leak detection, a customer hasn't responded to two follow-up texts. What do you do next?",
    options: [
      "Close the job — they're not interested",
      "Call them directly and mention financing options may be available",
      "Continue following up; also mention we can get the tech on the phone to answer technical questions",
      "Both B and C are valid next steps"
    ],
    correct: 3,
    explanation: "Continue following up persistently. Offer to get the tech on the phone for technical questions, and proactively mention financing if the estimate may be the barrier."
  }
];

export const dispatcherSections = [
  "Company Knowledge",
  "Call Handling",
  "Scheduling & Operations",
  "Follow-Up & Sales",
  "Pool Leak Knowledge",
  "Repair Pricing",
  "Scenarios"
];
