
import React from "react";
import { useIncidents } from "@/contexts/IncidentContext";
import StatsCards from "@/components/dashboard/StatsCards";
import IncidentList from "@/components/incidents/IncidentList";
import CategoryChart from "@/components/dashboard/CategoryChart";
import TeamPerformance from "@/components/dashboard/TeamPerformance";
import LocationMap from "@/components/dashboard/LocationMap";
import PowerBIEmbed from "@/components/powerbi/PowerBIEmbed";
import ExportIncidents from "@/components/admin/ExportIncidents";
import SLAStatistics from "@/components/dashboard/SLAStatistics";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const { incidents } = useIncidents();
  
  // Filter incidents for the dashboard
  const openIncidents = incidents.filter(inc => inc.status !== "Resolved");
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of all incidents and system performance.
          </p>
        </div>
        <ExportIncidents />
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
        
        <div className="lg:col-span-1">
          <LocationMap incidents={incidents} />
        </div>
      </div>
      
      <PowerBIEmbed />
    </div>
  );
};

export default AdminDashboard;
