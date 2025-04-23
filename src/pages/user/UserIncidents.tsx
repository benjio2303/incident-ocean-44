
import React from "react";
import { useIncidents } from "@/contexts/IncidentContext";
import IncidentList from "@/components/incidents/IncidentList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/contexts/TranslationContext";

const UserIncidents: React.FC = () => {
  const { incidents } = useIncidents();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('myIncidents')}</h1>
          <p className="text-muted-foreground">
            {t('viewIncidents')}
          </p>
        </div>
        <Button onClick={() => navigate("/user/report-incident")} className="flex items-center gap-2">
          <Plus size={16} />
          <span>{t('reportIncident')}</span>
        </Button>
      </div>
      
      <IncidentList 
        incidents={incidents} 
        showFilters={true}
        role="user"
      />
    </div>
  );
};

export default UserIncidents;
