"use client";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users } from "lucide-react";
import heroImage from "@/public/assets/images/hero-img.png";
import Image from "next/image";

export const HeroSection = () => {
  const scrollToBooking = () => {
    const bookingSection = document.getElementById("booking-section");
    bookingSection?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToFindDoctors = () => {
    scrollToBooking();
    const findDoctorsInput = document.getElementById("find-doctors");
    setTimeout(() => {
      findDoctorsInput.focus();
    }, 400);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={"/assets/images/hero-img.png"}
          alt="Medical professionals providing healthcare"
          className="w-full h-full object-cover opacity-20"
          width={1920}
          height={1280}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-primary/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
            Your Health,
            <span className="block text-primary">Our Priority</span>
          </h1>

          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            Book appointments with top-rated doctors in your area. Quality
            healthcare is just a click away.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={scrollToBooking}
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-accent/90 font-semibold px-8 py-6 text-lg shadow-lg cursor-pointer"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Appointment
            </Button>

            <Button
              onClick={scrollToFindDoctors}
              variant="outline"
              size="lg"
              className="border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary font-semibold px-8 py-6 text-lg cursor-pointer"
            >
              <Users className="w-5 h-5 mr-2" />
              Find Doctors
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-foreground mb-2">
                500+
              </div>
              <div className="text-primary-foreground/80">
                Qualified Doctors
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-foreground mb-2">
                24/7
              </div>
              <div className="text-primary-foreground/80">Emergency Care</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-foreground mb-2">
                10k+
              </div>
              <div className="text-primary-foreground/80">Happy Patients</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
