
import React from "react";
import IncidentForm from "@/components/incidents/IncidentForm";
import { useAuth } from "@/contexts/AuthContext";

const ReportIncident: React.FC = () => {
  const { user } = useAuth();
  
  // Fixed user property access with type safety
  const reporterName = user?.displayName || user?.email?.split('@')[0] || "Nedeco";
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Report a New Incident</h1>
        <p className="text-muted-foreground">
          Please provide all the necessary details about the incident
        </p>
      </div>
      
      <IncidentForm defaultReporterName={reporterName} />
    </div>
  );
};

export default ReportIncident;
