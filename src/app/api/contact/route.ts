import { NextResponse } from 'next/server';

const MAX_MESSAGE_LENGTH = 2000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;

type ChannelName = 'whatsapp' | 'email';
type ChannelStatus = 'sent' | 'skipped' | 'failed';
type Channel = 'both' | ChannelName;

/**
 * Best-effort in-memory limiter. Serverless instances each hold their own map,
 * which is enough to blunt casual form spam.
 */
const requestLog = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string) {
  const now = Date.now();
  const entry = requestLog.get(key);

  if (!entry || entry.resetAt < now) {
    requestLog.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function clean(value: unknown, maxLength = 200) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function singleLine(value: string) {
  return value.replace(/[\r\n]+/g, ' ');
}

export async function POST(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const clientKey = forwardedFor?.split(',')[0]?.trim() || 'unknown';

  if (isRateLimited(clientKey)) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again in a minute.' },
      { status: 429 }
    );
  }

  let payload: Record<string, unknown>;
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Invalid body');
    payload = body as Record<string, unknown>;
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const name = clean(payload.name, 120);
  const artistName = clean(payload.artistName, 120);
  const email = clean(payload.email, 160);
  const phone = clean(payload.phone, 40);
  const service = clean(payload.service, 120);
  const budget = clean(payload.budget, 60);
  const message = clean(payload.message, MAX_MESSAGE_LENGTH);
  const rawChannel = clean(payload.channel, 20);
  const channel: Channel =
    rawChannel === 'email' || rawChannel === 'whatsapp' ? rawChannel : 'both';

  if (!name || !email || !phone || !service) {
    return NextResponse.json({ success: false, error: 'Missing required fields.' }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ success: false, error: 'Enter a valid email address.' }, { status: 400 });
  }

  const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL || 'samrockmusicproduction@gmail.com';
  const whatsappNumber = process.env.MY_WHATSAPP_NUMBER || '2347048306524';
  const greenApiIdInstance = process.env.GREEN_API_ID_INSTANCE;
  const greenApiToken = process.env.GREEN_API_TOKEN;
  const resendApiKey = process.env.RESEND_API_KEY;

  const channels: Record<ChannelName, ChannelStatus> = { whatsapp: 'skipped', email: 'skipped' };

  // 1. WhatsApp dispatch (Green-API).
  if (channel !== 'email' && greenApiIdInstance && greenApiToken) {
    const lines = [
      '*New Samrock Studio Inquiry*',
      '',
      `*Name:* ${name}`,
      `*Artist Name:* ${artistName || 'N/A'}`,
      `*Email:* ${email}`,
      `*Phone:* ${phone}`,
      `*Service:* ${service}`,
      `*Budget:* ${budget || 'N/A'}`,
      `*Message:* ${message || 'None'}`,
    ];

    try {
      const response = await fetch(
        `https://api.green-api.com/waInstance${greenApiIdInstance}/sendMessage/${greenApiToken}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chatId: `${whatsappNumber}@c.us`, message: lines.join('\n') }),
        }
      );
      channels.whatsapp = response.ok ? 'sent' : 'failed';
      if (!response.ok) console.error('Green-API responded with', response.status);
    } catch (error) {
      console.error('Green-API dispatch failed:', error);
      channels.whatsapp = 'failed';
    }
  }

  // 2. Email dispatch (Resend).
  if (channel !== 'whatsapp' && resendApiKey) {
    const rows: Array<[string, string]> = [
      ['Name', name],
      ['Artist Name', artistName || 'N/A'],
      ['Email', email],
      ['Phone / WhatsApp', phone],
      ['Service Needed', service],
      ['Budget', budget || 'N/A'],
      ['Message', message || 'N/A'],
    ];

    const html = `<h2>New Studio Inquiry</h2><ul>${rows
      .map(([label, value]) => `<li><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</li>`)
      .join('')}</ul>`;

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: 'Samrock Portfolio <onboarding@resend.dev>',
          to: [recipientEmail],
          subject: singleLine(`New inquiry: ${service} from ${name}`),
          html,
        }),
      });
      channels.email = response.ok ? 'sent' : 'failed';
      if (!response.ok) console.error('Resend responded with', response.status);
    } catch (error) {
      console.error('Resend dispatch failed:', error);
      channels.email = 'failed';
    }
  }

  const attempted = Object.values(channels).filter((status) => status !== 'skipped');

  if (attempted.length === 0 || attempted.every((status) => status === 'failed')) {
    return NextResponse.json(
      {
        success: false,
        error: 'We could not deliver your message right now. Please try again or reach us on WhatsApp.',
        channels,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true, channels });
}
