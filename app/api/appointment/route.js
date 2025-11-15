// app/api/appointment/route.js

import { db } from "@/lib/db";
import {
  handleErrorResponse,
  handleSuccessResponse,
} from "@/utils/apiResponse";
import { sendEmail } from "@/utils/sendEmail";
import { generateReviewToken } from "@/utils/tokenGenerator";
import { reviewRequestEmail } from "@/utils/emailTemplates";
import nodemailer from "nodemailer";

// POST - Create new appointment
export async function POST(req) {
  try {
    const {
      doctor_id,
      patient_name,
      patient_email,
      patient_phone,
      appointment_date,
      appointment_time,
      reason,
    } = await req.json();

    // Validate required fields
    if (
      !doctor_id ||
      !patient_name ||
      !patient_email ||
      !patient_phone ||
      !appointment_date ||
      !appointment_time
    ) {
      return handleErrorResponse("All required fields must be provided", 400);
    }

    // Check if doctor exists
    const doctor = await db(
      "SELECT id, name, specialization FROM doctors WHERE id = ?",
      [doctor_id]
    );

    if (doctor.length === 0) {
      return handleErrorResponse("Doctor not found", 404);
    }

    // Check if the slot exists and is available
    const slot = await db(
      `SELECT id, is_booked FROM doctor_availability 
         WHERE doctor_id = ? AND available_date = ? AND slot_time = ?`,
      [doctor_id, appointment_date, appointment_time]
    );

    if (slot.length === 0) {
      return handleErrorResponse("Appointment slot not found", 404);
    }

    if (slot[0].is_booked) {
      return handleErrorResponse(
        "This appointment slot is already booked",
        400
      );
    }

    // Check if slot is not in the past (with 1 hour buffer)
    const slotDateTime = new Date(`${appointment_date}T${appointment_time}`);
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    if (slotDateTime < oneHourFromNow) {
      return handleErrorResponse(
        "Cannot book appointments less than 1 hour in advance",
        400
      );
    }

    // Check for duplicate bookings (same patient, same doctor, same day)
    const existingAppointment = await db(
      `SELECT id FROM appointments 
         WHERE patient_email = ? AND doctor_id = ? AND appointment_date = ? AND status != 'rejected'`,
      [patient_email, doctor_id, appointment_date]
    );

    if (existingAppointment.length > 0) {
      return handleErrorResponse(
        "You already have an appointment with this doctor on this date",
        400
      );
    }

    // Insert appointment
    await db(
      `INSERT INTO appointments 
        (doctor_id, patient_name, patient_email, patient_phone, appointment_date, appointment_time, reason) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        doctor_id,
        patient_name,
        patient_email,
        patient_phone,
        appointment_date,
        appointment_time,
        reason || null,
      ]
    );

    // Mark the doctor slot as booked
    await db(
      `UPDATE doctor_availability 
       SET is_booked = 1 
       WHERE doctor_id = ? 
         AND available_date = ? 
         AND slot_time = ?`,
      [doctor_id, appointment_date, appointment_time]
    );

    // Send "Appointment Request Received" email
    await sendEmail({
      status: "received",
      name: patient_name,
      email: patient_email,
      doctorName: doctor[0].name,
      doctorSpecialization: doctor[0].specialization,
      date: appointment_date,
      time: appointment_time,
      reason: reason,
    });

    return handleSuccessResponse(
      {
        doctor_id,
        doctor_name: doctor[0].name,
        doctor_specialization: doctor[0].specialization,
        patient_name,
        patient_email,
        patient_phone,
        appointment_date,
        appointment_time,
        reason,
        status: "pending",
      },
      "Appointment request submitted successfully"
    );
  } catch (error) {
    console.error("Error creating appointment:", error);
    return handleErrorResponse("Internal server error", 500);
  }
}

// GET - Fetch appointments
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let query = `
        SELECT 
          a.id,
          a.patient_name,
          a.patient_email,
          a.patient_phone,
          a.appointment_date,
          a.appointment_time,
          a.reason,
          a.status,
          a.created_at,
          a.reviewed_at,
          d.id AS doctor_id,
          d.name AS doctor_name,
          d.specialization AS doctor_specialization
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id
      `;

    let params = [];

    if (status) {
      query += " WHERE a.status = ?";
      params.push(status);
    }

    query += " ORDER BY a.appointment_date DESC, a.appointment_time DESC";

    const appointments = await db(query, params);

    return handleSuccessResponse(
      appointments,
      "Appointments fetched successfully"
    );
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return handleErrorResponse("Internal server error", 500);
  }
}

// PATCH - Update appointment status
export async function PATCH(req) {
  try {
    const { appointment_id, status, rejection_reason } = await req.json();

    // Validate input
    if (!appointment_id || !status) {
      return handleErrorResponse("Appointment ID and status are required", 400);
    }

    // Validate status
    const validStatuses = [
      "pending",
      "approved",
      "rejected",
      "completed",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return handleErrorResponse("Invalid status", 400);
    }

    // Get appointment details with doctor info
    const appointment = await db(
      `SELECT a.*, d.name AS doctor_name, d.specialization AS doctor_specialization
         FROM appointments a
         JOIN doctors d ON a.doctor_id = d.id
         WHERE a.id = ?`,
      [appointment_id]
    );

    if (appointment.length === 0) {
      return handleErrorResponse("Appointment not found", 404);
    }

    const appt = appointment[0];

    // Update appointment status
    await db(
      `UPDATE appointments 
         SET status = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
      [status, appointment_id]
    );

    // Handle status-specific actions
    if (status === "approved") {
      // Send approval email
      await sendEmail({
        status: "approved",
        name: appt.patient_name,
        email: appt.patient_email,
        doctorName: appt.doctor_name,
        doctorSpecialization: appt.doctor_specialization,
        date: appt.appointment_date,
        time: appt.appointment_time,
        reason: appt.reason,
      });
    } else if (status === "rejected") {
      // Free up the slot
      await db(
        `UPDATE doctor_availability
           SET is_booked = 0
           WHERE doctor_id = ? AND available_date = ? AND slot_time = ?`,
        [appt.doctor_id, appt.appointment_date, appt.appointment_time]
      );

      // Send rejection email
      await sendEmail({
        status: "rejected",
        name: appt.patient_name,
        email: appt.patient_email,
        doctorName: appt.doctor_name,
        doctorSpecialization: appt.doctor_specialization,
        date: appt.appointment_date,
        time: appt.appointment_time,
        reason: appt.reason,
        rejectionReason:
          rejection_reason || "The requested time slot is no longer available",
      });
    } else if (status === "completed") {
      // Generate review token
      const reviewToken = generateReviewToken(appointment_id);

      // Store token in database
      await db(
        "UPDATE appointments SET review_token = ?, review_token_sent_at = NOW() WHERE id = ?",
        [reviewToken, appointment_id]
      );

      // Generate review link
      const reviewLink = `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/review/${reviewToken}`;

      // Send review request email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });

      const fromEmail = process.env.GMAIL_USER || "healthcare@gmail.com";

      await transporter.sendMail({
        from: `HealthCare <${fromEmail}>`,
        to: appt.patient_email,
        subject: "Share Your Experience - Rate Your Visit",
        html: reviewRequestEmail({
          name: appt.patient_name,
          doctorName: appt.doctor_name,
          doctorSpecialization: appt.doctor_specialization,
          date: appt.appointment_date,
          time: appt.appointment_time,
          reviewLink: reviewLink,
        }),
      });

      // Update doctor metrics
      await db(
        `UPDATE doctors 
         SET completed_appointments = completed_appointments + 1,
             total_appointments = total_appointments + 1
         WHERE id = ?`,
        [appt.doctor_id]
      );
    } else if (status === "cancelled") {
      // Free up the slot if cancelled
      await db(
        `UPDATE doctor_availability
           SET is_booked = 0
           WHERE doctor_id = ? AND available_date = ? AND slot_time = ?`,
        [appt.doctor_id, appt.appointment_date, appt.appointment_time]
      );
    }

    return handleSuccessResponse(
      {
        appointment_id,
        status,
        message: getStatusMessage(status),
      },
      "Appointment status updated successfully"
    );
  } catch (error) {
    console.error("Error updating appointment status:", error);
    return handleErrorResponse("Internal server error", 500);
  }
}

// Helper function to get status-specific messages
function getStatusMessage(status) {
  const messages = {
    approved: "Appointment approved and confirmation email sent",
    rejected: "Appointment rejected and notification email sent",
    completed: "Appointment marked as completed and review request sent",
    cancelled: "Appointment cancelled and slot freed up",
    pending: "Appointment status updated to pending",
  };
  return messages[status] || "Appointment status updated";
}
