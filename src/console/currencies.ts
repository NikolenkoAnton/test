import { Currency, CurrencyBet, CurrencyHistory } from '../db/models';
import { log } from '../helper/sentry';
import axios from 'axios';
import config from '../config';
import { ServerError } from '../helper/errors';

export default async function () {
  if (!config.CURRENCY_KEY || !config.CURRENCY_URL) {
    log(new ServerError('Currencies API data is not set up'));
  }
  const response = await axios(`${config.CURRENCY_URL}?key=${config.CURRENCY_KEY}`);
  if (response.status !== 200 || (response.data.status && response.data.status !== 200)) {
    log(new ServerError('Currencies API data is not available'));
  }

  const now = new Date();
  const currencyDB = await Currency.findAll({ raw: true });
  // const currencyBetDB = await CurrencyBet.findAll({ raw: true });

  for (const code in response.data.data) {
    try {
      const item = response.data.data[code];

      let currency = currencyDB.find((r) => r.code === item['code']);
      if (!currency) {
        currency = await Currency.create({
          code: item['code'],
          value: item['value'],
          created_at: now,
        });
      } else {
        Currency.update(
          {
            value: item['value'],
            updated_at: now,
          },
          {
            where: { id: currency.id },
          },
        );

        CurrencyHistory.create({
          currency_id: currency.id,
          date: currency.updated_at,
          value: currency.value,
          created_at: now,
        });
      }

      // TODO waiting for updates
      // const currencyBet = currencyBetDB.find((c) => c.currency_id === currency.id);
      // if (!currencyBet) {
      //   CurrencyBet.create({
      //     currency_id: currency.id,
      //     name: 'min_bet',
      //     section: null,
      //     value_default: item['value'],
      //     value: item['value'],
      //     created_at: now,
      //   });
      // } else {
      //   CurrencyBet.update(
      //     {
      //       value_default: item['value'],
      //       value: currencyBet.value_manual ? currencyBet.value_manual : item['value'],
      //       updated_at: now,
      //     },
      //     {
      //       where: { currency_id: currency.id },
      //     },
      //   );
      // }
    } catch (err) {
      log(err);
    }
  }
}
