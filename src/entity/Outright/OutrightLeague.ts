import { Sport } from '../Fixture/Sport';
import { Location } from '../Fixture/Location';
import { FixtureStatus, OutrightFixtureLeagueType } from '../enum';
import { SubscriptionStatusContainer } from '../misc/SubscriptionStatusContainer';

export interface OutrightLeague {
  LastUpdate: Date;
  Sport: Sport;
  Location: Location;
  Type?: OutrightFixtureLeagueType;
  Status: FixtureStatus;
  Subscription: SubscriptionStatusContainer;
}
