// Infer one of the 52 Anfààní fields from a job title only.
// Tags are deliberately ignored: source tags are often a broad industry
// category (for example WeWorkRemotely tags a biotech job "Finance"),
// which misfiles jobs. This is an inference, not a fact from the source,
// so the normalised job carries field_source: "inferred". If nothing
// matches, field is null.

const FIELD_KEYWORDS = [
  ["Software engineering", ["software engineer", "software developer", "full stack", "full-stack", "frontend", "front-end", "backend", "back-end", "web developer", "mobile developer", "ios developer", "android developer", "python developer", "javascript developer", "react developer", "node.js", "programmer"]],
  ["AI and machine learning", ["machine learning", "ml engineer", "ai engineer", "artificial intelligence", "llm", "data scientist", "prompt engineer", "computer vision", "nlp engineer"]],
  ["Data science and analytics", ["data analyst", "data engineer", "analytics", "business intelligence", "bi analyst", "data science"]],
  ["Cybersecurity", ["cyber security", "cybersecurity", "security engineer", "penetration", "soc analyst", "infosec"]],
  ["Crypto, blockchain, and Web3", ["blockchain", "web3", "crypto", "solidity", "smart contract", "defi"]],
  ["Product management", ["product manager", "product owner", "product lead"]],
  ["UI and UX design", ["ux designer", "ui designer", "product designer", "ui/ux", "graphic designer", "visual designer"]],
  ["Cloud, DevOps, and IT", ["devops", "cloud engineer", "site reliability", "sre", "system administrator", "sysadmin", "it support", "network engineer"]],
  ["Game development", ["game developer", "game designer", "unity developer", "unreal"]],
  ["QA, testing, and technical support", ["qa engineer", "quality assurance", "software tester", "test engineer", "technical support", "support engineer"]],
  ["Medicine and clinical care", ["doctor", "physician", "clinical", "surgeon", "medical officer"]],
  ["Nursing and midwifery", ["nurse", "nursing", "midwife", "midwifery"]],
  ["Pharmacy", ["pharmacist", "pharmacy"]],
  ["Public health and immunology", ["public health", "epidemiolog", "immunolog", "health officer"]],
  ["Medical laboratory and diagnostics", ["laboratory", "lab technician", "diagnostic", "medical lab"]],
  ["Mental health and counselling", ["therapist", "counsellor", "counselor", "psychologist", "mental health"]],
  ["Research and laboratory science", ["research scientist", "research associate", "researcher", "lab scientist", "statistician", "biostatistician", "biostatistics"]],
  ["Veterinary and animal health", ["veterinarian", "veterinary", "animal health"]],
  ["Finance", ["finance manager", "financial analyst", "finance", "accountant", "treasury"]],
  ["Accounting and audit", ["accounting", "auditor", "audit", "bookkeeper"]],
  ["Banking", ["banking", "bank manager", "credit analyst"]],
  ["Insurance", ["insurance", "underwriter", "actuarial"]],
  ["Investment and fintech", ["investment", "fintech", "venture capital", "equity analyst", "trader"]],
  ["Marketing and growth", ["marketing", "growth manager", "seo", "content marketer", "digital marketing", "social media manager"]],
  ["Sales and business development", ["sales", "business development", "account executive", "account manager"]],
  ["Human resources and recruiting", ["recruiter", "human resources", "hr manager", "talent acquisition", "people operations"]],
  ["Law and legal", ["lawyer", "legal counsel", "attorney", "paralegal", "compliance officer"]],
  ["Civil and construction engineering", ["civil engineer", "construction engineer", "structural engineer"]],
  ["Mechanical and electrical engineering", ["mechanical engineer", "electrical engineer", "electronics engineer"]],
  ["Energy, oil, gas, and renewables", ["energy", "oil and gas", "renewable", "solar", "petroleum engineer"]],
  ["Environmental science and sustainability", ["environmental", "sustainability", "climate"]],
  ["Agriculture and food systems", ["agriculture", "agronomist", "farm manager", "food science"]],
  ["Architecture and urban planning", ["architect", "urban planner"]],
  ["Mining and natural resources", ["mining", "geologist"]],
  ["Education and teaching", ["teacher", "teaching", "lecturer", "educator", "tutor", "professor"]],
  ["Training and vocational skills", ["trainer", "training", "instructor", "coach"]],
  ["Government and public service", ["government", "public service", "civil service", "policy analyst"]],
  ["NGO, nonprofit, and development", ["ngo", "nonprofit", "non-profit", "development officer", "humanitarian"]],
  ["International organisations and diplomacy", ["diplomat", "international organisation", "united nations", "embassy"]],
  ["Community, social work, and care", ["social worker", "community", "care worker", "caregiver"]],
  ["Security, defence, and emergency services", ["security officer", "police", "firefighter", "paramedic", "emergency"]],
  ["Media, journalism, and writing", ["journalist", "writer", "editor", "copywriter", "content writer", "reporter"]],
  ["Film, music, and entertainment", ["film", "musician", "actor", "video editor", "producer"]],
  ["Fashion and beauty", ["fashion", "beautician", "stylist", "makeup artist"]],
  ["Hospitality, tourism, and travel", ["hospitality", "hotel", "tourism", "travel agent", "chef", "tour guide"]],
  ["Sports and fitness", ["fitness", "personal trainer", "sports coach", "physiotherapist"]],
  ["Food, beverage, and catering", ["catering", "food and beverage", "barista", "restaurant manager"]],
  ["Operations, supply chain, and procurement", ["operations manager", "supply chain", "procurement", "logistics manager", "operations"]],
  ["Transport, aviation, and logistics", ["driver", "pilot", "aviation", "logistics", "transport", "warehouse"]],
  ["Manufacturing and production", ["manufacturing", "production manager", "factory", "operator"]],
  ["Construction trades and skilled crafts", ["plumber", "electrician", "carpenter", "welder", "construction worker"]],
  ["Retail, e-commerce, and customer service", ["retail", "customer service", "customer support", "cashier", "store manager", "e-commerce"]],
];

export function inferField(title = "", _tags = []) {
  const text = title.toLowerCase();
  for (const [field, keywords] of FIELD_KEYWORDS) {
    if (keywords.some((kw) => text.includes(kw))) return field;
  }
  return null;
}
