// ============================================================
// MGI BFC - API Chat Memory (Persistance & Analytics)
// ============================================================

import fs from 'fs';
import path from 'path';

export interface ChatInteraction {
  id: string;
  sessionId: string;
  timestamp: string;
  question: string;
  intention: string;
  serviceLie?: string;
  reponse: string;
}

export interface AnalyticsData {
  totalVisitors: number;
  totalChatInteractions: number;
  questionsFrequentes: Map<string, number>;
  servicesDemandes: Map<string, number>;
  intentions: Map<string, number>;
  historiqueMessages: ChatInteraction[];
  // 🔧 FIX : ensemble des sessions déjà comptées
  sessionsCounted: Set<string>;
}

const DATA_PATH = path.join(process.cwd(), 'data', 'chat-analytics.json');

function loadDataRaw(): any {
  try {
    if (fs.existsSync(DATA_PATH)) {
      const raw = fs.readFileSync(DATA_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Erreur lecture data:', e);
  }
  return null;
}

export function loadData(): AnalyticsData {
  const parsed = loadDataRaw();
  if (parsed) {
    return {
      totalVisitors: parsed.totalVisitors || 0,
      totalChatInteractions: parsed.totalChatInteractions || 0,
      questionsFrequentes: new Map(Object.entries(parsed.questionsFrequentes || {})),
      servicesDemandes: new Map(Object.entries(parsed.servicesDemandes || {})),
      intentions: new Map(Object.entries(parsed.intentions || {})),
      historiqueMessages: parsed.historiqueMessages || [],
      // 🔧 FIX : restauration de l'ensemble des sessions comptées
      sessionsCounted: new Set(parsed.sessionsCounted || []),
    };
  }
  return {
    totalVisitors: 0,
    totalChatInteractions: 0,
    questionsFrequentes: new Map(),
    servicesDemandes: new Map(),
    intentions: new Map(),
    historiqueMessages: [],
    sessionsCounted: new Set(),
  };
}

function saveData(data: AnalyticsData) {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const toSave = {
    totalVisitors: data.totalVisitors,
    totalChatInteractions: data.totalChatInteractions,
    questionsFrequentes: Object.fromEntries(data.questionsFrequentes),
    servicesDemandes: Object.fromEntries(data.servicesDemandes),
    intentions: Object.fromEntries(data.intentions),
    historiqueMessages: data.historiqueMessages,
    // 🔧 FIX : persistance des sessions comptées
    sessionsCounted: Array.from(data.sessionsCounted),
  };
  fs.writeFileSync(DATA_PATH, JSON.stringify(toSave, null, 2));
}

export function saveInteraction(
  sessionId: string,
  question: string,
  intention: string,
  serviceLie: string | undefined,
  reponse: string
): AnalyticsData {
  const data = loadData();
  const id = `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

  data.totalChatInteractions++;
  data.historiqueMessages.push({
    id,
    sessionId,
    timestamp: new Date().toISOString(),
    question: question.slice(0, 500),
    intention,
    serviceLie,
    reponse: reponse.slice(0, 1000),
  });

  const qKey = question.toLowerCase().slice(0, 100);
  data.questionsFrequentes.set(qKey, (data.questionsFrequentes.get(qKey) || 0) + 1);

  if (intention) {
    data.intentions.set(intention, (data.intentions.get(intention) || 0) + 1);
  }

  if (serviceLie) {
    data.servicesDemandes.set(serviceLie, (data.servicesDemandes.get(serviceLie) || 0) + 1);
  }

  if (data.historiqueMessages.length > 5000) {
    data.historiqueMessages = data.historiqueMessages.slice(-5000);
  }

  saveData(data);
  return data;
}

export function getUserContext(sessionId: string, limit: number = 5): ChatInteraction[] {
  const data = loadData();
  return data.historiqueMessages
    .filter(m => m.sessionId === sessionId)
    .slice(-limit);
}

export function getTopServices(limit: number = 5): [string, number][] {
  const data = loadData();
  return Array.from(data.servicesDemandes.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

export function getTopIntentions(limit: number = 5): [string, number][] {
  const data = loadData();
  return Array.from(data.intentions.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

// 🔧 FIX : logique de comptage des visiteurs simplifiée et fiable
export function incrementVisitor(sessionId: string): number {
  const data = loadData();

  if (!data.sessionsCounted.has(sessionId)) {
    data.sessionsCounted.add(sessionId);
    data.totalVisitors++;
    saveData(data);
  }

  return data.totalVisitors;
}