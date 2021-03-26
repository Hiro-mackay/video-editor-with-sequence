import React, { FC, memo, useEffect, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { Timeline } from './Timeline';

interface IMTE {
  id: string;
}

export interface SequenceProps {
  items: Array<IMTE>;
  sequenceScale: number;
  changeItemHandler: (state: any) => void;
}

export const Sequence: FC<SequenceProps> = memo(({ items, sequenceScale }) => {
  const [timelines, setTimelines] = useState<Array<IMTE>>(items);

  useEffect(() => {
    console.log(items);
  }, [timelines]);

  return (
    <ReactSortable
      className="flex flex-nowrap w-min"
      list={timelines}
      setList={setTimelines}
      swapThreshold={0.8}
      ghostClass="bg-green-400"
      animation={300}
      delay={1}
    >
      {items.map((item) => (
        <Timeline length={200} sequenceScale={sequenceScale} />
      ))}
    </ReactSortable>
  );
});
