// ============================================================
// MGI BFC - api/chat.ts
// ============================================================

const COMPANY_DATA = {
  name: "MGI BFC",
  email: "contact@bfc.com.tn",
  website: "www.mgibfc.com",
  address: "Immeuble Golden Tower B8.2, Centre Urbain Nord, Tunis",
  clients: ["Aziza", "Vistaprint", "ABCO", "Linedata", "Dr. Oetker", "Leoni", "Altrad", "Hutchinson", "Vilavi"],
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
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
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
  return msg.split(/\s+/).some((w) => fuzzyMatch(w, keyword));
}

// ============================================================
// Normalisation
// ============================================================
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[''`\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ============================================================
// Détection de langue avec mémoire
// ============================================================
let lastLanguage: "fr" | "en" = "fr";

function detectLanguage(message: string): "fr" | "en" {
  const msg = message.toLowerCase().trim();

  if (["english","in english","speak english","repondez en anglais","en anglais"].some(w => msg.includes(w))) { lastLanguage = "en"; return "en"; }
  if (["francais","en francais","parle francais","french","reponds en francais"].some(w => msg.includes(w))) { lastLanguage = "fr"; return "fr"; }

  const strongFr = ["bonjour","salut","bonsoir","merci","oui","non","quoi","comment","parle moi","pourquoi","ou","quand","qu est","c est","dites","expliquez","et la","et le","et les","qu est ce","c est quoi"];
  const strongEn = ["hello","hi","hey","thanks","thank you","yes","no","what","how","where","when","who","why","tell me","explain","what is","what's","who are","what are","can you","and the","and what"];

  for (const w of strongFr) { if (msg.startsWith(w)) { lastLanguage = "fr"; return "fr"; } }
  for (const w of strongEn) { if (msg.startsWith(w)) { lastLanguage = "en"; return "en"; } }

  const frWords = ["les","des","vous","nous","votre","notre","avec","pour","dans","sur","une","du","au","est","que","quel","quelle","equipe","cabinet","faire","aide","la","le","et","chaque","son","ses","leur","leurs","ce","cet","cette","ces","mon","ma","mes"];
  const enWords = ["the","are","your","our","with","an","of","do","can","team","firm","help","price","each","every","its","their","this","that","these","those","my"];

  const words = msg.split(/\s+/);
  let frScore = 0, enScore = 0;
  frWords.forEach(w => { if (words.includes(w)) frScore++; });
  enWords.forEach(w => { if (words.includes(w)) enScore++; });

  if (frScore > enScore) { lastLanguage = "fr"; return "fr"; }
  if (enScore > frScore) { lastLanguage = "en"; return "en"; }
  return lastLanguage;
}

// ============================================================
// Base de connaissances
// ============================================================
interface KnowledgeEntry { keywords: string[]; fr: string; en: string; }

const knowledgeBase: KnowledgeEntry[] = [
  {
    keywords: ["bonjour","salut","bonsoir","hello","hi","hey","good morning","good evening","salam"],
    fr: "Bonjour ! Je suis l'assistant de MGI BFC. Comment puis-je vous aider aujourd'hui ?",
    en: "Hello! I'm the MGI BFC assistant. How can I help you today?",
  },
  {
    keywords: ["legal audit","audit legal","audit legale","legale","commissariat aux comptes"],
    fr: "L'**audit légal** (commissariat aux comptes) est une mission obligatoire imposée par la loi. Un commissaire aux comptes indépendant vérifie et certifie que vos états financiers sont sincères et donnent une image fidèle de la réalité de l'entreprise.",
    en: "**Legal audit** (statutory audit) is a mandatory mission required by law. An independent statutory auditor verifies and certifies that your financial statements are accurate and give a true and fair view of the company's financial position.",
  },
  {
    keywords: ["audit contractuel","contractual audit","contractuel","contratuel"],
    fr: "L'**audit contractuel** est une mission volontaire à la demande d'une entreprise ou d'un tiers. Il peut couvrir une opération spécifique, un projet, une acquisition ou tout besoin particulier de vérification financière.",
    en: "**Contractual audit** is a voluntary mission requested by a company or third party. It can cover a specific transaction, project, acquisition, or any particular financial verification need.",
  },
  {
    keywords: ["controle interne","internal control"],
    fr: "Le **contrôle interne** consiste à évaluer et améliorer les processus internes d'une entreprise pour minimiser les risques, prévenir la fraude et garantir la fiabilité des informations financières.",
    en: "**Internal control** involves evaluating and improving a company's internal processes to minimize risks, prevent fraud, and ensure the reliability of financial information.",
  },
  {
    keywords: ["audit programme","audit projet","program audit","project audit","programmes","projets"],
    fr: "L'**audit des programmes et projets** évalue l'utilisation des fonds alloués à des programmes ou projets spécifiques. Il vérifie que les ressources sont utilisées conformément aux objectifs et règles établies.",
    en: "**Program and project audit** evaluates the use of funds allocated to specific programs or projects. It verifies that resources are used in accordance with established objectives and rules.",
  },
  {
    keywords: ["audit","commissariat","statutory"],
    fr: "Notre pôle **Audit & Commissariat aux comptes** comprend :\n- **Audit légal** — certification obligatoire des comptes\n- **Audit contractuel** — vérification à la demande\n- **Audit des programmes/projets** — contrôle de l'utilisation des fonds\n- **Contrôle interne** — évaluation des processus internes\n\nVoulez-vous que j'explique l'un de ces services en détail ?",
    en: "Our **Audit & Statutory Audit** division includes:\n- **Legal audit** — mandatory accounts certification\n- **Contractual audit** — verification on request\n- **Program/project audit** — funds usage control\n- **Internal control** — internal process evaluation\n\nWould you like me to explain any of these in detail?",
  },
  {
    keywords: ["due diligence","due-diligence","diligence"],
    fr: "La **due diligence** est un audit approfondi réalisé avant une acquisition ou une transaction. Elle permet d'identifier les risques financiers, juridiques et opérationnels d'une entreprise cible avant de finaliser un investissement.",
    en: "**Due diligence** is an in-depth audit conducted before an acquisition or transaction. It identifies financial, legal, and operational risks of a target company before finalizing an investment.",
  },
  {
    keywords: ["valorisation","valuation","business valuation","valeur entreprise","evaluation entreprise"],
    fr: "La **valorisation d'entreprises** consiste à estimer la valeur économique d'une société. Nous utilisons différentes méthodes (DCF, multiples de marché, actif net) pour déterminer une valeur juste et défendable.",
    en: "**Business valuation** consists of estimating the economic value of a company. We use various methods (DCF, market multiples, net assets) to determine a fair and defensible value.",
  },
  {
    keywords: ["fundraising","levee de fonds","levee","investisseur","investor"],
    fr: "L'**accompagnement à la levée de fonds** consiste à préparer et accompagner une entreprise dans sa recherche d'investisseurs (capital-risque, private equity, fonds publics). Nous préparons les dossiers et facilitons les négociations.",
    en: "**Fundraising advisory** involves preparing and supporting a company in finding investors (venture capital, private equity, public funds). We prepare the files and facilitate negotiations.",
  },
  {
    keywords: ["faisabilite","feasibility","etude de faisabilite","feasibility study"],
    fr: "L'**étude de faisabilité** analyse la viabilité économique, financière et technique d'un projet avant son lancement. Elle permet de prendre une décision éclairée sur l'opportunité d'investissement.",
    en: "A **feasibility study** analyzes the economic, financial, and technical viability of a project before launch. It allows for an informed decision on the investment opportunity.",
  },
  {
    keywords: ["restructuration","restructuring","reorganisation","reorganization"],
    fr: "La **restructuration** consiste à réorganiser les activités, la structure financière ou opérationnelle d'une entreprise pour améliorer sa performance ou faire face à des difficultés.",
    en: "**Restructuring** involves reorganizing a company's activities, financial, or operational structure to improve performance or address difficulties.",
  },
  {
    keywords: ["transaction","tas","advisory"],
    fr: "Notre pôle **Transaction Advisory Services** couvre :\n- **Valorisation d'entreprises**\n- **Due diligence**\n- **Étude de faisabilité**\n- **Restructuration**\n- **Levée de fonds**\n\nVoulez-vous que j'explique l'un de ces services ?",
    en: "Our **Transaction Advisory Services** division covers:\n- **Business valuation**\n- **Due diligence**\n- **Feasibility study**\n- **Restructuring**\n- **Fundraising advisory**\n\nWould you like me to explain any of these?",
  },
  {
    keywords: ["supervision comptable","accounting supervision"],
    fr: "La **supervision comptable** consiste à encadrer et contrôler la tenue de votre comptabilité pour garantir sa fiabilité, sa conformité aux normes et sa cohérence avec les obligations légales.",
    en: "**Accounting supervision** involves overseeing and controlling your bookkeeping to ensure its reliability, compliance with standards, and consistency with legal obligations.",
  },
  {
    keywords: ["paie","payroll","salaire","salary","externalisation de la paie","payroll outsourcing"],
    fr: "L'**externalisation de la paie** permet de confier la gestion des salaires à MGI BFC. Nous prenons en charge le calcul des bulletins de paie, les déclarations sociales et la conformité aux obligations légales.",
    en: "**Payroll outsourcing** allows you to entrust salary management to MGI BFC. We handle payslip calculations, social declarations, and compliance with legal obligations.",
  },
  {
    keywords: ["consolidation","consolidation des comptes"],
    fr: "La **consolidation des comptes** consiste à regrouper les états financiers de toutes les entités d'un groupe en un seul jeu de comptes consolidés, donnant une vision globale de la situation financière du groupe.",
    en: "**Financial statement consolidation** involves combining the financial statements of all entities in a group into a single set of consolidated accounts, giving an overall view of the group's financial position.",
  },
  {
    keywords: ["fiscal","tax","assistance fiscale","tax advisory","impot","taxe","optimisation fiscale"],
    fr: "L'**assistance fiscale** couvre l'optimisation de votre charge fiscale, la préparation des déclarations fiscales et le conseil en matière de conformité aux obligations fiscales tunisiennes et internationales.",
    en: "**Tax advisory** covers optimizing your tax burden, preparing tax returns, and advising on compliance with Tunisian and international tax obligations.",
  },
  {
    keywords: ["juridique","secretarial","secretariat juridique","corporate secretarial"],
    fr: "Le **secrétariat juridique** prend en charge les obligations légales de votre entreprise : rédaction des procès-verbaux, tenue des registres légaux, dépôts officiels et formalités administratives.",
    en: "**Corporate secretarial services** handle your company's legal obligations: drafting minutes, maintaining legal registers, official filings, and administrative formalities.",
  },
  {
    keywords: ["comptabilite","accounting","outsourcing","externalisation","comptable"],
    fr: "Notre pôle **Comptabilité & Outsourcing** propose :\n- **Supervision comptable**\n- **Externalisation de la paie**\n- **Consolidation des comptes**\n- **Assistance fiscale**\n- **Secrétariat juridique**\n\nVoulez-vous que j'explique l'un de ces services ?",
    en: "Our **Accounting & Outsourcing** division offers:\n- **Accounting supervision**\n- **Payroll outsourcing**\n- **Financial statement consolidation**\n- **Tax advisory**\n- **Corporate secretarial services**\n\nWould you like me to explain any of these?",
  },
  {
    keywords: ["service","offre","proposez","offer","provide","what do you do","activite","activity","domaine","prestations"],
    fr: `MGI BFC propose 3 grands pôles de services :\n1. **Audit & Commissariat aux comptes**\n2. **Transaction Advisory Services**\n3. **Comptabilité & Outsourcing**\n\nSur lequel souhaitez-vous plus d'informations ?`,
    en: `MGI BFC offers 3 main service areas:\n1. **Audit & Statutory Audit**\n2. **Transaction Advisory Services**\n3. **Accounting & Outsourcing**\n\nWhich one would you like more information on?`,
  },
  {
    keywords: ["c est quoi","qui etes vous","presentez vous","presentation","about mgi","who are you","what is mgi","mgibfc"],
    fr: "MGI BFC est un cabinet de conseil financier dont la mission est de créer de la valeur ajoutée grâce à des services financiers sur mesure. Nous opérons en Tunisie et accompagnons des entreprises locales et internationales.",
    en: "MGI BFC is a financial consulting firm whose mission is to create added value through tailor-made financial services. We operate in Tunisia and support local and international companies.",
  },
  {
    keywords: ["explique","expliquer","explain","tell me more","plus d info","more info","en savoir plus","detail","detailler"],
    fr: `Sur quel service souhaitez-vous plus d'informations ?\n\n- **Audit** — légal, contractuel, contrôle interne\n- **Transaction Advisory** — valorisation, due diligence, levée de fonds\n- **Comptabilité & Outsourcing** — paie, fiscal, consolidation\n\nContactez-nous : ${COMPANY_DATA.email}`,
    en: `Which service would you like more information on?\n\n- **Audit** — legal, contractual, internal control\n- **Transaction Advisory** — valuation, due diligence, fundraising\n- **Accounting & Outsourcing** — payroll, tax, consolidation\n\nContact us: ${COMPANY_DATA.email}`,
  },
  {
    keywords: ["equipe","team","fondateur","founder","associe","amine","nadia","dirigeant","management","leadership"],
    fr: `L'équipe dirigeante de MGI BFC :\n- **Amine ABDERRAHMEN** – Fondateur\n- **Nadia YAICH** – Associée\n\nUne équipe d'experts dédiés à la création de valeur pour nos clients.`,
    en: `MGI BFC's leadership team:\n- **Amine ABDERRAHMEN** – Founder\n- **Nadia YAICH** – Partner\n\nA team of experts dedicated to creating value for our clients.`,
  },
  {
    keywords: ["client","reference","travaillez avec","work with","portefeuille","clientele"],
    fr: `Parmi nos clients de référence :\n${COMPANY_DATA.clients.join(", ")}.\n\nNous accompagnons des entreprises locales et des multinationales dans leurs projets financiers.`,
    en: `Among our reference clients:\n${COMPANY_DATA.clients.join(", ")}.\n\nWe support both local companies and multinationals in their financial projects.`,
  },
  {
    keywords: ["partenaire","partner","partenariat","partnership","ugfs","biat","tuninvest"],
    fr: `Nos partenaires stratégiques :\n${COMPANY_DATA.partners.join(", ")}.\n\nCes partenariats renforcent notre capacité à accompagner nos clients.`,
    en: `Our strategic partners:\n${COMPANY_DATA.partners.join(", ")}.\n\nThese partnerships strengthen our ability to support clients in their projects.`,
  },
  {
    keywords: ["contact","joindre","reach","email","mail","telephone","phone","coordonnees","ecrire"],
    fr: `Vous pouvez nous contacter via :\n- **Email** : ${COMPANY_DATA.email}\n- **Site web** : ${COMPANY_DATA.website}\n- **Adresse** : ${COMPANY_DATA.address}`,
    en: `You can reach us via:\n- **Email**: ${COMPANY_DATA.email}\n- **Website**: ${COMPANY_DATA.website}\n- **Address**: ${COMPANY_DATA.address}`,
  },
  {
    keywords: ["adresse","address","localisation","location","situe","located","bureau","office","tunis","golden tower"],
    fr: `Nous sommes situés à :\n**${COMPANY_DATA.address}**\n\nContactez-nous à ${COMPANY_DATA.email} pour fixer un rendez-vous.`,
    en: `We are located at:\n**${COMPANY_DATA.address}**\n\nFeel free to contact us at ${COMPANY_DATA.email} to schedule a meeting.`,
  },
  {
    keywords: ["carriere","career","emploi","job","recrutement","recruitment","rejoindre","join","stage","internship"],
    fr: `Pour consulter nos offres d'emploi, visitez la section **Carrières** : ${COMPANY_DATA.website}\n\nOu envoyez votre candidature à ${COMPANY_DATA.email}`,
    en: `To view our job openings, visit the **Careers** section: ${COMPANY_DATA.website}\n\nOr send your application to ${COMPANY_DATA.email}`,
  },
  {
    keywords: ["blog","article","actualite","news","publication","insight"],
    fr: `Retrouvez nos derniers articles dans la section **Blog** : ${COMPANY_DATA.website}`,
    en: `Find our latest articles in the **Blog** section: ${COMPANY_DATA.website}`,
  },
  {
    keywords: ["mission","valeur","value","vision","engagement","commitment","philosophie"],
    fr: "La mission de MGI BFC est de créer de la valeur ajoutée à travers des services financiers sur mesure. Nous nous engageons à offrir expertise, rigueur et proximité à chacun de nos clients.",
    en: "MGI BFC's mission is to create added value through tailor-made financial services. We are committed to delivering expertise, rigor, and proximity to each of our clients.",
  },
  {
    keywords: ["merci","thank","thanks","parfait","super","great","excellent","nickel"],
    fr: "Avec plaisir ! N'hésitez pas si vous avez d'autres questions sur MGI BFC.",
    en: "You're welcome! Feel free to ask if you have any other questions about MGI BFC.",
  },
  {
    keywords: ["english","in english","speak english","en anglais","francais","en francais","french"],
    fr: "Bien sûr ! Je peux répondre en français ou en anglais. Comment puis-je vous aider ?",
    en: "Of course! I can respond in French or English. How can I help you?",
  },
];

// ============================================================
// Boutons contextuels
// ============================================================
const BUTTONS_MAP: Record<string, { fr: string[]; en: string[] }> = {
  greeting: {
    fr: ["Nos services", "Nous contacter", "L'équipe", "Nos clients"],
    en: ["Our services", "Contact us", "The team", "Our clients"],
  },
  audit: {
    fr: ["Audit légal", "Audit contractuel", "Contrôle interne", "Audit de projets"],
    en: ["Legal audit", "Contractual audit", "Internal control", "Project audit"],
  },
  transaction: {
    fr: ["Valorisation", "Due diligence", "Levée de fonds", "Étude de faisabilité"],
    en: ["Valuation", "Due diligence", "Fundraising", "Feasibility study"],
  },
  comptabilite: {
    fr: ["Supervision comptable", "Externalisation de la paie", "Assistance fiscale", "Consolidation des comptes"],
    en: ["Accounting supervision", "Payroll outsourcing", "Tax advisory", "Financial consolidation"],
  },
  services: {
    fr: ["Audit & Commissariat", "Transaction Advisory", "Comptabilité & Outsourcing"],
    en: ["Audit & Statutory", "Transaction Advisory", "Accounting & Outsourcing"],
  },
  contact: {
    fr: ["Prendre rendez-vous", "Envoyer un email", "Voir l'adresse"],
    en: ["Schedule a meeting", "Send an email", "View address"],
  },
  team: {
    fr: ["Nos services", "Nos clients", "Nous contacter"],
    en: ["Our services", "Our clients", "Contact us"],
  },
  clients: {
    fr: ["Nos partenaires", "Nos services", "Nous contacter"],
    en: ["Our partners", "Our services", "Contact us"],
  },
};

function detectButtonContext(msg: string): string {
  if (["bonjour","salut","bonsoir","hello","hi","hey","salam"].some(k => msg.includes(k))) return "greeting";
  if (["audit","commissariat","controle interne","legal audit","audit contractuel","audit programme"].some(k => msg.includes(k))) return "audit";
  if (["transaction","valorisation","due diligence","levee de fonds","valuation","faisabilite","restructuration"].some(k => msg.includes(k))) return "transaction";
  if (["comptabilite","accounting","paie","payroll","fiscal","outsourcing","consolidation","supervision"].some(k => msg.includes(k))) return "comptabilite";
  if (["service","offre","proposez","what do you do","activite","domaine","prestations"].some(k => msg.includes(k))) return "services";
  if (["contact","joindre","email","mail","telephone","adresse"].some(k => msg.includes(k))) return "contact";
  if (["equipe","team","fondateur","founder","amine","nadia"].some(k => msg.includes(k))) return "team";
  if (["client","reference","partenaire","partner"].some(k => msg.includes(k))) return "clients";
  return "services"; // fallback
}

// ============================================================
// Fonction principale
// ============================================================
function getResponse(message: string): string {
  const lang = detectLanguage(message);
  const msg = normalize(message);
  for (const entry of knowledgeBase) {
    if (entry.keywords.some((k) => messageMatchesKeyword(msg, k))) return entry[lang];
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
    const lang    = detectLanguage(message);
    const reply   = getResponse(message);
    const context = detectButtonContext(normalize(message));
    const buttons = BUTTONS_MAP[context]?.[lang] ?? BUTTONS_MAP["services"][lang];

    console.log("✅ lang:", lang, "| context:", context);
    res.status(200).json({ reply, buttons, lang });
  } catch (error: any) {
    console.error("❌ Erreur chatbot:", error?.message);
    res.status(500).json({ error: "Erreur interne." });
  }
}