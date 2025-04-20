
import React, { useState, useRef } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Incident, IncidentStatus, ResponsibleTeam, FileAttachment } from "@/models/incident";
import { format } from "date-fns";
import { 
  Calendar, 
  User, 
  MapPin, 
  AlarmClock, 
  CheckCircle2, 
  RefreshCw, 
  AlertCircle, 
  ClipboardCheck,
  Paperclip,
  FileImage,
  File,
  X
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
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

interface IncidentDetailsProps {
  incident: Incident;
}

const statusColors: Record<IncidentStatus, string> = {
  "Open": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "In Progress": "bg-blue-100 text-blue-800 border-blue-200",
  "Resolved": "bg-green-100 text-green-800 border-green-200"
};

const IncidentDetails: React.FC<IncidentDetailsProps> = ({ incident }) => {
  const { role, user } = useAuth();
  const { updateIncidentStatus, assignTeam, resolveIncident } = useIncidents();
  const { toast } = useToast();
  const [selectedTeam, setSelectedTeam] = useState<ResponsibleTeam | "">("");
  const [teamNotes, setTeamNotes] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isAdmin = role === "admin";
  
  const handleStatusChange = (status: string) => {
    updateIncidentStatus(incident.id, status as IncidentStatus);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
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
    
    const fileAttachments: FileAttachment[] = selectedFiles.map(file => ({
      id: uuidv4(),
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadedAt: new Date(),
      uploadedBy: user?.username || "Admin" // Changed from user?.name to user?.username
    }));
    
    assignTeam(incident.id, selectedTeam, teamNotes, fileAttachments);
    setSelectedTeam("");
    setTeamNotes("");
    setSelectedFiles([]);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <FileImage className="h-5 w-5 text-blue-500" />;
    }
    return <File className="h-5 w-5 text-gray-500" />;
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
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Paperclip className="h-4 w-4" />
                          <span className="text-sm font-medium">Attachments</span>
                        </div>
                        
                        <div>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            multiple
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full border-dashed border-2 py-6"
                          >
                            <Paperclip className="mr-2 h-4 w-4" />
                            Click to add files or images
                          </Button>
                        </div>
                        
                        {selectedFiles.length > 0 && (
                          <div className="space-y-2 mt-2">
                            <div className="text-sm font-medium">Selected files:</div>
                            <div className="border rounded divide-y">
                              {selectedFiles.map((file, index) => (
                                <div key={index} className="py-2 px-3 flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    {getFileIcon(file.type)}
                                    <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFile(index)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
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
                  <div className="space-y-6 relative">
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
                        
                        {assignment.attachments && assignment.attachments.length > 0 && (
                          <div className="mt-2">
                            <div className="flex items-center gap-1 mb-1">
                              <Paperclip className="h-3 w-3 text-gray-500" />
                              <span className="text-sm text-gray-500">
                                {assignment.attachments.length} {assignment.attachments.length === 1 ? 'attachment' : 'attachments'}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {assignment.attachments.map((file, fileIndex) => (
                                <Dialog key={fileIndex}>
                                  <DialogTrigger asChild>
                                    <button className="border rounded p-1 hover:bg-gray-50">
                                      {file.type.startsWith('image/') ? (
                                        <div className="w-12 h-12 relative">
                                          <img 
                                            src={file.url} 
                                            alt={file.name}
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                      ) : (
                                        <div className="w-12 h-12 flex items-center justify-center bg-gray-100">
                                          <File className="h-6 w-6 text-gray-500" />
                                        </div>
                                      )}
                                    </button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-[90vw] sm:max-w-[600px] max-h-[90vh] overflow-auto">
                                    <DialogHeader>
                                      <DialogTitle className="flex items-center gap-2">
                                        {getFileIcon(file.type)}
                                        <span className="truncate">{file.name}</span>
                                      </DialogTitle>
                                      <DialogDescription>
                                        Uploaded {format(new Date(file.uploadedAt), "PPP p")} by {file.uploadedBy}
                                      </DialogDescription>
                                    </DialogHeader>
                                    {file.type.startsWith('image/') ? (
                                      <div className="flex justify-center my-4">
                                        <img
                                          src={file.url}
                                          alt={file.name}
                                          className="max-w-full max-h-[70vh] object-contain"
                                        />
                                      </div>
                                    ) : (
                                      <div className="flex flex-col items-center justify-center py-10">
                                        <File className="h-16 w-16 text-gray-400 mb-4" />
                                        <p className="text-center text-gray-600">
                                          Preview not available for this file type
                                        </p>
                                      </div>
                                    )}
                                    <DialogFooter>
                                      <a
                                        href={file.url}
                                        download={file.name}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <Button>
                                          Download File
                                        </Button>
                                      </a>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              ))}
                            </div>
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
