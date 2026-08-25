const APP_NAME = 'Hercules';

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function emailLayout(title: string, preheader: string, bodyHtml: string): string {
  const safeTitle = escapeHtml(title);
  const safePreheader = escapeHtml(preheader);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle}</title>
</head>
<body style="margin:0;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#f5f5f5;color:#222;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${safePreheader}</div>
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px 28px;">
    ${bodyHtml}
  </div>
</body>
</html>`;
}

export function magicLinkEmail({
  loginUrl,
  code,
  expiresMinutes,
}: {
  loginUrl: string;
  code: string;
  expiresMinutes: number;
}) {
  const safeCode = escapeHtml(code);
  const safeUrl = escapeHtml(loginUrl);

  const html = emailLayout(
    'Sign in to your account',
    `Your sign-in code is ${code}. Expires in ${expiresMinutes} minutes.`,
    `
      <h1 style="margin:0 0 12px;font-size:22px;font-weight:600;">Sign in to ${escapeHtml(APP_NAME)}</h1>
      <p style="margin:0;font-size:15px;line-height:1.6;color:#444;">
        Click the link below to sign in. This link expires in <strong>${expiresMinutes} minutes</strong>.
      </p>
      <p style="margin:24px 0 0;">
        <a href="${safeUrl}" style="display:inline-block;padding:12px 20px;background:#222;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">Sign in</a>
      </p>
      <p style="margin:28px 0 0;font-size:14px;line-height:1.6;color:#666;text-align:center;">
        Or enter this code on the sign-in page:
      </p>
      <p style="margin:12px 0 0;text-align:center;">
        <span style="display:inline-block;padding:12px 20px;border-radius:8px;background:#f5f5f5;font-size:28px;font-weight:700;letter-spacing:0.2em;">${safeCode}</span>
      </p>
      <p style="margin:24px 0 0;font-size:12px;line-height:1.5;color:#888;word-break:break-all;">
        Button not working? Copy this link:<br>
        <a href="${safeUrl}" style="color:#444;">${safeUrl}</a>
      </p>
    `,
  );

  const text = `Sign in to ${APP_NAME}

Click to sign in: ${loginUrl}

Or enter this code on the sign-in page: ${code}

This expires in ${expiresMinutes} minutes.`;

  return { html, text };
}
