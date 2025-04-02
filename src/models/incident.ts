
export type IncidentCategory = "System" | "Network" | "Radio" | "Radar" | "Other";
export type IncidentStatus = "Open" | "In Progress" | "Resolved";
export type ResponsibleTeam = "Technicians" | "Engineering" | "Third Party" | "Nedeco";
// Changed from enum to string to allow free text
export type IncidentLocation = string;

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
  // Additional fields for specific categories (stored in description)
  radioId?: string;
  serverType?: string;
  radarNumber?: string;
  networkSystemType?: string;
}

export interface IncidentFormData {
  clientTicketNumber: string;
  category: IncidentCategory;
  reportedAt: string;
  description: string;
  isRecurring: boolean;
  reportedBy: string;
  location: IncidentLocation;
  // These are optional as they depend on the category
  radioId?: string;
  serverType?: string;
  radarNumber?: string;
  networkSystemType?: string;
}
