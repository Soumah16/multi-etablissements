export function buildMailtoUrl(to: string, subject: string, body: string): string {
  const cleanTo = to.trim();
  const params = new URLSearchParams();
  if (subject.trim()) params.set('subject', subject.trim());
  if (body.trim()) params.set('body', body.trim());
  const query = params.toString().replace(/\+/g, '%20');
  return `mailto:${encodeURIComponent(cleanTo)}${query ? `?${query}` : ''}`;
}

export function buildGmailComposeUrl(to: string, subject: string, body: string): string {
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1'
  });
  if (to.trim()) params.set('to', to.trim());
  if (subject.trim()) params.set('su', subject.trim());
  if (body.trim()) params.set('body', body.trim());
  return `https://mail.google.com/mail/?${params.toString()}`;
}

export interface ServerEmailDispatchResult {
  ok: boolean;
  deliveryStatus: 'sent' | 'gateway_not_configured' | 'failed' | 'offline';
  message: string;
}

export async function dispatchEmailViaServer(params: {
  to: string;
  subject: string;
  body: string;
}): Promise<ServerEmailDispatchResult> {
  try {
    const resp = await fetch('/api/notifications/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel: 'email',
        to: params.to.trim(),
        subject: params.subject.trim(),
        body: params.body
      })
    });
    if (!resp.ok) {
      return {
        ok: false,
        deliveryStatus: 'failed',
        message: "Le serveur a refusé la requête d'envoi email."
      };
    }
    const data = (await resp.json()) as { ok?: boolean; deliveryStatus?: string };
    if (data.deliveryStatus === 'sent') {
      return {
        ok: true,
        deliveryStatus: 'sent',
        message: `Email envoyé automatiquement à ${params.to.trim()} !`
      };
    }
    if (data.deliveryStatus === 'gateway_not_configured') {
      return {
        ok: false,
        deliveryStatus: 'gateway_not_configured',
        message:
          'Passerelle email serveur non configurée. Utilisez « Ouvrir dans Gmail » ou « Application Mail » ci-dessous pour envoyer gratuitement tout de suite.'
      };
    }
    return {
      ok: false,
      deliveryStatus: 'failed',
      message: "Échec d'envoi via la passerelle serveur. Utilisez Gmail ou l'application Mail ci-dessous."
    };
  } catch {
    return {
      ok: false,
      deliveryStatus: 'offline',
      message: 'Serveur inaccessible. Utilisez « Ouvrir dans Gmail » ou « Application Mail » ci-dessous.'
    };
  }
}
