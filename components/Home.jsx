"use client";
import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { DoctorCard } from "@/components/DoctorCard";
import { AppointmentBooking } from "@/components/AppointmentBooking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Stethoscope,
  Heart,
  Brain,
  Eye,
  Users,
  Phone,
  Mail,
  LocateIcon,
} from "lucide-react";

// Mock doctor data
const doctors = [
  {
    id: 1,
    name: "Sarah Johnson",
    specialty: "Cardiology",
    rating: 4.9,
    experience: "15 years",
    location: "Downtown Medical Center",
    image: "/placeholder.svg",
    availableToday: true,
  },
  {
    id: 2,
    name: "Michael Chen",
    specialty: "Neurology",
    rating: 4.8,
    experience: "12 years",
    location: "University Hospital",
    image: "/placeholder.svg",
    availableToday: false,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    specialty: "Pediatrics",
    rating: 4.9,
    experience: "8 years",
    location: "Children's Medical Center",
    image: "/placeholder.svg",
    availableToday: true,
  },
  {
    id: 4,
    name: "David Park",
    specialty: "Orthopedics",
    rating: 4.7,
    experience: "20 years",
    location: "Sports Medicine Clinic",
    image: "/placeholder.svg",
    availableToday: true,
  },
];

const specialties = [
  { name: "Cardiology", icon: Heart, count: "25+ doctors" },
  { name: "Neurology", icon: Brain, count: "18+ doctors" },
  { name: "Pediatrics", icon: Users, count: "30+ doctors" },
  { name: "Ophthalmology", icon: Eye, count: "12+ doctors" },
  { name: "General Medicine", icon: Stethoscope, count: "45+ doctors" },
];

const Home = () => {
  const [selectedDoctor, setSelectedDoctor] = useState([]);
  const [showBooking, setShowBooking] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleBookAppointment = (doctorId) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    if (doctor) {
      setSelectedDoctor(doctor);
      setShowBooking(true);
    }
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showBooking) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="outline"
            onClick={() => setShowBooking(false)}
            className="mb-6"
          >
            ← Back to Doctors
          </Button>
          <AppointmentBooking
            selectedDoctor={selectedDoctor}
            onClose={() => setShowBooking(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Specialties Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Medical Specialties
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our wide range of medical specialties and find the
              right doctor for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {specialties.map((specialty) => {
              const IconComponent = specialty.icon;
              return (
                <div
                  key={specialty.name}
                  className="bg-card rounded-lg p-6 text-center hover:shadow-md transition-shadow group"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-card-foreground mb-2">
                    {specialty.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {specialty.count}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section id="booking-section" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Find Your Doctor
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Browse our network of qualified healthcare professionals
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search doctors or specialties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-6 text-lg"
                id="find-doctors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                {...doctor}
                onBookAppointment={handleBookAppointment}
              />
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No doctors found matching your search. Try a different term.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">HealthCare Plus</h3>
              <p className="text-primary-foreground/80 md:w-2/3">
                Connecting patients with quality healthcare providers for better
                health outcomes.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>Find Doctors</li>
                <li>Book Appointment</li>
                <li>Emergency Care</li>
                <li>Health Insurance</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li className="flex gap-2 items-center">
                  <Phone size="1rem" /> (555) 123-4567
                </li>
                <li className="flex gap-2 items-center">
                  <Mail size="1rem" /> info@healthcareplus.com
                </li>
                <li className="flex gap-2 items-center">
                  <LocateIcon size="1rem" /> Kathmandu, Nepal
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/80">
            <p>&copy; 2025 HealthCare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
