import { NextApiRequest, NextApiResponse } from 'next';

import connectMongo from '@/lib/db/ConnectMongo';
import { Family } from '@/lib/db/model/Family';
import { Member } from '@/lib/db/model/Member';
import { ResponseFormat } from '@/lib/ResponseFormat';

import { getUser, validateAutorization } from '@/middleware/api/utils';

connectMongo();

export default async function add_member(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { authorization } = req.headers;
  const { familyId, name, gender, birthDate, deathDate, parentId, coupleId } =
    req.body;

  if (!familyId) return new ResponseFormat(res, 422, 'Family ID is required');
  if (!name) return new ResponseFormat(res, 422, 'Member name is required');
  if (!birthDate)
    return new ResponseFormat(res, 422, 'Member birthDate is required');

  try {
    if (req.method == 'POST') {
      await validateAutorization(authorization ?? '', res);
      const user = await getUser(authorization ?? '');
      if (!user) return new ResponseFormat(res, 401, 'User not found');

      const family = await Family.findById(familyId);
      if (!family) return new ResponseFormat(res, 400, 'Family not found');

      const checkSameMemberName = await Member.findOne({
        familyId: familyId,
        name,
      });
      if (checkSameMemberName)
        return new ResponseFormat(
          res,
          400,
          'Member name already exists in this family'
        );

      const checkMemberInFamily = await Member.findOne({ familyId: familyId });

      const doc = new Member();
      doc.name = name;
      doc.gender = gender;
      doc.birthDate = birthDate;
      doc.deathDate = deathDate;
      doc.parentId = parentId;
      doc.coupleId = coupleId;
      doc.familyId = familyId;
      doc.createdAt = new Date();

      if (!checkMemberInFamily) {
        family.oldestId = doc._id;
      }

      const result = await doc.save();
      if (result.errors)
        return new ResponseFormat(res, 500, 'Error while adding member', {
          error: result.errors,
        });
      else {
        await family.save();
        return new ResponseFormat(res, 201, 'Member successfully added', {
          family,
          member: result,
        });
      }
    } else return new ResponseFormat(res, 405, 'Method not allowed');
  } catch (error) {
    return new ResponseFormat(res, 500, 'POST failed', { error: error });
  }
}
