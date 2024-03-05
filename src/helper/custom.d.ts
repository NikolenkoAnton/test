import { User } from '../db/models';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      userPermissions?: string[];
    }
  }
}
