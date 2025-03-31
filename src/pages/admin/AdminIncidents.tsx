
import React from "react";
import { useIncidents } from "@/contexts/IncidentContext";
import IncidentList from "@/components/incidents/IncidentList";
import ExportIncidents from "@/components/admin/ExportIncidents";

const AdminIncidents: React.FC = () => {
  const { incidents } = useIncidents();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">All Incidents</h1>
          <p className="text-muted-foreground">
            View and manage all incidents in the system.
          </p>
        </div>
        <ExportIncidents />
      </div>
      
      <IncidentList incidents={incidents} showFilters={true} />
    </div>
  );
};

export default AdminIncidents;
