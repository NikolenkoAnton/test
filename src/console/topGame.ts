import { addDays } from 'date-fns';
import sequelize from '../db';
import { Game } from '../db/models';
import { log } from '../helper/sentry';
import { getMatches } from '../lib/softswiss';

export default async function () {
  const start_date = new Date().toISOString(); //now
  const to_date = addDays(new Date(), 7).toISOString(); //one week plus
  const filter = `sort_by=bets_count:desc&limit=30&max_per_sport=3&sport_type=regular&bettable=true&match_status=0&start_from=${start_date}&start_to=${to_date}`;
  let ssTopGames = [];

  try {
    ssTopGames = await getMatches(filter);
  } catch (err) {
    log(err);
  }

  if (!ssTopGames.length) {
    return;
  }

  const transaction = await sequelize.transaction();
  try {
    await Promise.all(
      ssTopGames.map((topGame) => {
        return Game.update(
          { super_top: 1 },
          {
            where: { external_id: topGame.urn_id },
            transaction,
          },
        );
      }),
    );

    await transaction.commit();
  } catch (err) {
    log(err);
    await transaction.rollback();
  }
}
