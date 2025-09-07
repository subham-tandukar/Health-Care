import { db } from "@/lib/db";
import { fetchDoctorsWithStatus } from "@/lib/service/doctorService";
import {
  handleErrorResponse,
  handleSuccessResponse,
} from "@/utils/apiResponse";

export async function POST(req) {
  try {
    const { name, specialization, email, phone, experience, slots } =
      await req.json();

    // Validate required fields
    if (
      !name ||
      !specialization ||
      !email ||
      !phone ||
      experience === undefined
    ) {
      return handleErrorResponse("All fields are required", 400);
    }

    // Validate experience (must be a number)
    const expValue = parseFloat(experience);
    if (isNaN(expValue) || expValue < 0) {
      return handleErrorResponse("Experience must be a valid number", 400);
    }

    // Check if doctor already exists
    const existingDoctor = await db(
      "SELECT id FROM doctors WHERE email = ? OR phone = ?",
      [email, phone]
    );

    if (existingDoctor.length > 0) {
      return handleErrorResponse(
        "Doctor with this email or phone number already exists",
        400
      );
    }

    // Insert doctor
    const insertDoctorQuery = `
      INSERT INTO doctors (name, specialization, email, phone, experience)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db(insertDoctorQuery, [name, specialization, email, phone, expValue]);

    // Get the inserted doctor ID
    const [doctor] = await db(`SELECT id FROM doctors WHERE email = ?`, [
      email,
    ]);
    const doctorId = doctor.id;

    // If slots is provided, insert it
    if (Array.isArray(slots) && slots.length > 0) {
      const values = [];
      slots.forEach(({ date, time }) => {
        if (!date || !Array.isArray(time)) return;
        time.forEach((t) => {
          values.push([doctorId, date, t]);
        });
      });

      if (values.length > 0) {
        const placeholders = values.map(() => "(?, ?, ?)").join(", ");
        const flattenedValues = values.flat();

        await db(
          `INSERT INTO doctor_availability (doctor_id, available_date, slot_time)
           VALUES ${placeholders}`,
          flattenedValues
        );
      }
    }

    return handleSuccessResponse(
      {
        doctorId,
        name,
        specialization,
        email,
        phone,
        experience: expValue,
        slots,
      },
      "Doctor added successfully",
      201
    );
  } catch (error) {
    console.error("Error:", error);
    return handleErrorResponse("Internal server error", 500);
  }
}

export async function PUT(req) {
  try {
    const { id, name, specialization, email, phone, experience, slots } =
      await req.json();

    // Validate required fields
    if (
      !id ||
      !name ||
      !specialization ||
      !email ||
      !phone ||
      experience === undefined
    ) {
      return handleErrorResponse("All fields including ID are required", 400);
    }

    // Validate experience
    const expValue = parseFloat(experience);
    if (isNaN(expValue) || expValue < 0) {
      return handleErrorResponse("Experience must be a valid number", 400);
    }

    // Check if doctor exists
    const existingDoctor = await db("SELECT id FROM doctors WHERE id = ?", [
      id,
    ]);
    if (existingDoctor.length === 0) {
      return handleErrorResponse("Doctor not found", 404);
    }

    // Check for duplicate email/phone
    const conflictingDoctor = await db(
      "SELECT id FROM doctors WHERE (email = ? OR phone = ?) AND id != ?",
      [email, phone, id]
    );
    if (conflictingDoctor.length > 0) {
      return handleErrorResponse(
        "Another doctor with this email or phone number already exists",
        400
      );
    }

    // Update doctor details
    await db(
      `UPDATE doctors
       SET name = ?, specialization = ?, email = ?, phone = ?, experience = ?
       WHERE id = ?`,
      [name, specialization, email, phone, expValue, id]
    );

    // Delete only non-booked slots (use 0 instead of false for SQLite)
    await db(
      "DELETE FROM doctor_availability WHERE doctor_id = ? AND is_booked = 0",
      [id]
    );

    // Get remaining booked slots to avoid duplicates
    const existingSlots = await db(
      "SELECT available_date, slot_time FROM doctor_availability WHERE doctor_id = ?",
      [id]
    );
    
    // Fix: Use consistent key format (date-time with hyphen separator)
    const existingSet = new Set(
      existingSlots.map((s) => `${s.available_date}-${s.slot_time}`)
    );

    // Insert new slots (skip duplicates)
    if (Array.isArray(slots) && slots.length > 0) {
      const values = [];
      slots.forEach(({ date, time }) => {
        if (!date || !Array.isArray(time)) return;
        time.forEach((t) => {
          // Fix: Use same key format as above
          const key = `${date}-${t}`;
          if (!existingSet.has(key)) {
            values.push([id, date, t]);
          }
        });
      });

      if (values.length > 0) {
        const placeholders = values.map(() => "(?, ?, ?)").join(", ");
        const flattenedValues = values.flat();
        await db(
          `INSERT INTO doctor_availability (doctor_id, available_date, slot_time)
           VALUES ${placeholders}`,
          flattenedValues
        );
      }
    }

    return handleSuccessResponse(
      {
        doctorId: id,
        name,
        specialization,
        email,
        phone,
        experience: expValue,
      },
      "Doctor updated successfully",
      200
    );
  } catch (error) {
    console.error("Error:", error);
    return handleErrorResponse("Internal server error", 500);
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status") || "all";

    let doctors = await fetchDoctorsWithStatus();

    if (statusFilter !== "all") {
      doctors = doctors.filter((d) => d.status === statusFilter);
    }

    return handleSuccessResponse(doctors, "Doctor list fetched successfully");
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return handleErrorResponse("Internal server error", 500);
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();

    // Validate required ID
    if (!id) {
      return handleErrorResponse("Doctor ID is required", 400);
    }

    // Check if doctor exists
    const existingDoctor = await db(
      "SELECT id, name FROM doctors WHERE id = ?",
      [id]
    );
    if (existingDoctor.length === 0) {
      return handleErrorResponse("Doctor not found", 404);
    }

    // Check if doctor has any booked appointments
    const bookedAppointments = await db(
      `SELECT COUNT(*) as count FROM doctor_availability 
       WHERE doctor_id = ? AND is_booked = true`,
      [id]
    );

    if (bookedAppointments[0].count > 0) {
      return handleErrorResponse(
        "Cannot delete doctor with booked appointments. Please cancel or complete all appointments first.",
        400
      );
    }

    // Delete doctor's availability slots first (foreign key constraint)
    await db("DELETE FROM doctor_availability WHERE doctor_id = ?", [id]);

    // Delete the doctor
    await db("DELETE FROM doctors WHERE id = ?", [id]);

    return handleSuccessResponse(
      {
        doctorId: id,
        name: existingDoctor[0].name,
      },
      "Doctor deleted successfully",
      200
    );
  } catch (error) {
    console.error("Error:", error);
    return handleErrorResponse("Internal server error", 500);
  }
}
