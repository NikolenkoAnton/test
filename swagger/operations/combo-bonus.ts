import { SwaggerDefinitionConstant } from 'swagger-express-ts';
import { ARRAY } from '../swagger-type';

export const saveComboBonusSchema = {
  path: '/save',
  description: 'Saves a combo bonus.',
  summary: 'Save combo bonus',
  parameters: {
    body: { model: 'ComboBonusSaveRequest' },
  },
  responses: {
    200: { description: 'Success', model: 'ComboBonus' },
  },
};

export const getComboBonusSchema = {
  path: '',
  description: 'Retrieves a combo bonuses.',
  summary: 'Get combo bonus',
  parameters: {
    query: {
      id: {
        allowEmptyValue: true,
        type: 'number',
      },
      name: {
        allowEmptyValue: true,
        type: 'string',
      },
      sport_ids: {
        allowEmptyValue: true,
        type: ARRAY,
        format: 'number',
      },
      statuses: {
        allowEmptyValue: true,
        type: ARRAY,
        format: 'string',
      },
    },
  },
  responses: {
    200: {
      type: ARRAY,
      model: 'ComboBonus',
    },
  },
};

export const deleteComboBonusSchema = {
  path: '/delete',
  description: 'Deletes a combo bonus.',
  summary: 'Delete combo bonus',
  parameters: {
    query: {
      id: {
        type: 'number',
      },
    },
  },
  responses: {
    200: { description: 'The combo bonus has been successfully deleted.' },
  },
};
