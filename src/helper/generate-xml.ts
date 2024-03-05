import { BetResponse } from '../dto/response/.';
import { create } from 'xmlbuilder2';
import path from 'path';
import config from '../config';
import stringToStream from 'string-to-stream';

export const generateXmlFile = (rows: BetResponse[]) => {
  const root = create(
    { version: '1.0', encoding: 'UTF-8', standalone: true },
    {
      root: {
        bet: rows,
      },
    },
  );
  const xml = root.end({ prettyPrint: true });

  return stringToStream(xml);
};
