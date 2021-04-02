import { useCanvasContext } from '../../contexts/canvas';
import * as PIXI from 'pixi.js';
import { Lem as LemEngine } from './Lem';
import { useState } from 'react';
import { start } from 'node:repl';

const SECONDS_CONVERT_MILLISECONDS = 1000;
type FunctionVoid = () => void;
let id = 0;

const getVideoCuurentTime = (video: HTMLVideoElement) => convertSecondsToMilliseconds(video.currentTime);
const deltaStart = (resource: IVideoResource) => resource.start + resource.deltaStart;
const deltaEnd = (resource: IVideoResource) => resource.end + resource.deltaStart;

const _play = () => {
  Canvas.source.video.play();
};

const play = () => {
  if (!Canvas.source.video) return;
  setPlayer({
    paused: false,
    play: true
  });
  update();
};
const _pause = () => {
  Canvas.source.video.pause();
};

const puase = () => {
  _pause();
  setPlayer({
    paused: true,
    play: false
  });
};

// 動画再生時の更新とレンダリング
const update = () => {
  if (Player.paused) return;
  setCurrentTime();
  if (Canvas.source.video.paused) {
    next();
  }

  requestAnimationFrame(update);
};

const getScreenWidth = () => Canvas.app.screen.width;
const getScreenHeight = () => Canvas.app.screen.height;
const existsNextResource = (currentIndex) => currentIndex !== -1 && Canvas.resources.length - 1 > currentIndex;
const hasNextResource = () => !!Canvas.nextSource.sprite;

const initApp = (ref: HTMLCanvasElement) => {
  const _app = new PIXI.Application({ view: ref, backgroundColor: 0xffffff });
  Canvas.setApp(_app);
};

const findCurrentRecource = () => {
  return Canvas.resources.findIndex(
    (resource) => deltaStart(resource) <= Canvas.currentTime && Canvas.currentTime < deltaEnd(resource)
  );
};

const addViewingTime = (time: number) => {
  Canvas.setViewingTime(Canvas.viewingTime + time);
};

const createSprite = (texture: PIXI.Texture) => {
  const sprite = PIXI.Sprite.from(texture);
  sprite.width = getScreenWidth();
  sprite.height = getScreenHeight();
  return sprite;
};

const setStageSprite = (sprite: PIXI.Sprite) => {
  Canvas.app.stage.addChild(sprite);
};

// 現在レンダリング中の動画をセットする
const setSource = (sprite: PIXI.Sprite) => {
  const video = getVideoRecource(sprite.texture);

  Canvas.setSource({
    sprite,
    video
  });
};

// Current Time時の動画をセットする
const setCurrentRecource = (sprite: PIXI.Sprite) => {
  setSource(sprite);
  setStageSprite(sprite);
};

const setNextResource = (sprite: PIXI.Sprite) => {
  Canvas.setNextSource({ sprite });
};

const resetNextResource = () => {
  Canvas.setNextSource({ sprite: null });
};

// Current Time時の動画をStageにセットする
const loadResource = () => {
  const currentResourceIndex = findCurrentRecource();
  if (currentResourceIndex === -1) {
    return;
  }

  const texture = Canvas.resources[currentResourceIndex].texture;
  const sprite = createSprite(texture);

  setCurrentRecource(sprite);
};

const puaseSprite = (sprite: PIXI.Sprite) => {
  const video = getVideoRecource(sprite.texture);
  video.pause();
};

// CurrentTimeを基準に、次にレンダリングする動画をプリロード
const preloadResource = async () => {
  const currentResourceIndex = findCurrentRecource();
  const hasNext = existsNextResource(currentResourceIndex);
  if (!hasNext) {
    resetNextResource();
    return;
  }
  const nextTexture = Canvas.resources[currentResourceIndex + 1].texture;
  const sprite = createSprite(nextTexture);
  setNextResource(sprite);
  puaseSprite(sprite);
};

const addDeltaTime = () => {
  const duration = getVideoDuration(Canvas.source.video);
  Canvas.setDeltaTime(Canvas.deltaTime + duration);
};

const setCurrentTime = () => {
  const time = Canvas.deltaTime + getVideoCuurentTime(Canvas.source.video);
};

// nextSourceにセットされているResourceをレンダリングにセットする
const next = () => {
  const hasNext = hasNextResource();
  if (!hasNext) {
    puase();
    return;
  }

  addDeltaTime();

  setCurrentRecource(Canvas.nextSource.sprite);
  preloadResource();
  _play();
};

const load = () => {
  loadResource();
  preloadResource();
};

export const useCanvas = () => {
  const Canvas = useCanvasContext();
  const [Player, setPlayer] = useState({
    paused: true,
    play: false
  });

  return {
    initApp,
    play,
    puase,
    loadAsset,
    Canvas
  };
};