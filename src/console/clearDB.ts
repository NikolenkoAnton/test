import { log } from '../helper/sentry';

import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  // max: 200,
  // idle: 1000
});

export default async function () {
  try {
    await pool.query(`
    DELETE FROM bb_game WHERE start < NOW() - INTERVAL '7 days' 
                        AND NOT EXISTS (
                        SELECT 1 FROM bb_bet_outcome 
                        INNER JOIN bb_bet ON bb_bet_outcome.bet_id = bb_bet.id 
                        WHERE bb_bet.closed = 0 AND bb_bet_outcome.game_id = bb_game.id);`);
    await pool.query(
      'DELETE FROM bb_game_event USING bb_game_event AS del_table LEFT JOIN bb_game AS g ON del_table.game_id = g.id WHERE bb_game_event.id = del_table.id AND g.id IS NULL',
    );
    await pool.query(
      'DELETE FROM bb_game_favorite USING bb_game_favorite AS del_table LEFT JOIN bb_game AS g ON del_table.game_id = g.id WHERE bb_game_favorite.id = del_table.id AND g.id IS NULL',
    );
    await pool.query(
      'DELETE FROM bb_game_market USING bb_game_market AS del_table LEFT JOIN bb_game AS g ON del_table.game_id = g.id WHERE bb_game_market.id = del_table.id AND g.id IS NULL',
    );
    await pool.query(
      'DELETE FROM bb_game_outcome USING bb_game_outcome AS del_table LEFT JOIN bb_game AS g ON del_table.game_id = g.id WHERE bb_game_outcome.id = del_table.id AND g.id IS NULL',
    );
    await pool.query(
      'DELETE FROM bb_game_team USING bb_game_team AS del_table LEFT JOIN bb_game AS g ON del_table.game_id = g.id WHERE bb_game_team.id = del_table.id AND g.id IS NULL',
    );
    await pool.query(
      'DELETE FROM bb_game_time_event USING bb_game_time_event AS del_table LEFT JOIN bb_game AS g ON del_table.game_id = g.id WHERE bb_game_time_event.id = del_table.id AND g.id IS NULL',
    );

    // await pool.query(
    //   `DELETE FROM bb_translate USING bb_translate AS del_table LEFT JOIN bb_game AS g ON del_table.game_id = g.id WHERE g.id IS NULL and del_table.type = 'game'`,
    // );//todo
  } catch (err) {
    log(err);
  }
  return;
}
