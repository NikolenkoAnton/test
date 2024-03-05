import { log } from '../helper/sentry';
import sequelize from '../db';
import { Op, Transaction } from 'sequelize';
import { BET_RESULTS_ENUM, BET_TYPES_ENUM, OUTCOME_STATUSES_ENUM } from '../helper/bet_constants';
import { Bet, BetOutcome } from '../db/models';
import { map, result, sum, sumBy } from 'lodash';
import GameOutcome from '../db/models/GameOutcome';
import { Combination } from 'js-combinatorics';
import { systemVariationCount } from '../helper/systemVariationCount';
import bigDecimal from 'js-big-decimal';

const { LOSS_REFUND, LOSS, REFUND, WIN_REFUND, CANCEL, WIN, VOID } = OUTCOME_STATUSES_ENUM;
const IN_PROGRESS = null;

interface CustomBet {
  type: string;
  stake: number;
  current_possible_win: number;
  currency_value: number;
  betOutcomes: {
    gameOutcome: {
      result: string | null;
    };
    odds: number;
  }[];
}

const processSystem = async (betOutcome, bet, transaction) => {
  const { gameOutcome } = betOutcome;
  const { system } = bet;

  const combinations = new Combination(map(bet.betOutcomes, 'oddsCalculated'), system).toArray();
  const winPlayer = combinations.reduce((sum, innerArray) => {
    const multiplyResult = innerArray.reduce((product, num) => product * num, 1);
    return sum + multiplyResult;
  }, 0);

  const toUpdate: any = {
    result: gameOutcome.result,
    pool: calculateComboOrSystemPool(bet),
    risk: calculateSystemRisk(bet, gameOutcome, betOutcome, winPlayer),
    profit: calculateSystemProfit(bet, gameOutcome, winPlayer),
  };

  toUpdate.pool = bigDecimal.round(toUpdate.pool, 6);
  toUpdate.risk = bigDecimal.round(toUpdate.risk, 6);
  toUpdate.profit = bigDecimal.round(toUpdate.profit, 6);

  await BetOutcome.update(toUpdate, {
    where: { id: betOutcome.id },
    transaction,
  });
  console.log(toUpdate);
};

const calculateSystemRisk = (bet, gameOutcome, betOutcome, winPlayer) => {
  const { result } = gameOutcome;
  if (result === LOSS || result !== IN_PROGRESS) {
    return 0;
  }
  const inProgressOutcomes = filterOutcomesByResult(bet.betOutcomes, [IN_PROGRESS]);

  if (inProgressOutcomes.length === 0) {
    return 0;
  }
  const { system, betOutcomes, stake } = bet;
  const winInProgressOutcomes = betOutcomes.filter((bo) => [WIN, IN_PROGRESS].includes(bo.gameOutcome.result));
  const lossOutcomes = betOutcomes.filter((bo) => [LOSS].includes(bo.gameOutcome.result));
  const oddsSum = sumBy(inProgressOutcomes, 'oddsCalculated');

  const isAllVoid = betOutcomes.every((bo) => bo.gameOutcome.result === VOID);
  const isAllRefund = betOutcomes.every((bo) => bo.gameOutcome.result === REFUND);
  const isLoss = lossOutcomes.length > system;

  const isWinInProgress = winInProgressOutcomes.length === betOutcomes.length;
  const winPlayerEur = winPlayer / bet.currency_value;
  const isWinRefund = lossOutcomes.length < system && winPlayerEur >= bet.stake;

  const isLossRefund = lossOutcomes.length < system && winPlayerEur < bet.stake;

  const outcomes = betOutcomes.filter((bo) => [IN_PROGRESS].includes(bo.gameOutcome.result));
  if (isWinInProgress || isWinRefund) {
    return ((betOutcome.oddsCalculated - 1) / (oddsSum - outcomes.length)) * (winPlayerEur - stake);
  } else if (isAllVoid || isLoss || isAllRefund || isLossRefund) {
    return 0;
  }

  return 0;
};

const calculateSystemProfit = (bet, gameOutcome, winPlayer) => {
  if (gameOutcome.result === IN_PROGRESS) {
    return 0;
  }
  const { system, betOutcomes, stake } = bet;
  const betOutcomesCount = betOutcomes.length;

  const winOutcomes = betOutcomes.filter((bo: any) => bo.gameOutcome.result === WIN);
  const lossOutcomes = betOutcomes.filter((bo: any) => bo.gameOutcome.result === LOSS);

  const isAllVoid = betOutcomes.every((bo: any) => bo.gameOutcome.result === VOID);
  const isAllRefund = betOutcomes.every((bo: any) => bo.gameOutcome.result === REFUND);

  const winWinRefundOrVoidOutcomes = betOutcomes.filter((bo: any) =>
    [WIN, WIN_REFUND, VOID, REFUND].includes(bo.gameOutcome.result),
  );

  const lossLossRefundOrVoidOutcomes = betOutcomes.filter((bo: any) =>
    [LOSS, LOSS_REFUND, VOID, REFUND].includes(bo.gameOutcome.result),
  );

  const winPlayerEur = winPlayer / bet.currency_value;

  const isWinRefund = lossOutcomes.length < system && winPlayerEur >= bet.stake;

  const isLossRefund = lossOutcomes.length < system && winPlayerEur < bet.stake;

  // Betslip Result= Win (all tickets)
  if (winOutcomes.length === betOutcomesCount) {
    return (stake - winPlayerEur) / betOutcomesCount;
  }
  // Betslip Result= Void or Refund.
  else if (isAllVoid || isAllRefund) {
    return 0;
  }
  // Betslip Result= Loss Refund
  else if (isLossRefund) {
    if ([WIN, WIN_REFUND, VOID, REFUND].includes(gameOutcome.result)) {
      return 0;
    }
    return (stake - winPlayerEur) / (betOutcomesCount - winWinRefundOrVoidOutcomes.length);
  }
  // Betslip Result= Win Refund
  else if (isWinRefund) {
    if ([LOSS, LOSS_REFUND, VOID, REFUND].includes(gameOutcome.result)) {
      return 0;
    }
    return (stake - winPlayerEur) / (betOutcomesCount - lossLossRefundOrVoidOutcomes.length);
  } else if (winOutcomes.length < system || winOutcomes.length >= system) {
    if (gameOutcome.result === LOSS) {
      return (stake - winPlayerEur) / (betOutcomesCount - winOutcomes.length);
    }
    return 0;
  }

  return 0;
};

const processMulti = async (betOutcome, bet, transaction) => {
  const { gameOutcome } = betOutcome;
  const toUpdate: any = {
    result: gameOutcome.result,
    pool: calculateComboOrSystemPool(bet),
    risk: calculateComboRisk(betOutcome, bet),
    profit: calculateComboProfit(gameOutcome.result, bet),
  };

  toUpdate.pool = bigDecimal.round(toUpdate.pool, 6);
  toUpdate.risk = bigDecimal.round(toUpdate.risk, 6);
  toUpdate.profit = bigDecimal.round(toUpdate.profit, 6);

  await BetOutcome.update(toUpdate, {
    where: { id: betOutcome.id },
    transaction,
  });
  console.log(toUpdate);
};

const calculateComboOrSystemPool = (bet) => {
  return bet.stake / bet.betOutcomes.length;
};

const calculateComboRisk = (betOutcome, bet) => {
  const { result } = betOutcome.gameOutcome;
  const lossOutcomes = filterOutcomesByResult(bet.betOutcomes, [LOSS]);
  const inProgressOutcomes = filterOutcomesByResult(bet.betOutcomes, [IN_PROGRESS]);

  if (inProgressOutcomes.length === 0 || lossOutcomes.length) {
    return 0;
  }

  if (result !== IN_PROGRESS) {
    return 0;
  } else {
    const outcomes = filterOutcomesByResult(bet.betOutcomes, [IN_PROGRESS]);
    const oddsSum = sumBy(outcomes, 'oddsCalculated');
    const oddsCount = outcomes.length;
    return ((betOutcome.oddsCalculated - 1) / (oddsSum - oddsCount)) * (bet.current_possible_win - bet.stake);
  }
};

const calculateComboProfit = (result, bet) => {
  if (result === IN_PROGRESS) {
    return 0;
  }
  const fullOrPartlyWinOutcomes = filterOutcomesByResult(bet.betOutcomes, [WIN, WIN_REFUND, LOSS_REFUND]);
  const voidRefundOutcomes = filterOutcomesByResult(bet.betOutcomes, [REFUND, VOID]);
  const lossOutcomes = filterOutcomesByResult(bet.betOutcomes, [LOSS]);

  const oddsMultiply = multiplyBy(bet.betOutcomes, 'oddsCalculated');
  const totalProfit = bet.stake - bet.stake * oddsMultiply;

  if (fullOrPartlyWinOutcomes.length === bet.betOutcomes.length) {
    return totalProfit / bet.betOutcomes.length;
  } else if (voidRefundOutcomes.length === bet.betOutcomes.length) {
    return 0;
  } else if (lossOutcomes.length > 0) {
    if (result === LOSS) {
      return totalProfit / (bet.betOutcomes.length - fullOrPartlyWinOutcomes.concat(voidRefundOutcomes).length);
    }
    return 0;
  }
  return 0;
};

const multiplyBy = (array, field) => {
  return array.reduce((accumulator, currentValue) => accumulator * currentValue[field], 1);
};

const processOrdinar = async (betOutcome, bet, transaction: Transaction | null) => {
  const { gameOutcome } = betOutcome;

  const toUpdate: any = {
    result: gameOutcome.result,
    pool: bet.stake,
    risk: calculateOrdinarRisk(betOutcome, bet),
    profit: calculateOrdinarProfit(betOutcome, bet),
  };

  toUpdate.pool = bigDecimal.round(toUpdate.pool, 6);
  toUpdate.risk = bigDecimal.round(toUpdate.risk, 6);
  toUpdate.profit = bigDecimal.round(toUpdate.profit, 6);

  await BetOutcome.update(toUpdate, {
    where: {
      id: betOutcome.id,
    },
    transaction,
  });
  // console.log(toUpdate);
};

const calculateOrdinarRisk = (betOutcome, bet) => {
  const { oddsCalculated, gameOutcome } = betOutcome;
  const { result } = gameOutcome;
  if (result !== IN_PROGRESS) {
    return 0;
  } else {
    return bet.stake * oddsCalculated - bet.stake;
  }
};

const calculateOrdinarProfit = (betOutcome, bet) => {
  const { result } = betOutcome.gameOutcome;
  if ([VOID, LOSS, WIN, REFUND, LOSS_REFUND, WIN_REFUND].includes(result)) {
    return bet.stake - bet.stake * betOutcome.oddsCalculated;
  } else {
    return 0;
  }
};

function filterOutcomesByResult(outcomes, resultArray) {
  return outcomes.filter((bo) => resultArray.indexOf(bo.gameOutcome.result) > -1);
}

export const calculateOdds = (betOutcome, result) => {
  switch (result) {
    case LOSS_REFUND:
      return 0.5;
    case WIN_REFUND:
      return (betOutcome.odds + 1) / 2;
    case VOID:
    case REFUND:
      return 1;
    case LOSS:
      return 0;
    default:
      return betOutcome.odds;
  }
};

const calculateStakeAndPossibleWin = (bet: any, currency_value: number) => {
  const updatedStake = bet.stake / currency_value;
  const updatedPossibleWin = bet.current_possible_win / currency_value;

  return {
    stake: updatedStake,
    current_possible_win: updatedPossibleWin,
  };
};

export default async function () {
  const filterOutcomesSql = `SELECT DISTINCT bbbo.bet_id
            FROM
                bb_bet_outcome bbbo
            INNER JOIN
                bb_game_outcome bbgo ON bbbo.game_outcome_id = bbgo.id
            INNER JOIN
                bb_bet ON bb_bet.id = bbbo.bet_id
            WHERE
                bbbo.result IS DISTINCT FROM bbgo.result`;

  const bets = (await Bet.findAll({
    include: [
      {
        model: BetOutcome,
        include: [
          {
            model: GameOutcome,
          },
        ],
      },
    ],
    where: {
      // id: 2765,
      id: {
        [Op.in]: sequelize.literal(`(${filterOutcomesSql})`),
      },
    },
  })) as unknown as CustomBet[];

  if (!bets.length) {
    return;
  }

  for (let bet of bets) {
    const transaction = await sequelize.transaction();
    try {
      bet = (bet as any).toJSON();
      bet.betOutcomes = bet.betOutcomes.map((b) => ({
        ...b,
        oddsCalculated: calculateOdds(b, b.gameOutcome.result),
      }));
      const { stake, current_possible_win } = calculateStakeAndPossibleWin(bet, bet.currency_value);
      bet = { ...bet, stake, current_possible_win };

      for (const betOutcomeProcess of bet.betOutcomes) {
        switch (bet.type) {
          case BET_TYPES_ENUM.SINGLE:
            await processOrdinar(betOutcomeProcess, bet, transaction);
            break;
          case BET_TYPES_ENUM.COMBO:
            await processMulti(betOutcomeProcess, bet, transaction);
            break;
          case BET_TYPES_ENUM.SYSTEM:
            await processSystem(betOutcomeProcess, bet, transaction);
            break;
        }
      }
      await transaction.commit();
    } catch (err) {
      log(err);
      await transaction.rollback();
    }
  }
  return;
}
