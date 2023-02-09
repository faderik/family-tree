/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

import { TMember } from '@/lib/db/model/Member';

import MemberBox from '@/components/MemberBox';

type TreeProps = {
  tree: any;
  oldest: TMember;
  deleteMember: (id: string) => void;
};

export default function Tree(props: TreeProps) {
  const { tree, oldest } = props;

  const [treeState, setTreeState] = React.useState<any>([]);

  React.useEffect(() => {
    setTreeState(tree);
  }, [tree]);

  return (
    <div className='flex flex-col items-center gap-4'>
      {treeState.map((gen: [TMember]) => (
        <div
          key={'gen' + treeState.indexOf(gen)}
          className='flex items-center gap-4'
        >
          {gen.map((member) => (
            <MemberBox
              key={'mem' + member._id}
              member={member}
              oldest={oldest._id == member._id}
              deleteMember={props.deleteMember}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
