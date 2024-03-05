import pkg from 'pg';
const { Pool } = pkg;
import axios from 'axios';
import { log } from '../helper/sentry';
const pool = new Pool({
  user: process.env.REPLICA_DB_USERNAME,
  host: process.env.REPLICA_DB_HOST,
  database: process.env.REPLICA_DB_DATABASE,
  password: process.env.REPLICA_DB_PASSWORD,
  port: process.env.REPLICA_DB_PORT,
  // max: 200,
  // idle: 1000
});

function sendMessage(text) {
  // console.log('cron telegramAlert SEND');
  //urlencode("here is my text.\n and this is a new line \n another new line");
  axios(
    'https://api.telegram.org/bot5265178470:AAHcMGYlAWsU1Le2DpKGb123hSKVkpULW0E/sendMessage?chat_id=-1001467762129&text=' +
      encodeURIComponent(text),
  );
  // https://api.telegram.org/bot5265178470:AAHcMGYlAWsU1Le2DpKGb123hSKVkpULW0E/sendMessage?chat_id=-1001467762129&text=test
}

export default async function () {
  // console.log('cron telegramAlert START');
  await RegistrationsPayments();
  await SuccessfullyPayments();
  return;
}

async function RegistrationsPayments() {
  try {
    const exist_payments_100 = await pool.query(
      'select count(*) from replica_views.users_view ' +
        'where id >= (select min(id) from (select replica_views.users_view.id from replica_views.users_view ' +
        'inner join replica_views.payments_view ON replica_views.payments_view.user_id = replica_views.users_view.id ' +
        "where replica_views.users_view.created_at < now() - interval '1 hours' " +
        'GROUP by replica_views.users_view.id ' +
        'order by replica_views.users_view.id desc limit 100) as usr)',
    );

    const exist_payments_10 = await pool.query(
      'select count(*) from replica_views.users_view ' +
        'where id >= (select min(id) from (select replica_views.users_view.id from replica_views.users_view ' +
        'inner join replica_views.payments_view ON replica_views.payments_view.user_id = replica_views.users_view.id ' +
        "where replica_views.users_view.created_at < now() - interval '1 hours' " +
        'GROUP by replica_views.users_view.id ' +
        'order by replica_views.users_view.id desc limit 10) as usr)',
    );

    const text =
      'Registrations Payments(-1h)\n' +
      'AVG10: ' +
      Math.round((10 / exist_payments_10.rows[0].count) * 100) +
      '%\n' +
      'AVG100: ' +
      Math.round((100 / exist_payments_100.rows[0].count) * 100) +
      '%';
    if ((100 / exist_payments_100.rows[0].count) * 0.8 > 10 / exist_payments_10.rows[0].count) {
      sendMessage(text);
    }
    log(text);
  } catch (error) {
    log(error);
  }
}

async function SuccessfullyPayments() {
  try {
    const time_last_100_unsuccessful = await pool.query(
      'SELECT max(created_at::text) as created_at ' +
        'FROM replica_views.payments_view ' +
        "where success = false and action = 'deposit' and created_at < now() - interval '20 minutes' " +
        'group by user_id ' +
        'order by max(created_at) desc limit 100',
    );

    const successful_10 = await pool.query(
      'SELECT user_id FROM replica_views.payments_view ' +
        "where action = 'deposit' and success = true and created_at >= '" +
        time_last_100_unsuccessful.rows[9].created_at +
        "' and created_at < now() - interval '20 minutes' " +
        'group by user_id',
    );
    const successful_100 = await pool.query(
      'SELECT user_id FROM replica_views.payments_view ' +
        "where action = 'deposit' and success = true and created_at >= '" +
        time_last_100_unsuccessful.rows[99].created_at +
        "' and created_at < now() - interval '20 minutes' " +
        'group by user_id',
    );

    const text =
      'Successfully Payments(-20min)\n' +
      'AVG10: ' +
      Math.round((successful_10.rowCount / (successful_10.rowCount + 10)) * 100) +
      '%\n' +
      'AVG100: ' +
      Math.round((successful_100.rowCount / (successful_100.rowCount + 100)) * 100) +
      '%';
    if (
      (successful_100.rowCount / (successful_100.rowCount + 100)) * 0.8 >
      successful_10.rowCount / (successful_10.rowCount + 10)
    ) {
      sendMessage(text);
    }
    log(text);
  } catch (error) {
    log(error);
  }
}
