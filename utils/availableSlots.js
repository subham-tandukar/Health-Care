export const generateNextDays = (days = 3) => {
  const today = new Date();
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d.toISOString().split("T")[0]; // YYYY-MM-DD
  });
};

export const slotTimes = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
