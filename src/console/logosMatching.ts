/**
import pg from 'pg';
const { Pool } = pg;

const pool1 = new Pool({
  user: process.env.DB_USERNAME,
  host: '116.203.157.118',
  database: 'betting-db',
  password: 'AHJWivK0kpwc',
  port: process.env.DB_PORT,
  //#DB_USERNAME=betradar_user
  // #DB_PASSWORD=AHJWivK0kpwc
  // #DB_HOST=116.203.157.118
  // #DB_DATABASE=betting-db
  // max: 200,
  // idle: 1000
});
const pool2 = new Pool({
  user: process.env.DB_USERNAME,
  host: 'localhost',
  database: 'betting_dev',
  password: 'Q9s92JdVd',
  port: process.env.DB_PORT,
  //DB_HOST=localhost
  // DB_DATABASE=betting_dev
  // DB_USERNAME=betradar_user
  // DB_PASSWORD=Q9s92JdVd
  // max: 200,
  // idle: 1000
});

const maxImageId = 500000;

const iterations = [
  {
    sport_id_1: 237,
    sport_ids_2: [34, 56, 75, 94, 113, 132, 151, 170, 189, 208, 227],
    name: 'Golf',
  },
  {
    sport_id_1: 228,
    sport_ids_2: [33],
    name: 'Baseball',
  },
  {
    sport_id_1: 227,
    sport_ids_2: [35, 57, 76, 95, 114, 133, 152, 171, 190, 209, 228],
    name: 'Cricket',
  },
  {
    sport_id_1: 239,
    sport_ids_2: [23, 30, 24, 27],
    name: 'E-Games',
  },
  {
    sport_id_1: 284,
    sport_ids_2: [40, 53, 72, 91, 110, 129, 148, 167, 186, 205, 224],
    name: 'Handball',
  },
  {
    sport_id_1: 281,
    sport_ids_2: [32],
    name: 'Hockey',
  },
  {
    sport_id_1: 222,
    sport_ids_2: [36, 58, 77, 96, 115, 134, 153, 172, 191, 210, 229],
    name: 'Rugby League',
  },
  {
    sport_id_1: 221,
    sport_ids_2: [36, 58, 77, 96, 115, 134, 153, 172, 191, 210, 229],
    name: 'Rugby Union',
  },
  {
    sport_id_1: 275,
    sport_ids_2: [44, 63, 82, 101, 120, 139, 158, 177, 196, 215],
    name: 'Waterpolo',
  },
  {
    sport_id_1: 282,
    sport_ids_2: [29],
    name: 'Football',
  },
  {
    sport_id_1: 225,
    sport_ids_2: [31, 51, 70, 89, 108, 127, 146, 165, 184, 203, 222],
    name: 'Basketball',
  },
  {
    sport_id_1: 234,
    sport_ids_2: [42, 61, 80, 99, 118, 137, 156, 175, 194, 213],
    name: 'Badminton',
  },
  {
    sport_id_1: 285,
    sport_ids_2: [39, 54, 73, 92, 111, 130, 149, 168, 187, 206, 225],
    name: 'Beach Volleyball',
  },
  {
    sport_id_1: 261,
    sport_ids_2: [28],
    name: 'Bowls',
  },
  {
    sport_id_1: 226,
    sport_ids_2: [32],
    name: 'Hockey',
  },
  {
    sport_id_1: 286,
    sport_ids_2: [39, 54, 73, 92, 111, 130, 149, 168, 187, 206, 225],
    name: 'Volleyball',
  },
  {
    sport_id_1: 278,
    sport_ids_2: [52, 71, 90, 109, 128, 147, 166, 185, 204, 223],
    name: 'American Football',
  },
  {
    sport_id_1: 231,
    sport_ids_2: [25, 38, 55, 74, 93, 112, 131, 150, 169, 188, 207, 226],
    name: 'Tennis',
  },
  {
    sport_id_1: 287,
    sport_ids_2: [26, 41, 60, 79, 98, 117, 136, 155, 174, 193, 212],
    name: 'Table Tennis',
  },
  {
    sport_id_1: 230,
    sport_ids_2: [47, 66, 85, 104, 123, 142, 161, 180, 199, 218],
    name: 'Boxing',
  },
  {
    sport_id_1: 244,
    sport_ids_2: [46, 65, 84, 103, 122, 141, 160, 179, 198, 217],
    name: 'Cycling',
  },
];

import stringComparison from 'string-comparison';
import type { SortMatchResultType } from 'string-comparison';
import { QueryTypes } from 'sequelize';

console.log(stringComparison.levenshtein.similarity('Fca Darmstadt', 'SV Darmstadt 98'));

export default async function () {
  try {
    const progress = 0;
    for (let i = progress; i < iterations.length; i++) {
      const iteration = iterations[i];
      const teamsToUpdate = await getTeamsToUpdate(iteration);
      const teamsCompareWith = await getTeamsCompareWith(iteration);

      const teamsCompareWithNames = teamsCompareWith.map((t) => t.team_name);

      console.log(`Iteration: ${i}`);
      console.log(`Teams to update: ${teamsToUpdate.length}`);
      let currentTeamNum = 0;
      for (const teamLsport of teamsToUpdate) {
        currentTeamNum++;
        const res = stringComparison.levenshtein
          .sortMatch(teamLsport.team_name, teamsCompareWithNames)
          .sort((a, b) => b.rating - a.rating) as SortMatchResultType[];

        // console.log(res);
        const mostMatch = res[0].rating >= 0.7 ? res[0] : null;
        let teamSS;
        if (mostMatch) {
          teamSS = teamsCompareWith.find((t) => t.team_name === mostMatch.member);
        }
        // console.log(teamSS);
        try {
          await pool2.query(
            `
            INSERT INTO public.logos_match (ss_team_name, lsport_team_name, ss_provider_team_id, lsport_provider_team_id, sport_name)
            VALUES ($1, $2, $3, $4, $5) 
            `,
            [
              teamSS?.team_name,
              teamLsport.team_name,
              teamSS?.ss_provider_team_id,
              teamLsport.lsport_provider_team_id,
              iteration.name,
            ],
          );
        } catch (err) {
          console.error(err);
        }
        //ss_team_name, lsport_team_name, ss_provider_team_id, lsport_provider_team_id, sport_name
        if (currentTeamNum % 50 === 0) {
          console.log(`Teams ${currentTeamNum} of ${teamsToUpdate.length}`);
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
  return;
}

const getTeamsToUpdate = async (iteration) => {
  const q = await pool1.query(
    `SELECT t.external_id as lsport_provider_team_id, t.en as team_name, s.en as sport_name, s.id
        FROM public.bb_team as t
        INNER JOIN bb_sport AS s ON t.sport_id = s.id
        WHERE sport_id = $1
        ORDER BY ID ASC`,
    [iteration.sport_id_1],
  );

  return q.rows;
};
const getTeamsCompareWith = async (iteration) => {
  const q = await pool2.query(
    `SELECT MIN(provider_team_id) as ss_provider_team_id, t.name as team_name, s.name as sport_name, s.id
    FROM public.team as t
    INNER JOIN sport AS s ON t.sport_id = s.id
    WHERE s.id = ANY($1::int[])
    GROUP BY t.name, s.name, s.id`,
    [iteration.sport_ids_2],
  );
  return q.rows;
};
*/
/**
 * cehckLogosAi
 *
 * import OpenAI from 'openai';
 * import pg from 'pg';
 * const { Pool } = pg;
 *
 * const openai = new OpenAI({
 *   apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
 * });
 *
 * const pool = new Pool({
 *   user: process.env.DB_USERNAME,
 *   host: 'localhost',
 *   database: 'betting_dev',
 *   password: 'Q9s92JdVd',
 *   port: process.env.DB_PORT,
 *   //DB_HOST=localhost
 *   // DB_DATABASE=betting_dev
 *   // DB_USERNAME=betradar_user
 *   // DB_PASSWORD=Q9s92JdVd
 *   // max: 200,
 *   // idle: 1000
 * });
 *
 * export default async function () {
 *   try {
 *     const count: any = await teamsCount();
 *
 *     let recordNum = 0;
 *     while (true) {
 *       const record = await getTeamsToApprove();
 *       if (!record) break;
 *       recordNum++;
 *
 *       const { id, ss_team_name, lsport_team_name, sport_name } = record;
 *
 *       const prompt = `I have 2 sport teams of sport ${sport_name}.
 *         team 1: ${ss_team_name.toLowerCase().trim()}
 *         team 2: ${lsport_team_name.toLowerCase().trim()}.
 *         Are these teams the same?
 *         Answer only by digit: 1 or 0
 *         Despite everything`;
 *
 *       const chatCompletion: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create({
 *         messages: [{ role: 'user', content: prompt }],
 *         model: 'gpt-4',
 *         temperature: 0.2,
 *       });
 *
 *       try {
 *         const decision = parseInt(chatCompletion.choices[0].message.content);
 *
 *         await updateRecord(decision, id);
 *       } catch (e) {
 *         await updateRecord(2, id);
 *         console.error(chatCompletion);
 *         console.error(e);
 *         continue;
 *       }
 *
 *       console.log(`${recordNum} of ${count}`);
 *       // await wait(2000);
 *     }
 *   } catch (err) {
 *     console.error(err);
 *   }
 * }
 *
 * const teamsCount = async () => {
 *   const query = `
 *     SELECT COUNT(*) AS count
 *     FROM public.logos_match
 *     WHERE
 *      lsport_provider_team_id IS NOT NULL
 *       AND ss_provider_team_id IS NOT NULL
 *       AND ai_approved_2 IS NULL;
 *   `;
 *
 *   const result = await pool.query(query);
 *   const count = result.rows[0].count;
 *
 *   console.log('Number of rows:', count);
 *   return count;
 * };
 *
 * const getTeamsToApprove = async () => {
 *   const q = await pool.query(
 *     `SELECT
 *         id,
 *         ss_team_name,
 *         lsport_team_name,
 *         sport_name,
 *         ai_approved
 *       FROM
 *         public.logos_match
 *       WHERE
 *         lsport_provider_team_id IS NOT NULL
 *         AND ss_provider_team_id IS NOT NULL
 *         AND ai_approved_2 IS NULL
 *       ORDER BY ID ASC
 *       LIMIT 1`,
 *   );
 *
 *   return q.rows.length ? q.rows[0] : null;
 * };
 *
 * const updateRecord = async (newApprovedValue: number, idValue: number) => {
 *   const query = {
 *     text: 'UPDATE public.logos_match SET ai_approved_2 = $1 WHERE id = $2',
 *     values: [newApprovedValue, idValue],
 *   };
 *
 *   return pool.query(query);
 * };
 *
 * const wait = (ms: number) => {
 *   return new Promise((resolve) => {
 *     setTimeout(resolve, ms);
 *   });
 * };
 */

/**
 * fixLogosAi
 *
 * import pg from 'pg';
 * const { Pool } = pg;
 *
 * const pool = new Pool({
 *   user: process.env.DB_USERNAME,
 *   host: 'localhost',
 *   database: 'betting_dev',
 *   password: 'Q9s92JdVd',
 *   port: process.env.DB_PORT,
 *   //DB_HOST=localhost
 *   // DB_DATABASE=betting_dev
 *   // DB_USERNAME=betradar_user
 *   // DB_PASSWORD=Q9s92JdVd
 *   // max: 200,
 *   // idle: 1000
 * });
 *
 * export default async function () {
 *   try {
 *     const toUpdateTeams = await teamsToUpdate();
 *     for (const team of toUpdateTeams) {
 *       const teamNameToFind = stripRegexPattern(team.lsport_team_name).trim();
 *       const compared = teamNameToFind === team.ss_team_name;
 *       if (teamNameToFind === 'Venezuela') {
 *         console.log(123);
 *       }
 *       if (compared) {
 *         await updateRecord(1, team.id);
 *       }
 *     }
 *   } catch (err) {
 *     console.error(err);
 *   }
 * }
 *
 * const teamsToUpdate = async () => {
 *   const query = `
 *     SELECT *
 *     FROM public.logos_match
 *     WHERE
 *      lsport_provider_team_id IS NOT NULL
 *       AND ss_provider_team_id IS NOT NULL
 *       AND ai_approved_2 = 0
 *       AND lsport_team_name ~* '^(.*)(U21|U20|U17|U19|W|U23)$'
 *   `;
 *
 *   const result = await pool.query(query);
 *   return result.rows;
 * };
 *
 * const findTeamByLsportName = async (name, sport) => {
 *   const sql = `
 *     SELECT *
 *     FROM public.logos_match
 *     WHERE
 *      lsport_provider_team_id IS NOT NULL
 *       AND ss_provider_team_id IS NOT NULL
 *       AND ai_approved_2 = 1
 *       AND lsport_team_name = $1
 *       AND sport_name = $2
 *   `;
 *   const query = {
 *     text: sql,
 *     values: [name, sport],
 *   };
 *
 *   const result = await pool.query(query);
 *   if (result.rows.length > 1) {
 *     throw new Error(`more then one ${name}`);
 *   }
 *   return result.rows[0];
 * };
 *
 * const updateRecord = async (newApprovedValue: number, idValue: number) => {
 *   const query = {
 *     text: 'UPDATE public.logos_match SET ai_approved_2 = $1 WHERE id = $2',
 *     values: [newApprovedValue, idValue],
 *   };
 *
 *   return pool.query(query);
 * };
 *
 * const wait = (ms: number) => {
 *   return new Promise((resolve) => {
 *     setTimeout(resolve, ms);
 *   });
 * };
 *
 * function stripRegexPattern(str) {
 *   const pattern = /(U21|U20|U17|U19|W|U23)/g;
 *   return str.replace(pattern, '');
 * }
 */
