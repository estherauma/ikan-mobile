import { Blameable } from 'src/app/shared/types/api-types';

export interface WorkOrder extends Blameable {
  name: string;
  internalReference: string;
  dateOpened: string;
  status: string;
  vesselOwnerId: string;
}

export interface WorkOrderClause extends Blameable {
  workOrderId: number;
  name: string;
}


export interface WorkOrderClauseDetails extends Blameable {
  workOrderClauseId: number;
  key: string;
  value: string;
}
