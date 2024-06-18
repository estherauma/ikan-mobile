export type UploadType = 'application/pdf' | 'image/png' | 'image/jpeg' | 'image/jpg';

export type FileType = 'image' | 'pdf';
export interface DocumentType {
  id: number;
  onlineRef?: string;
  appRef: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  fileSize?: string;
  docType: FileType;
  isEssential: boolean;
  isDeleted?: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}
