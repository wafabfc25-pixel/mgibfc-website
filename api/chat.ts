// ============================================================
// MGI BFC - Chatbot (No API, Free, Bilingual)
// ============================================================

const COMPANY_DATA = {
  name: "MGI BFC",
  email: "contact@bfc.com.tn",
  website: "www.mgibfc.com",
  address: "Immeuble Golden Tower B8.2, Centre Urbain Nord, Tunis",
  founders: ["Amine ABDERRAHMEN (Fondateur / Founder)", "Nadia YAICH (Associée / Partner)"],
  clients: [
    "Aziza", "Vistaprint", "ABCO", "Linedata", "Dr. Oetker", "Leoni", "Altrad", "Hutchinson", "Vilavi"
  ],
  partners: ["UGFS", "BIAT Capital", "BH Equity", "Tuninvest", "Zitouna Capital", "RMBV"],
};

// ============================================================
// Fuzzy matching — distance de Levenshtein
// ============================================================
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
  if (keyword.includes(" ")) return msg.includes(keyword);
  const words = msg.split(/\s+/);
  return words.some((w) => fuzzyMatch(w, keyword));
}

// ============================================================
// Normalisation
// ============================================================
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[''`\-]/g, " ")   // FIX: tiret aussi converti en espace
    .replace(/\s+/g, " ")
    .trim();
}

// ============================================================
// Détection de langue
// FIX: "et la comptabilité", "audit chaque service" → français
// ============================================================

// Mémorise la dernière langue utilisée pour la cohérence
let lastLanguage: "fr" | "en" = "fr";

function detectLanguage(message: string): "fr" | "en" {
  const msg = message.toLowerCase().trim();

  // FIX PROBLÈME 4: changer de langue explicitement
  if (["english", "in english", "speak english", "répondez en anglais", "en anglais"].some(w => msg.includes(w))) {
    lastLanguage = "en";
    return "en";
  }
  if (["français", "en français", "parle français", "french", "réponds en français"].some(w => msg.includes(w))) {
    lastLanguage = "fr";
    return "fr";
  }

  // Mots forts anglais — seulement si le message COMMENCE par ces mots
  const strongEnglish = ["hello", "hi", "hey", "thanks", "thank you", "yes", "no",
    "what", "how", "where", "when", "who", "why", "tell me", "explain",
    "what is", "who are", "what are", "can you"];

  // Mots forts français — seulement si le message COMMENCE par ces mots
  const strongFrench = ["bonjour", "salut", "bonsoir", "merci", "oui", "non",
    "quoi", "comment", "parle moi", "pourquoi", "où", "quand",
    "qu est", "c est", "dites", "expliquez", "et la", "et le", "et les"];

  for (const w of strongFrench) {
    if (msg.startsWith(w)) { lastLanguage = "fr"; return "fr"; }
  }
  for (const w of strongEnglish) {
    if (msg.startsWith(w)) { lastLanguage = "en"; return "en"; }
  }

  // Score général — FIX: ajout de "et", "la", "le", "chaque" en français
  const frWords = [
    "les", "des", "vous", "nous", "votre", "notre", "avec", "pour", "dans",
    "sur", "une", "du", "au", "est", "que", "quel", "quelle", "equipe",
    "cabinet", "faire", "aide", "la", "le", "et", "chaque", "son", "ses",
    "leur", "leurs", "ce", "cet", "cette", "ces", "mon", "ma", "mes",
  ];
  const enWords = [
    "the", "are", "your", "our", "with", "an", "of", "do", "can",
    "team", "firm", "help", "price", "each", "every", "its", "their",
    "this", "that", "these", "those", "my",
  ];

  let frScore = 0;
  let enScore = 0;
  frWords.forEach((w) => { if (msg.split(/\s+/).includes(w)) frScore++; });
  enWords.forEach((w) => { if (msg.split(/\s+/).includes(w)) enScore++; });

  if (frScore > enScore) { lastLanguage = "fr"; return "fr"; }
  if (enScore > frScore) { lastLanguage = "en"; return "en"; }

  // En cas d'égalité → utilise la dernière langue connue
  return lastLanguage;
}

// ============================================================
// Base de connaissances
// ============================================================
interface KnowledgeEntry {
  keywords: string[];
  fr: string;
  en: string;
}

const knowledgeBase: KnowledgeEntry[] = [
  // Salutations
  {
    keywords: ["bonjour", "salut", "bonsoir", "hello", "hi", "hey", "good morning", "good evening", "salam"],
    fr: "Bonjour ! Je suis l'assistant de MGI BFC. Comment puis-je vous aider aujourd'hui ?",
    en: "Hello! I'm the MGI BFC assistant. How can I help you today?",
  },

  // FIX PROBLÈME 2: Audit légal — explication détaillée
  {
    keywords: ["legal audit", "audit legal", "audit legale", "legale", "legal"],
    fr: "L'**audit légal** (ou commissariat aux comptes) est une mission obligatoire imposée par la loi. Un commissaire aux comptes indépendant vérifie et certifie que vos états financiers sont sincères et donnent une image fidèle de la réalité de l'entreprise.",
    en: "**Legal audit** (statutory audit) is a mandatory mission required by law. An independent statutory auditor verifies and certifies that your financial statements are accurate and give a true and fair view of the company's financial position.",
  },

  // FIX PROBLÈME 2: Audit contractuel — explication détaillée
  {
    keywords: ["audit contractuel", "contractual audit", "contractuel"],
    fr: "L'**audit contractuel** est une mission volontaire à la demande d'une entreprise ou d'un tiers. Il peut couvrir une opération spécifique, un projet, une acquisition ou tout besoin particulier de vérification financière.",
    en: "**Contractual audit** is a voluntary mission at the request of a company or third party. It can cover a specific transaction, project, acquisition, or any particular financial verification need.",
  },

  // FIX PROBLÈME 2: Contrôle interne — explication détaillée
  {
    keywords: ["controle interne", "internal control", "controle"],
    fr: "Le **contrôle interne** consiste à évaluer et améliorer les processus et procédures internes d'une entreprise pour minimiser les risques, prévenir la fraude et garantir la fiabilité des informations financières.",
    en: "**Internal control** involves evaluating and improving a company's internal processes and procedures to minimize risks, prevent fraud, and ensure the reliability of financial information.",
  },

  // FIX PROBLÈME 2: Audit programmes/projets — explication détaillée
  {
    keywords: ["audit programme", "audit projet", "program audit", "project audit", "programmes", "projets"],
    fr: "L'**audit des programmes et projets** évalue l'utilisation des fonds alloués à des programmes ou projets spécifiques. Il vérifie que les ressources sont utilisées conformément aux objectifs et aux règles établies.",
    en: "**Program and project audit** evaluates the use of funds allocated to specific programs or projects. It verifies that resources are used in accordance with established objectives and rules.",
  },

  // Audit général
  {
    keywords: ["audit", "commissariat", "statutory"],
    fr: "Notre pôle **Audit & Commissariat aux comptes** comprend :\n- **Audit légal** — certification obligatoire des comptes\n- **Audit contractuel** — vérification à la demande\n- **Audit des programmes/projets** — contrôle de l'utilisation des fonds\n- **Contrôle interne** — évaluation des processus internes\n\nVoulez-vous que j'explique l'un de ces services en détail ?",
    en: "Our **Audit & Statutory Audit** division includes:\n- **Legal audit** — mandatory accounts certification\n- **Contractual audit** — verification on request\n- **Program/project audit** — funds usage control\n- **Internal control** — internal process evaluation\n\nWould you like me to explain any of these services in detail?",
  },

  // Transaction Advisory
  {
    keywords: ["transaction", "tas", "advisory", "valorisation", "valuation", "due diligence", "levee de fonds", "fundraising", "faisabilite", "feasibility", "restructuration", "restructuring"],
    fr: "Notre pôle **Transaction Advisory Services** couvre :\n- **Valorisation d'entreprises** — évaluation de la valeur d'une société\n- **Due diligence** — audit d'acquisition avant une transaction\n- **Étude de faisabilité** — analyse de viabilité d'un projet\n- **Restructuration** — réorganisation financière ou opérationnelle\n- **Levée de fonds** — accompagnement pour trouver des investisseurs\n\nVoulez-vous plus de détails sur l'un de ces points ?",
    en: "Our **Transaction Advisory Services** division covers:\n- **Business valuation** — evaluating a company's worth\n- **Due diligence** — acquisition audit before a transaction\n- **Feasibility study** — project viability analysis\n- **Restructuring** — financial or operational reorganization\n- **Fundraising advisory** — support in finding investors\n\nWould you like more details on any of these?",
  },

  // Comptabilité & Outsourcing
  {
    keywords: ["comptabilite", "accounting", "outsourcing", "externalisation", "consolidation", "fiscal", "tax", "paie", "payroll", "juridique", "secretarial"],
    fr: "Notre pôle **Comptabilité & Outsourcing** propose :\n- **Supervision comptable** — encadrement de votre comptabilité\n- **Externalisation de la paie** — gestion externalisée des salaires\n- **Consolidation des comptes** — regroupement des états financiers d'un groupe\n- **Assistance fiscale** — optimisation et conformité fiscale\n- **Secrétariat juridique** — gestion des obligations légales de l'entreprise",
    en: "Our **Accounting & Outsourcing** division offers:\n- **Accounting supervision** — oversight of your accounting\n- **Payroll outsourcing** — externalized salary management\n- **Financial statement consolidation** — grouping of group financial statements\n- **Tax advisory** — tax optimization and compliance\n- **Corporate secretarial services** — management of legal obligations",
  },

  // Services généraux
  {
    keywords: ["service", "offre", "proposez", "offer", "provide", "what do you do", "activite", "activity", "domaine", "prestations"],
    fr: `MGI BFC propose 3 grands pôles de services :\n1. **Audit & Commissariat aux comptes**\n2. **Transaction Advisory Services**\n3. **Comptabilité & Outsourcing**\n\nSur lequel souhaitez-vous plus d'informations ?`,
    en: `MGI BFC offers 3 main service areas:\n1. **Audit & Statutory Audit**\n2. **Transaction Advisory Services**\n3. **Accounting & Outsourcing**\n\nWhich one would you like more information on?`,
  },

  // Présentation générale
  {
    keywords: ["c est quoi", "qui etes vous", "presentez vous", "presentation", "about mgi", "who are you", "what is mgi", "mgibfc", "bfc consulting"],
    fr: "MGI BFC est un cabinet de conseil financier dont la mission est de créer de la valeur ajoutée grâce à des services financiers sur mesure. Nous opérons en Tunisie et accompagnons des entreprises locales et internationales.",
    en: "MGI BFC is a financial consulting firm whose mission is to create added value through tailor-made financial services. We operate in Tunisia and support local and international companies.",
  },

  // Explique général
  {
    keywords: ["explique", "expliquer", "explain", "tell me more", "plus d info", "more info", "en savoir plus", "detail", "detailler", "preciser", "clarifier", "clarify", "chaque"],
    fr: `Je peux vous expliquer nos services en détail. Sur quel sujet ?\n\n- **Audit** — légal, contractuel, contrôle interne\n- **Transaction Advisory** — valorisation, due diligence, levée de fonds\n- **Comptabilité & Outsourcing** — paie, fiscal, consolidation\n\nContactez-nous : ${COMPANY_DATA.email}`,
    en: `I can explain our services in detail. Which topic?\n\n- **Audit** — legal, contractual, internal control\n- **Transaction Advisory** — valuation, due diligence, fundraising\n- **Accounting & Outsourcing** — payroll, tax, consolidation\n\nContact us: ${COMPANY_DATA.email}`,
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

  // FIX PROBLÈME 4: changement de langue
  {
    keywords: ["english", "in english", "speak english", "en anglais", "francais", "en francais", "french"],
    fr: "Bien sûr ! Je peux répondre en français ou en anglais. Comment puis-je vous aider ?",
    en: "Of course! I can respond in French or English. How can I help you?",
  },
];

// ============================================================
// Fonction principale
// ============================================================
function getResponse(message: string): string {
  const lang = detectLanguage(message);
  const msg = normalize(message);

  for (const entry of knowledgeBase) {
    if (entry.keywords.some((k) => messageMatchesKeyword(msg, k))) {
      return entry[lang];
    }
  }

  return lang === "fr"
    ? `Je suis uniquement disponible pour répondre aux questions concernant MGI BFC. Pour toute autre demande, contactez-nous à ${COMPANY_DATA.email}`
    : `I'm only available to answer questions about MGI BFC. For anything else, feel free to reach us at ${COMPANY_DATA.email}`;
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
