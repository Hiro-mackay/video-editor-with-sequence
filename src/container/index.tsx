import React, { memo, useEffect, useState } from 'react';
import Canvas from '../components/Canvas';
import { LemState } from '../components/LemState';
import { Sequence } from '../components/Sequnce/Sequence';
import { SequenceTimetick } from '../components/Sequnce/SequenceTimetick';
import { Lem } from '../hooks/Pixi/Lem';

const DEFAULT_TIME = 10000;

export const Container = memo(() => {
  const [lem, _] = useState(new Lem());
  const [currentTime, setCurrentTime] = useState(lem.currentTime);
  const [items, setItems] = useState([]);
  const [timeDurtion, setTimeDuration] = useState(DEFAULT_TIME);
  const [timeTicks, setTimeTicks] = useState([...Array(Math.ceil(timeDurtion / 1000))].map((_, i) => i * 1000));
  const [sequenceScale, setSequenceScale] = useState(5);

  useEffect(() => {
    console.log(lem);
  }, [lem.resources]);

  return (
    <div className="w-full min-h-screen bg-gray-700">
      <LemState
        {...{
          time: lem.currentTime,
          videos: lem.resources
        }}
      />
      <div className="grid grid-cols-1">
        <div
          className="p-24 box-border w-full"
          style={{
            height: 900
          }}
        >
          <Canvas initApp={lem.initApp} />
          <div className="pt-2 text-white">{currentTime}</div>
          <label className="mt-5 bg-white inline-block">
            動画追加
            <input
              type="file"
              hidden
              onChange={(e) => {
                lem.loadAsset(e.currentTarget.files[0]);
              }}
            />
          </label>
          <div className="pt-5">
            <input type="button" value="再生" onClick={() => lem.play()} />
          </div>
          <div className="pt-5">
            <input type="button" value="停止" onClick={() => lem.puase()} />
          </div>
        </div>
      </div>

      <div className="h-96 bg-gray-800 ">
        <div className="w-full overflow-x-scroll p-10 box-border">
          <div className="mb-10">
            <SequenceTimetick timeScale={sequenceScale} durationTime={timeDurtion} timeTicks={timeTicks} />
          </div>
          <Sequence items={items} changeItemHandler={setItems} sequenceScale={sequenceScale} />
        </div>
      </div>
    </div>
  );
});
export default Container;
