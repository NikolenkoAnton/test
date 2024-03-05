import axios from 'axios';
import crypto from 'crypto';
import { get, head, map } from 'lodash';
import config from '../../config';
import { SS_EVENT_STATUSES } from '../../helper/constants';
import { SoftswissConnectionError } from '../../helper/errors';
import { log } from '../../helper/sentry';
import { BetData, Category, Competition, Event, Sport } from './dto';

export async function getMatchByTournamentId(tournamentId: number, matchStatus = 0, bettable = true): Promise<Event> {
  if (!tournamentId) {
    return null;
  }
  const url = `${config.SS_API_URL}matches?tournament_id=${tournamentId}&match_status=${matchStatus}&bettable=${bettable}&limit=1&sort_by=start_time:asc`;

  try {
    const response = await axios(url);

    return get(response, 'data.data[0]', null);
  } catch (err) {
    log(err);
    throw new SoftswissConnectionError();
  }
}

export async function getMatchByTournamentIdPrematchAndLive(tournamentId: number, bettable = true): Promise<Event> {
  if (!tournamentId) {
    return null;
  }
  const url = `${config.SS_API_URL}matches?tournament_id=${tournamentId}&match_status=${SS_EVENT_STATUSES.PREMATCH}&match_status=${SS_EVENT_STATUSES.LIVE}&bettable=${bettable}&limit=1&sort_by=start_time:asc`;

  try {
    const response = await axios(url);
    ``;

    return get(response, 'data.data[0]', null);
  } catch (err) {
    log(err);
    throw new SoftswissConnectionError();
  }
}

export async function getSports(limit = 500): Promise<Sport[]> {
  const url = `${config.SS_API_URL}sports?limit=${limit}`;

  try {
    const response = await axios(url, { headers: { 'accept-language': 'en' } });
    return response.data.data || [];
  } catch (err) {
    log(err);
    throw new SoftswissConnectionError();
  }
}

export async function getSportById(id: number): Promise<Sport> {
  const url = `${config.SS_API_URL}sports/${id}`;

  try {
    const response = await axios(url, { headers: { 'accept-language': 'en' } });
    return response.data;
  } catch (err) {
    log(err);
    throw new SoftswissConnectionError();
  }
}

export async function getCategoriesBySport(sportId: number): Promise<Category[]> {
  const url = `${config.SS_API_URL}categories?sport_id=${sportId}&limit=500`;

  try {
    const response = await axios(url, { headers: { 'accept-language': 'en' } });
    return response.data.data || [];
  } catch (err) {
    log(err);
    throw new SoftswissConnectionError();
  }
}

export async function getCategoryById(id: number): Promise<Category> {
  const url = `${config.SS_API_URL}categories/${id}`;

  try {
    const response = await axios(url, { headers: { 'accept-language': 'en' } });
    return response.data || null;
  } catch (err) {
    log(err);
    throw new SoftswissConnectionError();
  }
}

export async function getTournamentsByCategory(categoryId: number): Promise<Competition[]> {
  const url = `${config.SS_API_URL}tournaments?category_id=${categoryId}&limit=500`;

  try {
    const response = await axios(url, { headers: { 'accept-language': 'en' } });
    return response.data.data || [];
  } catch (err) {
    log(err);
    throw new SoftswissConnectionError();
  }
}

export async function getEventsByCompetition(competitionId: number): Promise<any[]> {
  const url = `${config.SS_API_URL}matches?tournament_id=${competitionId}&match_status=${SS_EVENT_STATUSES.PREMATCH}&match_status=${SS_EVENT_STATUSES.LIVE}&limit=500`;

  try {
    const response = await axios(url, { headers: { 'accept-language': 'en' } });
    return response.data.data || [];
  } catch (err) {
    log(err);
    throw new SoftswissConnectionError();
  }
}

export async function getEventById(id: number): Promise<Event> {
  const url = `${config.SS_API_URL}matches/${id}`;

  try {
    const response = await axios(url, { headers: { 'accept-language': 'en' } });
    return response.data || null;
  } catch (err) {
    log(err);
    throw new SoftswissConnectionError();
  }
}

export async function getMatches(filter = ''): Promise<Event[]> {
  const url = `${config.SS_API_URL}matches?${filter}`;
  try {
    const response = await axios(url, { headers: { 'accept-language': 'en' } });
    return response.data.data || null;
  } catch (err) {
    log(err);
    throw new SoftswissConnectionError();
  }
}

export async function getCompetitionById(id: number): Promise<Competition> {
  const url = `${config.SS_API_URL}tournaments/${id}`;

  try {
    const response = await axios(url, { headers: { 'accept-language': 'en' } });
    return response.data || null;
  } catch (err) {
    log(err);
    throw new SoftswissConnectionError();
  }
}

export async function getBetData(uuid: string): Promise<BetData> {
  const url = `${config.SS_API_URL}platform/bets/${uuid}`;

  try {
    const response = await axios(url, {
      headers: {
        'accept-language': 'en',
        'Payload-Signature': getPayloadSignature(),
      },
    });

    return new BetData(response.data);
  } catch (err) {
    log(err);
    throw new SoftswissConnectionError();
  }
}

const getPayloadSignature = (payload?: object): string => {
  return crypto
    .createHmac('sha256', config.SS_KEY)
    .update(payload ? JSON.stringify(payload) : '')
    .digest('hex');
};

export * from './dto';
