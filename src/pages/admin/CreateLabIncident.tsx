
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import LabIncidentForm from "@/components/admin/LabIncidentForm";

const CreateLabIncident: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Default to admin name
  const reporterName = user?.displayName || user?.username || "Admin";
  
  const handleSuccess = () => {
    navigate("/admin/lab-incidents");
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Create Laboratory Incident</h1>
        <p className="text-muted-foreground">
          Report a new laboratory incident for internal tracking
        </p>
      </div>
      
      <LabIncidentForm defaultReporterName={reporterName} onSuccess={handleSuccess} />
    </div>
  );
};

export default CreateLabIncident;
