import { NextApiRequest, NextApiResponse } from 'next';

import connectMongo from '@/lib/db/ConnectMongo';
import { Family } from '@/lib/db/model/Family';
import { TUser, User } from '@/lib/db/model/User';
import { ResponseFormat } from '@/lib/ResponseFormat';

import { verifyToken } from '@/middleware/utils';

connectMongo();

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  const { authorization } = req.headers;

  try {
    if (req.method == 'GET') {
      if (!authorization) return new ResponseFormat(res, 401, 'Unauthorized');
      const token = authorization.split(' ')[1];
      const decoded = (await verifyToken(token)) as TUser & {
        username: string;
      };

      const checkUser: TUser | null = await User.findById(decoded?.username);
      if (!checkUser) return new ResponseFormat(res, 401, 'User not found');

      const families = await Family.find({
        userId: decoded?.username,
      });

      if (families)
        return new ResponseFormat(res, 200, 'Families successfully retrieved', {
          families,
        });
      else return new ResponseFormat(res, 404, 'Families not found');
    } else return new ResponseFormat(res, 405, 'Method not allowed');
  } catch (error) {
    return new ResponseFormat(res, 500, 'GET failed', { error: error });
  }
}
