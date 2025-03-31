
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Incident, ResponsibleTeam } from "@/models/incident";

interface TeamPerformanceProps {
  incidents: Incident[];
}

const TeamPerformance: React.FC<TeamPerformanceProps> = ({ incidents }) => {
  // Count incidents and resolutions by team
  const teamStats: Record<ResponsibleTeam, { assigned: number, resolved: number, avgDays?: number }> = {
    "Technicians": { assigned: 0, resolved: 0 },
    "Engineering": { assigned: 0, resolved: 0 },
    "Third Party": { assigned: 0, resolved: 0 },
    "Nedeco": { assigned: 0, resolved: 0 }
  };
  
  // For average resolution time calculation
  const teamResolutionTimes: Record<ResponsibleTeam, number[]> = {
    "Technicians": [],
    "Engineering": [],
    "Third Party": [],
    "Nedeco": []
  };

  incidents.forEach(incident => {
    // Count assignments by looking at team history
    incident.teamHistory.forEach(assignment => {
      if (teamStats[assignment.team]) {
        teamStats[assignment.team].assigned++;
      
        // If this assignment has a resolution date, calculate the time
        if (assignment.resolvedAt) {
          teamStats[assignment.team].resolved++;
          const assignDate = new Date(assignment.assignedAt).getTime();
          const resolveDate = new Date(assignment.resolvedAt).getTime();
          const days = (resolveDate - assignDate) / (1000 * 60 * 60 * 24);
          teamResolutionTimes[assignment.team].push(days);
        }
      }
    });
  });
  
  // Calculate average resolution times
  Object.keys(teamResolutionTimes).forEach(team => {
    const times = teamResolutionTimes[team as ResponsibleTeam];
    if (times.length > 0) {
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      teamStats[team as ResponsibleTeam].avgDays = Math.round(avg * 10) / 10;
    }
  });
  
  // Convert to data for the chart
  const data = Object.entries(teamStats).map(([name, stats]) => ({
    name,
    assigned: stats.assigned,
    resolved: stats.resolved,
    avgDays: stats.avgDays || 0
  }));
  
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Team Performance</CardTitle>
        <CardDescription>Incidents assigned and resolved by team</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === "avgDays") return [`${value} days`, "Avg. Resolution Time"];
                  return [value, name === "assigned" ? "Assigned" : "Resolved"];
                }}
              />
              <Legend />
              <Bar dataKey="assigned" fill="#8884d8" name="Assigned" />
              <Bar dataKey="resolved" fill="#82ca9d" name="Resolved" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamPerformance;
