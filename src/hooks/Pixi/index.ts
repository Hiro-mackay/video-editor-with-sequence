import * as PIXI from 'pixi.js';

// 責務：Utiles
// =================================================================================================================================================

export interface Resource {
  id: number;
  texture: PIXI.Texture;
  inFrame: number;
  outFrame: number;
  deltaTime: number;
}

export type Resources = Resource[];

export interface Source {
  video: HTMLVideoElement;
  sprite: PIXI.Sprite;
}

const SECONDS_CONVERT_MILLISECONDS = 1000;
let app: PIXI.Application = null;
let resources: Resources = [];

export const setResources = (res: Resources) => {
  resources = res;
};

export const addResources = (res: Resource) => {
  resources = [...resources, res];
};

export const getResources = () => resources;

export const initApp = (view: HTMLCanvasElement) => {
  app = new PIXI.Application({
    view,
    backgroundColor: 0xffffff
  });

  return app;
};

let source: Source = {
  sprite: null,
  video: null
};

export const getSource = () => source;
export const setSource = (_source: Source) => {
  source = _source;
};

let nextSource: Source = {
  sprite: null,
  video: null
};

export const getNextSource = () => nextSource;
export const setNextSource = (_source: Source) => {
  nextSource = _source;
};

let id = 0;

export let paused = true;
let completed = false;
// ms
let currentTime = 0;
let deltaTime = 0;

export const getCurrentTime = () => currentTime;

const generateID = () => ++id;

const convertSecondsToMilliseconds = (seconds: number) => Math.ceil(seconds * SECONDS_CONVERT_MILLISECONDS);

// 責務：Getter系関数
// =================================================================================================================================================

const getScreenWidth = () => app.screen.width;

const getScreenHeight = () => app.screen.height;

const getDeltaStart = (resource: Resource) => resource.inFrame + resource.deltaTime;

const getDeltaEnd = (resource: Resource) => resource.outFrame + resource.deltaTime;

const getRecourceFromIndex = (index: number) => {
  if (resources.length <= index && index === -1) {
    return null;
  }

  return resources[index];
};

const getCurrentResouceIndex = (time: number) =>
  resources.findIndex((resource) => getDeltaStart(resource) <= time && time < getDeltaEnd(resource));

const getCurrentResouce = (time: number) => {
  const index = getCurrentResouceIndex(time);
  return getRecourceFromIndex(index);
};

const getVideoDuration = (video: HTMLVideoElement) => convertSecondsToMilliseconds(video.duration);

const getVideoCurrentTime = (video: HTMLVideoElement) => convertSecondsToMilliseconds(video.currentTime);

const _getViewTime = (resources: Resources) => {
  return resources.reduce((c, resource) => c + resource.outFrame, 0);
};
export const getViewTime = () => _getViewTime(resources);

const getVideoRecource = (texture: PIXI.Texture) => {
  // @ts-ignore
  return texture.baseTexture.resource.source as HTMLVideoElement;
};

// 責務：Create系関数
// =================================================================================================================================================

const createVideoTexture = (video: HTMLVideoElement) => {
  return PIXI.Texture.from(video);
};

// Video Elementを作成し、video pathを読み込ませる
const createVideoRef = (pathVideoRef: string) => {
  const video = document.createElement('video');
  video.crossOrigin = 'anonymous';
  video.preload = '';
  video.src = pathVideoRef;
  return video;
};

// ファイルからpathを生成する
const createVideoPath = (file: File) => URL.createObjectURL(file);

// ファイルからVideoElementを生成する
const createVideoElement = (file: File) => {
  const path = createVideoPath(file);
  return createVideoRef(path);
};

// ファイルからロード済みVideo Elementを作成する
const createVideo = async (file: File): Promise<HTMLVideoElement> => {
  const video = createVideoElement(file);

  return new Promise((resolve, reject) => {
    video
      .play()
      .then(() => {
        video.pause();
        resolve(video);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 *
 * @param texture PIXI.Texture
 * @returns Resource
 *
 * textureからResourceを生成する
 */
const createResource = (texture: PIXI.Texture) => {
  const deltaTime = _getViewTime(resources);
  const video = getVideoRecource(texture);
  const inFrame = 0;
  const outFrame = getVideoDuration(video);
  const id = generateID();

  return {
    id,
    texture,
    inFrame,
    outFrame,
    deltaTime
  };
};

/**
 *
 * @param texture PIXI.Texture
 * @returns PIXI.Sprite
 *
 * TextureからSpriteを生成
 */
const createSprite = (texture: PIXI.Texture) => {
  const sprite = PIXI.Sprite.from(texture);
  sprite.width = getScreenWidth();
  sprite.height = getScreenHeight();

  return sprite;
};

// 責務：Loader系関数
// =================================================================================================================================================

const loadSource = (resource: Resource): Source => {
  if (!resource) {
    return {
      video: null,
      sprite: null
    };
  }
  const texture = resource.texture;
  const sprite = createSprite(texture);
  const video = getVideoRecource(sprite.texture);

  return {
    sprite,
    video
  };
};

export const loadCurrentSource = (currentTime: number) => {
  const resource = getCurrentResouce(currentTime);
  const _source = loadSource(resource);

  setSource(_source);

  if (source.sprite) {
    source.video.pause();
    source.video.currentTime = 0;
    render(source.sprite);
  }

  return source;
};

export const loadNextSource = async (currentTime: number) => {
  const index = getCurrentResouceIndex(currentTime);
  const nextIndex = index + 1;

  const resource = getRecourceFromIndex(nextIndex);
  nextSource = loadSource(resource);

  setNextSource(nextSource);

  return nextSource;
};

/**
 *
 * @param file
 * @returns Resources
 *
 * ファイルを入力に渡すと、VideoResouceに変換し、今までのVideoResouceとconcatした配列を返す
 */
export const loadAsset = async (file: File): Promise<Resources> => {
  try {
    if (!file) return;
    const video = await createVideo(file);
    const texture = createVideoTexture(video);
    const resource = createResource(texture);

    const _video = getVideoRecource(resource.texture);
    _video.pause();
    _video.currentTime = 0;
    return [...resources, resource];
  } catch (error) {
    throw error;
  }
};

export const reloadResource = (items: Resources) => {
  const _items = [];
  items.reduce((c, item) => {
    _items.push({
      ...item,
      deltaTime: c
    });
    return c + item.outFrame;
  }, 0);

  return _items;
};

// PIXI Render
// =================================================================================================================================================

export const render = (sprite: PIXI.Sprite, time: number = 0) => {
  if (!sprite) return;
  const video = getVideoRecource(sprite.texture);
  video.currentTime = time;
  app.stage.addChild(sprite);
};

// Player
// =================================================================================================================================================

export const play = () => {
  paused = false;
  completed = false;
  source.video?.play();
};

export const pause = () => {
  paused = true;
  source.video?.pause();
};

export const stop = () => {
  pause();
  completed = false;
  currentTime = 0;
  deltaTime = 0;
  loadCurrentSource(0);
  const video = getVideoRecource(source.sprite.texture);
  video.onseeked = function () {
    source.sprite.texture.baseTexture.update();
  };
};

const _render = () => {
  const source = getSource();

  if (!source.video.paused) {
    return;
  }

  const _source = loadCurrentSource(currentTime);

  if (!_source.sprite) {
    paused = true;
    return;
  }
  deltaTime += getVideoDuration(source.video);

  _source.video.play();
};

export const loop = (updater: () => void) => () => {
  currentTime = deltaTime + getVideoCurrentTime(source.video);
  _render();
  updater();
};

export const next = () => {};
