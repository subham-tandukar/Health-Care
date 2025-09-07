"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, User, Mail, Clock, Clock1 } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export const AppointmentBooking = ({ selectedDoctor, onClose }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    patientName: "",
    email: "",
    phone: "",
    reason: "",
    doctorId: selectedDoctor?.id || "",
    date: "",
    time: "",
  });
  const [loading, setLoading] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor_id: formData.doctorId,
          patient_name: formData.patientName,
          patient_email: formData.email,
          patient_phone: formData.phone,
          appointment_date: formData.date,
          appointment_time: formData.time,
          reason: formData.reason,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to book appointment");
      } else {
        toast.success(data.message || "Appointment Booked Successfully!");

        setFormData({
          patientName: "",
          email: "",
          phone: "",
          reason: "",
          doctorId: selectedDoctor?.id || "",
          date: "",
          time: "",
        });
        router.refresh();
        setIsBooked(true);
      }
    } catch (err) {
      console.error("Error submitting doctor:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-lg border-0 bg-gradient-to-br from-card to-card/50">
      {!isBooked ? (
        <>
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
              <Calendar className="w-6 h-6" />
              Book Your Appointment
            </CardTitle>
            {selectedDoctor && (
              <p className="text-muted-foreground">
                with Dr. {selectedDoctor.name} -{" "}
                <span className="capitalize">
                  {selectedDoctor.specialization}
                </span>
              </p>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Patient Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Full Name *</Label>
                  <Input
                    id="patientName"
                    value={formData.patientName}
                    onChange={(e) =>
                      handleInputChange("patientName", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              {/* Slot Selection */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2 text-primary">
                  <Clock className="w-5 h-5" />
                  Choose an Available Slot *
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedDoctor?.slots
                    ?.filter((slot) => !slot.booked)
                    .map((slot, index) => (
                      <label
                        key={index}
                        className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted"
                      >
                        <input
                          type="radio"
                          name="slot"
                          value={`${slot.date}|${slot.time}`}
                          checked={
                            formData.date === slot.date &&
                            formData.time === slot.time
                          }
                          onChange={() => {
                            handleInputChange("date", slot.date);
                            handleInputChange("time", slot.time);
                          }}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span>
                          <span className="font-medium">{slot.date}</span> at{" "}
                          <span className="text-primary font-semibold">
                            {slot.time}
                          </span>
                        </span>
                      </label>
                    ))}
                  {(!selectedDoctor?.slots ||
                    selectedDoctor.slots.filter((s) => !s.booked).length ===
                      0) && (
                    <p className="text-sm text-muted-foreground">
                      No available slots for this doctor.
                    </p>
                  )}
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <Label htmlFor="reason">Reason (Optional)</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => handleInputChange("reason", e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Booking..." : "Confirm Appointment"}
              </Button>
            </form>
          </CardContent>
        </>
      ) : (
        <>
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
              <Clock1 className="w-6 h-6" />
              Appointment Request Sent
            </CardTitle>
            <div className="space-y-4 mt-4">
              <p className="text-muted-foreground">
                Thank you. Your request for an appointment with{" "}
                <span className="font-medium">Dr. {selectedDoctor?.name}</span>{" "}
                has been submitted.
              </p>
              <p className="text-muted-foreground">
                The appointment is currently{" "}
                <span className="font-medium">pending approval</span> {""}
                from the admin. You’ll be notified once it is approved or
                rejected.
              </p>
            </div>
          </CardHeader>
        </>
      )}
    </Card>
  );
};
