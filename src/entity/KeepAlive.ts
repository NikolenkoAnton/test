import { ExtraData } from './misc/ExtraData';

export interface KeepAlive {
  ActiveEvent: number[];
  ExtraData: ExtraData[];
  ProviderId?: number;
}
