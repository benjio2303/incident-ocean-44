
export type IncidentCategory = 
  | "System" 
  | "Network" 
  | "Radar" 
  | "Radio" 
  | "Camera" 
  | "Hardware" 
  | "Software" 
  | "Other";

export type IncidentStatus = "Open" | "In Progress" | "Resolved";

export type ResponsibleTeam = "Technicians" | "Engineering" | "Third Party" | "Nedeco";

export type IncidentLocation = 
  | "Nicosia HQ" 
  | "Larnaca Airport" 
  | "Paphos Airport" 
  | "Remote Site A" 
  | "Remote Site B" 
  | "Remote Site C"
  | "Other";

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface TeamAssignment {
  team: ResponsibleTeam;
  assignedAt: Date;
  resolvedAt?: Date;
  notes?: string;
  attachments?: FileAttachment[];
}

export interface Incident {
  id: string;
  clientTicketNumber?: string;
  internalTicketNumber: string;
  category: IncidentCategory;
  description: string;
  isRecurring: boolean;
  reportedBy: string;
  location: IncidentLocation;
  reportedAt: Date;
  openedAt: Date;
  closedAt?: Date;
  status: IncidentStatus;
  teamHistory: TeamAssignment[];
  currentTeam?: ResponsibleTeam;
  resolvingTeam?: ResponsibleTeam;
}

export interface IncidentFormData {
  clientTicketNumber?: string;
  category: IncidentCategory;
  description: string;
  isRecurring: boolean;
  reportedBy: string;
  location: IncidentLocation;
  reportedAt: string | Date;
}
