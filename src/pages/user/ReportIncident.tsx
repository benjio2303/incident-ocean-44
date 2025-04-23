
import React from "react";
import IncidentForm from "@/components/incidents/IncidentForm";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";

const ReportIncident: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  // Fixed user property access with type safety
  const reporterName = user?.displayName || user?.email?.split('@')[0] || "Nedeco";
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{t('reportNewIncident')}</h1>
        <p className="text-muted-foreground">
          {t('provideIncidentDetails')}
        </p>
      </div>
      
      <IncidentForm defaultReporterName={reporterName} />
    </div>
  );
};

export default ReportIncident;
