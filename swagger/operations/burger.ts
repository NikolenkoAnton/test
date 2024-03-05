import { IApiOperationGetArgs } from 'swagger-express-ts';

export const patchBurgerBlock = {
  path: '/blocks/patchMany',
  summary: 'Update many burger blocks',

  parameters: {
    body: {
      model: 'BurgerBlockPatchManyRequest',
    },
  },
  responses: {
    200: { model: 'GetBurgerBlocksResponse' },
  },
};
export const getBurgerBlocks: IApiOperationGetArgs = {
  path: '/blocks',

  summary: 'Get burger blocks',
  responses: {
    200: { model: 'GetBurgerBlocksResponse' },
  },

  parameters: {
    query: {
      id: {
        allowEmptyValue: true,
        type: 'number',
      },
    },
  },
};

export const deleteBurgerBlockItem = {
  path: '/items/delete',
  summary: 'Delete burger item',

  parameters: {
    query: {
      id: {
        allowEmptyValue: false,
        type: 'number',
      },
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};

export const saveBurgerBlockItem = {
  path: '/items/save',
  summary: 'Create or update burger item',

  parameters: {
    body: {
      model: 'UpdateBurgerItemRequest',
    },
  },
  responses: {
    200: { description: 'Success', model: 'BurgerBlock' },
  },
};
