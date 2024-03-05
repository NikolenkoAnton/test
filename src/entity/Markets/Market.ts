import { Bet } from './Bet';

export interface Market {
  Id: number;
  Name: string;
  Bets: Bet[];
  MainLine: string;
}
