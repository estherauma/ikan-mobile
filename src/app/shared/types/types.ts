export type UploadType = 'application/pdf' | 'image/png' | 'image/jpeg' | 'image/jpg';

export interface Document {
  id: number;
  userId: string;
  name: string;
  type: string;
  url: string;
  size?: string;
  onlineRef?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}
