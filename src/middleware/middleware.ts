import { Request } from 'express';
import { ForbiddenError, NotAuthorizedError } from '../helper/errors';
import { Permission, Role, User } from '../db/models';
import { flatten, includes, map, omit, uniq } from 'lodash';
import { OPEN_ROUTES } from '../helper/constants';

export const PUBLIC_URLS = [
  '/user/auth',
  '/user/permission',
  '/user/forgot',
  '/user/create-pass',
  '/user/update-profile',
  '/currency/currencies',
  '/data/event/search',
  '/data/event-short',
  '/data/event',
  '/data/category-short',
  '/data/competition-short',
  '/data/event-short',
  '/template/markets/search',
  '/category/categories/search',
  '/competition/competitions/search',
  '/game/games/search',
  '/bet/config/columns',
  '/user/me',
  '/widget/get-all-category-by-event',
  '/widget/get-all-competition-by-category',
  '/widget/get-all-events-by-competition',
  '/widget/get-all-event',
  '/combo-bonus/save',
];

export async function userAuth(request: Request, response: any, next?: (err?: any) => any): Promise<any> {
  const token = request.headers['boauth'];
  if (!token) {
    return next();
  }

  let user: User = await User.findOne({
    where: { remember_token: token },
    include: {
      model: Role,
      include: [Permission],
    },
    plain: true,
  });
  if (!user) {
    return next();
  }

  const permissions = uniq(
    flatten(map(user.roles, (role) => map(role.permissions, (permission) => permission.name.toString()))),
  );

  request.userPermissions = permissions;

  request.user = user;

  return next();
}

/** It is important that this middleware applied AFTER userAuth (above) */
export function permissionsCheck(request: Request, response: any, next?: (err?: any) => any): any {
  const publicUrls = Array.from(PUBLIC_URLS);

  let urlToCompare = request.originalUrl.replace(/^\//, '').replace(/\?.+$/, '');

  const isOpenRoute = [...OPEN_ROUTES].some((route) => urlToCompare.startsWith(route));

  if (!includes(publicUrls, `/${urlToCompare}`) && !includes(request.userPermissions, urlToCompare) && !isOpenRoute) {
    const error = request.user
      ? new NotAuthorizedError()
      : new ForbiddenError('You are not allowed to make this action');
    throw error;
  }

  return next();
}

export function loggingBefore(request: Request, response: any, next?: (err?: any) => any): any {
  // const req = Object.assign(request.query, request.params, request.body);
  // console.log(request.method, request.originalUrl, request);
  next();
}

export function loggingAfter(request: any, response: any, next?: (err?: any) => any): any {
  const req = Object.assign(request.query, request.params, request.body);
  if (req.password) {
    req.password = '******';
  }
  // console.log(`User ${request.user ? request.user.id : undefined}:`, request.method, request.originalUrl, req);
  next();
}

export function unlessIncludes(pathPart, middleware) {
  return function (req, res, next) {
    if (req.path.includes(pathPart)) {
      return next();
    } else {
      return middleware(req, res, next);
    }
  };
}
