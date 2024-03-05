import pg from 'pg';
pg.defaults.parseInt8 = true; // to return BIGINT fields as number instead of string

import { Sequelize } from 'sequelize-typescript';
import config from '../config/index';
import { StreamingUserPayload } from '../interface/common';

const logging = (...msg) => {
  const content = msg[0].replace('Executing (default): ', '');
  console.log(content);
};
const streamingSequelize = new Sequelize(config.STREAMING_DB_URL, {
  dialectModule: pg,
  logging: process.env.NODE_ENV === 'local' ? logging : false,

  pool: {
    max: 50,
    idle: 1000,
  },
});

streamingSequelize
  .authenticate()
  .then(async () => {
    console.log('Connection to Streaming DataBase has been established successfully.');
  })
  .catch((error) => {
    console.log('ERROR !!!! Connection to Streaming DataBase has not been established successfully.');

    process.kill(process.pid, 'SIGINT');
  });

export const getStreamingUserById = async (id: number): Promise<StreamingUserPayload> => {
  const [[user]] = await streamingSequelize.query(`SELECT * FROM public."users" WHERE "user_id"=${id} LIMIT 1;`, {
    raw: true,
  });

  return user as undefined as StreamingUserPayload;
};
// export default streamingSequelize;
