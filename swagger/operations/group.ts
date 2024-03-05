import { IApiOperationGetArgs } from 'swagger-express-ts';
import { ARRAY } from '../swagger-type';

export const getGroupsSchema: IApiOperationGetArgs = {
  path: '',

  summary: 'Get platform groups',
  parameters: {
    query: {
      search: {
        allowEmptyValue: true,
        type: 'string',
      },
    },
  },
  responses: {
    200: { model: 'GroupResponse', type: ARRAY },
  },
};
