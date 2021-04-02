import React, { FC, memo, useEffect, useRef } from 'react';
import { useCanvas } from '../hooks/Pixi';

export const Canvas: FC = memo(() => {
  const ref = useRef<HTMLCanvasElement>();
  const { initApp, play, puase, loadAsset } = useCanvas();

  useEffect(() => {
    initApp(ref.current);
  }, [ref]);

  return (
    <>
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
      <label className="mt-5 bg-white inline-block">
        動画追加
        <input
          type="file"
          hidden
          onChange={(e) => {
            loadAsset(e.currentTarget.files[0]);
          }}
        />
      </label>
      <div className="pt-5">
        <input type="button" value="再生" onClick={play} />
      </div>
      <div className="pt-5">
        <input type="button" value="停止" onClick={puase} />
      </div>
    </>
  );
});

export default Canvas;
