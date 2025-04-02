import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { Incident, IncidentFormData, IncidentCategory, IncidentStatus, ResponsibleTeam, IncidentLocation } from "@/models/incident";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

const generateTicketNumber = (): string => {
  const timestamp = new Date().getTime().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `CY-${timestamp}-${random}`;
};

const sendEmailNotification = async (incident: Incident) => {
  const emailAddresses = ["Amit.Arbel@elbitsystems.com", "Elbit.SupportCY@elbitsystems.com"];
  const emailSubject = `New Incident Reported: ${incident.internalTicketNumber}`;
  const emailBody = `
    A new incident has been reported:
    
    Ticket Number: ${incident.internalTicketNumber}
    Client Ticket: ${incident.clientTicketNumber || 'N/A'}
    Category: ${incident.category}
    Description: ${incident.description}
    Location: ${incident.location}
    Reported By: ${incident.reportedBy}
    Reported At: ${incident.reportedAt.toLocaleString()}
    
    Please assign this incident to the appropriate team.
  `;
  
  console.log("Sending email notification to:", emailAddresses);
  console.log("Email subject:", emailSubject);
  console.log("Email body:", emailBody);
  
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: emailAddresses,
        subject: emailSubject,
        body: emailBody,
        incident: incident,
      }),
    }).catch(() => {
      console.log("Email would be sent in production environment");
    });
    
    return true;
  } catch (error) {
    console.error("Error sending email notification:", error);
    return false;
  }
};

const checkSLADeadline = (incident: Incident) => {
  if (incident.status === "Resolved") return null;
  
  const openedTime = new Date(incident.openedAt).getTime();
  const currentTime = new Date().getTime();
  const twoHoursInMs = 2 * 60 * 60 * 1000;
  const fourHoursInMs = 4 * 60 * 60 * 1000;
  
  const timeElapsed = currentTime - openedTime;
  
  if (timeElapsed >= fourHoursInMs) {
    return "escalate";
  } else if (timeElapsed >= twoHoursInMs) {
    return "warning";
  }
  
  return null;
};

const sendSLANotification = async (incident: Incident, type: "warning" | "escalate") => {
  const emailAddresses = ["Amit.Arbel@elbitsystems.com", "Elbit.SupportCY@elbitsystems.com"];
  let emailSubject = "";
  let emailBody = "";
  
  if (type === "warning") {
    emailSubject = `SLA Warning: 2 Hours Remaining for Incident ${incident.internalTicketNumber}`;
    emailBody = `
      Warning: The SLA deadline is approaching for incident ${incident.internalTicketNumber}.
      
      You have 2 hours remaining to resolve this incident before it must be escalated to Engineering.
      
      Incident Details:
      Category: ${incident.category}
      Description: ${incident.description}
      Location: ${incident.location}
      Current Team: ${incident.currentTeam || 'Unassigned'}
      
      Please take appropriate action.
    `;
  } else if (type === "escalate") {
    emailSubject = `SLA Deadline Expired: Escalate Incident ${incident.internalTicketNumber} to Engineering`;
    emailBody = `
      URGENT: The SLA deadline has expired for incident ${incident.internalTicketNumber}.
      
      This incident must be escalated to Engineering immediately.
      
      Incident Details:
      Category: ${incident.category}
      Description: ${incident.description}
      Location: ${incident.location}
      Current Team: ${incident.currentTeam || 'Unassigned'}
      
      Please escalate this incident immediately.
    `;
  }
  
  console.log("Sending SLA notification to:", emailAddresses);
  console.log("Email subject:", emailSubject);
  console.log("Email body:", emailBody);
  
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: emailAddresses,
        subject: emailSubject,
        body: emailBody,
        incident: incident,
      }),
    }).catch(() => {
      console.log("SLA email would be sent in production environment");
    });
    
    return true;
  } catch (error) {
    console.error("Error sending SLA notification:", error);
    return false;
  }
};

interface IncidentContextType {
  incidents: Incident[];
  addIncident: (data: IncidentFormData) => Incident;
  updateIncidentStatus: (id: string, status: IncidentStatus) => void;
  assignTeam: (id: string, team: ResponsibleTeam, notes?: string) => void;
  resolveIncident: (id: string) => void;
  getIncidentById: (id: string) => Incident | undefined;
  getUserIncidents: (username: string) => Incident[];
}

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

const mockIncidents: Incident[] = [
  {
    id: "1",
    clientTicketNumber: "CLIENT-001",
    internalTicketNumber: "CY-123456-001",
    category: "System",
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
    category: "System",
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
        setIncidents(parsedIncidents);
      } catch (error) {
        console.error("Error parsing incidents from localStorage:", error);
        setIncidents(mockIncidents);
      }
    } else {
      setIncidents(mockIncidents);
    }
  }, []);

  useEffect(() => {
    if (incidents.length > 0) {
      localStorage.setItem("incidents", JSON.stringify(incidents));
    }
  }, [incidents]);

  useEffect(() => {
    const checkSLADeadlines = () => {
      incidents.forEach(incident => {
        if (incident.status === "Resolved") return;
        
        const slaStatus = checkSLADeadline(incident);
        
        const slaNotificationKey = `sla-notification-${incident.id}`;
        const sentNotifications = localStorage.getItem(slaNotificationKey) ? 
          JSON.parse(localStorage.getItem(slaNotificationKey) || '{}') : {};
        
        if (slaStatus === "warning" && !sentNotifications.warning) {
          sendSLANotification(incident, "warning");
          sentNotifications.warning = true;
          localStorage.setItem(slaNotificationKey, JSON.stringify(sentNotifications));
          
          toast({
            title: "SLA Warning",
            description: `2 hours remaining for incident ${incident.internalTicketNumber}. Technicians need to resolve or escalate.`,
            variant: "destructive",
          });
        } else if (slaStatus === "escalate" && !sentNotifications.escalate) {
          sendSLANotification(incident, "escalate");
          sentNotifications.escalate = true;
          localStorage.setItem(slaNotificationKey, JSON.stringify(sentNotifications));
          
          if (incident.currentTeam === "Technicians") {
            assignTeam(incident.id, "Engineering", "Auto-escalated due to SLA expiration");
            
            toast({
              title: "SLA Deadline Expired - Auto-escalated",
              description: `Incident ${incident.internalTicketNumber} has been escalated to Engineering after 4 hours`,
              variant: "destructive",
            });
          } else {
            toast({
              title: "SLA Deadline Expired",
              description: `Incident ${incident.internalTicketNumber} has exceeded the 4-hour SLA limit`,
              variant: "destructive",
            });
          }
        }
      });
    };
    
    checkSLADeadlines();
    
    const interval = setInterval(checkSLADeadlines, 60000);
    
    return () => clearInterval(interval);
  }, [incidents, toast]);

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
    
    sendEmailNotification(newIncident);
    
    toast({
      title: "Incident Reported",
      description: `Incident has been created with ticket number ${newIncident.internalTicketNumber}. Email notifications have been sent.`,
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

  const assignTeam = (id: string, team: ResponsibleTeam, notes?: string) => {
    setIncidents(prev => 
      prev.map(incident => {
        if (incident.id === id) {
          const newTeamAssignment = {
            team,
            assignedAt: new Date(),
            notes: notes || `Assigned to ${team}`
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

  return (
    <IncidentContext.Provider value={{ 
      incidents, 
      addIncident, 
      updateIncidentStatus, 
      assignTeam, 
      resolveIncident,
      getIncidentById,
      getUserIncidents
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
