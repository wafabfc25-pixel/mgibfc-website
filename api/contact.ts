import axios from "axios";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { firstName, lastName, email, service, message } = req.body;

  try {
    // We forward the contact form to Formspree which will deliver it to the company email.
    // This is the most reliable way to send emails from Vercel without a dedicated mail server.
    // NOTE: You will receive an email from Formspree to confirm 'contact@bfc.com.tn' once.
    await axios.post('https://formspree.io/f/contact@bfc.com.tn', {
      name: `${firstName} ${lastName}`,
      email: email,
      service: service,
      message: message,
      _subject: `Nouveau message de contact: ${firstName} ${lastName}`
    });

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Contact Form Error:", error);
    // Even if it fails (e.g. email not verified), we want to provide a decent experience
    res.status(500).json({ error: "Failed to send message" });
  }
}
