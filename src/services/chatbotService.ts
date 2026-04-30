export const GREETING_RESPONSE = "Bonjour ! Je suis l'assistant de MGI BFC Consulting. Comment puis-je vous aider ?";

export const isGreeting = (message: string): boolean => {
  const msg = message.toLowerCase().trim();
  const greetings = ['bonjour', 'salut', 'hello', 'hi', 'coucou', 'hey', 'bjr', 'slt'];
  return greetings.some(g => msg === g || msg.startsWith(g + ' '));
};

export async function chatWithBotAI(message: string): Promise<string> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("Erreur API:", err);
      throw new Error("Erreur serveur");
    }

    const data = await response.json();
    return data.reply || "Désolé, je n'ai pas pu générer une réponse.";

  } catch (error) {
    console.error("Chat error:", error);
    return "Désolé, j'ai rencontré une difficulté technique. Veuillez réessayer plus tard.";
  }
}