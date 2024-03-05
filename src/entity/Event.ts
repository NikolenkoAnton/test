import { Fixture } from './Fixture/Fixture';
import { Market } from './Markets/Market';
import { Livescore } from './Livescore/Livescore';
import { OutrightFixture } from './Outright/OutrightFixture';
import { OutrightLeague } from './Outright/OutrightLeague';
import { OutrightScore } from './Outright/OutrightScore';

export interface Event {
  FixtureId: number;
  Fixture: Fixture;
  Livescore: Livescore;
  Markets: Market[];
  OutrightFixture: OutrightFixture;
  OutrightLeague: OutrightLeague;
  OutrightScore: OutrightScore;
}
