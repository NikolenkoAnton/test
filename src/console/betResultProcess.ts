import { log } from '../helper/sentry';
import { BET_RESULTS_ENUM, BET_TYPES_ENUM, OUTCOME_STATUSES_ENUM } from '../helper/bet_constants';
import { Bet, BetOutcome } from '../db/models';
import { Combination } from 'js-combinatorics';
import { calculateOdds } from './betOutcomeResultProcess';
import bigDecimal from 'js-big-decimal';
import Platform from '../db/models/Platform';
import crypto from 'crypto';
import axios from 'axios';
let processes_run = 0;
const betCloseTime = 3 * 60 * 1000; //3 min
const processedAttempt = {
  0: 0,
  1: 3 * 60 * 1000, //3 min
  2: 6 * 60 * 1000, //3 min
  3: 9 * 60 * 1000, //3 min
  4: 39 * 60 * 1000, //30 min
  5: 69 * 60 * 1000, //30 min
  6: 99 * 60 * 1000, //30 min
  7: 159 * 60 * 1000, //60 min
};
let SECRET_KEY, PLATFORM_URL;

const { PART_LOSS, PART_WIN } = BET_RESULTS_ENUM;

const { LOSS_REFUND, LOSS, REFUND, WIN_REFUND, WIN, VOID } = OUTCOME_STATUSES_ENUM;
const IN_PROGRESS = null;

const processSystem = async (bet) => {
  const { system, betOutcomes } = bet;

  const combinations = new Combination(
    betOutcomes.map((bo) => bo.oddsCalculated),
    system,
  ).toArray();

  const currentResult = getSystemResult(bet);

  bet.win = calculateSystemWin(combinations, currentResult);
  bet.current_possible_win = calculateSystemPossibleWin(combinations);
  updateBetResult(bet, currentResult);
  await checkBetForClose(bet);

  await Bet.update(bet, {
    where: {
      id: bet.id,
    },
  });
};

const calculateSystemWin = (combinations, result) => {
  switch (result) {
    case LOSS:
    case IN_PROGRESS:
      return 0;
    default:
      return calculateSystemPossibleWin(combinations);
  }
};

const calculateSystemPossibleWin = (combinations) => {
  const win = combinations.reduce((sum, innerArray) => {
    const multiplyResult = innerArray.reduce((product, num) => product * num, 1);
    return sum + multiplyResult;
  }, 0);
  return bigDecimal.round(win, 6);
};

const getSystemResult = (bet) => {
  const { system, betOutcomes, win: winPlayer } = bet;
  const betOutcomesCount = betOutcomes.length;

  const winOutcomes = getOutcomesByResult(betOutcomes, WIN);
  const lossOutcomes = getOutcomesByResult(betOutcomes, LOSS);
  const inProgressOutcomes = getOutcomesByResult(betOutcomes, IN_PROGRESS);

  const isAllVoid = betOutcomes.every((bo) => bo.result === VOID);
  const isAllRefund = betOutcomes.every((bo) => bo.result === REFUND);
  const isWinRefund = lossOutcomes.length < system && winPlayer >= bet.stake;

  const isLossRefund = lossOutcomes.length < system && winPlayer < bet.stake;

  if (winOutcomes.length === betOutcomesCount) {
    return WIN;
  } else if (lossOutcomes.length > system) {
    return LOSS;
  } else if (isAllVoid) {
    return VOID;
  } else if (isAllRefund) {
    return REFUND;
  } else if (inProgressOutcomes.length && lossOutcomes.length < betOutcomesCount - system + 1) {
    return IN_PROGRESS;
  } else if (isLossRefund) {
    return PART_LOSS;
  } else if (isWinRefund) {
    return PART_WIN;
  }
};

const getOutcomesByResult = (betOutcomes: any[], result: string | string[]) => {
  if (Array.isArray(result)) {
    return betOutcomes.filter((bo) => result.includes(bo.result));
  } else {
    return betOutcomes.filter((bo) => bo.result === result);
  }
};

const processCombo = async (bet) => {
  const currentResult = getMultiResult(bet);

  bet.win = calculateComboWin(bet, currentResult);
  bet.current_possible_win = calculateComboPossibleWin(bet);

  updateBetResult(bet, currentResult);
  await checkBetForClose(bet);

  await Bet.update(bet, {
    where: {
      id: bet.id,
    },
  });
};

const calculateComboWin = (bet, result) => {
  switch (result) {
    case LOSS:
    case IN_PROGRESS:
      return 0;
    default:
      return calculateComboPossibleWin(bet);
  }
};

const calculateComboPossibleWin = (bet) => {
  const oddsMultiply = multiplyBy(bet.betOutcomes, 'oddsCalculated');
  const win = oddsMultiply === 0 ? 0 : bet.stake * oddsMultiply;
  return bigDecimal.round(win, 6);
};

const getMultiResult = (bet) => {
  const oddsMultiply = multiplyBy(bet.betOutcomes, 'oddsCalculated');
  const playerWin = oddsMultiply === 0 ? 0 : bet.stake * oddsMultiply;
  const outcomes = bet.betOutcomes;
  const lossOutcomes = getOutcomesByResult(outcomes, LOSS);
  const inProgressOutcomes = getOutcomesByResult(outcomes, IN_PROGRESS);
  const voidOutcomes = getOutcomesByResult(outcomes, VOID);
  const winOutcomes = getOutcomesByResult(outcomes, WIN);
  const refundOutcomes = getOutcomesByResult(outcomes, REFUND);
  const partLossOutcomes = getOutcomesByResult(outcomes, [LOSS_REFUND, VOID, REFUND]);
  const partWinOutcomes = getOutcomesByResult(outcomes, [WIN_REFUND, VOID, REFUND]);

  if (lossOutcomes.length) {
    return LOSS;
  } else if (inProgressOutcomes.length) {
    return IN_PROGRESS;
  } else if (voidOutcomes.length === outcomes.length) {
    return VOID;
  } else if (winOutcomes.length === outcomes.length) {
    return WIN;
  } else if (refundOutcomes.length === outcomes.length) {
    return REFUND;
  } else if (
    ((partLossOutcomes.length && partLossOutcomes.length < outcomes.length) ||
      (partWinOutcomes.length && partWinOutcomes.length < outcomes.length)) &&
    playerWin < bet.stake
  ) {
    return PART_LOSS;
  } else if (
    ((partLossOutcomes.length && partLossOutcomes.length < outcomes.length) ||
      (partWinOutcomes.length && partWinOutcomes.length < outcomes.length)) &&
    playerWin >= bet.stake
  ) {
    return PART_WIN;
  }
};

const multiplyBy = (array, field) => {
  return array.reduce((accumulator, currentValue) => accumulator * currentValue[field], 1);
};

const processSingle = async (bet) => {
  const currentResult = getOrdinarResult(bet);

  bet.win = calculateSingleWin(bet, currentResult);
  updateBetResult(bet, currentResult);
  await checkBetForClose(bet);

  await Bet.update(bet, {
    where: {
      id: bet.id,
    },
  });
};

const calculateSingleWin = (bet, result) => {
  const calculatedOdd = bet.betOutcomes[0].oddsCalculated;

  switch (result) {
    case LOSS:
    case IN_PROGRESS:
      return 0;
    default:
      const win = calculatedOdd === 0 ? 0 : bet.stake * calculatedOdd;
      return bigDecimal.round(win, 6);
  }
};

const updateBetResult = (bet, currentResult) => {
  if (bet.result !== currentResult) {
    bet.result = currentResult;
    bet.resulted_at = new Date();
  }
};

const checkBetForClose = async (bet) => {
  if (
    bet.result !== null &&
    bet.resulted_at < new Date(Date.now() - (betCloseTime + processedAttempt[bet.proceed_attempts]))
  ) {
    if (await platformSendResult(bet)) {
      bet.closed = 1;
    } else {
      bet.proceed_attempts++;
    }
  }
  return true;
};

const getOrdinarResult = (bet) => {
  const outcome = bet.betOutcomes[0];
  switch (outcome.result) {
    case LOSS_REFUND:
      return PART_LOSS;
    case WIN_REFUND:
      return PART_WIN;
    default:
      return outcome.result;
  }
};

const platformSendResult = async (bet) => {
  let hash_a = [bet.uuid];
  let hash_new = await getHash(hash_a);
  let check = await axios.post(
    PLATFORM_URL,
    {
      method: 'closeBet',
      amount: parseFloat(bet.win),
      bid: bet.uuid,
      hash: hash_a.join('|') + '|' + hash_new,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  if (check.data.status !== true) {
    return false;
  }
  return true;
};

const getHash = (data) => {
  return crypto.createHmac('sha256', SECRET_KEY).update(data.join(',')).digest('hex');
};

export default async function () {
  try {
    if (processes_run === 0) {
      processes_run = 1;
    } else {
      return true;
    }
    if (!SECRET_KEY) {
      let platform = await Platform.findOne({
        attributes: ['special_key', 'data'],
      });
      if (!platform) {
        throw new Error('Platform settings');
      }
      SECRET_KEY = platform['special_key'];
      PLATFORM_URL = platform['data']['platform_url'];
    }
    const bets: any = await Bet.findAll({
      include: [
        {
          model: BetOutcome,
        },
      ],
      where: {
        closed: 0,
        proceed_attempts: Object.keys(processedAttempt),
      },
    });
    for (const bet of bets) {
      if (!bet.betOutcomes.length) {
        continue;
      }
      const processBet = bet.toJSON();
      processBet.betOutcomes = processBet.betOutcomes.map((b) => ({
        ...b,
        oddsCalculated: calculateOdds(b, b.result),
      }));
      switch (processBet.type) {
        case BET_TYPES_ENUM.SINGLE:
          await processSingle(processBet);
          break;
        case BET_TYPES_ENUM.COMBO:
          await processCombo(processBet);
          break;
        case BET_TYPES_ENUM.SYSTEM:
          await processSystem(processBet);
          break;
      }
    }
  } catch (err) {
    log(err);
    processes_run = 0;
  }
  processes_run = 0;
  return;
}
