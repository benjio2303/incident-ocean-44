
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useIncidents } from "@/contexts/IncidentContext";
import IncidentDetails from "@/components/incidents/IncidentDetails";
import CloseIncidentButton from "@/components/incidents/CloseIncidentButton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const UserIncidentDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getIncidentById } = useIncidents();
  const { user } = useAuth();
  
  const incident = id ? getIncidentById(id) : undefined;
  
  if (!incident) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold">Incident Not Found</h2>
        <p className="mt-2 text-muted-foreground">The incident you're looking for doesn't exist.</p>
        <Button className="mt-4" onClick={() => navigate("/user/incidents")}>
          Back to Incidents
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={() => navigate("/user/incidents")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Incidents
        </Button>
        
        {user?.username === "Nedeco" && (
          <CloseIncidentButton 
            incident={incident} 
            onClose={() => navigate("/user/incidents")} 
          />
        )}
      </div>
      
      <IncidentDetails incident={incident} />
    </div>
  );
};

export default UserIncidentDetails;
