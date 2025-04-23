
import React from "react";
import { Button } from "@/components/ui/button";
import { Incident } from "@/models/incident";
import { useToast } from "@/hooks/use-toast";
import { FileDown } from "lucide-react";
import { useTranslation } from "@/contexts/TranslationContext";

interface ExportIncidentsProps {
  incidents: Incident[];
  filename?: string;
}

const ExportIncidents: React.FC<ExportIncidentsProps> = ({ incidents, filename = "incidents" }) => {
  const { toast } = useToast();
  const { t } = useTranslation();

  const exportToExcel = () => {
    // Format incidents data for export
    const exportData = incidents.map(incident => {
      // Format team history as a readable string
      const teamMovement = incident.teamHistory
        .map(th => th.team)
        .join(" → ");
      
      return {
        [t('clientTicketNumber')]: incident.clientTicketNumber,
        [t('internalTicketNumber')]: incident.internalTicketNumber,
        [t('category')]: incident.category,
        [t('description')]: incident.description,
        [t('status')]: incident.status,
        [t('openingDate')]: incident.openedAt ? new Date(incident.openedAt).toLocaleDateString() : "",
        [t('closingDate')]: incident.closedAt ? new Date(incident.closedAt).toLocaleDateString() : "",
        [t('reportedBy')]: incident.reportedBy,
        [t('location')]: incident.location,
        [t('currentTeam')]: incident.currentTeam || "",
        [t('resolvingTeam')]: incident.resolvingTeam || "",
        [t('recurring')]: incident.isRecurring ? t('yes') : t('no'),
        [t('teamMovementHistory')]: teamMovement,
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
    link.setAttribute("download", `${filename}_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: t('exportSuccess'),
      description: t('exportDescription', { count: incidents.length })
    });
  };

  return (
    <Button onClick={exportToExcel} className="flex items-center gap-2">
      <FileDown size={16} />
      {t('exportToExcel')}
    </Button>
  );
};

export default ExportIncidents;
