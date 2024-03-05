import { IApiOperationGetArgs } from 'swagger-express-ts';
import { BOOLEAN } from '../swagger-type';

export const getNote: IApiOperationGetArgs = {
  path: '',
  description: 'Return note list',
  summary: 'Get notes list',
  parameters: {
    query: {
      page: {
        allowEmptyValue: true,
        type: 'number',
      },
      per_page: {
        allowEmptyValue: true,
        type: 'number',
      },
      path: {
        allowEmptyValue: false,
        type: 'string',
      },
    },
  },
  responses: {
    200: { description: 'Success', model: 'GetNotesResponse' },
  },
};

export const getUnreadNotesCount: IApiOperationGetArgs = {
  path: '/unread-count',
  description: 'Return unread notes count',
  summary: 'Get unread notes count by path',
  parameters: {
    query: {
      path: {
        allowEmptyValue: false,
        type: 'string',
      },
    },
  },
  responses: {
    200: { description: 'Success', model: 'UnreadNotesCountResponse' },
  },
};

export const saveNoteSchema = {
  path: '/save',
  summary: 'Save note',

  responses: {
    200: { description: 'Success', model: 'NoteResponses' },
  },
  parameters: {
    body: {
      model: 'NoteSaveRequest',
    },
  },
};
