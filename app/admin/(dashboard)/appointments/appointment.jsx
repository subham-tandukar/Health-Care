"use client";
import { useEffect, useState } from "react";
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

const Appointments = () => {
  const [list, setList] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch appointments from API
  const getList = async () => {
    try {
      const res = await fetch(`/api/appointment`);
      const data = await res.json();

      if (!res.ok) {
        setList([]);
      } else {
        setList(data.data || []); // assuming your API response has { data: [...] }
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getList();
  }, []);

  // Apply filters
  const filteredAppointments = list.filter((appointment) => {
    const matchesSearch =
      appointment.patient_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats calculation
  const stats = [
    {
      title: "Pending Appointments",
      value: list.filter((a) => a.status === "pending").length,
      color: "muted-foreground",
    },
    {
      title: "Approved Appointments",
      value: list.filter((a) => a.status === "approved").length,
      color: "primary",
    },
    {
      title: "Completed Appointments",
      value: list.filter((a) => a.status === "completed").length,
      color: "success",
    },
    {
      title: "Rejected Appointments",
      value: list.filter((a) => a.status === "rejected").length,
      color: "destructive",
    },
  ];

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
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Appointments List */}
          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-muted-foreground">Loading...</p>
            ) : filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  getList={getList}
                />
              ))
            ) : (
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
