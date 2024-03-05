import { CompetitionTop } from '../db/models';
import { getMatchByTournamentId } from '../lib/softswiss';
import { log } from '../helper/sentry';

export default async function () {
  const competitionTops: CompetitionTop[] = await CompetitionTop.findAll({
    order: [
      ['position', 'ASC'],
      ['id', 'ASC'],
    ],
  });

  if (!competitionTops.length) {
    return true;
  }

  for (const competitionTop of competitionTops) {
    try {
      const game = await getMatchByTournamentId(competitionTop.ss_competition_id);
      const has_game = game ? 1 : 0;
      if (competitionTop.has_game !== has_game) {
        await CompetitionTop.update({ has_game }, { where: { id: competitionTop.id } });
      }
    } catch (e) {
      log(e);
    }
  }
}
