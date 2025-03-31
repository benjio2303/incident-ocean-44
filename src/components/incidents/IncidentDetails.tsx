
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Incident, IncidentStatus, ResponsibleTeam } from "@/models/incident";
import { format } from "date-fns";
import { 
  Calendar, 
  User, 
  MapPin, 
  AlarmClock, 
  CheckCircle2, 
  RefreshCw, 
  AlertCircle, 
  ClipboardCheck
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useIncidents } from "@/contexts/IncidentContext";
import { useToast } from "@/hooks/use-toast";

interface IncidentDetailsProps {
  incident: Incident;
}

const statusColors: Record<IncidentStatus, string> = {
  "Open": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "In Progress": "bg-blue-100 text-blue-800 border-blue-200",
  "Resolved": "bg-green-100 text-green-800 border-green-200"
};

const IncidentDetails: React.FC<IncidentDetailsProps> = ({ incident }) => {
  const { role } = useAuth();
  const { updateIncidentStatus, assignTeam, resolveIncident } = useIncidents();
  const { toast } = useToast();
  const [selectedTeam, setSelectedTeam] = React.useState<ResponsibleTeam | "">("");
  const [teamNotes, setTeamNotes] = React.useState("");
  
  const isAdmin = role === "admin";
  
  const handleStatusChange = (status: string) => {
    updateIncidentStatus(incident.id, status as IncidentStatus);
  };
  
  const handleAssignTeam = () => {
    if (!selectedTeam) {
      toast({
        title: "Error",
        description: "Please select a team to assign",
        variant: "destructive"
      });
      return;
    }
    
    assignTeam(incident.id, selectedTeam, teamNotes);
    setSelectedTeam("");
    setTeamNotes("");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    {incident.internalTicketNumber}
                    <Badge className={statusColors[incident.status]}>
                      {incident.status}
                    </Badge>
                    {incident.isRecurring && (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Recurring
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Client Ticket: {incident.clientTicketNumber}
                  </CardDescription>
                </div>
                
                {isAdmin && incident.status !== "Resolved" && (
                  <Button 
                    onClick={() => resolveIncident(incident.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="mr-2" size={16} />
                    Mark as Resolved
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1">{incident.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Category</h3>
                    <p className="mt-1 flex items-center gap-2">
                      <AlertCircle size={16} className="text-cy-blue" />
                      {incident.category}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Current Team</h3>
                    <p className="mt-1 flex items-center gap-2">
                      <ClipboardCheck size={16} className="text-cy-blue" />
                      {incident.currentTeam || "Unassigned"}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    <p className="mt-1 flex items-center gap-2">
                      <MapPin size={16} className="text-cy-blue" />
                      {incident.location}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Reported By</h3>
                    <p className="mt-1 flex items-center gap-2">
                      <User size={16} className="text-cy-blue" />
                      {incident.reportedBy}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Reported Date</h3>
                    <p className="mt-1 flex items-center gap-2">
                      <Calendar size={16} className="text-cy-blue" />
                      {format(new Date(incident.reportedAt), "PPP")}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Open Since</h3>
                    <p className="mt-1 flex items-center gap-2">
                      <AlarmClock size={16} className="text-cy-blue" />
                      {format(new Date(incident.openedAt), "PPP")}
                      {" "} 
                      ({Math.ceil((Date.now() - new Date(incident.openedAt).getTime()) / (1000 * 60 * 60 * 24))} days)
                    </p>
                  </div>
                  
                  {incident.closedAt && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Resolved Date</h3>
                      <p className="mt-1 flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-600" />
                        {format(new Date(incident.closedAt), "PPP")}
                      </p>
                    </div>
                  )}
                  
                  {incident.resolvingTeam && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Resolved By</h3>
                      <p className="mt-1 flex items-center gap-2">
                        <ClipboardCheck size={16} className="text-green-600" />
                        {incident.resolvingTeam}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {isAdmin && incident.status !== "Resolved" && (
            <Card>
              <CardHeader>
                <CardTitle>Update Incident</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select 
                      value={incident.status}
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Assign to Team</h3>
                    <div className="flex flex-col gap-4">
                      <Select 
                        value={selectedTeam}
                        onValueChange={val => setSelectedTeam(val as ResponsibleTeam)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select team" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Technicians">Technicians</SelectItem>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Third Party">Third Party</SelectItem>
                          <SelectItem value="Nedeco">Nedeco</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Textarea
                        placeholder="Notes about this assignment"
                        value={teamNotes}
                        onChange={e => setTeamNotes(e.target.value)}
                      />
                      
                      <Button onClick={handleAssignTeam}>
                        Assign Team
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw size={18} />
                Team History
              </CardTitle>
              <CardDescription>
                Track incident movement between teams
              </CardDescription>
            </CardHeader>
            <CardContent>
              {incident.teamHistory.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  No team assignments yet
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                  <div className="space-y-4 relative">
                    {incident.teamHistory.map((assignment, index) => (
                      <div key={index} className="relative pl-9">
                        <div className="absolute left-0 top-2 w-8 h-8 rounded-full bg-white border-2 border-cy-blue flex items-center justify-center text-sm text-cy-blue">
                          {index + 1}
                        </div>
                        
                        <div className="mb-1 font-medium">{assignment.team}</div>
                        
                        <div className="text-sm text-gray-500 mb-1">
                          Assigned: {format(new Date(assignment.assignedAt), "PPP p")}
                        </div>
                        
                        {assignment.resolvedAt && (
                          <div className="text-sm text-green-600">
                            Resolved: {format(new Date(assignment.resolvedAt), "PPP p")}
                          </div>
                        )}
                        
                        {assignment.notes && (
                          <div className="mt-2 text-sm bg-gray-50 p-2 rounded-md border border-gray-100">
                            {assignment.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetails;
