import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/formatter";
import { Check, X, Clock } from "lucide-react";
import Link from "next/link";

const mockAppointments = [
  {
    id: 1,
    patientName: "Sarah Johnson",
    doctorName: "Dr. Smith",
    date: "2024-01-15",
    time: "10:00 AM",
    status: "pending",
    type: "Consultation",
  },
  {
    id: 2,
    patientName: "Michael Chen",
    doctorName: "Dr. Williams",
    date: "2024-01-15",
    time: "2:30 PM",
    status: "pending",
    type: "Follow-up",
  },
  {
    id: 3,
    patientName: "Emma Davis",
    doctorName: "Dr. Brown",
    date: "2024-01-16",
    time: "9:15 AM",
    status: "approved",
    type: "Check-up",
  },
  {
    id: 4,
    patientName: "James Wilson",
    doctorName: "Dr. Garcia",
    date: "2024-01-16",
    time: "3:45 PM",
    status: "pending",
    type: "Consultation",
  },
];

const getStatusBadge = (status) => {
  switch (status) {
    case "pending":
      return (
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary border-primary/20"
        >
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    case "approved":
      return (
        <Badge
          variant="secondary"
          className="bg-success/10 text-success border-success/20"
        >
          <Check className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const RecentAppointments = ({ appointments }) => {
  return (
    <div className="space-y-4">
      {appointments.length > 0 ? (
        <>
          {appointments.slice(0, 4).map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-4 bg-card rounded-lg border border-border/50 hover:bg-accent/5 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-foreground">
                    {appointment.patient_name}
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground flex items-center space-x-2">
                  <span>Dr. {appointment.doctor_name}</span>
                  <span>•</span>
                  <span className="capitalize">
                    {appointment.doctor_specialization}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(appointment.appointment_date)} at{" "}
                  {appointment.appointment_time}
                </p>
              </div>

              {getStatusBadge(appointment.status)}
            </div>
          ))}

          <Button variant="default" className="w-full mt-4" asChild>
            <Link href="/admin/appointments">View All Appointments</Link>
          </Button>
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-foreground mb-2">
            No appointments found
          </h3>
        </div>
      )}
    </div>
  );
};
