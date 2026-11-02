import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, artistName, email, phone, service, budget, message } = body;

    // Validate required fields
    if (!name || !email || !phone || !service) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL || 'samrockmusicproduction@gmail.com';
    const whatsappNumber = process.env.MY_WHATSAPP_NUMBER || '2347048306524';

    // 1. WhatsApp Dispatch Logic (Green-API integration example)
    const greenApiIdInstance = process.env.GREEN_API_ID_INSTANCE;
    const greenApiToken = process.env.GREEN_API_TOKEN;

    const whatsappMessage = `🚨 *New Samrock Studio Inquiry* 🚨%0A%0A*Name:* ${name}%0A*Artist Name:* ${artistName || 'N/A'}%0A*Email:* ${email}%0A*Phone:* ${phone}%0A*Service:* ${service}%0A*Budget:* ${budget || 'N/A'}%0A*Message:* ${message || 'None'}`;

    if (greenApiIdInstance && greenApiToken) {
      await fetch(`https://api.green-api.com/waInstance${greenApiIdInstance}/sendMessage/${greenApiToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: `${whatsappNumber}@c.us`,
          message: whatsappMessage
        })
      });
    }

    // 2. Email Dispatch Logic (Resend integration example)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: 'Samrock Portfolio <onboarding@resend.dev>',
          to: [recipientEmail],
          subject: `New Inquiry: ${service} from ${name}`,
          html: `
            <h2>New Studio Inquiry</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Artist Name:</strong> ${artistName || 'N/A'}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone / WhatsApp:</strong> ${phone}</p>
            <p><strong>Service Needed:</strong> ${service}</p>
            <p><strong>Budget:</strong> ${budget || 'N/A'}</p>
            <p><strong>Message:</strong> ${message || 'N/A'}</p>
          `
        })
      });
    }

    return NextResponse.json({ success: true, message: 'Inquiry sent successfully to Gmail & WhatsApp!' });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}