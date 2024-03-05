import pg from 'pg';
pg.defaults.parseInt8 = true; // to return BIGINT fields as number instead of string

import { Sequelize } from 'sequelize-typescript';
import config from '../config/index';
import * as models from './models';
import { where, fn, col, Op } from 'sequelize';
import { Bet, BetOutcome, TranslateLanguage } from './models';

const logging = (...msg) => {
  const content = msg[0].replace('Executing (default): ', '');
  console.log(content);
};

(Sequelize as any).DataTypes.postgres.DECIMAL.parse = parseFloat;

const sequelize = new Sequelize({
  dialect: 'postgres',
  dialectModule: pg,
  database: config.DB.DATABASE,
  username: config.DB.USERNAME,
  password: config.DB.PASSWORD,
  host: config.DB.HOST,
  port: config.DB.PORT,
  models: Object.values(models),
  logging: process.env.NODE_ENV === 'local' ? logging : false,
  pool: {
    max: 50,
    idle: 1000,
  },
});

sequelize
  .authenticate()
  .then(async () => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.log('ERROR !!!! Connection has not been established successfully.');
    process.kill(process.pid, 'SIGINT');
  });

export default sequelize;
