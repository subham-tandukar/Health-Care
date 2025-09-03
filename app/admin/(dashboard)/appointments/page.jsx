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
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle, X, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppointmentCard } from "@/components/appointments/AppointmentCard";
import { StatsCard } from "@/components/dashboard/StatsCard";

const mockAppointments = [
  {
    id: 1,
    patientName: "Sarah Johnson",
    patientPhone: "+1 (555) 123-0001",
    patientEmail: "sarah.johnson@email.com",
    doctorName: "Dr. Smith",
    doctorSpecialization: "Cardiology",
    date: "2024-01-15",
    time: "10:00 AM",
    status: "pending",
    type: "Consultation",
    reason: "Chest pain and irregular heartbeat",
    requestedAt: "2024-01-12T14:30:00Z",
  },
  {
    id: 2,
    patientName: "Michael Chen",
    patientPhone: "+1 (555) 123-0002",
    patientEmail: "michael.chen@email.com",
    doctorName: "Dr. Williams",
    doctorSpecialization: "Neurology",
    date: "2024-01-15",
    time: "2:30 PM",
    status: "approved",
    type: "Follow-up",
    reason: "Follow-up appointment for migraine treatment",
    requestedAt: "2024-01-10T09:15:00Z",
  },
  {
    id: 3,
    patientName: "Emma Davis",
    patientPhone: "+1 (555) 123-0003",
    patientEmail: "emma.davis@email.com",
    doctorName: "Dr. Brown",
    doctorSpecialization: "Pediatrics",
    date: "2024-01-16",
    time: "9:15 AM",
    status: "completed",
    type: "Check-up",
    reason: "Annual pediatric check-up for 8-year-old",
    requestedAt: "2024-01-08T16:45:00Z",
  },
  {
    id: 4,
    patientName: "James Wilson",
    patientPhone: "+1 (555) 123-0004",
    patientEmail: "james.wilson@email.com",
    doctorName: "Dr. Garcia",
    doctorSpecialization: "Orthopedics",
    date: "2024-01-16",
    time: "3:45 PM",
    status: "cancelled",
    type: "Consultation",
    reason: "Knee pain after sports injury",
    requestedAt: "2024-01-11T11:20:00Z",
  },
  {
    id: 5,
    patientName: "Lisa Rodriguez",
    patientPhone: "+1 (555) 123-0005",
    patientEmail: "lisa.rodriguez@email.com",
    doctorName: "Dr. Johnson",
    doctorSpecialization: "Dermatology",
    date: "2024-01-17",
    time: "11:30 AM",
    status: "pending",
    type: "Consultation",
    reason: "Skin rash and allergic reaction",
    requestedAt: "2024-01-13T13:10:00Z",
  },
];

const stats = [
  {
    title: "Pending Appointments",
    value: "24",
    color: "muted-foreground",
  },
  {
    title: "Approved Appointments",
    value: "18",
    color: "primary",
  },
  {
    title: "Completed Appointments",
    value: "156",
    color: "success",
  },
  {
    title: "Rejected Appointments",
    value: "12",
    color: "destructive",
  },
];

const Appointments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredAppointments = mockAppointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatsCount = (status) => {
    return mockAppointments.filter((apt) => apt.status === status).length;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
          <Calendar className="w-8 h-8 text-primary" />
          <span>Appointments Management</span>
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Filters and Search */}
      <Card className="bg-gradient-card shadow-medium border-border/50">
        <CardHeader>
          <CardTitle>Appointment Requests</CardTitle>
          <CardDescription>
            Review and take action on patient appointment requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by patient or doctor name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Appointments List */}
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}

            {filteredAppointments.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No appointments found
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "No appointment requests at the moment"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Appointments;
