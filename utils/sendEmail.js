import { emailTemplates } from "./emailTemplates";
import nodemailer from "nodemailer";

const fromEmail = process.env.GMAIL_USER || "healthcare@gmail.com";

/**
 * Send appointment email notification
 * @param {Object} config - Email configuration
 * @param {string} config.status - 'received' | 'approved' | 'rejected'
 * @param {string} config.name - Patient's full name
 * @param {string} config.email - Patient's email
 * @param {string} config.doctorName - Doctor's full name
 * @param {string} config.doctorSpecialization - Doctor's specialization (optional)
 * @param {string} config.date - Appointment date
 * @param {string} config.time - Appointment time
 * @param {string} config.reason - Reason for appointment (optional)
 * @param {string} config.rejectionReason - Reason for rejection (optional)
 */
export async function sendEmail(config) {
  try {
    const {
      status = "received",
      name,
      email,
      doctorName,
      doctorSpecialization,
      date,
      time,
      reason,
      rejectionReason,
    } = config;

    // Generate email content
    const htmlContent = emailTemplates({
      status,
      name,
      doctorName,
      doctorSpecialization,
      date,
      time,
      reason,
      rejectionReason,
    });

    // Determine subject based on status
    const subjects = {
      received: "Appointment Request Received",
      approved: "Appointment Confirmed ✓",
      rejected: "Appointment Request Update",
    };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `HealthCare <${fromEmail}>`,
      to: email,
      subject: subjects[status] || subjects.received,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${email} with status: ${status}`);
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Could not send email");
  }
}
