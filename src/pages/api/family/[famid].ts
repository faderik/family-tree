import { NextApiRequest, NextApiResponse } from 'next';

import connectMongo from '@/lib/db/ConnectMongo';
import { Family } from '@/lib/db/model/Family';
import { ResponseFormat } from '@/lib/ResponseFormat';

connectMongo();

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  const { famid } = req.query;

  try {
    if (req.method == 'GET') {
      const family = await Family.findById(famid);

      if (family)
        return new ResponseFormat(res, 200, 'family successfully retrieved', {
          family,
        });
      else return new ResponseFormat(res, 404, 'Family not found');
    } else return new ResponseFormat(res, 405, 'Method not allowed');
  } catch (error) {
    return new ResponseFormat(res, 500, 'GET failed', { error: error });
  }
}