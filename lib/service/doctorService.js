import { db } from "@/lib/db";

/**
 * Fetch doctors with slots and compute status
 * @returns {Promise<Array>} doctors with status and slots
 */
export async function fetchDoctorsWithStatus() {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const currentTime = now.getHours() + now.getMinutes() / 60;

  // Fetch doctors + availability
  const rows = await db(`
    SELECT d.id, d.name, d.specialization, d.email, d.phone, d.experience,
           DATE_FORMAT(da.available_date, '%Y-%m-%d') AS available_date,
           TIME_FORMAT(da.slot_time, '%H:%i:%s') AS slot_time,
           da.is_booked
    FROM doctors d
    LEFT JOIN doctor_availability da ON da.doctor_id = d.id
    ORDER BY d.created_at DESC
  `);

  // Group by doctor
  const doctorMap = {};
  rows.forEach((row) => {
    if (!doctorMap[row.id]) {
      doctorMap[row.id] = {
        id: row.id,
        name: row.name,
        specialization: row.specialization,
        email: row.email,
        phone: row.phone,
        experience: row.experience,
        slots: [],
      };
    }

    if (row.available_date && row.slot_time) {
      // Filter out past slots (1 hour buffer)
      const slotDateTime = new Date(`${row.available_date}T${row.slot_time}`);
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour ago
      if (slotDateTime > oneHourAgo) {
        doctorMap[row.id].slots.push({
          date: row.available_date,
          time: row.slot_time,
          booked: Boolean(row.is_booked),
        });
      }
    }
  });

  // Compute status
  return Object.values(doctorMap).map((doctor) => {
    // Sort slots by date + time ascending
    doctor.slots.sort((a, b) => {
      const dateTimeA = new Date(`${a.date}T${a.time}`);
      const dateTimeB = new Date(`${b.date}T${b.time}`);
      return dateTimeA - dateTimeB;
    });

    if (!doctor.slots.length) {
      doctor.status = "unavailable";
      return doctor;
    }

    // Check if all slots are booked
    const allBooked = doctor.slots.every((slot) => slot.booked);
    if (allBooked) {
      doctor.status = "unavailable";
      return doctor;
    }

    let status = "available";
    for (const slot of doctor.slots) {
      if (slot.booked && slot.date === todayStr) {
        const [h, m] = slot.time.split(":").map(Number);
        const slotStart = h + m / 60;
        const slotEnd = slotStart + 1;

        if (currentTime >= slotStart && currentTime < slotEnd) {
          status = "busy";
          break;
        }
      }
    }

    doctor.status = status;
    return doctor;
  });
}
