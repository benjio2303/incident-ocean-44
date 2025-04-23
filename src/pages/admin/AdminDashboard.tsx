
import React from "react";
import { useIncidents } from "@/contexts/IncidentContext";
import StatsCards from "@/components/dashboard/StatsCards";
import IncidentList from "@/components/incidents/IncidentList";
import CategoryChart from "@/components/dashboard/CategoryChart";
import TeamPerformance from "@/components/dashboard/TeamPerformance";
import LocationMap from "@/components/dashboard/LocationMap";
import ExportIncidents from "@/components/admin/ExportIncidents";
import SLAStatistics from "@/components/dashboard/SLAStatistics";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import IncidentAnalytics from "@/components/admin/IncidentAnalytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/contexts/TranslationContext";

const AdminDashboard: React.FC = () => {
  const { incidents } = useIncidents();
  const { t } = useTranslation();
  
  // Filter incidents for the dashboard
  const openIncidents = incidents.filter(inc => inc.status !== "Resolved");
  const labIncidents = incidents.filter(inc => inc.category === "Laboratory");
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('dashboard')}</h1>
          <p className="text-muted-foreground">
            {t('overviewOfAllIncidents') || "Overview of all incidents and system performance."}
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/lab-incidents/new">
            <Button>{t('createLabIncident')}</Button>
          </Link>
          <Link to="/admin/users">
            <Button variant="outline">{t('manageUsers')}</Button>
          </Link>
          <ExportIncidents incidents={incidents} />
        </div>
      </div>
      
      <StatsCards incidents={incidents} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CategoryChart incidents={incidents} />
        <TeamPerformance incidents={incidents} />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t('slaPerformance') || "SLA Performance"}</h2>
        <SLAStatistics incidents={incidents} />
      </div>
      
      <Tabs defaultValue="open" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="open">{t('openIncidents') || "Open Incidents"}</TabsTrigger>
          <TabsTrigger value="lab">{t('labIncidents')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="open">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{t('openIncidents') || "Open Incidents"}</h2>
                <Link to="/admin/incidents">
                  <Button variant="outline">{t('viewAll') || "View All Incidents"}</Button>
                </Link>
              </div>
              
              <IncidentList 
                incidents={openIncidents} 
                maxItems={5}
                showFilters={false}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="lab">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{t('labIncidents')}</h2>
                <Link to="/admin/lab-incidents">
                  <Button variant="outline">{t('viewAll') || "View All Lab Incidents"}</Button>
                </Link>
              </div>
              
              <IncidentList 
                incidents={labIncidents} 
                maxItems={5}
                showFilters={false}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <IncidentAnalytics incidents={incidents} />
    </div>
  );
};

export default AdminDashboard;
