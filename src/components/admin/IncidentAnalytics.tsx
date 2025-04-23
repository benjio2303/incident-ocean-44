
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Incident } from "@/models/incident";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays, subMonths, subYears, isAfter } from "date-fns";

interface IncidentAnalyticsProps {
  incidents: Incident[];
}

const IncidentAnalytics: React.FC<IncidentAnalyticsProps> = ({ incidents }) => {
  const [timeRange, setTimeRange] = useState<string>("week");
  
  // Filter incidents based on time range
  const getFilteredIncidents = () => {
    const now = new Date();
    let cutoffDate;
    
    switch(timeRange) {
      case "week":
        cutoffDate = subDays(now, 7);
        break;
      case "month":
        cutoffDate = subMonths(now, 1);
        break;
      case "quarter":
        cutoffDate = subMonths(now, 3);
        break;
      case "halfyear":
        cutoffDate = subMonths(now, 6);
        break;
      case "year":
        cutoffDate = subYears(now, 1);
        break;
      case "all":
      default:
        cutoffDate = new Date(0); // Beginning of time
        break;
    }
    
    return incidents.filter(inc => isAfter(new Date(inc.reportedAt), cutoffDate));
  };
  
  // Process data for category chart
  const getCategoryData = () => {
    const filteredIncidents = getFilteredIncidents();
    const categoryCounts: Record<string, number> = {};
    
    filteredIncidents.forEach(incident => {
      const category = incident.category;
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    return Object.keys(categoryCounts).map(key => ({
      name: key,
      count: categoryCounts[key]
    }));
  };
  
  // Process data for status chart
  const getStatusData = () => {
    const filteredIncidents = getFilteredIncidents();
    const statusCounts = {
      "Open": 0,
      "In Progress": 0,
      "Resolved": 0
    };
    
    filteredIncidents.forEach(incident => {
      const status = incident.status;
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    return Object.keys(statusCounts).map(key => ({
      name: key,
      count: statusCounts[key]
    }));
  };
  
  // Process data for team performance
  const getTeamData = () => {
    const filteredIncidents = getFilteredIncidents();
    const teamCounts: Record<string, number> = {};
    
    filteredIncidents.forEach(incident => {
      if (incident.currentTeam) {
        const team = incident.currentTeam;
        teamCounts[team] = (teamCounts[team] || 0) + 1;
      }
    });
    
    return Object.keys(teamCounts).map(key => ({
      name: key,
      count: teamCounts[key]
    }));
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Incident Analytics Dashboard</CardTitle>
        <CardDescription>
          Comprehensive analysis of incident data
        </CardDescription>
        <div className="mt-4">
          <Tabs defaultValue="week" onValueChange={setTimeRange} value={timeRange}>
            <TabsList className="grid grid-cols-6">
              <TabsTrigger value="week">Weekly</TabsTrigger>
              <TabsTrigger value="month">Monthly</TabsTrigger>
              <TabsTrigger value="quarter">3 Months</TabsTrigger>
              <TabsTrigger value="halfyear">6 Months</TabsTrigger>
              <TabsTrigger value="year">Yearly</TabsTrigger>
              <TabsTrigger value="all">All Time</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Categories</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="teams">Team Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="rounded-lg border p-4 mt-4">
              <h3 className="font-medium mb-2">Incident Categories</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getCategoryData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#3a86ff" name="Incidents" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="status">
            <div className="rounded-lg border p-4 mt-4">
              <h3 className="font-medium mb-2">Incident Status</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getStatusData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#4cc9f0" name="Incidents" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="teams">
            <div className="rounded-lg border p-4 mt-4">
              <h3 className="font-medium mb-2">Team Performance</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getTeamData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8338ec" name="Incidents" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default IncidentAnalytics;
