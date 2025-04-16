
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
  
  // Modified condition to check for Nedeco reporter with type safety
  // Only show for open/in progress incidents and for reporter "Nedeco"
  const isNedeco = user?.email?.toLowerCase().includes("nedeco") || 
                  user?.displayName?.toLowerCase().includes("nedeco") || 
                  incident.reportedBy.toLowerCase().includes("nedeco");
  
  if (incident.status === "Resolved" || !isNedeco) {
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
