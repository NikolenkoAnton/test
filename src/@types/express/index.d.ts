import { Express } from 'express-serve-static-core';
import { User } from '../../db/models';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      userPermissions?: string[];
    }
  }

  type OrderByType = 'asc' | 'desc';
}
