import { db } from "@/lib/db";
import {
  handleErrorResponse,
  handleSuccessResponse,
} from "@/utils/apiResponse";
import { verifyReviewToken } from "@/utils/tokenGenerator";

export async function POST(req) {
  try {
    const { token, rating, review_text } = await req.json();

    // Validate inputs
    if (!token || !rating || rating < 1 || rating > 5) {
      return handleErrorResponse("Invalid data provided", 400);
    }

    // Verify token
    const decoded = verifyReviewToken(token);
    if (!decoded) {
      return handleErrorResponse("Invalid or expired review link", 400);
    }

    // Get appointment details
    const appointment = await db(
      `SELECT a.*, d.id as doctor_id
       FROM appointments a
       JOIN doctors d ON a.doctor_id = d.id
       WHERE a.id = ? AND a.review_token = ? AND a.status = 'completed'`,
      [decoded.appointmentId, token]
    );

    if (appointment.length === 0) {
      return handleErrorResponse("Appointment not found", 404);
    }

    const appt = appointment[0];

    // Check if already reviewed
    // const existingReview = await db(
    //   "SELECT id FROM doctor_reviews WHERE appointment_id = ?",
    //   [decoded.appointmentId]
    // );

    // if (existingReview.length > 0) {
    //   return handleErrorResponse("Review already submitted", 400);
    // }

    // Insert review
    // await db(
    //   `INSERT INTO doctor_reviews
    //    (doctor_id, appointment_id, patient_name, patient_email, rating, review_text)
    //    VALUES (?, ?, ?, ?, ?, ?)`,
    //   [
    //     appt.doctor_id,
    //     decoded.appointmentId,
    //     appt.patient_name,
    //     appt.patient_email,
    //     rating,
    //     review_text,
    //   ]
    // );

    // Mark appointment as reviewed
    await db("UPDATE appointments SET reviewed_at = NOW() WHERE id = ?", [
      decoded.appointmentId,
    ]);

    // Update doctor's average rating
    // await updateDoctorRating(appt.doctor_id);

    return handleSuccessResponse({ message: "Review submitted successfully" });
  } catch (error) {
    console.error("Error submitting review:", error);
    return handleErrorResponse("Internal server error", 500);
  }
}

async function updateDoctorRating(doctorId) {
  const stats = await db(
    `SELECT 
      AVG(rating) as avg_rating, 
      COUNT(*) as total_reviews 
     FROM doctor_reviews 
     WHERE doctor_id = ?`,
    [doctorId]
  );

  await db(
    "UPDATE doctors SET average_rating = ?, total_reviews = ? WHERE id = ?",
    [stats[0].avg_rating || 0, stats[0].total_reviews || 0, doctorId]
  );
}
