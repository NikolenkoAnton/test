import { Result } from './Result';
import { StatisticType } from '../enum';
import { Incident } from './Incident';

export interface Statistic {
  Type: StatisticType;
  Value: Result[] | null;
  Incident: Incident[] | null;
}
