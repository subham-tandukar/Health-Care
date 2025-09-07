import React from "react";
import Doctors from "./doctor";
import { base_url } from "@/utils/baseUrl";

async function getDoctors() {
  const res = await fetch(`${base_url}/doctor?status=all`);

  if (!res.ok) {
    throw new Error("Failed to fetch doctors");
  }

  return res.json();
}

async function getDoctorsStats() {
  const res = await fetch(`${base_url}/dashboard-stats`);

  if (!res.ok) {
    throw new Error("Failed to fetch doctors stats");
  }

  return res.json();
}

export default async function DoctorPage() {
  const { data: doctors } = await getDoctors();
  const { data: stats } = await getDoctorsStats();
  return <Doctors doctors={doctors} stats={stats} />;
}
