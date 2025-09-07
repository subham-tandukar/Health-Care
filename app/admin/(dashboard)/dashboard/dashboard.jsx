import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Calendar, Clock, CheckCircle } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DoctorsList } from "@/components/dashboard/DoctorList";
import { RecentAppointments } from "@/components/dashboard/RecentAppoinments";

export default function AdminDashboard({
  doctors,
  dashboardStats,
  appointments,
}) {
  const stats = [
    {
      title: "Total Doctors",
      value: dashboardStats?.totalDoctors,
      color: "muted-foreground",
    },
    {
      title: "Approved Appointments",
      value: dashboardStats?.approvedAppointments,
      color: "primary",
    },
    {
      title: "Completed Appointments",
      value: dashboardStats?.completedAppointments,
      color: "success",
    },
    {
      title: "Rejected Appointments",
      value: dashboardStats?.rejectedAppointments,
      color: "destructive",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, Admin
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Appointments */}
        <Card className="bg-gradient-card shadow-medium border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span>Recent Appointments</span>
            </CardTitle>
            <CardDescription>
              Latest appointment requests from patients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentAppointments appointments={appointments} />
          </CardContent>
        </Card>

        {/* Active Doctors */}
        <Card className="bg-gradient-card shadow-medium border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary" />
              <span>Available Doctors</span>
            </CardTitle>
            <CardDescription>Currently available medical staff</CardDescription>
          </CardHeader>
          <CardContent>
            <DoctorsList doctors={doctors} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
