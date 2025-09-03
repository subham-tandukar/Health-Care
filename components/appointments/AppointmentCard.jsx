import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Check,
  X,
  Clock,
  User,
  Phone,
  Mail,
  Calendar,
  Stethoscope,
} from "lucide-react";

const getStatusBadge = (status) => {
  switch (status) {
    case "pending":
      return (
        <Badge
          variant="secondary"
          className="bg-warning/10 text-warning border-warning/20"
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
    case "completed":
      return (
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary border-primary/20"
        >
          <Check className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      );
    case "cancelled":
      return (
        <Badge
          variant="secondary"
          className="bg-destructive/10 text-destructive border-destructive/20"
        >
          <X className="w-3 h-3 mr-1" />
          Cancelled
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getTypeColor = (type) => {
  switch (type.toLowerCase()) {
    case "consultation":
      return "text-primary";
    case "follow-up":
      return "text-muted-foreground";
    case "check-up":
      return "text-success";
    default:
      return "text-muted-foreground";
  }
};

export const AppointmentCard = ({ appointment }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatRequestedDate = (isoString) => {
    return new Date(isoString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="bg-card shadow-soft border-border/50 hover:shadow-medium transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Main Info */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-3">
                <div>
                  <h3 className="font-semibold text-foreground">
                    {appointment.patientName}
                  </h3>
                </div>
              </div>
              {getStatusBadge(appointment.status)}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Stethoscope className="w-4 h-4" />
                  <span>{appointment.doctorName}</span>
                  <span>•</span>
                  <span>{appointment.doctorSpecialization}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {formatDate(appointment.date)} at {appointment.time}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{appointment.patientPhone}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{appointment.patientEmail}</span>
                </div>

                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Requested:</span>{" "}
                  {formatRequestedDate(appointment.requestedAt)}
                </div>
              </div>
            </div>

            {/* Reason */}
            <div className="bg-muted/30 rounded-lg pt-3">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Reason: </span>
                {appointment.reason}
              </p>
            </div>
          </div>
        </div>

        {appointment.status === "pending" && (
          <div className="flex gap-2 mt-5">
            <Button
              size="sm"
              className="bg-success hover:bg-success/90 text-primary-foreground flex-1 lg:flex-none"
            >
              <Check className="w-4 h-4 mr-2" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="bg-destructive hover:bg-destructive/90 hover:text-primary-foreground flex-1 lg:flex-none"
            >
              <X className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
