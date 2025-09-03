import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export const RecentAppointments = () => {
  return (
    <div className="space-y-4">
      {mockAppointments.slice(0, 4).map((appointment) => (
        <div
          key={appointment.id}
          className="flex items-center justify-between p-4 bg-card rounded-lg border border-border/50 hover:bg-accent/5 transition-colors"
        >
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-foreground">
                {appointment.patientName}
              </h4>
              {getStatusBadge(appointment.status)}
            </div>
            <p className="text-sm text-muted-foreground">
              {appointment.doctorName} • {appointment.type}
            </p>
            <p className="text-xs text-muted-foreground">
              {appointment.date} at {appointment.time}
            </p>
          </div>

          {appointment.status === "pending" && (
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 hover:bg-success hover:text-primary-foreground border-success/20"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 hover:bg-destructive hover:text-primary-foreground border-destructive/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      ))}

      <Button variant="default" className="w-full mt-4" asChild>
        <Link href="/admin/appointments">View All Appointments</Link>
      </Button>
    </div>
  );
};
