import { IApiOperationDeleteArgs, IApiOperationGetArgs, IApiOperationPostArgs } from 'swagger-express-ts';
import { ARRAY } from '../swagger-type';

export const getCmsFooterBlockTypes: IApiOperationGetArgs = {
  path: '/blocks/types',
  summary: 'Get  cms footer block types',

  responses: {
    200: { description: 'Success', model: 'CmsFooterBlockTypeResponse', type: ARRAY },
  },
};

export const getCmsFooterBlock: IApiOperationPostArgs = {
  path: '/blocks',
  summary: 'Get cms footer blocks ',

  responses: {
    200: { description: 'Success', model: 'CmsFooterBlockResponse', type: ARRAY },
  },
  parameters: { body: { model: 'BodyWithBlockId' } },
};

export const saveCmsFooterBlock: IApiOperationPostArgs = {
  path: '/blocks/save',
  summary: 'Save cms footer block',

  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
  parameters: { body: { model: 'CreateCmsFooterBlockRequest' } },
};

export const saveCmsFooterGroup: IApiOperationPostArgs = {
  path: '/groups/save',
  summary: 'Save cms footer group',

  responses: {
    200: { description: 'Success', model: 'CmsFooterGroupResponse' },
  },
  parameters: { body: { model: 'CreateCmsFooterGroupRequest' } },
};

export const saveCmsFooterElement: IApiOperationPostArgs = {
  path: '/elements/save',
  summary: 'Save cms footer element',

  responses: {
    200: { description: 'Success', model: 'CmsFooterGroupElementResponse' },
  },
  parameters: { body: { model: 'CreateCmsFooterGroupElementRequest' } },
};

export const deleteCmsFooterBlock: IApiOperationDeleteArgs = {
  path: '/blocks/delete',
  summary: 'Delete cms footer block',

  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
  parameters: { body: { model: 'BodyWithBlockId' } },
};

export const deleteCmsFooterGroup: IApiOperationDeleteArgs = {
  path: '/groups/delete',
  summary: 'Delete cms footer group',

  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
  parameters: { body: { model: 'BodyWithGroupId' } },
};

export const deleteCmsFooterElement: IApiOperationDeleteArgs = {
  path: '/elements/delete',
  summary: 'Delete cms footer element',

  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
  parameters: { body: { model: 'BodyWithElementId' } },
};

export const updateCmsFooterBlocks = {
  path: '/blocks/update',
  summary: 'Update cms footer blocks',

  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
  parameters: { body: { model: 'UpdateCmsFooterRowBlockRequest' } },
};
