import { magicLinkEmail } from './templates.js';

const RESEND_API_URL = 'https://api.resend.com/emails';

export type MagicLinkEmailPayload = {
  to: string;
  loginUrl: string;
  code: string;
  expiresMinutes?: number;
};

export type SendMagicLinkResult = { id: string } | { skipped: true };

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

export async function sendMagicLinkEmail({
  to,
  loginUrl,
  code,
  expiresMinutes = 15,
}: MagicLinkEmailPayload): Promise<SendMagicLinkResult> {
  if (!isResendConfigured()) {
    return { skipped: true };
  }

  const { html, text } = magicLinkEmail({ loginUrl, code, expiresMinutes });

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL,
      to: [to],
      subject: `Your sign-in link for Hercules`,
      html,
      text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend error: ${body}`);
  }

  const payload = (await response.json()) as { id: string };
  return payload;
}
