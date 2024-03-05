import { IApiOperationGetArgs, IApiOperationPatchArgs, IApiOperationPostArgs } from 'swagger-express-ts';
import { ARRAY } from '../swagger-type';

export const getCmsHeaderBlocks: IApiOperationGetArgs = {
  path: '/blocks',
  summary: 'Get cms header blocks',

  responses: { 200: { description: 'Success', model: 'CmsHeaderBlockResponse', type: ARRAY } },
};

export const updateCmsHeaderBlocks: IApiOperationPatchArgs = {
  path: '/blocks/update',
  summary: 'Update cms header blocks',

  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
  parameters: { body: { model: 'PatchActiveAndPositionDto' } },
};

export const updateCmsHeaderBlockText: IApiOperationPostArgs = {
  path: '/blocks/text-update',
  summary: 'Update cms header block text',

  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
  parameters: { body: { model: 'CmsHeaderBlockRequest' } },
};
