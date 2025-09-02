"use client"
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock } from "lucide-react";

export const DoctorCard = ({
  id,
  name,
  specialty,
  rating,
  experience,
  location,
  image,
  availableToday,
  onBookAppointment,
}) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-gradient-to-br from-card to-card/50">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={image}
              alt={`Dr. ${name}`}
              className="w-20 h-20 rounded-full object-cover border-4 border-primary/20"
            />
            {availableToday && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-card flex items-center justify-center">
                <div className="w-2 h-2 bg-success-foreground rounded-full"></div>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors">
                  Dr. {name}
                </h3>
                <p className="text-muted-foreground font-medium">{specialty}</p>
              </div>

              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-sm">{rating}</span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{experience} experience</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {availableToday && (
                  <Badge
                    variant="secondary"
                    className="bg-success-light text-success-foreground"
                  >
                    Available Today
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
