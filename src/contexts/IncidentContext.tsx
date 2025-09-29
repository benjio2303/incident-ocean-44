import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { Incident, IncidentFormData, IncidentCategory, IncidentStatus, ResponsibleTeam, IncidentLocation, FileAttachment } from "@/models/incident";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

const generateTicketNumber = (): string => {
  const timestamp = new Date().getTime().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `CY-${timestamp}-${random}`;
};

const mockIncidents: Incident[] = [
  {
    id: "1",
    clientTicketNumber: "CLIENT-001",
    internalTicketNumber: "CY-123456-001",
    category: "IT",
    description: "Server not responding to requests",
    isRecurring: false,
    reportedBy: "John Doe",
    location: "Nicosia HQ",
    reportedAt: new Date(Date.now() - 86400000 * 5),
    openedAt: new Date(Date.now() - 86400000 * 5),
    status: "In Progress",
    teamHistory: [
      {
        team: "Technicians",
        assignedAt: new Date(Date.now() - 86400000 * 5),
        notes: "Initial assignment",
      },
      {
        team: "Engineering",
        assignedAt: new Date(Date.now() - 86400000 * 3),
        notes: "Escalated to engineering for software issue",
      }
    ],
    currentTeam: "Engineering",
  },
  {
    id: "2",
    clientTicketNumber: "CLIENT-002",
    internalTicketNumber: "CY-123456-002",
    category: "Network",
    description: "Network latency in east wing",
    isRecurring: true,
    reportedBy: "Jane Smith",
    location: "Larnaca Airport",
    reportedAt: new Date(Date.now() - 86400000 * 10),
    openedAt: new Date(Date.now() - 86400000 * 10),
    closedAt: new Date(Date.now() - 86400000 * 2),
    status: "Resolved",
    teamHistory: [
      {
        team: "Technicians",
        assignedAt: new Date(Date.now() - 86400000 * 10),
        notes: "Initial troubleshooting",
      },
      {
        team: "Third Party",
        assignedAt: new Date(Date.now() - 86400000 * 8),
        notes: "Referred to ISP",
      },
      {
        team: "Technicians",
        assignedAt: new Date(Date.now() - 86400000 * 4),
        notes: "Confirmation of fix",
        resolvedAt: new Date(Date.now() - 86400000 * 2),
      }
    ],
    currentTeam: "Technicians",
    resolvingTeam: "Technicians",
  },
  {
    id: "3",
    clientTicketNumber: "CLIENT-003",
    internalTicketNumber: "CY-123456-003",
    category: "Radar",
    description: "Calibration issues with radar station 2",
    isRecurring: false,
    reportedBy: "Mike Johnson",
    location: "Remote Site A",
    reportedAt: new Date(Date.now() - 86400000 * 2),
    openedAt: new Date(Date.now() - 86400000 * 2),
    status: "Open",
    teamHistory: [
      {
        team: "Engineering",
        assignedAt: new Date(Date.now() - 86400000 * 2),
        notes: "Awaiting specialist",
      }
    ],
    currentTeam: "Engineering",
  },
  {
    id: "4",
    clientTicketNumber: "CLIENT-004",
    internalTicketNumber: "CY-123456-004",
    category: "Radio",
    description: "Interference on emergency channel",
    isRecurring: true,
    reportedBy: "Sarah Palmer",
    location: "Paphos Airport",
    reportedAt: new Date(Date.now() - 86400000 * 15),
    openedAt: new Date(Date.now() - 86400000 * 15),
    closedAt: new Date(Date.now() - 86400000 * 12),
    status: "Resolved",
    teamHistory: [
      {
        team: "Technicians",
        assignedAt: new Date(Date.now() - 86400000 * 15),
        notes: "Initial diagnosis",
      },
      {
        team: "Nedeco",
        assignedAt: new Date(Date.now() - 86400000 * 14),
        resolvedAt: new Date(Date.now() - 86400000 * 12),
        notes: "Specialist equipment repair",
      }
    ],
    currentTeam: "Nedeco",
    resolvingTeam: "Nedeco",
  },
  {
    id: "5",
    clientTicketNumber: "CLIENT-005",
    internalTicketNumber: "CY-123456-005",
    category: "IT",
    description: "Database connection timeout",
    isRecurring: false,
    reportedBy: "Alex Wong",
    location: "Nicosia HQ",
    reportedAt: new Date(Date.now() - 86400000),
    openedAt: new Date(Date.now() - 86400000),
    status: "In Progress",
    teamHistory: [
      {
        team: "Technicians",
        assignedAt: new Date(Date.now() - 86400000),
        notes: "Initial troubleshooting",
      },
      {
        team: "Engineering",
        assignedAt: new Date(Date.now() - 43200000),
        notes: "Escalated to DB team",
      }
    ],
    currentTeam: "Engineering",
  }
];

interface IncidentContextType {
  incidents: Incident[];
  addIncident: (data: IncidentFormData) => Incident;
  updateIncidentStatus: (id: string, status: IncidentStatus) => void;
  assignTeam: (id: string, team: ResponsibleTeam, notes?: string, attachments?: FileAttachment[]) => void;
  resolveIncident: (id: string) => void;
  getIncidentById: (id: string) => Incident | undefined;
  getUserIncidents: (username: string) => Incident[];
  addAttachmentToAssignment: (incidentId: string, teamAssignmentIndex: number, attachment: FileAttachment) => void;
}

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

export const IncidentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedIncidents = localStorage.getItem("incidents");
    if (storedIncidents) {
      try {
        const parsedIncidents = JSON.parse(storedIncidents, (key, value) => {
          const dateProperties = ["reportedAt", "openedAt", "closedAt", "assignedAt", "resolvedAt"];
          if (dateProperties.includes(key) && value) {
            return new Date(value);
          }
          return value;
        });
        setIncidents(parsedIncidents.length > 0 ? parsedIncidents : mockIncidents);
      } catch (error) {
        console.error("Error parsing incidents from localStorage:", error);
        setIncidents(mockIncidents);
        localStorage.setItem("incidents", JSON.stringify(mockIncidents));
      }
    } else {
      setIncidents(mockIncidents);
      localStorage.setItem("incidents", JSON.stringify(mockIncidents));
    }
  }, []);

  useEffect(() => {
    if (incidents.length > 0) {
      localStorage.setItem("incidents", JSON.stringify(incidents));
    }
  }, [incidents]);

  const addIncident = (data: IncidentFormData): Incident => {
    const newIncident: Incident = {
      id: uuidv4(),
      clientTicketNumber: data.clientTicketNumber,
      internalTicketNumber: generateTicketNumber(),
      category: data.category,
      description: data.description,
      isRecurring: data.isRecurring,
      reportedBy: data.reportedBy,
      location: data.location,
      reportedAt: new Date(data.reportedAt),
      openedAt: new Date(),
      status: "Open",
      teamHistory: [],
      currentTeam: undefined,
    };

    setIncidents(prev => [...prev, newIncident]);
    
    toast({
      title: "Incident Reported",
      description: `Incident has been created with ticket number ${newIncident.internalTicketNumber}.`,
    });
    
    return newIncident;
  };

  const updateIncidentStatus = (id: string, status: IncidentStatus) => {
    setIncidents(prev => 
      prev.map(incident => {
        if (incident.id === id) {
          const updatedIncident = { ...incident, status };
          
          if (status === "Resolved" && !incident.closedAt) {
            updatedIncident.closedAt = new Date();
            updatedIncident.resolvingTeam = incident.currentTeam;
            
            if (updatedIncident.teamHistory.length > 0) {
              const lastTeamIndex = updatedIncident.teamHistory.length - 1;
              updatedIncident.teamHistory[lastTeamIndex] = {
                ...updatedIncident.teamHistory[lastTeamIndex],
                resolvedAt: new Date()
              };
            }
          }
          
          return updatedIncident;
        }
        return incident;
      })
    );
    
    toast({
      title: "Status Updated",
      description: `Incident status has been updated to ${status}`,
    });
  };

  const assignTeam = (id: string, team: ResponsibleTeam, notes?: string, attachments: FileAttachment[] = []) => {
    setIncidents(prev => 
      prev.map(incident => {
        if (incident.id === id) {
          const newTeamAssignment = {
            team,
            assignedAt: new Date(),
            notes: notes || `Assigned to ${team}`,
            attachments: attachments
          };
          
          return {
            ...incident,
            currentTeam: team,
            teamHistory: [...incident.teamHistory, newTeamAssignment],
            status: incident.status === "Open" ? "In Progress" : incident.status
          };
        }
        return incident;
      })
    );
    
    toast({
      title: "Team Assigned",
      description: `Incident has been assigned to ${team}`,
    });
  };

  const resolveIncident = (id: string) => {
    updateIncidentStatus(id, "Resolved");
  };

  const getIncidentById = (id: string) => {
    return incidents.find(incident => incident.id === id);
  };

  const getUserIncidents = (username: string) => {
    return incidents.filter(incident => incident.reportedBy === username);
  };

  const addAttachmentToAssignment = (incidentId: string, teamAssignmentIndex: number, attachment: FileAttachment) => {
    setIncidents(prev => 
      prev.map(incident => {
        if (incident.id === incidentId && incident.teamHistory.length > teamAssignmentIndex) {
          const updatedTeamHistory = [...incident.teamHistory];
          
          if (!updatedTeamHistory[teamAssignmentIndex].attachments) {
            updatedTeamHistory[teamAssignmentIndex].attachments = [];
          }
          
          updatedTeamHistory[teamAssignmentIndex].attachments?.push(attachment);
          
          return {
            ...incident,
            teamHistory: updatedTeamHistory
          };
        }
        return incident;
      })
    );
    
    toast({
      title: "Attachment Added",
      description: `File "${attachment.name}" has been attached to the assignment`,
    });
  };

  return (
    <IncidentContext.Provider value={{ 
      incidents, 
      addIncident, 
      updateIncidentStatus, 
      assignTeam, 
      resolveIncident,
      getIncidentById,
      getUserIncidents,
      addAttachmentToAssignment
    }}>
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncidents = () => {
  const context = useContext(IncidentContext);
  if (context === undefined) {
    throw new Error("useIncidents must be used within an IncidentProvider");
  }
  return context;
};
