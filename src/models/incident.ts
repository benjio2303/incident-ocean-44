
export type IncidentCategory = 
  | "IT" 
  | "Network" 
  | "Radar" 
  | "Radio" 
  | "Camera EO" 
  | "Camera PTZ"
  | "TorchX"
  | "Synch"
  | "Milestone"
  | "Drone";

export type ITSubcategory = 
  | "Firewall"
  | "NetApp"
  | "NTP"
  | "Cisco Switch"
  | "Fortinet FortiSwitch"
  | "iDrac"
  | "ESXi"
  | "vCenter"
  | "Zabbix"
  | "FortiManager"
  | "Other";

export type NetworkSubcategory = 
  | "Fortinet Router"
  | "Fortinet Switch"
  | "Firewall"
  | "LTE"
  | "Internet"
  | "VPN"
  | "Fortinet Encryptor"
  | "FortiManager"
  | "FortiAnalyzer"
  | "FortiAuthenticator"
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
  | "Limassol Port"
  | "Unknown"
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

export interface SpecificDetails {
  radioId?: string;
  radarNumber?: string;
  systemType?: string;
  subcategory?: ITSubcategory | NetworkSubcategory;
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
  reportedTime?: string; // Added field for 24h time
  openedAt: Date;
  closedAt?: Date;
  status: IncidentStatus;
  teamHistory: TeamAssignment[];
  currentTeam?: ResponsibleTeam;
  resolvingTeam?: ResponsibleTeam;
  specificDetails?: SpecificDetails;
}

export interface IncidentFormData {
  clientTicketNumber?: string;
  category: IncidentCategory;
  description: string;
  isRecurring: boolean;
  reportedBy: string;
  location: IncidentLocation;
  reportedAt: string | Date;
  reportedTime?: string;
  specificDetails?: SpecificDetails;
}
