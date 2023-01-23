import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

import connectMongo from '@/lib/db/ConnectMongo';
import { TUser, User } from '@/lib/db/model/User';
import { ResponseFormat } from '@/lib/ResponseFormat';

const SECRET_KEY = process.env.JWT_KEY ?? 'FAMILYTREE';
const EXPIRES_SEC = 31556926; // 1 year in seconds

connectMongo();

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;
  let user: TUser | null = null;

  try {
    switch (req.method) {
      case 'POST':
        /* Any how email or password is blank */
        if (!email || !password)
          return new ResponseFormat(
            res,
            400,
            'Email/Username or Password is required'
          );

        /* Check user email in database */
        user = await User.findOne({
          $or: [{ email: email }, { _id: email }],
        });

        /* Variables checking */
        if (user) {
          /* Check and compare password */
          bcrypt.compare(password, user.password).then((isMatch) => {
            if (isMatch) {
              /* Create JWT Payload */
              const payload = {
                username: user?._id,
                email: user?.email,
                name: user?.name,
                createdAt: user?.createdAt,
                personId: user?.personId,
              };

              /* Sign token */
              jwt.sign(
                payload,
                SECRET_KEY,
                {
                  expiresIn: EXPIRES_SEC,
                },
                (err, token) => {
                  /* Send succes with token */
                  return new ResponseFormat(res, 200, 'Login success', {
                    token: `Bearer ${token}`,
                  });
                }
              );
            } else return new ResponseFormat(res, 400, 'Password incorrect');
          });
        } else
          return new ResponseFormat(
            res,
            400,
            'User not found with this credential'
          );
        break;
      default:
        return new ResponseFormat(res, 405, 'Method Not Allowed');
    }
  } catch (error) {
    return new ResponseFormat(res, 500, 'Login failed', { error: error });
  }
}
