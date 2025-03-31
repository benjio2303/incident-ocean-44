
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useIncidents } from "@/contexts/IncidentContext";
import IncidentDetails from "@/components/incidents/IncidentDetails";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const UserIncidentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getIncidentById } = useIncidents();
  const navigate = useNavigate();
  
  const incident = id ? getIncidentById(id) : undefined;
  
  if (!incident) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Incident Not Found</h2>
        <p className="text-gray-500 mb-4">The incident you are looking for does not exist or has been removed.</p>
        <Button onClick={() => navigate("/user/incidents")}>
          Back to Incidents
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Button 
        variant="outline" 
        className="flex items-center gap-2" 
        onClick={() => navigate("/user/incidents")}
      >
        <ChevronLeft size={16} />
        Back to Incidents
      </Button>
      
      <h1 className="text-2xl font-bold tracking-tight">
        Incident Details
      </h1>
      
      <IncidentDetails incident={incident} />
    </div>
  );
};

export default UserIncidentDetails;
