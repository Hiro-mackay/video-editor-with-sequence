import React, { FC, memo, useEffect, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { Timeline } from './Timeline';

interface IMTE {
  id: string;
  text: string;
  length: number; // ミリ秒
}

export interface SequenceProps {
  items: Array<IMTE>;
  sequenceScale: number;
  changeItemHandler: (state: any) => void;
}

export const Sequence: FC<SequenceProps> = memo(({ items, changeItemHandler, sequenceScale }) => {
  return (
    <ReactSortable
      className="flex flex-nowrap w-min"
      list={items}
      setList={changeItemHandler}
      swapThreshold={0.8}
      ghostClass="bg-green-300"
      animation={300}
      delay={1}
    >
      {items.map((item) => (
        <Timeline key={item.id} length={item.length} sequenceScale={sequenceScale} />
      ))}
    </ReactSortable>
  );
});
