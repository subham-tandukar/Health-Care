import { fetchDoctorsWithStatus } from "@/lib/service/doctorService";
import { db } from "@/lib/db";
import {
  handleErrorResponse,
  handleSuccessResponse,
} from "@/utils/apiResponse";

export async function GET() {
  try {
    // Doctor stats
    const doctors = await fetchDoctorsWithStatus();

    const doctorStats = {
      totalDoctors: doctors.length,
      availableDoctors: doctors.filter((d) => d.status === "available").length,
      busyDoctors: doctors.filter((d) => d.status === "busy").length,
      unavailableDoctors: doctors.filter((d) => d.status === "unavailable")
        .length,
    };

    // Appointment stats
    const appointments = await db(`
      SELECT 
        COUNT(*) AS total,
        SUM(status = 'approved') AS approved,
        SUM(status = 'rejected') AS rejected,
        SUM(status = 'completed') AS completed
      FROM appointments
    `);

    const appointmentStats = {
      totalAppointments: appointments[0].total || 0,
      approvedAppointments: appointments[0].approved || 0,
      rejectedAppointments: appointments[0].rejected || 0,
      completedAppointments: appointments[0].completed || 0,
    };

    return handleSuccessResponse(
      {
        ...doctorStats,
        ...appointmentStats,
      },
      "Stats fetched successfully"
    );
  } catch (error) {
    console.error("Error fetching doctor and appointment stats:", error);
    return handleErrorResponse("Internal server error", 500);
  }
}
