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
  
export interface CreateVesselResp {
  status: string;
  data:   VesselData;
}

export interface VesselData {
  id:                string;
  deleted:           boolean;
  createdAt:         string;
  updatedAt:         string;
  deletedAt:         null;
  createdBy:         string;
  updatedBy:         string;
  deletedBy:         null;
  appRef:            string;
  name:              string;
  regNo:             string;
  vesselType:        string;
  status:            string;
  capacity:          string;
  commissioningDate: string;
}

export interface CreateContractResp {
  status: string;
  data:   ContractData;
}

export interface ContractData {
  id:                string;
  name:              string;
  appRef:            string;
  internalRef:       string;
  startDate:         string;
  endDate:           string;
  description:       string;
  taiwaneseCompany:  string;
  indonesianCompany: string;
  kind:              string;
  deleted:           boolean;
  createdAt:         string;
  updatedAt:         string;
  deletedAt:         null;
  createdBy:         string;
  updatedBy:         string;
  deletedBy:         null;
}
