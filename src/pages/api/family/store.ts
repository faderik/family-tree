import { NextApiRequest, NextApiResponse } from 'next';

import connectMongo from '@/lib/db/ConnectMongo';
import { Family } from '@/lib/db/model/Family';
import { ResponseFormat } from '@/lib/ResponseFormat';

import { getUser, validateAutorization } from '@/middleware/api/utils';

connectMongo();

export default async function store(req: NextApiRequest, res: NextApiResponse) {
  const { authorization } = req.headers;

  try {
    if (req.method == 'POST') {
      await validateAutorization(authorization ?? '', res);
      const user = await getUser(authorization ?? '');

      if (!user) return new ResponseFormat(res, 401, 'User not found');

      const famId = req.body.fam_id;
      const checkFam = await Family.findById(famId);
      if (checkFam)
        return new ResponseFormat(res, 400, 'Family ID already taken');

      const doc = new Family();
      doc._id = famId;
      doc.name = req.body.fam_name;
      doc.userId = user?._id;

      doc.save((err, doc) => {
        if (err)
          return new ResponseFormat(res, 500, 'Error while storing family', {
            error: err.message,
          });
        else
          return new ResponseFormat(res, 200, 'Family successfully added', {
            family: doc,
          });
      });
    } else return new ResponseFormat(res, 405, 'Method not allowed');
  } catch (error) {
    return new ResponseFormat(res, 500, 'POST failed', { error: error });
  }
}
