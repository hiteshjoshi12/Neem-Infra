import nodemailer from 'nodemailer';

/**
 * SAUDAGAR PROPERTIES — LEAD EMAIL NOTIFICATION SERVICE
 * ============================================================================
 * Dispatches real-time, luxury-formatted email alerts to the business inbox
 * for every incoming inquiry, private viewing booking, corridor lead, or newsletter.
 */

// Default business notification inbox if none specified in env
const DEFAULT_NOTIFICATION_EMAIL = 'saudagar.properties@yahoo.in';

/**
 * Creates and caches the Nodemailer transporter instance
 */
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
  const service = process.env.SMTP_SERVICE; // e.g. 'gmail', 'yahoo'

  if (!user || !pass) {
    return null;
  }

  if (service) {
    return nodemailer.createTransport({
      service,
      auth: { user, pass },
    });
  }

  if (host) {
    return nodemailer.createTransport({
      host,
      port,
      secure: process.env.SMTP_SECURE === 'true' || port === 465,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      },
    });
  }

  return null;
}

/**
 * Format a human-readable title for the inquiry type
 */
function getInquiryTypeLabel(type) {
  switch (type) {
    case 'property_inquiry':
    case 'viewing_request':
      return 'Private Viewing & Inspection Request';
    case 'corridor_inquiry':
      return 'Prime Corridor Micro-Market Lead';
    case 'consultation':
      return 'Private Portfolio Consultation';
    case 'newsletter':
      return 'Private Journal / Newsletter Subscriber';
    case 'general_contact':
    case 'contact_form':
    default:
      return 'Direct Website Inquiry';
  }
}

/**
 * Generate a high-converting, mobile-responsive luxury HTML email template
 */
function buildEmailHtml(inquiry) {
  const typeLabel = getInquiryTypeLabel(inquiry.type);
  const cleanPhone = (inquiry.phone || '').replace(/\D/g, '');
  const waUrl = cleanPhone ? `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`}?text=${encodeURIComponent(`Hello ${inquiry.name || 'there'}, thank you for contacting Saudagar Properties regarding your luxury real estate inquiry.`)}` : null;
  const telUrl = inquiry.phone ? `tel:${inquiry.phone}` : null;
  const mailtoUrl = inquiry.email ? `mailto:${inquiry.email}` : null;
  const dateFormatted = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Lead Notification</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F4F1EA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #17213D;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F4F1EA; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #E5E0D5;" cellspacing="0" cellpadding="0">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #0E162B; padding: 32px 28px; text-align: center; border-bottom: 3px solid #D09A16;">
              <span style="display: inline-block; padding: 4px 14px; border-radius: 20px; background-color: rgba(208,154,22,0.15); border: 1px solid rgba(208,154,22,0.4); color: #D09A16; font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 12px;">
                NEW INQUIRY CAPTURED
              </span>
              <h1 style="color: #FFFFFF; font-size: 24px; font-weight: 700; margin: 0 0 6px 0; letter-spacing: -0.02em;">
                Saudagar Properties
              </h1>
              <p style="color: #9DA6B8; font-size: 13px; margin: 0;">
                Gurugram Prime Residential & Commercial Advisory
              </p>
            </td>
          </tr>

          <!-- Inquiry Category Banner -->
          <tr>
            <td style="background-color: #F8F6F0; padding: 14px 28px; border-bottom: 1px solid #EBE7DF;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="font-size: 12px; color: #566078; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">
                    Inquiry Classification:
                  </td>
                  <td align="right" style="font-size: 13px; font-weight: 700; color: #D09A16;">
                    ${typeLabel}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Client Details Section -->
          <tr>
            <td style="padding: 28px;">
              <h2 style="font-size: 16px; font-weight: 700; color: #0E162B; margin: 0 0 16px 0; border-bottom: 2px solid #F4F1EA; padding-bottom: 8px;">
                Prospective Client Information
              </h2>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="8" style="font-size: 14px; line-height: 1.5;">
                ${inquiry.name ? `
                <tr>
                  <td width="35%" style="color: #64748B; font-weight: 600; padding: 8px 0; border-bottom: 1px solid #F1ECE1;">Full Name:</td>
                  <td style="color: #0E162B; font-weight: 700; padding: 8px 0; border-bottom: 1px solid #F1ECE1;">${inquiry.name}</td>
                </tr>
                ` : ''}

                ${inquiry.phone ? `
                <tr>
                  <td style="color: #64748B; font-weight: 600; padding: 8px 0; border-bottom: 1px solid #F1ECE1;">Contact Number:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #F1ECE1;">
                    <a href="${telUrl}" style="color: #0E162B; font-weight: 700; text-decoration: none; border-bottom: 1px dashed #D09A16;">
                      ${inquiry.phone}
                    </a>
                  </td>
                </tr>
                ` : ''}

                ${inquiry.email ? `
                <tr>
                  <td style="color: #64748B; font-weight: 600; padding: 8px 0; border-bottom: 1px solid #F1ECE1;">Email Address:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #F1ECE1;">
                    <a href="${mailtoUrl}" style="color: #17213D; font-weight: 600; text-decoration: underline;">
                      ${inquiry.email}
                    </a>
                  </td>
                </tr>
                ` : ''}

                ${inquiry.propertyTitle ? `
                <tr>
                  <td style="color: #64748B; font-weight: 600; padding: 8px 0; border-bottom: 1px solid #F1ECE1;">Property Title:</td>
                  <td style="color: #D09A16; font-weight: 700; padding: 8px 0; border-bottom: 1px solid #F1ECE1;">${inquiry.propertyTitle}</td>
                </tr>
                ` : ''}

                ${inquiry.preferredDate ? `
                <tr>
                  <td style="color: #64748B; font-weight: 600; padding: 8px 0; border-bottom: 1px solid #F1ECE1;">Preferred Date:</td>
                  <td style="color: #0E162B; font-weight: 600; padding: 8px 0; border-bottom: 1px solid #F1ECE1;">${inquiry.preferredDate}</td>
                </tr>
                ` : ''}

                ${inquiry.source ? `
                <tr>
                  <td style="color: #64748B; font-weight: 600; padding: 8px 0; border-bottom: 1px solid #F1ECE1;">Lead Origin:</td>
                  <td style="color: #566078; padding: 8px 0; border-bottom: 1px solid #F1ECE1;">${inquiry.source}</td>
                </tr>
                ` : ''}
              </table>

              <!-- Client Notes / Message -->
              ${inquiry.message ? `
              <div style="margin-top: 24px; padding: 16px; background-color: #F8F6F0; border-radius: 12px; border-left: 4px solid #D09A16;">
                <div style="font-size: 11px; font-weight: 700; color: #8A95A7; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;">
                  Inquiry Details / Message:
                </div>
                <div style="font-size: 13px; color: #17213D; line-height: 1.6; white-space: pre-wrap;">${inquiry.message}</div>
              </div>
              ` : ''}

              <!-- Direct Action Buttons -->
              <div style="margin-top: 28px; text-align: center;">
                <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                  <tr>
                    ${waUrl ? `
                    <td style="padding: 0 6px;">
                      <a href="${waUrl}" style="display: inline-block; padding: 12px 22px; background-color: #25D366; color: #FFFFFF; font-size: 13px; font-weight: 700; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 12px rgba(37,211,102,0.3);">
                        💬 Chat on WhatsApp
                      </a>
                    </td>
                    ` : ''}

                    ${telUrl ? `
                    <td style="padding: 0 6px;">
                      <a href="${telUrl}" style="display: inline-block; padding: 12px 22px; background-color: #0E162B; color: #FFFFFF; font-size: 13px; font-weight: 700; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 12px rgba(14,22,43,0.25);">
                        📞 Call Client
                      </a>
                    </td>
                    ` : ''}
                  </tr>
                </table>
              </div>

            </td>
          </tr>

          <!-- Footer Information -->
          <tr>
            <td style="background-color: #F8F6F0; padding: 20px 28px; border-top: 1px solid #EBE7DF; text-align: center; font-size: 12px; color: #8A95A7;">
              <p style="margin: 0 0 4px 0;">
                Submitted on: <strong>${dateFormatted}</strong>
              </p>
              <p style="margin: 0; font-size: 11px;">
                Saudagar Properties Pvt. Ltd. • DLF Phase 2, Gurugram, Haryana 122002
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Generate plain text version for email clients that don't support HTML
 */
function buildEmailText(inquiry) {
  const typeLabel = getInquiryTypeLabel(inquiry.type);
  return `
SAUDAGAR PROPERTIES — NEW LEAD NOTIFICATION
=============================================================

Inquiry Type:    ${typeLabel}
Client Name:     ${inquiry.name || 'Not provided'}
Phone Number:    ${inquiry.phone || 'Not provided'}
Email Address:   ${inquiry.email || 'Not provided'}
Property:        ${inquiry.propertyTitle || 'N/A'}
Preferred Date:  ${inquiry.preferredDate || 'N/A'}
Lead Source:     ${inquiry.source || 'Website'}

Message / Requirements:
${inquiry.message || 'No additional message'}

=============================================================
Timestamp: ${new Date().toISOString()}
`.trim();
}

/**
 * Main dispatch function called by the inquiries API route
 */
export async function sendInquiryNotification(inquiry) {
  const recipient = process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER || DEFAULT_NOTIFICATION_EMAIL;
  const fromAddress = process.env.SMTP_FROM || `"Saudagar Properties Lead Desk" <${process.env.SMTP_USER || 'noreply@saudagarproperties.com'}>`;
  const typeLabel = getInquiryTypeLabel(inquiry.type);
  const clientIdentifier = inquiry.name || inquiry.phone || inquiry.email || 'New Client';
  const subject = `🔔 [New Lead: ${typeLabel}] ${clientIdentifier} ${inquiry.propertyTitle ? `• ${inquiry.propertyTitle}` : ''}`.trim();

  const transporter = getTransporter();

  // If SMTP is not yet configured, log to server output so no lead is missed
  if (!transporter) {
    console.log('\n=============================================================');
    console.log('📧 [EMAIL NOTIFICATION NOTICE - SMTP NOT CONFIGURED]');
    console.log(`To receive live emails at "${recipient}", configure SMTP_HOST / SMTP_USER / SMTP_PASS in .env.local`);
    console.log('Inquiry details captured:');
    console.log(buildEmailText(inquiry));
    console.log('=============================================================\n');

    return {
      success: true,
      delivered: false,
      reason: 'SMTP_NOT_CONFIGURED',
      recipient,
      inquiryId: inquiry._id,
    };
  }

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to: recipient,
      subject,
      text: buildEmailText(inquiry),
      html: buildEmailHtml(inquiry),
      replyTo: inquiry.email && inquiry.email.includes('@') && !inquiry.email.endsWith('@lead.saudagarproperties.com') 
        ? inquiry.email 
        : undefined,
    });

    console.log(`[Email Service] Notification sent successfully to ${recipient} (Message ID: ${info.messageId})`);

    return {
      success: true,
      delivered: true,
      messageId: info.messageId,
      recipient,
    };
  } catch (error) {
    console.error('[Email Service Error] Failed to dispatch inquiry notification:', error);
    // Never throw — the lead is already safe in MongoDB
    return {
      success: false,
      delivered: false,
      error: error.message,
      recipient,
    };
  }
}
