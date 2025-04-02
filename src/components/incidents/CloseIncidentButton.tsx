
import React from "react";
import { Button } from "@/components/ui/button";
import { useIncidents } from "@/contexts/IncidentContext";
import { useAuth } from "@/contexts/AuthContext";
import { Incident } from "@/models/incident";
import { useToast } from "@/hooks/use-toast";

interface CloseIncidentButtonProps {
  incident: Incident;
  onClose?: () => void;
}

const CloseIncidentButton: React.FC<CloseIncidentButtonProps> = ({ incident, onClose }) => {
  const { resolveIncident } = useIncidents();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handleClose = () => {
    resolveIncident(incident.id);
    toast({
      title: "Incident Closed",
      description: `Incident ${incident.internalTicketNumber} has been marked as resolved.`,
    });
    
    if (onClose) {
      onClose();
    }
  };
  
  // Only show for open/in progress incidents and for Nedeco users
  if (incident.status === "Resolved" || user?.role !== "user" || user?.name !== "Nedeco") {
    return null;
  }
  
  return (
    <Button 
      variant="default" 
      onClick={handleClose}
      className="bg-green-600 hover:bg-green-700"
    >
      Mark as Resolved
    </Button>
  );
};

export default CloseIncidentButton;
