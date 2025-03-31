
export type IncidentCategory = "System" | "Network" | "Radio" | "Radar" | "Other";
export type IncidentStatus = "Open" | "In Progress" | "Resolved";
export type ResponsibleTeam = "Technicians" | "Engineering" | "Third Party" | "Nedeco";
export type IncidentLocation = 
  | "Nicosia HQ" 
  | "Larnaca Airport" 
  | "Paphos Airport" 
  | "Limassol Port" 
  | "Remote Site A" 
  | "Remote Site B"
  | "Other";

export interface TeamAssignment {
  team: ResponsibleTeam;
  assignedAt: Date;
  resolvedAt?: Date;
  notes?: string;
}

export interface Incident {
  id: string;
  clientTicketNumber: string;
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
  clientTicketNumber: string;
  category: IncidentCategory;
  description: string;
  isRecurring: boolean;
  reportedBy: string;
  location: IncidentLocation;
  reportedAt: string;
}
