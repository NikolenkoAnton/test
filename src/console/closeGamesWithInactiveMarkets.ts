import { Game, RMTBaseSettings } from '../db/models';
import { log } from '../helper/sentry';
import sequelize from '../db';
import { QueryTypes, Op } from 'sequelize';

export default async function () {
  try {
    const { show_market_time_limit } = await RMTBaseSettings.findOne();
    if (!show_market_time_limit) {
      return;
    }

    const gamesToBlock: any[] = await getGamesToBlock();
    const gamesToUnBlock: any[] = await getGamesToUnBlock();

    await updateGames(gamesToBlock, 0);
    await updateGames(gamesToUnBlock, 1);
  } catch (err) {
    log(err);
  }
  return;
}

const getGamesToBlock = () => {
  return sequelize.query(
    `SELECT g.id AS game_id
          FROM public.bb_game g
          LEFT JOIN bb_game_outcome go ON g.id = go.game_id AND go.blocked = 0
          WHERE
            g.start >= NOW()
            AND g.status IN ('prematch', 'live')
            AND g.blocked = 0
            AND g.enabled = 1
          GROUP BY g.id
          HAVING COUNT(go.id) = 0`,
    { type: QueryTypes.SELECT },
  );
};

const getGamesToUnBlock = () => {
  return sequelize.query(
    `SELECT g.id AS game_id
          FROM public.bb_game g
          LEFT JOIN bb_game_outcome go ON g.id = go.game_id AND go.blocked = 0
          WHERE
            g.start >= NOW()
            AND g.status IN ('prematch', 'live')
            AND g.blocked = 0
            AND g.enabled = 0
          GROUP BY g.id
          HAVING COUNT(go.id) > 0`,
    { type: QueryTypes.SELECT },
  );
};

const updateGames = async (games: any[], enabled: number) => {
  if (games.length) {
    await Game.update(
      { enabled },
      {
        where: {
          id: { [Op.in]: games.map((g) => g.game_id) },
        },
      },
    );
  }
};
