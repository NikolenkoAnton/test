import { BetSettlement, BetStatus } from '../enum';

export interface Bet {
  Id: number;
  Name: string;
  Line: string;
  BaseLine: string;
  Status: BetStatus;
  StartPrice: number;
  Price: number;
  LayPrice?: number;
  PriceVolume?: number;
  LayPriceVolume?: number;
  Settlement: BetSettlement;
  ProviderBetId?: string;
  LastUpdate: Date;
  ParticipantId?: number;
  Probability?: number;
  PlayerName?: string;
  SuspensionReason: number;
}
