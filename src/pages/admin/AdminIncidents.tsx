
import React from "react";
import { useIncidents } from "@/contexts/IncidentContext";
import IncidentList from "@/components/incidents/IncidentList";
import ExportIncidents from "@/components/admin/ExportIncidents";
import { useTranslation } from "@/contexts/TranslationContext";

const AdminIncidents: React.FC = () => {
  const { incidents } = useIncidents();
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('allIncidents')}</h1>
          <p className="text-muted-foreground">
            {t('manageAllIncidents')}
          </p>
        </div>
        <ExportIncidents 
          incidents={incidents}
          filename="incidents" 
        />
      </div>
      
      <IncidentList incidents={incidents} showFilters={true} />
    </div>
  );
};

export default AdminIncidents;
