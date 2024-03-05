import { createParamDecorator } from 'routing-controllers';

export function UserFromRequest(options: { required?: boolean } = { required: true }) {
  return createParamDecorator({
    required: options && options.required ? true : false,
    value: (action) => {
      const user = action.request.user.get({ plain: true });
      return user;
    },
  });
}
