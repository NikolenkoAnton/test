import { FixtureStatus } from '../enum';
import { OutrightParticipantElement } from './OutrightParticipantElement';

export interface OutrightScore {
  ParticipantResults: OutrightParticipantElement;
  Status: FixtureStatus;
}
