
import React from "react";
import { useIncidents } from "@/contexts/IncidentContext";
import IncidentList from "@/components/incidents/IncidentList";
import ExportIncidents from "@/components/admin/ExportIncidents";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "@/contexts/TranslationContext";

const LabIncidents: React.FC = () => {
  const { incidents } = useIncidents();
  const { t } = useTranslation();
  
  // Filter for laboratory incidents
  const labIncidents = incidents.filter(inc => inc.category === "IT");
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('labIncidents')}</h1>
          <p className="text-muted-foreground">
            {t('labIncidents')}
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/lab-incidents/new">
            <Button>{t('createLabIncident')}</Button>
          </Link>
          <ExportIncidents 
            incidents={labIncidents}
            filename="lab-incidents" 
          />
        </div>
      </div>
      
      <IncidentList 
        incidents={labIncidents} 
        showFilters={true}
      />
    </div>
  );
};

export default LabIncidents;
