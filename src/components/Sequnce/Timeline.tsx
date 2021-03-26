import React, { FC, memo } from 'react';

interface TimelineProps {
  sequenceScale: number;
  length: number;
}

export const Timeline: FC<TimelineProps> = memo(({ sequenceScale, length }) => {
  return (
    <div
      className="border-yellow-600 cursor-move box-border p-2 rounded-lg"
      style={{ width: length / sequenceScale, marginRight: 1 }}
    >
      Timeline
    </div>
  );
});
