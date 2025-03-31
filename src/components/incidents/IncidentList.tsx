
import React, { useState } from "react";
import { Incident, IncidentStatus, IncidentCategory } from "@/models/incident";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Search, AlertCircle, Calendar, MapPin, User } from "lucide-react";

interface IncidentListProps {
  incidents: Incident[];
  showFilters?: boolean;
  maxItems?: number;
  type?: "compact" | "full";
  role?: "user" | "admin";
}

const statusColor = (status: IncidentStatus) => {
  switch (status) {
    case "Open":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "In Progress":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Resolved":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const categoryIcon = (category: IncidentCategory) => {
  switch (category) {
    case "System":
      return "💻";
    case "Network":
      return "🌐";
    case "Radio":
      return "📡";
    case "Radar":
      return "📊";
    case "Other":
      return "📝";
    default:
      return "❓";
  }
};

const IncidentList: React.FC<IncidentListProps> = ({ 
  incidents, 
  showFilters = false,
  maxItems = Infinity,
  type = "full",
  role = "admin"
}) => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Apply filters
  const filteredIncidents = incidents
    .filter(incident => 
      statusFilter === "all" || incident.status === statusFilter
    )
    .filter(incident => 
      categoryFilter === "all" || incident.category === categoryFilter
    )
    .filter(incident => {
      if (!searchQuery) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        incident.clientTicketNumber.toLowerCase().includes(query) ||
        incident.internalTicketNumber.toLowerCase().includes(query) ||
        incident.description.toLowerCase().includes(query) ||
        incident.reportedBy.toLowerCase().includes(query) ||
        incident.location.toLowerCase().includes(query)
      );
    })
    .slice(0, maxItems);
  
  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="mb-6 space-y-4 bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-medium text-gray-700">Filter Incidents</h3>
          <div className="flex flex-wrap gap-4">
            <div className="w-full md:w-auto min-w-[200px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-auto min-w-[200px]">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="System">System</SelectItem>
                  <SelectItem value="Network">Network</SelectItem>
                  <SelectItem value="Radio">Radio</SelectItem>
                  <SelectItem value="Radar">Radar</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search by ticket #, description, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      )}
      
      {filteredIncidents.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow-sm">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No incidents found</h3>
          <p className="mt-1 text-gray-500">No incidents match your current filters.</p>
          {showFilters && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setStatusFilter("all");
                setCategoryFilter("all");
                setSearchQuery("");
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredIncidents.map((incident) => (
            <Card key={incident.id} className="overflow-hidden hover:shadow transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{categoryIcon(incident.category)}</span>
                          <h3 className="font-medium">
                            <Link to={`/${role}/incidents/${incident.id}`} className="hover:text-cy-blue">
                              {incident.internalTicketNumber}
                            </Link>
                          </h3>
                          <Badge className={`${statusColor(incident.status)}`}>
                            {incident.status}
                          </Badge>
                        </div>
                        
                        <div className="mt-1 text-sm text-gray-500">
                          Client Ticket: {incident.clientTicketNumber}
                        </div>
                      </div>
                      
                      <div className="text-right text-sm text-gray-500 flex flex-col">
                        <span className="flex items-center gap-1 justify-end">
                          <Calendar size={14} />
                          {format(new Date(incident.reportedAt), 'MMM d, yyyy')}
                        </span>
                        
                        {type === "full" && incident.currentTeam && (
                          <span className="text-cy-darkBlue font-medium mt-1">
                            {incident.currentTeam}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="mt-2 text-gray-700 line-clamp-2">{incident.description}</p>
                    
                    {type === "full" && (
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <User size={14} />
                          {incident.reportedBy}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {incident.location}
                        </span>
                        {incident.isRecurring && (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            Recurring
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {type === "full" && (
                    <div className="px-4 py-2 bg-gray-50 flex justify-between">
                      <div className="text-sm text-gray-500">
                        {incident.status === "Resolved" ? (
                          <span>
                            Resolved by {incident.resolvingTeam} on {' '}
                            {incident.closedAt && format(new Date(incident.closedAt), 'MMM d, yyyy')}
                          </span>
                        ) : (
                          <span>
                            Open for {' '}
                            {Math.ceil((Date.now() - new Date(incident.openedAt).getTime()) / (1000 * 60 * 60 * 24))} days
                          </span>
                        )}
                      </div>
                      
                      <Link to={`/${role}/incidents/${incident.id}`} className="text-sm font-medium text-cy-blue hover:underline">
                        View Details
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default IncidentList;
