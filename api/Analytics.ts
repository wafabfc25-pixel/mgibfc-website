import { loadData, getTopServices, getTopIntentions } from './chatMemory';

export default async function handler(req: any, res: any) {
  // Protection par token (défini dans .env)
  const authToken = req.headers['x-admin-token'];
  const expectedToken = process.env.ADMIN_TOKEN;
  
  if (!expectedToken) {
    console.warn('⚠️ ADMIN_TOKEN non défini dans .env - accès analytics désactivé');
    return res.status(503).json({ error: 'Service analytics non configuré' });
  }
  
  if (authToken !== expectedToken) {
    return res.status(401).json({ error: 'Non autorisé - Token invalide' });
  }
  
  try {
    const data = loadData();
    
    // Transformer les Maps en objets pour JSON
    const topServices = Array.from(data.servicesDemandes.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
    
    const topIntentions = Array.from(data.intentions.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
    
    const topQuestions = Array.from(data.questionsFrequentes.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([question, count]) => ({ question, count }));
    
    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      totals: {
        visitors: data.totalVisitors,
        chatInteractions: data.totalChatInteractions,
      },
      topServices,
      topIntentions,
      topQuestions,
      recentInteractions: data.historiqueMessages.slice(-20).map(m => ({
        date: m.timestamp,
        question: m.question.slice(0, 100),
        intention: m.intention,
        service: m.serviceLie,
      })),
    });
  } catch (error: any) {
    console.error('Erreur analytics:', error);
    res.status(500).json({ error: 'Erreur interne lors de la récupération des analytics' });
  }
}