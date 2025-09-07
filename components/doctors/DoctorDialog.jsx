import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "../ui/checkbox";
import { generateNextDays, slotTimes } from "@/utils/availableSlots";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export const DoctorDialog = ({ open, onOpenChange, doctor }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    slots: [],
  });

  useEffect(() => {
    if (doctor) {
      let groupedSlots = [];

      // Check if slots exist and handle the object format
      if (doctor.slots && doctor.slots.length > 0) {
        // Handle object format [{ date: "2025-09-07", time: "14:00:00", booked: false }]
        const slotMap = {};

        doctor.slots.forEach((slot) => {
          // Extract time and remove seconds if present (14:00:00 -> 14:00)
          const time = slot.time.substring(0, 5);

          if (slotMap[slot.date]) {
            slotMap[slot.date].push(time);
          } else {
            slotMap[slot.date] = [time];
          }
        });

        // Convert map to array format and sort
        groupedSlots = Object.entries(slotMap).map(([date, times]) => ({
          date,
          time: times.sort((a, b) => a.localeCompare(b)),
        }));
      }

      // Sort dates
      groupedSlots.sort((a, b) => new Date(a.date) - new Date(b.date));

      setFormData({
        name: doctor.name || "",
        email: doctor.email || "",
        phone: doctor.phone || "",
        specialization: doctor.specialization || "",
        experience: doctor.experience || "",
        slots: groupedSlots,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        specialization: "",
        experience: "",
        slots: [],
      });
    }
  }, [doctor]);

  const toggleSlot = (date, time) => {
    setFormData((prev) => {
      let slots = [...prev.slots];
      const dateIndex = slots.findIndex((s) => s.date === date);

      if (dateIndex > -1) {
        let times = [...slots[dateIndex].time];
        if (times.includes(time)) {
          times = times.filter((t) => t !== time);
        } else {
          times.push(time);
        }

        times.sort((a, b) => a.localeCompare(b)); // keep sorted

        if (times.length > 0) {
          slots[dateIndex] = { ...slots[dateIndex], time: times };
        } else {
          slots.splice(dateIndex, 1);
        }
      } else {
        slots.push({ date, time: [time] });
      }

      // sort dates as well
      slots.sort((a, b) => new Date(a.date) - new Date(b.date));

      return { ...prev, slots };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const method = doctor ? "PUT" : "POST";
      const payload = doctor
        ? { ...formData, id: doctor.id } // Include ID for updates
        : formData;

      const res = await fetch("/api/doctor", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(
          data.message || `Failed to ${doctor ? "update" : "add"} doctor`
        );
      } else {
        toast.success(
          data.message || `Doctor ${doctor ? "updated" : "added"} successfully`
        );
        router.refresh();
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error submitting doctor:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{doctor ? "Edit Doctor" : "Add New Doctor"}</DialogTitle>
          <DialogDescription>
            {doctor
              ? "Update the doctor's information below."
              : "Fill in the information to add a new doctor."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="experience">Experience</Label>
              <Input
                id="experience"
                value={formData.experience}
                onChange={(e) =>
                  handleInputChange("experience", e.target.value)
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Select
                value={formData.specialization}
                onValueChange={(value) =>
                  handleInputChange("specialization", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="neurology">Neurology</SelectItem>
                  <SelectItem value="pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="orthopedics">Orthopedics</SelectItem>
                  <SelectItem value="dermatology">Dermatology</SelectItem>
                  <SelectItem value="psychiatry">Psychiatry</SelectItem>
                  <SelectItem value="oncology">Oncology</SelectItem>
                  <SelectItem value="emergency">Emergency Medicine</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label>Available Slots (Next 3 Days)</Label>

              {generateNextDays(3).map((date) => (
                <div key={date} className="space-y-2 border rounded-lg p-3">
                  <p className="font-medium">{date}</p>
                  <div className="flex flex-wrap gap-2">
                    {slotTimes.map((time) => {
                      const dateSlot = formData.slots.find(
                        (s) => s.date === date
                      );
                      const checked = dateSlot?.time.includes(time);

                      // Disable if date & time is in the past
                      const slotDateTime = new Date(`${date}T${time}`);
                      const isPast = slotDateTime <= new Date();

                      return (
                        <div key={`${date}-${time}`}>
                          <Checkbox
                            id={`${date}-${time}`}
                            checked={checked}
                            onCheckedChange={() => toggleSlot(date, time)}
                            className="hidden"
                            disabled={isPast} // disable past slots
                          />
                          <Label
                            htmlFor={`${date}-${time}`}
                            className={`cursor-pointer inline-flex items-center justify-center gap-2 rounded-md border px-3 py-1 text-sm transition ${
                              checked
                                ? "bg-primary text-primary-foreground"
                                : ""
                            } ${isPast ? "opacity-50 cursor-not-allowed" : ""}`} // style for disabled
                          >
                            {time}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="destructive"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              className={` ${loading && "pointer-events-none opacity-50"}`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Please wait...
                </>
              ) : (
                <>{doctor ? "Update Doctor" : "Add Doctor"}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
