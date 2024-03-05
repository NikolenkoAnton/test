import { ExtraData } from '../misc/ExtraData';

export interface Participant {
  Id: number;
  Name: string;
  Position: string;
  IsActive: boolean;
  ExtraData: ExtraData[];
}
