import { Result } from './Result';

export interface Incident {
  Period: number;
  IncidentType: number;
  Seconds: number;
  ParticipantPosition: string;
  PlayerId?: string | null;
  PlayerName?: string | null;
  Score: Result[] | null;
}
