import { Teaser } from '../db/models';
import { getMatchByTournamentId, getMatchByTournamentIdPrematchAndLive, getMatches } from '../lib/softswiss';
import { log } from '../helper/sentry';
import { SS_EVENT_STATUSES, TEASER_EVENT_STATUS_ENUM } from '../helper/constants';
import { filter } from 'lodash';
import { addMinutes, parseISO, toDate } from 'date-fns';

export default async function () {
  const teasers: Teaser[] = await Teaser.findAll();

  if (!teasers.length) {
    return true;
  }

  const teasersWithEvents = filter(teasers, 'event_id');
  const teasersWithCompetition = filter(teasers, (t) => !t.event_id);

  try {
    if (teasersWithEvents.length) {
      const promises = [];
      const games = await getGamesOfTeasersWithEvents(teasersWithEvents);
      for (const teaser of teasersWithEvents) {
        const existedEvent = games.find((d) => d.urn_id === `sr:match:${teaser.event_id}`);

        let has_game;
        if (teaser.event_status === TEASER_EVENT_STATUS_ENUM.PREMATCH) {
          has_game =
            existedEvent &&
            existedEvent.status === SS_EVENT_STATUSES.PREMATCH &&
            teaser.start_to >= new Date(existedEvent.start_time)
              ? 1
              : 0;
        } else {
          has_game = existedEvent ? 1 : 0;
        }

        if (teaser.has_game !== has_game) {
          promises.push(Teaser.update({ has_game }, { where: { id: teaser.id } }));
        }
      }
      await Promise.all(promises);
    }
  } catch (err) {
    log(err);
    console.log(err);
  }

  try {
    if (teasersWithCompetition.length) {
      const promises = [];
      for (const teaser of teasersWithCompetition) {
        const game =
          teaser.event_status === TEASER_EVENT_STATUS_ENUM.PREMATCH
            ? await getMatchByTournamentId(teaser.ss_competition_id)
            : await getMatchByTournamentIdPrematchAndLive(teaser.ss_competition_id);

        const has_game = game && teaser.start_to >= new Date(game.start_time) ? 1 : 0;
        if (teaser.has_game !== has_game) {
          promises.push(Teaser.update({ has_game }, { where: { id: teaser.id } }));
        }
      }
      await Promise.all(promises);
    }
  } catch (err) {
    log(err);
    console.log(err);
  }
}

async function getGamesOfTeasersWithEvents(teasers) {
  // unique
  const eventsIds = teasers.map((t) => t.event_id).filter((v, i, a) => a.indexOf(v) === i);
  const filterString = `${eventsIds.map((id) => `urn_id=sr:match:${id}&`).join('')}match_status=0&match_status=1`;

  return await getMatches(filterString);
}
