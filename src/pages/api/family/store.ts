import { NextApiRequest, NextApiResponse } from 'next';

import connectMongo from '@/lib/db/ConnectMongo';
import { Family } from '@/lib/db/model/Family';
import { ResponseFormat } from '@/lib/ResponseFormat';

import { getUser, validateAutorization } from '@/middleware/api/utils';

connectMongo();

export default async function store(req: NextApiRequest, res: NextApiResponse) {
  const { authorization } = req.headers;
  const { fam_id, fam_name } = req.body;

  if (!fam_id) return new ResponseFormat(res, 422, 'Family ID is required');
  if (!fam_name) return new ResponseFormat(res, 422, 'Family name is required');

  try {
    if (req.method == 'POST') {
      await validateAutorization(authorization ?? '', res);
      const user = await getUser(authorization ?? '');

      if (!user) return new ResponseFormat(res, 401, 'User not found');

      const checkFam = await Family.findById(fam_id);
      if (checkFam)
        return new ResponseFormat(res, 400, 'Family ID already taken');

      const doc = new Family();
      doc._id = fam_id;
      doc.name = fam_name;
      doc.userId = user?._id;

      doc.save((err, doc) => {
        if (err)
          return new ResponseFormat(res, 500, 'Error while storing family', {
            error: err.message,
          });
        else
          return new ResponseFormat(res, 201, 'Family successfully added', {
            family: doc,
          });
      });
    } else return new ResponseFormat(res, 405, 'Method not allowed');
  } catch (error) {
    return new ResponseFormat(res, 500, 'POST failed', { error: error });
  }
}
