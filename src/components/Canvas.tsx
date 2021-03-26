import React, { FC, memo, useEffect, useRef } from 'react';

interface CanvasProps {
  initApp: (ref: HTMLCanvasElement) => void;
}

export const Canvas: FC<CanvasProps> = memo(({ initApp }) => {
  const ref = useRef<HTMLCanvasElement>();

  useEffect(() => {
    initApp(ref.current);
  }, [ref]);
  return <canvas>Canvas viewer</canvas>;
});
