
import React from "react";
import { useIncidents } from "@/contexts/IncidentContext";
import StatsCards from "@/components/dashboard/StatsCards";
import IncidentList from "@/components/incidents/IncidentList";
import CategoryChart from "@/components/dashboard/CategoryChart";
import TeamPerformance from "@/components/dashboard/TeamPerformance";
import LocationMap from "@/components/dashboard/LocationMap";
import ExportIncidents from "@/components/admin/ExportIncidents";
import SLAStatistics from "@/components/dashboard/SLAStatistics";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import IncidentAnalytics from "@/components/admin/IncidentAnalytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminDashboard: React.FC = () => {
  const { incidents } = useIncidents();
  
  // Filter incidents for the dashboard
  const openIncidents = incidents.filter(inc => inc.status !== "Resolved");
  const labIncidents = incidents.filter(inc => inc.category === "Laboratory");
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of all incidents and system performance.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/users">
            <Button variant="outline">Manage Users</Button>
          </Link>
          <ExportIncidents />
        </div>
      </div>
      
      <StatsCards incidents={incidents} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CategoryChart incidents={incidents} />
        <TeamPerformance incidents={incidents} />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">SLA Performance</h2>
        <SLAStatistics incidents={incidents} />
      </div>
      
      <Tabs defaultValue="open" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="open">Open Incidents</TabsTrigger>
          <TabsTrigger value="lab">Laboratory Incidents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="open">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Open Incidents</h2>
                <Link to="/admin/incidents">
                  <Button variant="outline">View All Incidents</Button>
                </Link>
              </div>
              
              <IncidentList 
                incidents={openIncidents} 
                maxItems={5}
                showFilters={false}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="lab">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Laboratory Incidents</h2>
                <Link to="/admin/lab-incidents">
                  <Button variant="outline">View All Lab Incidents</Button>
                </Link>
              </div>
              
              <IncidentList 
                incidents={labIncidents} 
                maxItems={5}
                showFilters={false}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <IncidentAnalytics incidents={incidents} />
    </div>
  );
};

export default AdminDashboard;
