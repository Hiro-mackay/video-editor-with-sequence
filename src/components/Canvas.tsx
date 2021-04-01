import React, { FC, memo, useEffect, useRef } from 'react';

interface CanvasProps {
  initApp: (ref: HTMLCanvasElement) => void;
}

export const Canvas: FC<CanvasProps> = memo(({ initApp }) => {
  const ref = useRef<HTMLCanvasElement>();

  useEffect(() => {
    initApp(ref.current);
  }, [ref]);
  return (
    <div className="w-full relative" style={{ paddingTop: '56.25%' }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <canvas ref={ref} className="w-full h-full bg-white">
          Canvas viewer
        </canvas>
      </div>
    </div>
  );
});

export default Canvas;
