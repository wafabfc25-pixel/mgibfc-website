import { sendNotificationEmail, EmailData } from './emailService';

export default async function handler(req: any, res: any) {
  // Uniquement POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { type, nom, email, telephone, message, serviceDemande } = req.body;
  
  // Validation basique
  if (!nom || typeof nom !== 'string' || nom.trim().length < 2) {
    return res.status(400).json({ error: 'Veuillez fournir un nom valide (minimum 2 caractères)' });
  }
  
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Veuillez fournir un email valide' });
  }
  
  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    return res.status(400).json({ error: 'Veuillez fournir un message d\'au moins 10 caractères' });
  }
  
  // Type valide
  const validTypes = ['contact', 'candidature', 'service'];
  const finalType = validTypes.includes(type) ? type : 'contact';
  
  const emailData: EmailData = {
    type: finalType,
    nom: nom.trim(),
    email: email.trim().toLowerCase(),
    telephone: telephone?.trim(),
    message: message.trim(),
    serviceDemande: serviceDemande?.trim(),
  };
  
  console.log(`📧 Envoi email de type "${finalType}" depuis ${emailData.email}`);
  
  const sent = await sendNotificationEmail(emailData);
  
  if (sent) {
    res.status(200).json({ 
      success: true, 
      message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.' 
    });
  } else {
    console.error('❌ Échec envoi email pour:', emailData.email);
    res.status(500).json({ 
      error: 'Erreur lors de l\'envoi de votre message. Veuillez réessayer ou nous contacter directement par téléphone.' 
    });
  }
}