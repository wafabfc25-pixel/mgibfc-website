const COMPANY_DATA = {
  name: "MGI BFC Consulting",
  email: "contact@bfc.com.tn",
  website: "www.mgibfc.com",  // ✅ FIX: était manquant dans ton code original
  address: "Immeuble Golden Tower B8.2, Centre Urbain Nord, Tunis",
  founders: ["Amine ABDERRAHMEN (Fondateur / Founder)", "Nadia YAICH (Associée / Partner)"],
  clients: [
    "Aziza", "Vistaprint", "ABCO", "Linedata", "Dr. Oetker", "Leoni", "Altrad",
    "Coca Cola", "Hutchinson", "Vilavi", "Stellantis", "Orange", "TotalEnergies",
    "Vermeg", "Sagemcom", "Sanofi", "Vivo Energy", "Air Liquide", "Heineken", "Societe Generale"
  ],
  partners: ["UGFS", "BIAT Capital", "BH Equity", "Tuninvest", "Zitouna Capital", "CDC", "RMBV", "AfricInvest"],
};

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function fuzzyMatch(word: string, keyword: string): boolean {
  // Pour les expressions multi-mots ("due diligence", "qui êtes") → vérification directe
  if (keyword.includes(" ")) return false;
  if (word === keyword) return true;
  // Pas de fuzzy sur les mots trop courts (évite faux positifs)
  if (word.length <= 3 || keyword.length <= 3) return word === keyword;
  // Tolérance : 1 erreur pour mots courts, 2 pour moyens, 3 pour longs
  const maxDist = keyword.length <= 5 ? 1 : keyword.length <= 8 ? 2 : 3;
  return levenshtein(word, keyword) <= maxDist;
}

function messageMatchesKeyword(msg: string, keyword: string): boolean {
  // Expression exacte multi-mots
  if (keyword.includes(" ")) return msg.includes(keyword);
  // Mot seul : vérifier chaque mot du message
  const words = msg.split(/\s+/);
  return words.some((w) => fuzzyMatch(w, keyword));
}

function detectLanguage(message: string): "fr" | "en" {
  const frWords = [
    "bonjour", "salut", "merci", "oui", "non", "comment", "quoi", "que", "est",
    "les", "des", "vous", "prix", "où", "quand", "pourquoi", "aide",
    "qui", "quel", "quelle", "équipe", "cabinet", "nous",
    "votre", "faire", "avec", "pour", "dans", "sur", "une", "un", "du", "au",
  ];
  const enWords = [
    "hello", "hi", "thanks", "yes", "no", "how", "what", "is", "the", "are",
    "you", "price", "delivery", "where", "when", "why", "help", "who", "which",
    "team", "firm", "our", "tell", "your", "do", "can", "with",
    "for", "in", "on", "a", "an", "of",
  ];

  const msg = message.toLowerCase();
  let frScore = 0;
  let enScore = 0;

  frWords.forEach((w) => { if (msg.includes(w)) frScore++; });
  enWords.forEach((w) => { if (msg.includes(w)) enScore++; });

  return enScore > frScore ? "en" : "fr";
}

interface KnowledgeEntry {
  keywords: string[];
  fr: string;
  en: string;
}

const knowledgeBase: KnowledgeEntry[] = [
  
  {
    keywords: ["bonjour", "salut", "bonsoir", "hello", "hi", "hey", "good morning", "good evening"],
    fr: "Bonjour ! Je suis l'assistant de MGI BFC Consulting. Comment puis-je vous aider aujourd'hui ?",
    en: "Hello! I'm the MGI BFC Consulting assistant. How can I help you today?",
  },

  {
    keywords: ["c'est quoi", "kesako", "qui êtes", "qui est", "présenter", "présentation", "about", "who are", "what is mgi", "mgibfc", "bfc consulting", "cabinet"],
    fr: "MGI BFC Consulting est un cabinet de conseil financier dont la mission est de créer de la valeur ajoutée grâce à des services financiers sur mesure. Nous opérons en Tunisie et accompagnons des entreprises locales et internationales.",
    en: "MGI BFC Consulting is a financial consulting firm whose mission is to create added value through tailor-made financial services. We operate in Tunisia and support local and international companies.",
  },

  {
    keywords: ["service", "offre", "proposez", "offer", "provide", "what do you do", "activité", "activity", "faites", "domaine"],
    fr: `MGI BFC Consulting propose 3 grands pôles de services :\n1. **Audit & Commissariat aux comptes** (audit légal, audit contractuel, audit des programmes/projets, contrôle interne)\n2. **Transaction Advisory Services** (valorisation, due diligence, étude de faisabilité, restructuration, levée de fonds)\n3. **Comptabilité & Outsourcing** (supervision comptable, externalisation de la paie, consolidation des comptes, assistance fiscale, secrétariat juridique)\n\nPour plus d'informations : ${COMPANY_DATA.email}`,
    en: `MGI BFC Consulting offers 3 main service areas:\n1. **Audit & Statutory Audit** (legal audit, contractual audit, program/project audit, internal control)\n2. **Transaction Advisory Services** (valuation, due diligence, feasibility study, restructuring, fundraising advisory)\n3. **Accounting & Outsourcing** (accounting supervision, payroll outsourcing, financial statement consolidation, tax advisory, corporate secretarial services)\n\nFor more info: ${COMPANY_DATA.email}`,
  },

  {
    keywords: ["audit", "commissariat", "contrôle interne", "internal control", "statutory", "légal", "legal"],
    fr: "Notre pôle **Audit & Commissariat aux comptes** comprend : l'audit légal, l'audit contractuel, l'audit des programmes/projets et le contrôle interne. Nous garantissons la fiabilité et la conformité de vos états financiers.",
    en: "Our **Audit & Statutory Audit** division includes: legal audit, contractual audit, program/project audit, and internal control. We ensure the reliability and compliance of your financial statements.",
  },

  {
    keywords: ["transaction", "tas", "advisory", "valorisation", "valuation", "due diligence", "levée de fonds", "fundraising", "faisabilité", "feasibility", "restructuration", "restructuring"],
    fr: "Notre pôle **Transaction Advisory Services** couvre : la valorisation d'entreprises, la due diligence, l'étude de faisabilité, la restructuration et l'accompagnement à la levée de fonds. Nous vous assistons dans toutes vos opérations stratégiques.",
    en: "Our **Transaction Advisory Services** division covers: business valuation, due diligence, feasibility study, restructuring, and fundraising advisory. We assist you in all your strategic operations.",
  },

  {
    keywords: ["comptabilité", "accounting", "outsourcing", "externalisation", "consolidation", "fiscal", "tax", "paie", "payroll", "juridique", "secretarial"],
    fr: "Notre pôle **Comptabilité & Outsourcing** propose : la supervision comptable, l'externalisation de la paie, la consolidation des comptes, l'assistance fiscale et le secrétariat juridique.",
    en: "Our **Accounting & Outsourcing** division offers: accounting supervision, payroll outsourcing, financial statement consolidation, tax advisory, and corporate secretarial services.",
  },

  {
    keywords: ["équipe", "team", "fondateur", "founder", "associé", "partner", "amine", "nadia", "dirigeant", "management", "qui dirige", "leadership"],
    fr: `L'équipe dirigeante de MGI BFC Consulting est composée de :\n- **Amine ABDERRAHMEN** – Fondateur\n- **Nadia YAICH** – Associée\n\nUne équipe d'experts dédiés à la création de valeur pour nos clients.`,
    en: `MGI BFC Consulting's leadership team consists of:\n- **Amine ABDERRAHMEN** – Founder\n- **Nadia YAICH** – Partner\n\nA team of experts dedicated to creating value for our clients.`,
  },

  {
    keywords: ["client", "référence", "reference", "travaillez avec", "work with", "portefeuille", "clientèle"],
    fr: `Parmi nos clients de référence :\n${COMPANY_DATA.clients.join(", ")}.\n\nNous accompagnons des entreprises locales et des multinationales dans leurs projets financiers.`,
    en: `Among our reference clients:\n${COMPANY_DATA.clients.join(", ")}.\n\nWe support both local companies and multinationals in their financial projects.`,
  },

  {
    keywords: ["partenaire", "partner", "partenariat", "partnership", "ugfs", "biat", "africinvest", "tuninvest"],
    fr: `Nos partenaires stratégiques incluent :\n${COMPANY_DATA.partners.join(", ")}.\n\nCes partenariats renforcent notre capacité à accompagner nos clients dans leurs projets.`,
    en: `Our strategic partners include:\n${COMPANY_DATA.partners.join(", ")}.\n\nThese partnerships strengthen our ability to support clients in their projects.`,
  },

  
  {
    keywords: ["contact", "joindre", "reach", "email", "mail", "téléphone", "phone", "coordonnées", "nous écrire", "write to"],
    fr: `Vous pouvez nous contacter via :\n- **Email** : ${COMPANY_DATA.email}\n- **Site web** : ${COMPANY_DATA.website}\n- **Adresse** : ${COMPANY_DATA.address}`,
    en: `You can reach us via:\n- **Email**: ${COMPANY_DATA.email}\n- **Website**: ${COMPANY_DATA.website}\n- **Address**: ${COMPANY_DATA.address}`,
  },

  {
    keywords: ["adresse", "address", "où", "where", "localisation", "location", "situé", "located", "bureau", "office", "tunis", "golden tower", "centre urbain"],
    fr: `Nous sommes situés à :\n**${COMPANY_DATA.address}**\n\nN'hésitez pas à nous contacter à ${COMPANY_DATA.email} pour fixer un rendez-vous.`,
    en: `We are located at:\n**${COMPANY_DATA.address}**\n\nFeel free to contact us at ${COMPANY_DATA.email} to schedule a meeting.`,
  },

  {
    keywords: ["carrière", "career", "emploi", "job", "recrutement", "recruitment", "rejoindre", "join", "offre d'emploi", "stage", "internship", "candidature"],
    fr: `Pour consulter nos offres d'emploi et nous rejoindre, visitez la section **Carrières** de notre site : ${COMPANY_DATA.website}\n\nOu envoyez votre candidature à ${COMPANY_DATA.email}`,
    en: `To view our job openings and join our team, visit the **Careers** section on our website: ${COMPANY_DATA.website}\n\nOr send your application to ${COMPANY_DATA.email}`,
  },

  {
    keywords: ["blog", "article", "actualité", "news", "publication", "insight"],
    fr: `Retrouvez nos derniers articles et publications dans la section **Blog** de notre site : ${COMPANY_DATA.website}`,
    en: `Find our latest articles and publications in the **Blog** section of our website: ${COMPANY_DATA.website}`,
  },

 
  {
    keywords: ["mission", "valeur", "value", "vision", "engagement", "commitment", "philosophie", "philosophy"],
    fr: "La mission de MGI BFC Consulting est de créer de la valeur ajoutée à travers des services financiers sur mesure. Nous nous engageons à offrir expertise, rigueur et proximité à chacun de nos clients.",
    en: "MGI BFC Consulting's mission is to create added value through tailor-made financial services. We are committed to delivering expertise, rigor, and proximity to each of our clients.",
  },

 
  {
    keywords: ["merci", "thank", "thanks", "parfait", "super", "great", "excellent", "nickel"],
    fr: "Avec plaisir ! N'hésitez pas si vous avez d'autres questions sur MGI BFC Consulting.",
    en: "You're welcome! Feel free to ask if you have any other questions about MGI BFC Consulting.",
  },
];

function getResponse(message: string): string {
  const lang = detectLanguage(message);
  const msg = message.toLowerCase().trim();

  for (const entry of knowledgeBase) {
    if (entry.keywords.some((k) => messageMatchesKeyword(msg, k))) {
      return entry[lang];
    }
  }


  return lang === "fr"
    ? `Je suis uniquement disponible pour répondre aux questions concernant MGI BFC Consulting. Pour toute autre demande, contactez-nous à ${COMPANY_DATA.email}`
    : `I'm only available to answer questions about MGI BFC Consulting. For anything else, feel free to reach us at ${COMPANY_DATA.email}`;
}

export default async function handler(req: any, res: any) {
  console.log("✅ /api/chat appelé", req.method, req.body);
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message requis" });

  try {
    const reply = getResponse(message);
    console.log("✅ Réponse générée localement");
    res.status(200).json({ reply });
  } catch (error: any) {
    console.error("❌ Erreur chatbot:", error?.message);
    res.status(500).json({ error: "Erreur interne." });
  }
}