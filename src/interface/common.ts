export interface StreamingUserPayload {
  userId: number;
  clientName?: string;
  operation?: string;
  email?: string;
  activePhoneStatus?: string;
  accessLimits?: string[];
  userAccessLimits?: {
    type: string;
    createdAt: string;
  }[];
  currentSignInIp?: string;
  currentSignInAt?: string;
  confirmedAt?: string;
  createdAt?: string;
  state?: string;
  tags?: string[];
  btag?: string;
  qtag?: string;
  ctag?: string;
  stagAffiliate?: string;
  subid?: string;
  currentSignInCountry?: string;
  currencies?: string[];
  visibleCurrencies?: string[];
  duplicate?: boolean;
  address?: string;
  autoIssuingBonuses?: boolean;
  gender?: string;
  country?: string;
  depositPaymentSystems?: string[];
  cashoutPaymentSystems?: string[];
  receivePromos?: boolean;
  receiveSmsPromos?: boolean;
  dateOfBirth?: string;
  affiliateEmail?: string;
  affiliateProfileExistence?: boolean;
  egamesStatus?: string;
  language?: string;
  disposableEmail?: boolean;
  socialNetworks?: string[];
  deviceTypes?: string[];
  version?: number;
  msgId?: string;
  apiVersion?: string;
  action?: string;
}

export interface DateIntervalPayload {
  start_date: Date;
  end_date: Date;
}
