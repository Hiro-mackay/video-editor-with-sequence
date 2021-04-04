import React, { FC, memo, useEffect, useRef } from 'react';
import { useCanvasContext } from '../contexts/canvas';
import { initApp, loadAsset, next } from '../hooks/Pixi';

export const Canvas: FC = memo(() => {
  const ref = useRef<HTMLCanvasElement>();
  const { currentTime, setResources, deltaPlay, deltaPause, deltaStop } = useCanvasContext();

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
      <p className="text-white pt-4">{currentTime}</p>
      <label className="mt-5 bg-white inline-block">
        動画追加
        <input
          type="file"
          hidden
          onChange={async (e) => {
            const resources = await loadAsset(e.currentTarget.files[0]);
            setResources(resources);
          }}
        />
      </label>
      <div className="pt-5">
        <input type="button" value="再生" onClick={deltaPlay} />
      </div>
      <div className="pt-5">
        <input type="button" value="停止" onClick={deltaPause} />
      </div>
      <div className="pt-5">
        <input type="button" value="リセット" onClick={deltaStop} />
      </div>
      <div className="pt-5">
        <input type="button" value="次へ" onClick={next} />
      </div>
    </>
  );
});

export default Canvas;
