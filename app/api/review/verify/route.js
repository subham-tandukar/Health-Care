import { db } from "@/lib/db";
import {
  handleErrorResponse,
  handleSuccessResponse,
} from "@/utils/apiResponse";
import { verifyReviewToken } from "@/utils/tokenGenerator";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return handleErrorResponse("Token is required", 400);
    }

    // Verify token
    const decoded = verifyReviewToken(token);
    if (!decoded) {
      return handleErrorResponse("Invalid or expired review link", 400);
    }

    // Get appointment details
    const appointment = await db(
      `SELECT a.*, d.name as doctor_name, d.specialization as doctor_specialization
       FROM appointments a
       JOIN doctors d ON a.doctor_id = d.id
       WHERE a.id = ? AND a.review_token = ? AND a.status = 'completed'`,
      [decoded.appointmentId, token]
    );

    if (appointment.length === 0) {
      return handleErrorResponse(
        "Appointment not found or already reviewed",
        404
      );
    }

    // Check if already reviewed
    // const existingReview = await db(
    //   "SELECT id FROM doctor_reviews WHERE appointment_id = ?",
    //   [decoded.appointmentId]
    // );

    // if (existingReview.length > 0) {
    //   return handleErrorResponse(
    //     "You have already submitted a review for this appointment",
    //     400
    //   );
    // }

    return handleSuccessResponse({ appointment: appointment[0] });
  } catch (error) {
    console.error("Error verifying token:", error);
    return handleErrorResponse("Internal server error", 500);
  }
}
