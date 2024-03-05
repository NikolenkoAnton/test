import { Result } from './Result';
import { Incident } from './Incident';

export interface Period {
  Type: string;
  IsFinished: boolean;
  IsConfirmed: boolean;
  Results: Result[] | null;
  Incidents: Incident[];
  SubPeriods?: Period[];
  SequenceNumber?: number;
}
