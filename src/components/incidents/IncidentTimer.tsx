
import React, { useState, useEffect } from "react";
import { formatDuration, intervalToDuration } from "date-fns";
import { Incident } from "@/models/incident";

interface IncidentTimerProps {
  incident: Incident;
}

const IncidentTimer: React.FC<IncidentTimerProps> = ({ incident }) => {
  const [duration, setDuration] = useState<string>("");

  useEffect(() => {
    // Function to format the duration
    const calculateDuration = () => {
      const startDate = new Date(incident.openedAt);
      const endDate = incident.closedAt ? new Date(incident.closedAt) : new Date();
      
      const durationObj = intervalToDuration({
        start: startDate,
        end: endDate
      });
      
      const formatted = formatDuration(durationObj, {
        format: ['days', 'hours', 'minutes'],
        delimiter: ', '
      });
      
      setDuration(formatted || "0 minutes");
    };

    // Calculate initial duration
    calculateDuration();
    
    // Update the duration every minute if the incident is still open
    const intervalId = !incident.closedAt ? 
      setInterval(calculateDuration, 60000) : undefined;
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [incident]);

  // Determine color based on duration
  const getTimerColor = () => {
    if (incident.status === "Resolved") return "text-green-500";
    
    const startDate = new Date(incident.openedAt);
    const now = new Date();
    const hoursOpen = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    
    if (hoursOpen >= 24) return "text-red-500";
    if (hoursOpen >= 4) return "text-amber-500";
    return "text-green-500";
  };

  return (
    <div className={`font-medium ${getTimerColor()}`}>
      {incident.status === "Resolved" ? "Resolved in: " : "Open for: "} 
      {duration}
    </div>
  );
};

export default IncidentTimer;
