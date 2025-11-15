// emailTemplates.js

/**
 * Generate HTML email template for appointment notifications
 * @param {Object} config - Email configuration
 * @param {string} config.status - 'received' | 'approved' | 'rejected'
 * @param {string} config.name - Patient's full name
 * @param {string} config.doctorName - Doctor's full name
 * @param {string} config.doctorSpecialization - Doctor's specialization (optional)
 * @param {string} config.date - Appointment date (e.g., '2024-12-01')
 * @param {string} config.time - Appointment time (e.g., '10:00 AM')
 * @param {string} config.reason - Reason for appointment (optional)
 * @param {string} config.rejectionReason - Reason for rejection (optional, only for rejected status)
 * @returns {string} - HTML email content
 */
export function emailTemplates(config) {
  const {
    status = "received",
    name,
    doctorName,
    doctorSpecialization,
    date,
    time,
    reason,
    rejectionReason,
  } = config;

  // Get status-specific content
  const content = getStatusContent(status, rejectionReason);

  // Format the date for better readability
  const formattedDate = formatDate(date);

  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${content.subject}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 40px 20px;">
          <tr>
            <td align="center">
              <!-- Main Container -->
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, ${
                    content.headerColor
                  } 0%, ${
    content.headerColorDark
  } 100%); padding: 40px 30px; text-align: center;">
                    <div style="background-color: rgba(255, 255, 255, 0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                      ${content.icon}
                    </div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                      ${content.title}
                    </h1>
                  </td>
                </tr>
  
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <!-- Greeting -->
                    <p style="margin: 0 0 20px; font-size: 16px; color: #333333; line-height: 1.6;">
                      Dear <strong>${name}</strong>,
                    </p>
  
                    <!-- Main Message -->
                    <p style="margin: 0 0 30px; font-size: 16px; color: #555555; line-height: 1.6;">
                      ${content.message}
                    </p>
  
                    <!-- Appointment Details Card -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid ${
                      content.accentColor
                    }; margin-bottom: 30px;">
                      <tr>
                        <td style="padding: 25px;">
                          <h3 style="margin: 0 0 20px; font-size: 18px; color: #333333; font-weight: 600;">
                            📋 Appointment Details
                          </h3>
                          
                          <table width="100%" cellpadding="8" cellspacing="0">
                            <tr>
                              <td style="font-size: 14px; color: #666666; padding: 8px 0; width: 140px;">
                                <strong>Doctor:</strong>
                              </td>
                              <td style="font-size: 14px; color: #333333; padding: 8px 0;">
                                Dr. ${doctorName}${
    doctorSpecialization ? ` (${doctorSpecialization})` : ""
  }
                              </td>
                            </tr>
                            <tr>
                              <td style="font-size: 14px; color: #666666; padding: 8px 0;">
                                <strong>Date:</strong>
                              </td>
                              <td style="font-size: 14px; color: #333333; padding: 8px 0;">
                                ${formattedDate}
                              </td>
                            </tr>
                            <tr>
                              <td style="font-size: 14px; color: #666666; padding: 8px 0;">
                                <strong>Time:</strong>
                              </td>
                              <td style="font-size: 14px; color: #333333; padding: 8px 0;">
                                ${time}
                              </td>
                            </tr>
                            ${
                              reason
                                ? `
                            <tr>
                              <td style="font-size: 14px; color: #666666; padding: 8px 0; vertical-align: top;">
                                <strong>Reason:</strong>
                              </td>
                              <td style="font-size: 14px; color: #333333; padding: 8px 0;">
                                ${reason}
                              </td>
                            </tr>
                            `
                                : ""
                            }
                            <tr>
                              <td style="font-size: 14px; color: #666666; padding: 8px 0;">
                                <strong>Status:</strong>
                              </td>
                              <td style="font-size: 14px; padding: 8px 0;">
                                <span style="background-color: ${
                                  content.statusBgColor
                                }; color: ${
    content.statusTextColor
  }; padding: 4px 12px; border-radius: 12px; font-weight: 600; font-size: 13px; text-transform: capitalize;">
                                  ${content.statusLabel}
                                </span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
  
                    ${
                      rejectionReason && status === "rejected"
                        ? `
                    <!-- Rejection Reason -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 30px;">
                      <tr>
                        <td style="padding: 20px;">
                          <p style="margin: 0; font-size: 14px; color: #856404;">
                            <strong>Reason for rejection:</strong><br>
                            ${rejectionReason}
                          </p>
                        </td>
                      </tr>
                    </table>
                    `
                        : ""
                    }
  
                    <!-- Additional Info -->
                    <div style="background-color: #e8f4fd; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                      ${content.additionalInfo}
                    </div>
  
                    <!-- Closing -->
                    <p style="margin: 0 0 10px; font-size: 16px; color: #333333; line-height: 1.6;">
                      ${content.closing}
                    </p>
                    
                    <p style="margin: 0; font-size: 16px; color: #555555; line-height: 1.6;">
                      Best regards,<br>
                      <strong>HealthCare Team</strong>
                    </p>
                  </td>
                </tr>
  
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                    <p style="margin: 0 0 10px; font-size: 14px; color: #6c757d;">
                      Need help? Contact us at <a href="mailto:support@healthcare.com" style="color: ${
                        content.accentColor
                      }; text-decoration: none;">support@healthcare.com</a>
                    </p>
                    <p style="margin: 0; font-size: 12px; color: #adb5bd;">
                      © ${new Date().getFullYear()} HealthCare. All rights reserved.
                    </p>
                  </td>
                </tr>
  
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
}

/**
 * Generate review request email
 */
export function reviewRequestEmail(config) {
  const { name, doctorName, doctorSpecialization, date, time, reviewLink } =
    config;

  const formattedDate = formatDate(date);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Share Your Experience</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                  <div style="background-color: rgba(255, 255, 255, 0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white"/>
                    </svg>
                  </div>
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                    How Was Your Visit?
                  </h1>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px; font-size: 16px; color: #333333; line-height: 1.6;">
                    Dear <strong>${name}</strong>,
                  </p>

                  <p style="margin: 0 0 30px; font-size: 16px; color: #555555; line-height: 1.6;">
                    Thank you for choosing HealthCare for your appointment with <strong>Dr. ${doctorName}</strong>. We hope your visit went well!
                  </p>

                  <!-- Appointment Details -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin-bottom: 30px;">
                    <tr>
                      <td style="padding: 20px;">
                        <p style="margin: 0 0 10px; font-size: 14px; color: #666;">
                          <strong>Appointment Completed:</strong>
                        </p>
                        <p style="margin: 0; font-size: 16px; color: #333;">
                          ${formattedDate} at ${time}<br>
                          Dr. ${doctorName} - ${doctorSpecialization}
                        </p>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 30px; font-size: 16px; color: #555555; line-height: 1.6;">
                    Your feedback helps other patients make informed decisions and helps us improve our services. It only takes a minute!
                  </p>

                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding: 20px 0;">
                        <a href="${reviewLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.4);">
                          ⭐ Write a Review
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 30px 0 0; font-size: 14px; color: #999; text-align: center; line-height: 1.6;">
                    This link is valid for 30 days and can only be used once.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                  <p style="margin: 0 0 10px; font-size: 14px; color: #6c757d;">
                    Questions? Contact us at <a href="mailto:support@healthcare.com" style="color: #667eea; text-decoration: none;">support@healthcare.com</a>
                  </p>
                  <p style="margin: 0; font-size: 12px; color: #adb5bd;">
                    © ${new Date().getFullYear()} HealthCare. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Get status-specific content for the email
 */
function getStatusContent(status, rejectionReason) {
  const contentMap = {
    received: {
      subject: "Appointment Request Received",
      title: "Request Received",
      headerColor: "#4A90E2",
      headerColorDark: "#357ABD",
      accentColor: "#4A90E2",
      statusBgColor: "#fff3cd",
      statusTextColor: "#856404",
      statusLabel: "Pending Review",
      icon: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 11L12 14L22 4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
      message:
        "We have successfully received your appointment request. Our admin team will review it shortly and get back to you with a confirmation.",
      additionalInfo: `
          <p style="margin: 0 0 10px; font-size: 14px; color: #0c5460; line-height: 1.6;">
            <strong>ℹ️ What happens next?</strong>
          </p>
          <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #0c5460; line-height: 1.8;">
            <li>Admin will review your appointment request</li>
            <li>You'll receive an email notification once it's approved or if any changes are needed</li>
            <li>Please keep this email for your records</li>
          </ul>
        `,
      closing: "Thank you for choosing HealthCare!",
    },
    approved: {
      subject: "Appointment Confirmed ✓",
      title: "Appointment Confirmed",
      headerColor: "#28a745",
      headerColorDark: "#218838",
      accentColor: "#28a745",
      statusBgColor: "#d4edda",
      statusTextColor: "#155724",
      statusLabel: "Confirmed",
      icon: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M22 4L12 14.01L9 11.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
      message:
        "Great news! Your appointment has been confirmed by our admin team. We look forward to seeing you at your scheduled time.",
      additionalInfo: `
          <p style="margin: 0 0 10px; font-size: 14px; color: #0c5460; line-height: 1.6;">
            <strong>📝 Important Reminders:</strong>
          </p>
          <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #0c5460; line-height: 1.8;">
            <li>Please arrive 10 minutes before your scheduled time</li>
            <li>Bring any relevant medical records or test results</li>
            <li>If you need to reschedule or cancel, please notify us at least 24 hours in advance</li>
          </ul>
        `,
      closing: "We look forward to providing you with excellent care!",
    },
    rejected: {
      subject: "Appointment Request Update",
      title: "Request Update",
      headerColor: "#dc3545",
      headerColorDark: "#c82333",
      accentColor: "#dc3545",
      statusBgColor: "#f8d7da",
      statusTextColor: "#721c24",
      statusLabel: "Not Approved",
      icon: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2"/>
          <path d="M12 8V12" stroke="white" stroke-width="2" stroke-linecap="round"/>
          <circle cx="12" cy="16" r="1" fill="white"/>
        </svg>`,
      message:
        "We regret to inform you that your appointment request could not be approved at this time.",
      additionalInfo: `
          <p style="margin: 0 0 10px; font-size: 14px; color: #0c5460; line-height: 1.6;">
            <strong>🔄 Next Steps:</strong>
          </p>
          <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #0c5460; line-height: 1.8;">
            <li>You can submit a new appointment request with different date/time</li>
            <li>Contact our support team if you have any questions</li>
            <li>Check available time slots on our booking portal</li>
          </ul>
        `,
      closing: "We apologize for any inconvenience and hope to serve you soon.",
    },
  };

  return contentMap[status] || contentMap.received;
}

/**
 * Format date to a more readable format
 */
function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  } catch (error) {
    return dateString; // Return original if parsing fails
  }
}
