export interface Message {
  Header: MessageHeader;
  Body: MessageBody;
}

interface MessageHeader {
  Type: number;
  MsgGuid: string;
  ServerTimestamp: number;
  MsgSeq: number;
}

interface MessageBody {
  Events: Array<Event>;
  Competition: string;
  KeepAlive: number;
}

interface Event {
  FixtureId: number;
  Fixture: Fixture;
  Markets: Market;
  Livescore: any;
  OutrightFixture: any;
  OutrightLeague: any;
  OutrightScore: any;
}

enum FixtureStatus {
  NOT_STARTED = 1,
  IN_PROGRESS = 2,
  FINISHED = 3,
  CANCELED = 4,
  POSTPONED = 5,
  INTERRUPTED = 6,
  ABANDONED = 7,
  COVERAGE_LOST = 8,
  ABOUT_TO_START = 9,
}

interface Fixture {
  StartDate?: Date | null;
  LastUpdate: Date;
  Sport: Sport;
  Location: Location;
  League: League;
  Status: FixtureStatus;
  Participants: Participant[] | null;
  FixtureExtraData: ExtraData[] | null;
  ExternalFixtureId: string | null;
  Subscription: Subscription;
}

interface League {
  Id: number;
  Name: string;
}

interface Sport {
  Id: number;
  Name: string;
}

interface Participant {
  Id: number;
  Name: string;
  Position: string;
  IsActive: boolean;
  ExtraData: ExtraData[];
}

interface ExtraData {
  Name: string;
  Value: string;
}

interface Subscription {
  Type: SubscriptionType;
  Status: SubscriptionStatus;
}

enum SubscriptionType {
  IN_PLAY = 1,
  PRE_MATCH = 2,
}

enum SubscriptionStatus {
  SUBSCRIBED = 1,
  PENDING = 2,
  UNSUBSCRIBED = 3,
  DELETED = 4,
}

interface Market {
  Id: number;
  Name: string;
  MainLine: string;
  Bets: Bet[];
}

interface Bet {
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

enum BetSettlement {
  CANCELED = -1, // The bet settlement is canceled
  LOSER = 1, // The bet has lost
  WINNER = 2, // The bet has won
  REFUND = 3, // There should be a refund
  HALF_LOST = 4, // Half of the bet has lost
  HALF_WON = 5, // Half of the bet has won
}

enum BetStatus {
  OPEN = 1, // The bet is open (bets can be placed)
  SUSPENDED = 2, // The bet is suspended (bets cannot be placed)
  SETTLED = 3, // The bet is settled (resulted) – a settlement is determined (see settlement enumeration for additional information)
}
