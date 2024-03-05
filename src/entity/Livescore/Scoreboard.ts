import { FixtureStatus, StatusDescription } from '../enum';
import { Result } from './Result';

export interface Scoreboard {
  Status: FixtureStatus;
  Description: StatusDescription;
  CurrentPeriod: number;
  Time: string;
  Results: Result[];
}
