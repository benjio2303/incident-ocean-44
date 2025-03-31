
import React from "react";
import IncidentForm from "@/components/incidents/IncidentForm";

const ReportIncident: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Report a New Incident</h1>
        <p className="text-muted-foreground">
          Please provide all the necessary details about the incident
        </p>
      </div>
      
      <IncidentForm defaultReporter="John Doe" />
    </div>
  );
};

export default ReportIncident;
