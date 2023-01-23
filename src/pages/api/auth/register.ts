import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';

import connectMongo from '@/lib/db/ConnectMongo';
import { TUser, User } from '@/lib/db/model/User';
import { ResponseFormat } from '@/lib/ResponseFormat';

connectMongo();

export default async function register(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password, username, name, confirmPassword } = req.body;
  let user: TUser | null = null;

  try {
    switch (req.method) {
      case 'POST':
        /* Request Validation */
        if (!email || !password || !username)
          return new ResponseFormat(
            res,
            400,
            'Email, Username, and Password is required'
          );

        if (password != confirmPassword)
          return new ResponseFormat(res, 400, 'Password not match');

        /* Check user email/_id in database */
        user = await User.findOne({
          $or: [{ email: email }, { _id: email }],
        });

        if (user)
          return new ResponseFormat(res, 400, 'Email/Username already taken');

        /* Create user in database */
        user = await User.create({
          _id: username,
          email: email,
          name: name,
          password: await bcrypt.hash(password, 8),
          createdAt: new Date(),
        });

        if (user)
          return new ResponseFormat(res, 201, 'Registration success', {
            user: user,
          });
        else return new ResponseFormat(res, 500, 'User not crated');

      default:
        return new ResponseFormat(res, 405, 'Method Not Allowed');
    }
  } catch (error) {
    return new ResponseFormat(res, 500, 'Registration failed', {
      error: error,
    });
  }
}
