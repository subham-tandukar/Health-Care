"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Mail } from "lucide-react";
import { formatExperience } from "@/utils/formatter";

export const DoctorCard = ({
  id,
  name,
  specialization,
  experience,
  email,
  status,
  onBookAppointment,
}) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-gradient-to-br from-card to-card/50">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full uppercase object-cover bg-primary/10 text-primary text-2xl flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
              {name.split("")[0]}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors">
                  Dr. {name}
                </h3>
                <p className="text-muted-foreground font-medium capitalize">
                  {specialization}
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{formatExperience(experience)} experience</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{email}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {status && (
                  <Badge
                    variant="secondary"
                    className="bg-success/10 text-success border-success/20"
                  >
                    Available
                  </Badge>
                )}
              </div>

              <Button
                onClick={() => onBookAppointment(id)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
