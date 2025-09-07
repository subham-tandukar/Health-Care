import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const mockDoctors = [
  {
    id: 1,
    name: "Sarah Smith",
    specialization: "Cardiology",
    status: "available",
    avatar: "",
    patientsToday: 8,
  },
  {
    id: 2,
    name: "Michael Williams",
    specialization: "Neurology",
    status: "busy",
    avatar: "",
    patientsToday: 12,
  },
  {
    id: 3,
    name: "Emily Brown",
    specialization: "Pediatrics",
    status: "available",
    avatar: "",
    patientsToday: 6,
  },
  {
    id: 4,
    name: "James Garcia",
    specialization: "Orthopedics",
    status: "unavailable",
    avatar: "",
    patientsToday: 0,
  },
];

const getStatusBadge = (status) => {
  switch (status) {
    case "available":
      return (
        <Badge
          variant="secondary"
          className="bg-success/10 text-success border-success/20"
        >
          Available
        </Badge>
      );
    case "busy":
      return (
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary border-primary/20"
        >
          Busy
        </Badge>
      );
    case "unavailable":
      return (
        <Badge
          variant="secondary"
          className="bg-destructive/10 text-destructive border-destructive/20"
        >
          Unavailable
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const DoctorsList = ({ doctors }) => {
  return (
    <div className="space-y-4">
      {doctors.length > 0 ? (
        <>
          {doctors.slice(0, 4).map((doctor) => (
            <div
              key={doctor.id}
              className="flex items-center justify-between p-4 bg-card rounded-lg border border-border/50 hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex justify-center items-center font-medium">
                  {doctor.name.split("")[0]}
                </div>
                <div>
                  <h4 className="font-medium text-foreground">
                    Dr. {doctor.name}
                  </h4>
                  <p className="text-sm text-muted-foreground capitalize">
                    {doctor.specialization}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {/* {doctor.patientsToday} patients today */}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {getStatusBadge(doctor.status)}
              </div>
            </div>
          ))}

          <Button variant="default" className="w-full mt-4" asChild>
            <Link href="/admin/doctors">View All Doctors</Link>
          </Button>
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-foreground mb-2">
            No doctors found
          </h3>
        </div>
      )}
    </div>
  );
};
