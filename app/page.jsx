import Home from "@/components/home/Home";
import { base_url } from "@/utils/baseUrl";

async function getDoctors() {
  const res = await fetch(`${base_url}/doctor?status=available`);

  if (!res.ok) {
    throw new Error("Failed to fetch doctors");
  }

  return res.json();
}
export default async function HomePage() {
  const { data: doctors } = await getDoctors();
  return <Home doctors={doctors} />;
}
