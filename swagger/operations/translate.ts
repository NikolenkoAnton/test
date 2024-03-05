export const getTranslateKeys = {
  path: '/keys',
  summary: 'Get localization keys',
  description: 'Returns list of localization keys',

  parameters: {
    body: {
      model: 'GetTranslateKeysDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'GetTranslateKeysResponseDto' },
  },
};

export const getTranslateKeysGroups = {
  path: '/keys/groups',
  summary: 'Get localization keys groups',
  description: 'Returns list of localization keys groups',

  responses: {
    200: { description: 'Success', model: 'GetTranslateKeysGroupsResponseDto' },
  },
};

export const getTranslateKeyValues = {
  path: '/key/values',
  summary: 'Get localization key values',
  description: 'Returns object with localization key values',

  parameters: {
    body: {
      model: 'GetTranslateKeyValuesDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'GetTranslateKeyValuesResponse' },
  },
};

export const saveTranslateKey = {
  path: '/keys/save',
  summary: 'Save/update localization key',
  description: 'Saves or updates localization key',

  parameters: {
    body: {
      model: 'SaveTranslateKeyDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};

export const deleteTranslateKey = {
  path: '/keys/delete',
  summary: 'Delete localization key',
  description: 'Deletes localization key',

  parameters: {
    body: {
      model: 'DeleteTranslateKeyDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};
