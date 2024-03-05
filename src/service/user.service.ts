import { Service } from 'typedi';
import { Permission, Role, User } from '../db/models';
import { flatten, map, uniqBy } from 'lodash';

@Service()
export class UserService {
  async getUserPermissions(userId: number): Promise<Permission[]> {
    const user = await User.findOne({
      where: { id: userId },
      include: {
        model: Role,
        include: [Permission],
      },
    });

    return uniqBy(flatten(map(user.roles, (role) => role.permissions)), 'id');
  }
}
