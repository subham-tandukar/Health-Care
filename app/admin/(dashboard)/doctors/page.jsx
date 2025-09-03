"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Users, Stethoscope } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DoctorDialog } from "@/components/doctors/DoctorDialog";
import { StatsCard } from "@/components/dashboard/StatsCard";

const mockDoctors = [
  {
    id: 1,
    name: "Sarah Smith",
    email: "sarah.smith@medical.com",
    phone: "+1 (555) 123-4567",
    specialization: "Cardiology",
    experience: "15 years",
    status: "available",
    patientsCount: 342,
    joinDate: "2019-03-15",
  },
  {
    id: 2,
    name: "Michael Williams",
    email: "michael.williams@medical.com",
    phone: "+1 (555) 234-5678",
    specialization: "Neurology",
    experience: "12 years",
    status: "available",
    patientsCount: 298,
    joinDate: "2020-07-22",
  },
  {
    id: 3,
    name: "Emily Brown",
    email: "emily.brown@medical.com",
    phone: "+1 (555) 345-6789",
    specialization: "Pediatrics",
    experience: "8 years",
    status: "available",
    patientsCount: 189,
    joinDate: "2021-01-10",
  },
  {
    id: 4,
    name: "James Garcia",
    email: "james.garcia@medical.com",
    phone: "+1 (555) 456-7890",
    specialization: "Orthopedics",
    experience: "20 years",
    status: "busy",
    patientsCount: 445,
    joinDate: "2018-09-03",
  },
];

const stats = [
  {
    title: "Total Doctors",
    value: "24",
    color: "muted-foreground",
  },
  {
    title: "Busy Doctors",
    value: "18",
    color: "primary",
  },
  {
    title: "Available Doctors",
    value: "156",
    color: "success",
  },
  {
    title: "Unavailable Doctors",
    value: "12",
    color: "destructive",
  },
];

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  const filteredDoctors = mockDoctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDoctor = () => {
    setEditingDoctor(null);
    setIsDialogOpen(true);
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setIsDialogOpen(true);
  };

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
            <Users className="w-8 h-8 text-primary" />
            <span>Doctors Management</span>
          </h1>
        </div>
        <Button onClick={handleAddDoctor} variant="default">
          <Plus className="w-4 h-4 mr-2" />
          Add Doctor
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="bg-gradient-card shadow-medium border-border/50">
        <CardHeader>
          <CardTitle>Doctors List</CardTitle>
          <CardDescription>View and manage all medical staff</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search doctors by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <Card
                key={doctor.id}
                className="bg-card shadow-soft border-border/50 hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-primary text-white flex justify-center items-center font-medium">
                        {doctor.name.split("")[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          Dr. {doctor.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {doctor.specialization}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(doctor.status)}
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Experience:</span>{" "}
                      {doctor.experience}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Patients:</span>{" "}
                      {doctor.patientsCount}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Email:</span> {doctor.email}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditDoctor(doctor)}
                      className="flex-1 hover:bg-primary hover:text-primary-foreground border-primary/20"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="hover:bg-destructive hover:text-primary-foreground border-destructive/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <DoctorDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        doctor={editingDoctor}
      />
    </div>
  );
};

export default Doctors;
