
import React from "react";
import { Button } from "@/components/ui/button";
import { useIncidents } from "@/contexts/IncidentContext";
import { useToast } from "@/hooks/use-toast";
import { FileDown } from "lucide-react";

const ExportIncidents: React.FC = () => {
  const { incidents } = useIncidents();
  const { toast } = useToast();

  const exportToExcel = () => {
    // Format incidents data for export
    const exportData = incidents.map(incident => {
      // Format team history as a readable string
      const teamMovement = incident.teamHistory
        .map(th => th.team)
        .join(" → ");
      
      return {
        "Client Ticket Number": incident.clientTicketNumber,
        "Internal Ticket Number": incident.internalTicketNumber,
        "Category": incident.category,
        "Description": incident.description,
        "Status": incident.status,
        "Opening Date": incident.openedAt ? new Date(incident.openedAt).toLocaleDateString() : "",
        "Closing Date": incident.closedAt ? new Date(incident.closedAt).toLocaleDateString() : "",
        "Reported By": incident.reportedBy,
        "Location": incident.location,
        "Current Team": incident.currentTeam || "",
        "Resolving Team": incident.resolvingTeam || "",
        "Recurring": incident.isRecurring ? "Yes" : "No",
        "Team Movement History": teamMovement,
      };
    });

    // Convert data to CSV
    const headers = Object.keys(exportData[0] || {});
    const csvRows = [
      headers.join(","), // Header row
      ...exportData.map(row => 
        headers.map(field => {
          // Escape quotes and enclose in quotes to handle commas in data
          const value = row[field as keyof typeof row].toString();
          return `"${value.replace(/"/g, '""')}"`;
        }).join(",")
      )
    ];
    
    const csvString = csvRows.join("\n");
    
    // Create a blob and trigger download
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.setAttribute("href", url);
    link.setAttribute("download", `incidents_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: `${incidents.length} incidents exported to CSV file.`,
    });
  };

  return (
    <Button onClick={exportToExcel} className="flex items-center gap-2">
      <FileDown size={16} />
      Export to Excel
    </Button>
  );
};

export default ExportIncidents;
