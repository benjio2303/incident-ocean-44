
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Incident } from "@/models/incident";
import { AlertCircle, Clock } from "lucide-react";

interface SLAStatisticsProps {
  incidents: Incident[];
}

const SLAStatistics: React.FC<SLAStatisticsProps> = ({ incidents }) => {
  // Calculate average resolution time
  const resolvedIncidents = incidents.filter(inc => inc.status === "Resolved" && inc.openedAt && inc.closedAt);
  
  let avgResolutionTime = 0;
  if (resolvedIncidents.length > 0) {
    const totalHours = resolvedIncidents.reduce((acc, inc) => {
      const openDate = new Date(inc.openedAt).getTime();
      const closeDate = inc.closedAt ? new Date(inc.closedAt).getTime() : Date.now();
      const diffHours = (closeDate - openDate) / (1000 * 60 * 60);
      return acc + diffHours;
    }, 0);
    avgResolutionTime = Math.round((totalHours / resolvedIncidents.length) * 10) / 10;
  }
  
  // Calculate SLA breaches
  const calculateSLABreaches = () => {
    return incidents.filter(inc => {
      if (!inc.openedAt) return false;
      
      const openedTime = new Date(inc.openedAt).getTime();
      const resolvedTime = inc.closedAt ? new Date(inc.closedAt).getTime() : Date.now();
      const hoursDifference = (resolvedTime - openedTime) / (1000 * 60 * 60);
      
      return hoursDifference > 4;
    }).length;
  };
  
  const slaBreaches = calculateSLABreaches();
  const slaBreachPercentage = resolvedIncidents.length > 0 
    ? Math.round((slaBreaches / incidents.length) * 100) 
    : 0;
  
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Resolution Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgResolutionTime} hours</div>
          <p className="text-xs text-muted-foreground">
            Based on {resolvedIncidents.length} resolved incidents
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">SLA Breaches</CardTitle>
          <AlertCircle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{slaBreaches}</div>
          <p className="text-xs text-muted-foreground">
            {slaBreachPercentage}% of all incidents exceeded 4-hour SLA
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SLAStatistics;
