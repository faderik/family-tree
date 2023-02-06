/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next';

import connectMongo from '@/lib/db/ConnectMongo';
import { Family } from '@/lib/db/model/Family';
import { Member } from '@/lib/db/model/Member';
import { ResponseFormat } from '@/lib/ResponseFormat';

connectMongo();

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  const { famid } = req.query;

  try {
    if (req.method == 'GET') {
      const family = await Family.findById(famid);
      const members = await Member.find({ familyId: famid })
        .populate('couple')
        .select('-__v');
      const oldest = await Member.findById(family?.oldestId)
        .populate('couple')
        .select('-__v');

      const backupMembers = [...members];
      const famTree: any[] = [
        // [erik]
        // [erik.adi, erik.budi]
        // [adi.cloe, adi.clara, budi.david, budi.diana]
      ];

      if (oldest) {
        // Finding the oldest member
        famTree[0] = [oldest];
        const oldestIdx = members.findIndex(
          (member) => member._id.valueOf() == oldest._id.valueOf()
        );
        members.splice(oldestIdx, 1);

        // First generation & Filter non parent member
        [...members].map(async (member) => {
          if (member.parentId) {
            const parentIsOldest =
              member.parentId.valueOf() == oldest._id.valueOf();

            if (parentIsOldest) {
              if (!famTree[1]) famTree.push([member]);
              else famTree[1].push(member);

              members.splice(members.indexOf(member), 1);
            }
          } else {
            members.splice(members.indexOf(member), 1);
          }
        });

        // Separate member based on their parent
        let famDepth = 1;
        while (members.length > 0) {
          famDepth++;

          for (let i = 0; i < famTree[famDepth - 1].length; i++) {
            const parent = famTree[famDepth - 1][i];
            const isArray = Array.isArray(parent);

            if (!isArray) {
              [...members].map(async (member) => {
                if (member.parentId) {
                  if (member.parentId.valueOf() == parent._id.valueOf()) {
                    if (!famTree[famDepth]) famTree[famDepth] = [member];
                    else {
                      famTree[famDepth] = [...famTree[famDepth], member];
                    }

                    members.splice(members.indexOf(member), 1);
                  }
                } else {
                  members.splice(members.indexOf(member), 1);
                }
              });
            } else {
              // console.log('P: ', parent);
            }
          }
        }
      }

      // return new ResponseFormat(res, 200, 'DEBUG', {
      //   family,
      //   oldest,
      //   members: backupMembers,
      //   famTree,
      // });

      if (family)
        return new ResponseFormat(
          res,
          200,
          'Family detail successfully retrieved',
          {
            family,
            members: backupMembers,
            famTree,
            oldest,
          }
        );
      else return new ResponseFormat(res, 404, 'Family not found');
    } else return new ResponseFormat(res, 405, 'Method not allowed');
  } catch (error) {
    return new ResponseFormat(res, 500, 'GET failed', { error });
  }
}
