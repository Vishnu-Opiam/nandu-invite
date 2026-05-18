export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!n8nWebhookUrl) {
    console.error('N8N_WEBHOOK_URL is not set in environment variables.');
    return res.status(500).json({ message: 'Webhook URL not configured' });
  }

  try {
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      throw new Error(`Failed to send to n8n: ${response.statusText}`);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error forwarding to n8n:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
