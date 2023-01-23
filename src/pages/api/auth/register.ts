import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

import connectMongo from '@/lib/db/ConnectMongo';
import { TUser, User } from '@/lib/db/model/User';
import { ResponseFormat } from '@/lib/ResponseFormat';

const EXPIRES_SEC = 31556926; // 1 year in seconds
const SECRET_KEY = process.env.JWT_KEY ?? 'FAMILYTREE';

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
          $or: [{ email: email }, { _id: username }],
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

        if (user) {
          const payload = {
            username: user?._id,
            email: user?.email,
            name: user?.name,
            createdAt: user?.createdAt,
            personId: user?.personId,
          };

          /* Sign token */
          const token = jwt.sign(payload, SECRET_KEY, {
            expiresIn: EXPIRES_SEC,
          });

          return new ResponseFormat(res, 201, 'Registration success', {
            token: token,
          });
        } else return new ResponseFormat(res, 500, 'User not created');

      default:
        return new ResponseFormat(res, 405, 'Method Not Allowed');
    }
  } catch (error) {
    return new ResponseFormat(res, 500, 'Registration failed', {
      error: error,
    });
  }
}
