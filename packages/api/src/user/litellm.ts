import type { Request, Response } from 'express';

export async function getUserSpend(req: Request, res: Response) {
  const baseUrl = process.env.LITELLM_BASE_URL;
  const key = process.env.LITELLM_API_KEY;
  const userId = req.user?.id;

  if (!baseUrl || !key) {
    return res.status(503).json({ message: 'LiteLLM not configured' });
  }

  const url = `${baseUrl}/customer/info?end_user_id=${encodeURIComponent(userId)}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${key}` },
  });

  if (!response.ok) {
    return res.status(response.status).json({ message: 'LiteLLM request failed' });
  }

  const data = await response.json();
  return res.json({ spend: data.spend ?? 0 });
}