export interface CreateCompanyResp {
    status: string;
    data: Data;
  }
  
  export interface Data {
    id: string;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt?: null;
    createdBy: string;
    updatedBy: string;
    deletedBy?: null;
    appRef?: null;
    name: string;
    description: string;
    country: string;
    telephone: string;
    email: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
  }
  