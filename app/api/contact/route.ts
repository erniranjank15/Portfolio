import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { detail: 'Please fill in all fields (name, email, message).' },
        { status: 400 }
      );
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const recipientEmail = process.env.RECIPIENT_EMAIL || emailUser || 'kasoteniranjan23@gmail.com';

    if (!emailUser || !emailPass || emailPass.includes('sqmipyjdhlhftjcg')) {
      return NextResponse.json(
        {
          detail: 'Email credentials are not configured. Please set EMAIL_USER and EMAIL_PASS in your .env file.',
        },
        { status: 500 }
      );
    }

    // Configure Nodemailer transporter (defaulting to Gmail or custom SMTP)
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const formattedMessage = message.replace(/\n/g, '<br>');

    // 1. Notification email sent TO YOU (from the visitor)
    const adminMailOptions = {
      from: `"${name}" <${emailUser}>`,
      to: recipientEmail,
      replyTo: email,
      subject: `Inquiry from ${name}: Portfolio Contact`,
      html: `
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
            Clicking 'Reply' in your mail client will reply directly to ${name} (${email})
          </div>
        </div>
      `,
    };

    // 2. Automated acknowledgment copy sent TO THE VISITOR
    const userMailOptions = {
      from: `"Niranjan Kasote" <${emailUser}>`,
      to: email,
      replyTo: recipientEmail,
      subject: `Thanks for reaching out, ${name}!`,
      html: `
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

    // Send email to you
    await transporter.sendMail(adminMailOptions);

    // Send confirmation to the visitor (asynchronously)
    transporter.sendMail(userMailOptions).catch((err) => {
      console.error('Error sending confirmation email to visitor:', err);
    });

    return NextResponse.json({
      status: 'success',
      message: 'Your message has been sent successfully!',
    });
  } catch (error: any) {
    console.error('Nodemailer Error:', error);
    return NextResponse.json(
      { detail: `Failed to send email: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
