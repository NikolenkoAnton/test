import { BET_RESULTS_ENUM } from './../helper/bet_constants';
import { groupBy, map, mapValues, orderBy, reduce, sortBy, sumBy } from 'lodash';
import { Action } from 'routing-controllers';
import { PLAYER_VIEW_MAIN_TABS } from '../controller/player/constant';

export function PlayerResponseInterceptor(action: Action, content: any) {
  const main_tab: PLAYER_VIEW_MAIN_TABS = action.request.query.main_tab;

  const response: any = { data: content };

  if (action.request.path === '/player/types' && main_tab === PLAYER_VIEW_MAIN_TABS.RTP) {
    const types = groupBy(content, 'type');

    const mappedTypes = mapValues(types, (value, key) => {
      const winSum = sumBy(value, 'win_sum');

      const stakeSum = sumBy(value, 'stake_sum');

      return winSum / stakeSum;
    });

    response.general_rtp = mappedTypes;

    return response;
  }

  if (main_tab === PLAYER_VIEW_MAIN_TABS.RTP) {
    const [win, stake] = reduce(
      content as any[],
      ([win, stake], { win_sum, stake_sum }) => [win + win_sum, stake + stake_sum],
      [0, 0],
    );

    response.rtp = win / stake;

    if (action.request.path === '/player/results') {
      response.data = orderBy(
        map(response.data, (item) =>
          item.result === BET_RESULTS_ENUM.LOSE ? { result: BET_RESULTS_ENUM.LOSE, rtp: 0 } : item,
        ),
        (item) => (item.rtp === null ? -1 : item.rtp),
        action.request.query.order,
      );
    }
  }

  if ([PLAYER_VIEW_MAIN_TABS.BET_SUM, PLAYER_VIEW_MAIN_TABS.PROFIT].includes(main_tab)) {
    const sum = sumBy(content as any[], main_tab);
    response[main_tab] = sum;
  }

  return response;
}
