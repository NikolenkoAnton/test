/** @type {import('sequelize-cli').Migration} */
const OLD_PERIODS = {
  General: {
    '-1': 'NSY',
    80: 'Break Time',
  },
  131506: {
    //"American Football"
    1: '1st Quarter',
    2: '2nd Quarter',
    3: '3rd Quarter',
    4: '4th Quarter',
    40: 'Overtime',
    100: 'Full time',
    101: 'Full time after overtime',
  },
  389537: {
    //Australian Rules
    1: '1st Quarter',
    2: '2nd Quarter',
    3: '3rd Quarter',
    4: '4th Quarter',
    40: 'Overtime',
    100: 'Full time',
    101: 'Full time After overtime',
  },
  1149093: {
    //Badminton
    1: '1st Game',
    2: '2nd Game',
    3: '3rd Game',
    4: '4th Game',
    5: '5th Game',
    100: 'Full time',
  },
  46957: {
    //Bandy
    10: '1st Half',
    20: '2nd Half',
    40: 'Overtime',
    100: 'Full time',
    101: 'Full time after overtime',
  },
  154914: {
    //Baseball
    1: '1st Inning',
    2: '2nd Inning',
    3: '3rd Inning',
    4: '4th Inning',
    5: '5th Inning',
    6: '6th Inning',
    7: '7th Inning',
    8: '8th Inning',
    9: '9th Inning',
    40: 'Extra Innings',
    62: 'Error',
    100: 'Full time',
    101: 'Full time after extra time',
  },
  48242: {
    //Basketball
    1: '1st Quarter',
    2: '2nd Quarter',
    3: '3rd Quarter',
    4: '4th Quarter',
    40: 'Overtime',
    100: 'Full time',
    101: 'Full time after overtime',
  },
  'Basketball - NCAA League exclusive': {
    //todo
    10: '1st Half',
    20: '2nd Half',
    100: 'Full time',
    101: 'Full time after overtime',
    40: 'Overtime',
  },
  621569: {
    //"Beach Volleyball"
    1: '1st Set',
    2: '2nd Set',
    3: '3rd Set',
    100: 'Full time',
  },
  1149113: {
    //Bowls
    1: '1st Set',
    2: '2nd Set',
    100: 'Full time',
    50: 'Tie Break',
  },
  154919: {
    //Boxing
    1: '1st Round',
    2: '2nd Round',
    3: '3rd Round',
    4: '4th Round',
    5: '5th Round',
    6: '6th Round',
    7: '7th Round',
    8: '8th Round',
    9: '9th Round',
    10: '10th Round',
    11: '11th Round',
    12: '12th Round',
    100: 'Full time',
  },
  452674: {
    //Cricket
    10: '1st Inning - Home Team',
    11: '1st Inning - Away Team',
    20: '2nd Inning - Home Team',
    21: '2nd Inning - Away Team',
    70: 'Over',
    80: 'Super Over',
    71: 'Delivery',
    100: 'Full time',
    101: 'Full time after Super Over',
  },
  154923: {
    //Darts
    67: 'Leg',
    100: 'Full time',
  },
  687890: {
    //"E-Games"
    1: '1st Map',
    2: '2nd Map',
    3: '3rd Map',
    4: '4th Map',
    5: '5th Map',
    6: '6th Map',
    7: '7th Map',
    8: '8th Map',
    9: '9th Map',
    65: 'Round',
    100: 'Full time',
  },
  35706: {
    //Floorball
    1: '1st Period',
    2: '2nd Period',
    3: '3rd Period',
    40: 'Overtime',
    50: 'Penalties',
    100: 'Full time',
    101: 'Full time after overtime',
    102: 'Full time after penalties',
  },
  6046: {
    //Football
    10: '1st Half',
    20: '2nd Half',
    25: '3rd Half',
    30: 'Overtime 1st Half',
    35: 'Overtime 2nd Half',
    50: 'Penalties',
    100: 'Full time',
    101: 'Full time after overtime',
    102: 'Full time after penalties',
  },
  687887: {
    //Futsal
    10: '1st Half',
    20: '2nd Half',
    40: 'Overtime 1st Half',
    45: 'Overtime 2nd Half',
    50: 'Penalties',
    100: 'Full time',
    101: 'Full time after overtime',
    102: 'Full time after penalties',
  },
  35709: {
    //Handball
    10: '1st Half',
    20: '2nd Half',
    40: 'Overtime',
    50: 'Penalties',
    100: 'Full time',
    101: 'Full time after overtime',
    102: 'Full time after penalties',
  },
  530129: {
    //"Field Hockey"
    1: '1st Quarter',
    2: '2nd Quarter',
    3: '3rd Quarter',
    4: '4th Quarter',
    40: 'Overtime 1st Half',
    45: 'Overtime 2nd Half',
    50: 'Penalties',
    100: 'Full time',
    101: 'Full time after overtime',
    102: 'Full time after penalties',
  },
  35232: {
    //"Ice Hockey"
    1: '1st Period',
    2: '2nd Period',
    3: '3rd Period',
    40: 'Overtime',
    50: 'Penalties',
    100: 'Full time',
    101: 'Full time after overtime',
    102: 'Full time after penalties',
  },
  1149123: {
    //Kabaddi
    10: '1st Half',
    20: '2nd Half',
    100: 'Full time',
  },
  274792: {
    //"Rugby League"
    10: '1st Half',
    20: '2nd Half',
    40: 'Overtime',
    100: 'Full time',
    101: 'Full time after overtime',
  },
  274791: {
    //"Rugby Union"
    10: '1st Half',
    20: '2nd Half',
    40: 'Overtime',
    100: 'Full time',
    101: 'Full time after overtime',
  },
  262622: {
    //Snooker
    1: '1st Frame',
    2: '2nd Frame',
    3: '3rd Frame',
    4: '4th Frame',
    5: '5th Frame',
    6: '6th Frame',
    7: '7th Frame',
    8: '8th Frame',
    9: '9th Frame',
    10: '10th Frame',
    11: '11th Frame',
    12: '12th Frame',
    13: '13th Frame',
    14: '14th Frame',
    15: '15th Frame',
    16: '16th Frame',
    17: '17th Frame',
    18: '18th Frame',
    19: '19th Frame',
    20: '20th Frame',
    21: '21st Frame',
    22: '22nd Frame',
    23: '23rd Frame',
    24: '24th Frame',
    25: '25th Frame',
    26: '26th Frame',
    27: '27th Frame',
    28: '28th Frame',
    29: '29th Frame',
    30: '30th Frame',
    31: '31st Frame',
    32: '32nd Frame',
    33: '33rd Frame',
    34: '34th Frame',
    35: '35th Frame',
    100: 'Full Time',
  },
  1149122: {
    //SoftBall
    1: '1st Inning',
    2: '2nd Inning',
    3: '3rd Inning',
    4: '4th Inning',
    5: '5th Inning',
    6: '6th Inning',
    7: '7th Inning',
    40: 'Extra Innings',
    100: 'Full time',
    101: 'Full time after extra time',
  },
  265917: {
    //"Table Tennis"
    1: '1st Set',
    2: '2nd Set',
    3: '3rd Set',
    4: '4th Set',
    5: '5th Set',
    6: '6th Set',
    7: '7th Set',
    100: 'Full time',
  },
  54094: {
    //Tennis
    1: '1st Set',
    2: '2nd Set',
    3: '3rd Set',
    4: '4th Set',
    5: '5th Set',
    60: 'Game',
    61: 'Tie Break',
    100: 'Full time',
  },
  154830: {
    //Volleyball
    1: '1st Set',
    2: '2nd Set',
    3: '3rd Set',
    4: '4th Set',
    5: '5th Set',
    50: 'Golden Set',
    100: 'Full time',
    102: 'Full time after Golden Set',
  },
  388764: {
    //Waterpolo
    1: '1st Quarter',
    2: '2nd Quarter',
    3: '3rd Quarter',
    4: '4th Quarter',
    40: 'Overtime',
    50: 'Penalties',
    100: 'Full time',
    101: 'Full time after overtime',
    102: 'Full time after penalties',
  },
  1149104: {
    //Squash
    1: '1st Set',
    2: '2nd Set',
    3: '3rd Set',
    4: '4th Set',
    5: '5th Set',
    100: 'Full time',
  },
  1149097: {
    //Netball
    1: '1st Quarter',
    2: '2nd Quarter',
    3: '3rd Quarter',
    4: '4th Quarter',
    30: 'Overtime 1st Half',
    35: 'Overtime 2nd Half',
    100: 'Full time',
    101: 'Full time after overtime',
  },
  307126: {
    //Curling
    1: 'In Progress',
    100: 'Full time',
  },
  1149124: {
    //AUDL
    298: '1st Quarter',
    299: '2nd Quarter',
    300: '3rd Quarter',
    301: '4th Quarter',
    302: 'FT',
  },
  1149125: {
    //Padel
    310: '1st Set',
    311: '2nd Set',
    312: '3rd Set',
    302: 'FT',
  },
};
const PERIODS = {
  General: {
    '-1': 'NSY',
    80: 'BT',
  },
  131506: {
    //"American Football"
    1: '1Q',
    2: '2Q',
    3: '3Q',
    4: '4Q',
    40: 'OT',
    100: 'FT',
    101: 'FT after OT',
  },
  389537: {
    //Australian Rules
    1: '1Q',
    2: '2Q',
    3: '3Q',
    4: '4Q',
    40: 'OT',
    100: 'FT',
    101: 'FT after OT',
  },
  1149093: {
    //Badminton
    1: '1G',
    2: '2G',
    3: '3G',
    4: '4G',
    5: '5G',
    100: 'FT',
  },
  46957: {
    //Bandy
    10: '1H',
    20: '2H',
    40: 'OT',
    100: 'FT',
    101: 'FT after OT',
  },
  154914: {
    //Baseball
    1: '1I',
    2: '2I',
    3: '3I',
    4: '4I',
    5: '5I',
    6: '6I',
    7: '7I',
    8: '8I',
    9: '9I',
    40: 'EI',
    62: 'Er',
    100: 'FT',
    101: 'FT after OT',
  },
  48242: {
    //Basketball
    1: '1Q',
    2: '2Q',
    3: '3Q',
    4: '4Q',
    40: 'OT',
    100: 'FT',
    101: 'FT after OT',
  },
  'Basketball - NCAA League exclusive': {
    //todo
    10: '1H',
    20: '2H',
    100: 'FT',
    101: 'FT after OT',
    40: 'OT',
  },
  621569: {
    //"Beach Volleyball"
    1: '1S',
    2: '2S',
    3: '3S',
    100: 'FT',
  },
  1149113: {
    //Bowls
    1: '1S',
    2: '2S',
    100: 'FT',
    50: 'TB',
  },
  154919: {
    //Boxing
    1: '1R',
    2: '2R',
    3: '3R',
    4: '4R',
    5: '5R',
    6: '6R',
    7: '7R',
    8: '8R',
    9: '9R',
    10: '10R',
    11: '11R',
    12: '12R',
    100: 'FT',
  },
  452674: {
    //Cricket
    10: '1I HT',
    11: '1I AT',
    20: '2I HT',
    21: '2I AT',
    70: 'O',
    80: 'SO',
    71: 'D',
    100: 'FT',
    101: 'FT after OT',
  },
  154923: {
    //Darts
    67: 'L',
    100: 'FT',
  },
  687890: {
    //"E-Games"
    1: '1M',
    2: '2M',
    3: '3M',
    4: '4M',
    5: '5M',
    6: '6M',
    7: '7M',
    8: '8M',
    9: '9M',
    65: 'R',
    100: 'FT',
  },
  35706: {
    //Floorball
    1: '1P',
    2: '2P',
    3: '3P',
    40: 'OT',
    50: 'P',
    100: 'FT',
    101: 'FT after OT',
    102: 'FT after P',
  },
  6046: {
    //Football
    10: '1H',
    20: '2H',
    25: '3H',
    30: 'OT1H',
    35: 'OT2H',
    50: 'P',
    100: 'FT',
    101: 'FT after O',
    102: 'FT after P',
  },
  687887: {
    //Futsal
    10: '1H',
    20: '2H',
    40: 'OT1H',
    45: 'OT2H',
    50: 'P',
    100: 'FT',
    101: 'FT after OT',
    102: 'FT after P',
  },
  35709: {
    //Handball
    10: '1H',
    20: '2H',
    40: 'OT',
    50: 'P',
    100: 'FT',
    101: 'FT after OT',
    102: 'FT after P',
  },
  530129: {
    //"Field Hockey"
    1: '1Q',
    2: '2Q',
    3: '3Q',
    4: '4Q',
    40: 'OT1H',
    45: 'OT2H',
    50: 'P',
    100: 'FT',
    101: 'FT after OT',
    102: 'FT after P',
  },
  35232: {
    //"Ice Hockey"
    1: '1P',
    2: '2P',
    3: '3P',
    40: 'OT',
    50: 'P',
    100: 'FT',
    101: 'FT after OT',
    102: 'FT after P',
  },
  1149123: {
    //Kabaddi
    10: '1H',
    20: '2H',
    100: 'FT',
  },
  274792: {
    //"Rugby League"
    10: '1H',
    20: '2H',
    40: 'O',
    100: 'FT',
    101: 'FT after OT',
  },
  274791: {
    //"Rugby Union"
    10: '1H',
    20: '2H',
    40: 'OT',
    100: 'FT',
    101: 'FT after OT',
  },
  262622: {
    //Snooker
    1: '1F',
    2: '2F',
    3: '3F',
    4: '4F',
    5: '5F',
    6: '6F',
    7: '7F',
    8: '8F',
    9: '9F',
    10: '10F',
    11: '11F',
    12: '12F',
    13: '13F',
    14: '14F',
    15: '15F',
    16: '16F',
    17: '17F',
    18: '18F',
    19: '19F',
    20: '20F',
    21: '21F',
    22: '22F',
    23: '23F',
    24: '24F',
    25: '25F',
    26: '26F',
    27: '27F',
    28: '28F',
    29: '29F',
    30: '30F',
    31: '31F',
    32: '32F',
    33: '33F',
    34: '34F',
    35: '35F',
    100: 'FT',
  },
  1149122: {
    //SoftBall
    1: '1I',
    2: '2I',
    3: '3I',
    4: '4I',
    5: '5I',
    6: '6I',
    7: '7I',
    40: 'ExI',
    100: 'FT',
    101: 'FT after ex t',
  },
  265917: {
    //"Table Tennis"
    1: '1S',
    2: '2S',
    3: '3S',
    4: '4S',
    5: '5S',
    6: '6S',
    7: '7S',
    100: 'FT',
  },
  54094: {
    //Tennis
    1: '1S',
    2: '2S',
    3: '3S',
    4: '4S',
    5: '5S',
    60: 'G',
    61: 'TB',
    100: 'FT',
  },
  154830: {
    //Volleyball
    1: '1S',
    2: '2S',
    3: '3S',
    4: '4S',
    5: '5S',
    50: 'GS',
    100: 'FT',
    102: 'FT after GS',
  },
  388764: {
    //Waterpolo
    1: '1Q',
    2: '2Q',
    3: '3Q',
    4: '4Q',
    40: 'OT',
    50: 'P',
    100: 'FT',
    101: 'FT after OT',
    102: 'FT after P',
  },
  1149104: {
    //Squash
    1: '1S',
    2: '2S',
    3: '3S',
    4: '4S',
    5: '5S',
    100: 'FT',
  },
  1149097: {
    //Netball
    1: '1Q',
    2: '2Q',
    3: '3Q',
    4: '4Q',
    30: 'OT1H',
    35: 'OT2H',
    100: 'FT',
    101: 'FT after OT',
  },
  307126: {
    //Curling
    1: 'IP',
    100: 'FT',
  },
  1149124: {
    //AUDL
    298: '1Q',
    299: '2Q',
    300: '3Q',
    301: '4Q',
    302: 'FT',
  },
  1149125: {
    //Padel
    310: '1S',
    311: '2S',
    312: '3S',
    302: 'FT',
  },
};

function mapPeriods(oldPeriods, newPeriods) {
  const result = new Set();

  for (const sportId in oldPeriods) {
    const oldSportPeriods = oldPeriods[sportId];
    const newSportPeriods = newPeriods[sportId];

    if (oldSportPeriods && newSportPeriods) {
      for (const oldPeriodId in oldSportPeriods) {
        const oldPeriod = oldSportPeriods[oldPeriodId];
        const newPeriod = newSportPeriods[oldPeriodId];

        if (oldPeriod && newPeriod) {
          result.add(JSON.stringify([oldPeriod, newPeriod]));
        }
      }
    }
  }

  return Array.from(result).map((pair) => JSON.parse(pair));
}

const result = mapPeriods(OLD_PERIODS, PERIODS);
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      for (const periods of result) {
        await queryInterface.sequelize.query(`UPDATE bb_game SET period = $2 WHERE period = $1`, {
          bind: [periods[0], periods[1]],
          transaction,
        });
      }

      await transaction.commit();
    } catch (e) {
      console.error(e);
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      for (const periods of result) {
        await queryInterface.sequelize.query(`UPDATE bb_game SET period = $1 WHERE period = $2`, {
          bind: [periods[0], periods[1]],
          transaction,
        });
      }

      await transaction.commit();
    } catch (e) {
      console.error(e);
      await transaction.rollback();
      throw err;
    }
  },
};
