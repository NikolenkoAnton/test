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
    await pool.query("DELETE FROM bb_cms_static_page WHERE delete_after < NOW()");
  } catch (err) {
    log(err);
  }
  return;
}
