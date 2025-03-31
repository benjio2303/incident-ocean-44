
import React from "react";
import { useIncidents } from "@/contexts/IncidentContext";
import StatsCards from "@/components/dashboard/StatsCards";
import IncidentList from "@/components/incidents/IncidentList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserDashboard: React.FC = () => {
  const { incidents } = useIncidents();
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage your reported incidents.
          </p>
        </div>
        <Button onClick={() => navigate("/user/report-incident")} className="flex items-center gap-2">
          <Plus size={16} />
          <span>Report Incident</span>
        </Button>
      </div>
      
      <StatsCards incidents={incidents} />
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recent Incidents</h2>
          <Button variant="outline" onClick={() => navigate("/user/incidents")}>
            View All
          </Button>
        </div>
        
        <IncidentList 
          incidents={incidents.slice(0, 5)} 
          showFilters={false}
          role="user"
        />
      </div>
    </div>
  );
};

export default UserDashboard;
