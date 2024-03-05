export const getLanguages = {
  path: '',
  summary: 'Get languages data',
  description: 'Returns languages data',

  parameters: {
    body: {
      model: 'GetLanguagesDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'GetLanguagesResponseDto' },
  },
};

export const saveLanguage = {
  path: '/save',
  summary: 'Add language data',
  description: 'Adds or updates language data',

  parameters: {
    body: {
      model: 'CreateLanguageRequest',
    },
    formData: {
      icon: {
        name: 'Language icon',
      },
    },
  },
  responses: {
    200: { description: 'Success', model: 'TranslateLanguage' },
  },
};

export const updateLanguage = {
  path: '/update',
  summary: 'Edit language data',
  description: 'Updates language data',

  parameters: {
    body: {
      model: 'UpdateLanguageRequest',
    },
    formData: {
      icon: {
        name: 'Language icon',
      },
    },
  },
  responses: {
    200: { description: 'Success', model: 'TranslateLanguage' },
  },
};

export const patchManyLanguages = {
  path: '/patchMany',
  description: 'Patch many languages',
  summary: 'Patch languages active and position fields',

  parameters: {
    body: {
      model: 'PatchActiveAndPositionDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};

export const deleteLanguage = {
  path: '/delete',
  description: 'Delete languages',
  summary: 'Delete language and chained content',
  parameters: {
    query: {
      id: {
        type: 'number',
      },
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};
