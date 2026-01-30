export interface Project { id: string; name: string; createdAt: string }
export interface Presentation { id: string; name: string; sizeMB: number; uploadedAt: string }
export interface CompetitorProject { id: string; name: string; createdAt: string }

export interface ProjectVideo { label: string; url: string }
export interface ProjectDocument { name: string; type: string }
export interface DetailedProject {
  title: string;
  url: string;
  videos: ProjectVideo[];
  coordinates: string;
  documents: ProjectDocument[];
  createdAt: string;
}
