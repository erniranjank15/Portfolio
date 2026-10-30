import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { detail: 'Please provide name, email, and message.' },
        { status: 400 }
      );
    }

    const brevoApiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.SENDER_EMAIL || 'kasoteniranjan23@gmail.com';
    const myNotificationEmail = process.env.RECIPIENT_EMAIL || 'kasoteniranjan23@gmail.com';

    if (!brevoApiKey || brevoApiKey.includes('your_actual_brevo_api_key_here')) {
      return NextResponse.json(
        { detail: 'Brevo API key is not configured on the server. Please check .env file.' },
        { status: 500 }
      );
    }

    const brevoEndpoint = 'https://api.brevo.com/v3/smtp/email';
    const headers = {
      'accept': 'application/json',
      'api-key': brevoApiKey,
      'content-type': 'application/json',
    };

    const formattedMessage = message.replace(/\n/g, '<br>');

    // 1. Notification email sent TO YOU (with visitor's name as sender)
    const adminEmailPayload = {
      sender: {
        name: name,
        email: senderEmail,
      },
      to: [
        {
          email: myNotificationEmail,
          name: 'Niranjan Kasote',
        },
      ],
      replyTo: {
        email: email,
        name: name,
      },
      subject: `Inquiry from ${name}: Portfolio Contact`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #4f46e5; color: #ffffff; padding: 20px; text-align: center;">
            <h2 style="margin: 0; font-size: 20px;">New Message from ${name}</h2>
          </div>
          <div style="padding: 24px;">
            <p style="margin: 0 0 10px 0;"><strong>Sender Name:</strong> ${name}</p>
            <p style="margin: 0 0 10px 0;"><strong>Sender Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="margin: 0 0 8px 0;"><strong>Message:</strong></p>
            <div style="background-color: #f9fafb; border-left: 4px solid #4f46e5; padding: 12px 16px; margin: 0; font-size: 14px; white-space: pre-wrap;">
              ${formattedMessage}
            </div>
          </div>
          <div style="background-color: #f3f4f6; padding: 12px; text-align: center; font-size: 12px; color: #6b7280;">
            Clicking 'Reply' will respond directly to ${name} (${email})
          </div>
        </div>
      `,
    };

    // 2. Automated acknowledgment copy sent TO THE VISITOR
    const userEmailPayload = {
      sender: {
        name: 'Niranjan Kasote',
        email: senderEmail,
      },
      to: [
        {
          email: email,
          name: name,
        },
      ],
      replyTo: {
        email: myNotificationEmail,
        name: 'Niranjan Kasote',
      },
      subject: `Thanks for reaching out, ${name}!`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #4f46e5; color: #ffffff; padding: 20px; text-align: center;">
            <h2 style="margin: 0; font-size: 20px;">Thank You for Reaching Out!</h2>
          </div>
          <div style="padding: 24px;">
            <p>Hi <strong>${name}</strong>,</p>
            <p>Thank you for getting in touch through my portfolio. I have received your message and will get back to you as soon as possible.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="margin: 0 0 8px 0; font-weight: bold; color: #555;">Your message:</p>
            <div style="background-color: #f9fafb; border-left: 4px solid #4f46e5; padding: 12px 16px; margin: 0; font-size: 14px; white-space: pre-wrap;">
              ${formattedMessage}
            </div>
            <br>
            <p>Best regards,<br><strong>Niranjan Kasote</strong></p>
          </div>
        </div>
      `,
    };

    // Send notification to admin
    const adminRes = await fetch(brevoEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(adminEmailPayload),
    });

    // Send acknowledgment to visitor (fire in background)
    fetch(brevoEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(userEmailPayload),
    }).catch(err => console.error('Error sending auto-reply:', err));

    if (adminRes.ok) {
      return NextResponse.json({
        status: 'success',
        message: 'Your message has been sent successfully!',
      });
    } else {
      const errData = await adminRes.json().catch(() => ({}));
      const errorDetail = errData.message || (await adminRes.text()) || 'Failed to send via Brevo';
      return NextResponse.json(
        { detail: `Brevo API error: ${errorDetail}` },
        { status: adminRes.status }
      );
    }
  } catch (error: any) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { detail: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}

