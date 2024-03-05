export const meSchema = {
  path: '/me',
  description: 'Returns user data and permissions',

  responses: {
    200: { description: 'Success', model: 'UserResponseDto' },
  },
};

export const auth = {
  path: '/auth',
  description: 'Returns auth token and name',
  summary: 'Authentication of the user',
  parameters: {
    body: {
      model: 'AuthDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'UserResponseDto' },
  },
};

export const permission = {
  path: '/permission',
  summary: 'Get current user permission data',
  description: 'Returns current user permission data',

  responses: {
    200: { description: 'Success', model: 'UserPermissionResponseDto' },
  },
};

export const updateProfile = {
  path: '/update-profile',
  description: 'Returns success',
  summary: 'Update self profile',

  parameters: {
    body: {
      model: 'UpdateProfileDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};

export const forgot = {
  path: '/forgot',
  description: 'Returns success if email exist',
  summary: 'Forgot password of the user',
  parameters: {
    body: {
      model: 'ForgotDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};

export const createPass = {
  path: '/create-pass',
  description: 'Rewrite old user password',
  summary: 'Forgot password of the user',
  parameters: {
    body: {
      model: 'CreatePassDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};

export const getLogs = {
  path: '/logs',
  description: 'Returns user log events',
  summary: 'Get user logs',

  parameters: {
    body: {
      model: 'GetLogsDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'GetUserLogsResponseDto' },
  },
};

export const getUsers = {
  path: '/users',
  description: 'Returns list of user data',
  summary: 'Get user list',

  parameters: {
    body: {
      model: 'GetUsersDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'GetUsersResponseDto' },
  },
};

export const getUser = {
  path: '',
  description: 'Returns user data by id',
  summary: 'Get user',

  parameters: {
    query: {
      id: {
        allowEmptyValue: false,
        type: 'number',
      },
    },
  },
  responses: {
    200: { description: 'Success', model: 'UserResponseDto' },
  },
};

export const getPermissions = {
  path: '/permissions',
  description: 'Returns list of permissions',
  summary: 'Get permissions list',

  parameters: {
    body: {
      model: 'GetPermissionsDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'GetRolesResponseDto' },
  },
};

export const getRoles = {
  path: '/roles',
  description: 'Returns list of roles data',
  summary: 'Get roles list',

  parameters: {
    body: {
      model: 'GetRolesDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'GetRolesResponseDto' },
  },
};

export const saveRole = {
  path: '/roles/save',
  description: 'Create or update role data',
  summary: 'Save role',

  parameters: {
    body: {
      model: 'SaveRoleDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};

export const deleteRole = {
  path: '/roles/delete',
  description: 'Deletes a role',
  summary: 'Delete role',

  parameters: {
    body: {
      model: 'DeleteRoleDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};

export const saveUser = {
  path: '/users/save',
  description: 'Creates or updates user',
  summary: 'Save user',

  parameters: {
    body: {
      model: 'SaveUserDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'UserResponseDto' },
  },
};

export const activities = {
  path: '/activities',
  description: 'Get user activities',
  summary: 'User activities list',

  parameters: {
    body: {
      model: 'ActivitiesDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'ActivitiesResponseDto' },
  },
};
