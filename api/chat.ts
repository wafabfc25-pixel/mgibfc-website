// ============================================================
// MGI BFC - Chatbot (No API, Free, Bilingual)
// ============================================================

const COMPANY_DATA = {
  name: "MGI BFC ",
  email: "contact@bfc.com.tn",
  website: "www.mgibfc.com",
  address: "Immeuble Golden Tower B8.2, Centre Urbain Nord, Tunis",
  founders: ["Amine ABDERRAHMEN (Fondateur / Founder)", "Nadia YAICH (Associée / Partner)"],
  clients: [
    "Aziza", "Vistaprint", "ABCO", "Linedata", "Dr. Oetker", "Leoni", "Altrad",
    "Coca Cola", "Hutchinson", "Vilavi"
],
  partners: ["UGFS", "BIAT Capital", "BH Equity", "Tuninvest", "Zitouna Capital", "RMBV"],
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
  if (word === keyword) return true;
  if (word.length <= 3 || keyword.length <= 3) return word === keyword;
  const maxDist = keyword.length <= 5 ? 1 : keyword.length <= 8 ? 2 : 3;
  return levenshtein(word, keyword) <= maxDist;
}

function messageMatchesKeyword(msg: string, keyword: string): boolean {
  // Expression exacte multi-mots → correspondance exacte uniquement
  if (keyword.includes(" ")) return msg.includes(keyword);
  // Mot seul → fuzzy sur chaque mot du message
  const words = msg.split(/\s+/);
  return words.some((w) => fuzzyMatch(w, keyword));
}

// ============================================================
// Détection de langue — FIX: anglais prioritaire si score égal
// ============================================================
function detectLanguage(message: string): "fr" | "en" {
  // FIX BUG 1: mots anglais forts détectés en priorité
  const strongEnglish = ["hello", "hi", "hey", "thanks", "thank you", "yes", "no",
    "what", "how", "where", "when", "who", "why", "tell me", "explain",
    "what is", "who are", "what are", "can you"];

  const strongFrench = ["bonjour", "salut", "bonsoir", "merci", "oui", "non",
    "quoi", "comment", "parle moi","pourquoi", "qui", "où", "quand",
    "qu'est", "c'est", "dites", "expliquez"];

  const msg = message.toLowerCase().trim();

  // Vérification des mots forts d'abord
  for (const w of strongEnglish) {
    if (msg.startsWith(w) || msg === w) return "en";
  }
  for (const w of strongFrench) {
    if (msg.startsWith(w) || msg === w) return "fr";
  }

  // Score général
  const frWords = [
    "les", "des", "vous", "nous", "votre", "notre", "avec", "pour", "dans",
    "sur", "une", "du", "au", "est", "que", "quel", "quelle", "équipe",
    "cabinet", "faire", "aide", "prix",
  ];
  const enWords = [
    "the", "are", "you", "your", "our", "with", "for", "in", "on", "a",
    "an", "of", "is", "do", "can", "team", "firm", "help", "price",
    "service", "contact", "partner",
  ];

  let frScore = 0;
  let enScore = 0;
  frWords.forEach((w) => { if (msg.includes(w)) frScore++; });
  enWords.forEach((w) => { if (msg.includes(w)) enScore++; });

  // FIX BUG 1: en cas d'égalité → anglais si message en latin sans accents
  if (enScore === frScore) {
    const hasAccents = /[àâäéèêëîïôùûüç]/i.test(message);
    return hasAccents ? "fr" : "en";
  }

  return enScore > frScore ? "en" : "fr";
}

// ============================================================
// Normalisation — supprime accents pour améliorer le matching
// ============================================================
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") 
    .replace(/[''`]/g, " ")          
    .trim();
}

interface KnowledgeEntry {
  keywords: string[];
  fr: string;
  en: string;
}

const knowledgeBase: KnowledgeEntry[] = [
  // Salutations — en premier pour priorité maximale
  {
    keywords: ["bonjour", "salut", "bonsoir", "hello", "hi", "hey", "good morning", "good evening", "salam"],
    fr: "Bonjour ! Je suis l'assistant de MGI BFC. Comment puis-je vous aider aujourd'hui ?",
    en: "Hello! I'm the MGI BFC assistant. How can I help you today?",
  },

  // Audit — FIX BUG 2: avant "présentation" pour éviter le chevauchement
  {
    keywords: ["audit", "commissariat", "controle interne", "internal control", "statutory", "legal audit", "audit legal", "audit contractuel"],
    fr: "Notre pôle **Audit & Commissariat aux comptes** comprend :\n- Audit légal\n- Audit contractuel\n- Audit des programmes/projets\n- Contrôle interne\n\nNous garantissons la fiabilité et la conformité de vos états financiers.",
    en: "Our **Audit & Statutory Audit** division includes:\n- Legal audit\n- Contractual audit\n- Program/project audit\n- Internal control\n\nWe ensure the reliability and compliance of your financial statements.",
  },

  // Transaction Advisory
  {
    keywords: ["transaction", "tas", "advisory", "valorisation", "valuation", "due diligence", "levee de fonds", "fundraising", "faisabilite", "feasibility", "restructuration", "restructuring"],
    fr: "Notre pôle **Transaction Advisory Services** couvre :\n- Valorisation d'entreprises\n- Due diligence\n- Étude de faisabilité\n- Restructuration\n- Accompagnement à la levée de fonds\n\nNous vous assistons dans toutes vos opérations stratégiques.",
    en: "Our **Transaction Advisory Services** division covers:\n- Business valuation\n- Due diligence\n- Feasibility study\n- Restructuring\n- Fundraising advisory\n\nWe assist you in all your strategic operations.",
  },

  // Comptabilité & Outsourcing
  {
    keywords: ["comptabilite", "accounting", "outsourcing", "externalisation", "consolidation", "fiscal", "tax", "paie", "payroll", "juridique", "secretarial"],
    fr: "Notre pôle **Comptabilité & Outsourcing** propose :\n- Supervision comptable\n- Externalisation de la paie\n- Consolidation des comptes\n- Assistance fiscale\n- Secrétariat juridique",
    en: "Our **Accounting & Outsourcing** division offers:\n- Accounting supervision\n- Payroll outsourcing\n- Financial statement consolidation\n- Tax advisory\n- Corporate secretarial services",
  },

  // Services généraux — FIX BUG 2: keywords moins ambigus
  {
    keywords: ["service", "offre", "proposez", "offer", "provide", "what do you do", "activite", "activity", "domaine", "prestations"],
    fr: `MGI BFC propose 3 grands pôles de services :\n1. **Audit & Commissariat aux comptes**\n2. **Transaction Advisory Services**\n3. **Comptabilité & Outsourcing**\n\nPour plus d'informations : ${COMPANY_DATA.email}`,
    en: `MGI BFC offers 3 main service areas:\n1. **Audit & Statutory Audit**\n2. **Transaction Advisory Services**\n3. **Accounting & Outsourcing**\n\nFor more info: ${COMPANY_DATA.email}`,
  },

  // Présentation générale — FIX BUG 2: retiré "qui est" trop générique
  {
    keywords: ["c est quoi", "qui etes vous", "presentez vous", "presentation", "about mgi", "who are you", "what is mgi", "mgibfc", "bfc consulting"],
    fr: "MGI BFC est un cabinet de conseil financier dont la mission est de créer de la valeur ajoutée grâce à des services financiers sur mesure. Nous opérons en Tunisie et accompagnons des entreprises locales et internationales.",
    en: "MGI BFC is a financial consulting firm whose mission is to create added value through tailor-made financial services. We operate in Tunisia and support local and international companies.",
  },

  // FIX BUG 3: "explique" et variantes
  {
    keywords: ["explique", "expliquer", "explain", "tell me more", "plus d info", "more info", "en savoir plus", "detail", "detailler", "preciser", "clarifier", "clarify"],
    fr: `Je peux vous expliquer nos services en détail. Sur quel sujet souhaitez-vous plus d'informations ?\n\n- **Audit** — légal, contractuel, contrôle interne\n- **Transaction Advisory** — valorisation, due diligence, levée de fonds\n- **Comptabilité & Outsourcing** — paie, fiscal, consolidation\n\nOu contactez-nous directement : ${COMPANY_DATA.email}`,
    en: `I can explain our services in detail. Which topic would you like more information on?\n\n- **Audit** — legal, contractual, internal control\n- **Transaction Advisory** — valuation, due diligence, fundraising\n- **Accounting & Outsourcing** — payroll, tax, consolidation\n\nOr contact us directly: ${COMPANY_DATA.email}`,
  },

  // Équipe
  {
    keywords: ["equipe", "team", "fondateur", "founder", "associe", "amine", "nadia", "dirigeant", "management", "qui dirige", "leadership"],
    fr: `L'équipe dirigeante de MGI BFC :\n- **Amine ABDERRAHMEN** – Fondateur\n- **Nadia YAICH** – Associée\n\nUne équipe d'experts dédiés à la création de valeur pour nos clients.`,
    en: `MGI BFC's leadership team:\n- **Amine ABDERRAHMEN** – Founder\n- **Nadia YAICH** – Partner\n\nA team of experts dedicated to creating value for our clients.`,
  },

  // Clients
  {
    keywords: ["client", "reference", "travaillez avec", "work with", "portefeuille", "clientele"],
    fr: `Parmi nos clients de référence :\n${COMPANY_DATA.clients.join(", ")}.\n\nNous accompagnons des entreprises locales et des multinationales dans leurs projets financiers.`,
    en: `Among our reference clients:\n${COMPANY_DATA.clients.join(", ")}.\n\nWe support both local companies and multinationals in their financial projects.`,
  },

  // Partenaires
  {
    keywords: ["partenaire", "partner", "partenariat", "partnership", "ugfs", "biat", "africinvest", "tuninvest"],
    fr: `Nos partenaires stratégiques :\n${COMPANY_DATA.partners.join(", ")}.\n\nCes partenariats renforcent notre capacité à accompagner nos clients.`,
    en: `Our strategic partners:\n${COMPANY_DATA.partners.join(", ")}.\n\nThese partnerships strengthen our ability to support clients in their projects.`,
  },

  // Contact
  {
    keywords: ["contact", "joindre", "reach", "email", "mail", "telephone", "phone", "coordonnees", "ecrire"],
    fr: `Vous pouvez nous contacter via :\n- **Email** : ${COMPANY_DATA.email}\n- **Site web** : ${COMPANY_DATA.website}\n- **Adresse** : ${COMPANY_DATA.address}`,
    en: `You can reach us via:\n- **Email**: ${COMPANY_DATA.email}\n- **Website**: ${COMPANY_DATA.website}\n- **Address**: ${COMPANY_DATA.address}`,
  },

  // Localisation
  {
    keywords: ["adresse", "address", "localisation", "location", "situe", "located", "bureau", "office", "tunis", "golden tower", "centre urbain"],
    fr: `Nous sommes situés à :\n**${COMPANY_DATA.address}**\n\nContactez-nous à ${COMPANY_DATA.email} pour fixer un rendez-vous.`,
    en: `We are located at:\n**${COMPANY_DATA.address}**\n\nFeel free to contact us at ${COMPANY_DATA.email} to schedule a meeting.`,
  },

  // Carrières
  {
    keywords: ["carriere", "career", "emploi", "job", "recrutement", "recruitment", "rejoindre", "join", "stage", "internship", "candidature"],
    fr: `Pour consulter nos offres d'emploi, visitez la section **Carrières** : ${COMPANY_DATA.website}\n\nOu envoyez votre candidature à ${COMPANY_DATA.email}`,
    en: `To view our job openings, visit the **Careers** section: ${COMPANY_DATA.website}\n\nOr send your application to ${COMPANY_DATA.email}`,
  },

  // Blog
  {
    keywords: ["blog", "article", "actualite", "news", "publication", "insight"],
    fr: `Retrouvez nos derniers articles dans la section **Blog** : ${COMPANY_DATA.website}`,
    en: `Find our latest articles in the **Blog** section: ${COMPANY_DATA.website}`,
  },

  // Mission / Valeurs
  {
    keywords: ["mission", "valeur", "value", "vision", "engagement", "commitment", "philosophie", "philosophy"],
    fr: "La mission de MGI BFC est de créer de la valeur ajoutée à travers des services financiers sur mesure. Nous nous engageons à offrir expertise, rigueur et proximité à chacun de nos clients.",
    en: "MGI BFC's mission is to create added value through tailor-made financial services. We are committed to delivering expertise, rigor, and proximity to each of our clients.",
  },

  // Remerciements
  {
    keywords: ["merci", "thank", "thanks", "parfait", "super", "great", "excellent", "nickel"],
    fr: "Avec plaisir ! N'hésitez pas si vous avez d'autres questions sur MGI BFC.",
    en: "You're welcome! Feel free to ask if you have any other questions about MGI BFC.",
  },
];

// ============================================================
// Fonction principale
// ============================================================
function getResponse(message: string): string {
  const lang = detectLanguage(message);
  // FIX BUG 2: normaliser le message pour ignorer accents et apostrophes
  const msg = normalize(message);

  for (const entry of knowledgeBase) {
    if (entry.keywords.some((k) => messageMatchesKeyword(msg, k))) {
      return entry[lang];
    }
  }

  return lang === "fr"
    ? `Je suis uniquement disponible pour répondre aux questions concernant MGI BFC . Pour toute autre demande, contactez-nous à ${COMPANY_DATA.email}`
    : `I'm only available to answer questions about MGI BFC . For anything else, feel free to reach us at ${COMPANY_DATA.email}`;
}

// ============================================================
// Handler Express
// ============================================================
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
