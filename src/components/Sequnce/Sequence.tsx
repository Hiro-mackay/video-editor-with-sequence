import React, { FC, memo, useEffect, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { useCanvasContext } from '../../contexts/canvas';
import { useSequenceContext } from '../../contexts/Sequence';
import { useCanvas } from '../../hooks/Pixi';
import { Timeline } from './Timeline';

interface IMTE {
  id: string;
  text: string;
  length: number; // ミリ秒
}

export const Sequence: FC = memo(() => {
  const { setResources } = useCanvasContext();
  const { Canvas } = useCanvas();
  const { sequenceScale } = useSequenceContext();

  return (
    <ReactSortable
      className="flex flex-nowrap w-min"
      list={Canvas.resources}
      setList={setResources}
      swapThreshold={0.8}
      ghostClass="bg-green-300"
      animation={300}
      delay={1}
    >
      {Canvas.resources.map((item) => (
        <Timeline key={item.id} length={item.end} sequenceScale={sequenceScale} />
      ))}
    </ReactSortable>
  );
});
