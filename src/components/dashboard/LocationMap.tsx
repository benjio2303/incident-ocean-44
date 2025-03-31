
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Incident, IncidentLocation } from "@/models/incident";
import { MapPin } from "lucide-react";

interface LocationMapProps {
  incidents: Incident[];
}

interface LocationData {
  name: IncidentLocation;
  count: number;
  resolved: number;
  open: number;
}

const LocationMap: React.FC<LocationMapProps> = ({ incidents }) => {
  // Count incidents by location
  const locationStats: Record<IncidentLocation, LocationData> = {
    "Nicosia HQ": { name: "Nicosia HQ", count: 0, resolved: 0, open: 0 },
    "Larnaca Airport": { name: "Larnaca Airport", count: 0, resolved: 0, open: 0 },
    "Paphos Airport": { name: "Paphos Airport", count: 0, resolved: 0, open: 0 },
    "Limassol Port": { name: "Limassol Port", count: 0, resolved: 0, open: 0 },
    "Remote Site A": { name: "Remote Site A", count: 0, resolved: 0, open: 0 },
    "Remote Site B": { name: "Remote Site B", count: 0, resolved: 0, open: 0 },
    "Other": { name: "Other", count: 0, resolved: 0, open: 0 }
  };
  
  incidents.forEach(incident => {
    locationStats[incident.location].count++;
    
    if (incident.status === "Resolved") {
      locationStats[incident.location].resolved++;
    } else {
      locationStats[incident.location].open++;
    }
  });
  
  // Convert to array and sort by count
  const locationData = Object.values(locationStats)
    .filter(location => location.count > 0)
    .sort((a, b) => b.count - a.count);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Incident Location Heatmap
        </CardTitle>
        <CardDescription>Geographic distribution of incidents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {locationData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No location data available
            </div>
          ) : (
            locationData.map((location) => (
              <div key={location.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{location.name}</span>
                  <span className="text-sm text-gray-500">{location.count} incidents</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full flex"
                    style={{ width: "100%" }}
                  >
                    <div 
                      className="bg-cy-blue h-full"
                      style={{ width: `${(location.open / location.count) * 100}%` }}
                    ></div>
                    <div 
                      className="bg-green-500 h-full"
                      style={{ width: `${(location.resolved / location.count) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{location.open} open</span>
                  <span>{location.resolved} resolved</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationMap;
