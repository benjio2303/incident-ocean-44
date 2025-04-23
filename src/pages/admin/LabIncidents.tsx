
import React from "react";
import { useIncidents } from "@/contexts/IncidentContext";
import IncidentList from "@/components/incidents/IncidentList";
import ExportIncidents from "@/components/admin/ExportIncidents";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LabIncidents: React.FC = () => {
  const { incidents } = useIncidents();
  
  // Filter for laboratory incidents
  const labIncidents = incidents.filter(inc => inc.category === "Laboratory");
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Laboratory Incidents</h1>
          <p className="text-muted-foreground">
            View and manage all laboratory incidents in the system.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/lab-incidents/new">
            <Button>Create Lab Incident</Button>
          </Link>
          <ExportIncidents incidents={labIncidents} filename="lab-incidents" />
        </div>
      </div>
      
      <IncidentList 
        incidents={labIncidents} 
        showFilters={true} 
        showTimer={true}
      />
    </div>
  );
};

export default LabIncidents;
