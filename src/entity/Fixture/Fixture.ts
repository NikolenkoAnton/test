import { Sport } from './Sport';
import { Location } from './Location';
import { League } from './League';
import { FixtureStatus } from '../enum';
import { Participant } from './Participant';
import { ExtraData } from '../misc/ExtraData';
import { SubscriptionStatusContainer } from '../misc/SubscriptionStatusContainer';

export interface Fixture {
  StartDate?: Date | null;
  LastUpdate: Date;
  Sport: Sport;
  Location: Location;
  League: League;
  Status: FixtureStatus;
  Participants: Participant[] | null;
  FixtureExtraData: ExtraData[] | null;
  ExternalFixtureId: string | null;
  Subscription: SubscriptionStatusContainer;
}
