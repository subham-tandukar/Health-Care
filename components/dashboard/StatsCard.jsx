import { Card, CardContent } from "@/components/ui/card";

export const StatsCard = ({ title, value, color }) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className={`text-sm font-medium text-${color}`}>{title}</p>
            <p className={`text-3xl font-bold text-${color}`}>{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
