import { ExtraData } from '../misc/ExtraData';
import { Scoreboard } from './Scoreboard';
import { Period } from './Period';
import { Statistic } from './Statistic';

export interface Livescore {
  Scoreboard: Scoreboard;
  Periods: Period[] | null;
  Statistics: Statistic[] | null;
  LivescoreExtraData: ExtraData | null;
}
