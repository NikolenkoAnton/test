import cron from 'node-cron';
import topCompetitionGame from './topCompetitionGame';
import teaserGame from './teaserGame';
import currencies from './currencies';
import bets from './bets';
import clearDB from './clearDB';
import telegramAlert from './telegramAlert';
import clearPreviewData from './clearPreviewData';
import topGame from './topGame';
import closeGamesWithInactiveMarkets from './closeGamesWithInactiveMarkets';
import betOutcomeResultProcess from './betOutcomeResultProcess';
import betResultProcess from './betResultProcess';

const tasks = [];

export default function runCron() {
  if (process.env.NODE_ENV === 'local') {
    return true;
  }

  if (process.env.NODE_ENV !== 'production') {
  } else {
    // tasks.push(cron.schedule('0 * * * *', telegramAlert));
  }
  // tasks.push(cron.schedule('4 * * * *', clearDB)); //temp commit
  // tasks.push(cron.schedule('0 * * * *', topCompetitionGame));
  // tasks.push(cron.schedule('0 * * * *', teaserGame));
  tasks.push(cron.schedule('0 * * * *', clearPreviewData));
  tasks.push(cron.schedule('0 1 * * *', currencies));
  // tasks.push(cron.schedule('* * * * *', bets));
  // tasks.push(cron.schedule('1 0 * * *', topGame));
  tasks.push(cron.schedule('* * * * *', closeGamesWithInactiveMarkets));
  tasks.push(cron.schedule('* * * * *', betOutcomeResultProcess));
  tasks.push(cron.schedule('* * * * *', betResultProcess));
}
