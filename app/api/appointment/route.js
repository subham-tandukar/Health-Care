import { db } from "@/lib/db";
import {
  handleErrorResponse,
  handleSuccessResponse,
} from "@/utils/apiResponse";

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

export async function PATCH(req) {
  try {
    const { appointment_id, status } = await req.json();

    // Validate input
    if (!appointment_id || !status) {
      return handleErrorResponse("Appointment ID and status are required", 400);
    }

    // Check if appointment exists
    const appointment = await db(
      `SELECT id, doctor_id, appointment_date, appointment_time, status 
         FROM appointments WHERE id = ?`,
      [appointment_id]
    );

    if (appointment.length === 0) {
      return handleErrorResponse("Appointment not found", 404);
    }

    // Update appointment status
    await db(
      `UPDATE appointments 
         SET status = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
      [status, appointment_id]
    );

    // If rejected → free up the slot
    if (status === "rejected") {
      await db(
        `UPDATE doctor_availability
           SET is_booked = 0
           WHERE doctor_id = ? AND available_date = ? AND slot_time = ?`,
        [
          appointment[0].doctor_id,
          appointment[0].appointment_date,
          appointment[0].appointment_time,
        ]
      );
    }

    return handleSuccessResponse(
      { appointment_id, status },
      "Appointment status updated successfully"
    );
  } catch (error) {
    console.error("Error updating appointment status:", error);
    return handleErrorResponse("Internal server error", 500);
  }
}
