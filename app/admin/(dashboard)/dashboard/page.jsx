import React from "react";
import { base_url } from "@/utils/baseUrl";
import AdminDashboard from "./dashboard";

async function getStats() {
  const res = await fetch(`${base_url}/dashboard-stats`);

  if (!res.ok) {
    throw new Error("Failed to fetch doctors stats");
  }

  return res.json();
}

async function getDoctors() {
  const res = await fetch(`${base_url}/doctor?status=available`);

  if (!res.ok) {
    throw new Error("Failed to fetch doctors");
  }

  return res.json();
}

async function getAppointments() {
  const res = await fetch(`${base_url}/appointment?status=pending`);

  if (!res.ok) {
    throw new Error("Failed to fetch doctors");
  }

  return res.json();
}

export default async function AdminDasboardPage() {
  const { data: doctors } = await getDoctors();
  const { data: stats } = await getStats();
  const { data: appointments } = await getAppointments();
  return (
    <AdminDashboard
      doctors={doctors}
      dashboardStats={stats}
      appointments={appointments}
    />
  );
}
