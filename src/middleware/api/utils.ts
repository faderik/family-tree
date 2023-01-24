import { NextApiResponse } from 'next';

import { TUser, User } from '@/lib/db/model/User';
import { ResponseFormat } from '@/lib/ResponseFormat';

import { verifyToken } from '@/middleware/utils';

export async function validateAutorization(
  authorization: string,
  res: NextApiResponse
) {
  if (!authorization) return new ResponseFormat(res, 401, 'Unauthorized');
  const token = authorization.split(' ')[1];
  const decoded = (await verifyToken(token)) as TUser & {
    username: string;
  };

  const checkUser: TUser | null = await User.findById(decoded?.username);
  if (!checkUser) return new ResponseFormat(res, 401, 'User not found');

  return checkUser;
}

export async function getUser(authorization: string) {
  const token = authorization.split(' ')[1];
  const decoded = (await verifyToken(token)) as TUser & {
    username: string;
  };

  const checkUser: TUser | null = await User.findById(decoded?.username);
  if (!checkUser) return null;

  return checkUser;
}
