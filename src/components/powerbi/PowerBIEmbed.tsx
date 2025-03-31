
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// This is a mock component to simulate Power BI integration
// In a real implementation, you would use the Power BI Embedded JavaScript SDK
const PowerBIEmbed: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Power BI Analytics</CardTitle>
        <CardDescription>
          Real-time incident analytics dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="sla">SLA Metrics</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="rounded-lg border p-4 mt-4 bg-cy-lightBlue/20">
              <h3 className="font-medium mb-2">Power BI Integration</h3>
              <p className="text-sm text-gray-500">
                In a production environment, this section would embed an actual Power BI dashboard
                showing incident overview metrics, category breakdowns, status distributions, and location-based analytics.
              </p>
              <div className="mt-4 bg-white p-4 rounded border text-center">
                <div className="text-3xl font-bold text-cy-blue mb-1">Power BI Dashboard</div>
                <p className="text-sm text-gray-500">
                  Visualizations would appear here in the live implementation
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-gray-100 h-40 rounded flex items-center justify-center">
                    Incident Status Chart
                  </div>
                  <div className="bg-gray-100 h-40 rounded flex items-center justify-center">
                    Category Distribution
                  </div>
                  <div className="bg-gray-100 h-40 rounded flex items-center justify-center">
                    Monthly Trend
                  </div>
                  <div className="bg-gray-100 h-40 rounded flex items-center justify-center">
                    Location Map
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="performance">
            <div className="rounded-lg border p-4 mt-4 bg-cy-lightBlue/20">
              <h3 className="font-medium mb-2">Team Performance Analytics</h3>
              <p className="text-sm text-gray-500">
                This tab would show detailed metrics about team performance, including average resolution times,
                number of incidents handled, and efficiency metrics.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="sla">
            <div className="rounded-lg border p-4 mt-4 bg-cy-lightBlue/20">
              <h3 className="font-medium mb-2">SLA Compliance Metrics</h3>
              <p className="text-sm text-gray-500">
                SLA compliance tracking, showing which incidents were resolved within target timeframes,
                and identifying bottlenecks in the incident management process.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="trends">
            <div className="rounded-lg border p-4 mt-4 bg-cy-lightBlue/20">
              <h3 className="font-medium mb-2">Incident Trends Analysis</h3>
              <p className="text-sm text-gray-500">
                Long-term trend analysis for recurring incidents, seasonal patterns,
                and forecasting for resource planning.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PowerBIEmbed;
