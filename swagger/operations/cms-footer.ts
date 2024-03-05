import { IApiOperationPostArgs } from 'swagger-express-ts';

//#region  Elements actions
export const createCmsFooterElement: IApiOperationPostArgs = {
  path: '/elements/save',
  summary: 'Create new element for static page header',

  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
  parameters: { body: { model: 'CreateFooterGroupElement' } },
};

export const deleteCmsFooterElement: IApiOperationPostArgs = {
  path: '/elements/delete',
  summary: 'Delete element of static page block',

  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
  parameters: { body: { model: 'BodyWithElementId' } },
};
//#endregion

//#region  Text block actions
export const saveCmsFooterTextBlockItem: IApiOperationPostArgs = {
  path: '/text/save',

  parameters: {
    body: {
      model: 'SaveCmsFooterTextBlockDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'GetCmsFooterTextResponseDto' },
  },
};

export const getCmsFooterTexts: IApiOperationPostArgs = {
  path: '/text',

  parameters: {
    body: {
      model: 'GetByCmsFooterBlockDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'GetCmsFooterTextResponseDto' },
  },
};

export const removeCmsFooterTexts: IApiOperationPostArgs = {
  path: '/text/delete',

  parameters: {
    body: {
      model: 'RemoveCmsFooterTextDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};
//#endregion

//#region Logo block actions
export const saveCmsFooterLogo: IApiOperationPostArgs = {
  path: '/logo/save',

  parameters: {
    body: {
      model: 'SaveCmsFooterLogoBlockDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};

export const getCmsFooterLogo: IApiOperationPostArgs = {
  path: '/logo',

  parameters: {
    body: {
      model: 'GetByCmsFooterBlockDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'GetCmsFooterLogoResponseDto' },
  },
};

export const deleteCmsFooterLogo: IApiOperationPostArgs = {
  path: '/logo/delete',

  parameters: {
    body: {
      model: 'DeleteByIdDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};

export const patchFooterLogo = {
  path: '/logo/patchMany',
  description: 'Patch Footer Logo',
  summary: 'Patch Footer Logo active and position fields',

  parameters: {
    body: {
      model: 'PatchActiveAndPositionDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};
//#endregion

//#region Chat block actions
export const saveCmsFooterChat: IApiOperationPostArgs = {
  path: '/chat/save',

  parameters: {
    body: {
      model: 'SaveCmsFooterChatBlockDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};

export const getCmsFooterChat: IApiOperationPostArgs = {
  path: '/chat',

  parameters: {
    body: {
      model: 'GetByCmsFooterBlockDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'CmsFooterChat' },
  },
};

export const deleteCmsFooterChat: IApiOperationPostArgs = {
  path: '/chat/delete',

  parameters: {
    body: {
      model: 'DeleteByIdDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};

//#endregion

//#region Chat block actions
export const saveCmsFooterValidator: IApiOperationPostArgs = {
  path: '/validator/save',

  parameters: {
    body: {
      model: 'SaveCmsFooterValidatorBlockDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'CmsFooterValidator' },
  },
};

export const getCmsFooterValidator: IApiOperationPostArgs = {
  path: '/validator',

  parameters: {
    body: {
      model: 'GetByCmsFooterBlockDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'CmsFooterValidator' },
  },
};

export const deleteCmsFooterValidator: IApiOperationPostArgs = {
  path: '/validator/delete',

  parameters: {
    body: {
      model: 'DeleteByIdDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};

//#endregion
