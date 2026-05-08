
export interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
  buttons?: string[];
}

export interface ChatApiResponse {
  reply: string;
  buttons: string[];
  lang: 'fr' | 'en';
}


export async function sendMessage(message: string): Promise<ChatApiResponse> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) throw new Error(`Erreur réseau : ${res.status}`);
  return res.json();
}