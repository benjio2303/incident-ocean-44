
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Incident } from "@/models/incident";
import { BarChart4, Clock, CheckCircle2, AlertCircle } from "lucide-react";

interface StatsCardsProps {
  incidents: Incident[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ incidents }) => {
  // Calculate statistics
  const totalIncidents = incidents.length;
  const openIncidents = incidents.filter(inc => inc.status === "Open").length;
  const inProgressIncidents = incidents.filter(inc => inc.status === "In Progress").length;
  const resolvedIncidents = incidents.filter(inc => inc.status === "Resolved").length;
  
  // Calculate average resolution time in days
  const resolvedWithDates = incidents.filter(inc => 
    inc.status === "Resolved" && inc.openedAt && inc.closedAt
  );
  
  let avgResolutionTime = 0;
  if (resolvedWithDates.length > 0) {
    const totalDays = resolvedWithDates.reduce((acc, inc) => {
      const openDate = new Date(inc.openedAt).getTime();
      const closeDate = inc.closedAt ? new Date(inc.closedAt).getTime() : Date.now();
      const diffDays = (closeDate - openDate) / (1000 * 60 * 60 * 24);
      return acc + diffDays;
    }, 0);
    avgResolutionTime = Math.round((totalDays / resolvedWithDates.length) * 10) / 10;
  }
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
          <BarChart4 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalIncidents}</div>
          <p className="text-xs text-muted-foreground">
            All incidents in the system
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Open Incidents</CardTitle>
          <AlertCircle className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{openIncidents}</div>
          <p className="text-xs text-muted-foreground">
            {((openIncidents / totalIncidents) * 100).toFixed(1)}% of total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          <Clock className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inProgressIncidents}</div>
          <p className="text-xs text-muted-foreground">
            {((inProgressIncidents / totalIncidents) * 100).toFixed(1)}% of total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{resolvedIncidents}</div>
          <p className="text-xs text-muted-foreground">
            Avg. {avgResolutionTime} days to resolve
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
