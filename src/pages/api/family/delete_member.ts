import { NextApiRequest, NextApiResponse } from 'next';

import connectMongo from '@/lib/db/ConnectMongo';
import { Member } from '@/lib/db/model/Member';
import { ResponseFormat } from '@/lib/ResponseFormat';

import { getUser, validateAutorization } from '@/middleware/api/utils';

connectMongo();

export default async function destroy(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { authorization } = req.headers;
  const { memberId } = req.body;

  if (!memberId) return new ResponseFormat(res, 422, 'Member ID is required');

  try {
    if (req.method == 'POST') {
      await validateAutorization(authorization ?? '', res);
      const user = await getUser(authorization ?? '');

      if (!user) return new ResponseFormat(res, 401, 'User not found');

      const doc = await Member.findById(memberId);
      if (doc) {
        // Cek if member have any child
        const checkChild = await Member.find({ parent: memberId });
        if (checkChild) {
          return new ResponseFormat(res, 400, 'Canot delete member with child');
        }

        const result = await doc.remove();
        return new ResponseFormat(
          res,
          200,
          'Member successfully deleted',
          result
        );
      } else return new ResponseFormat(res, 400, 'Member not found');
    } else return new ResponseFormat(res, 405, 'Method not allowed');
  } catch (error) {
    return new ResponseFormat(res, 500, 'POST failed', { error: error });
  }
}
