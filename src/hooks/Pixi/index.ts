import * as PIXI from 'pixi.js';

// 責務：Utiles
// =================================================================================================================================================

export interface Resource {
  id: number;
  texture: PIXI.Texture;
  start: number;
  end: number;
  deltaStart: number;
}

type Resources = Resource[];

const SECONDS_CONVERT_MILLISECONDS = 1000;
const app: PIXI.Application = new PIXI.Application();

const getScreenWidth = () => app.screen.width;
const getScreenHeight = () => app.screen.height;


const getDeltaStart = (resource: Resource) => resource.start + resource.deltaStart;

const getDeltaEnd = (resource: Resource) => resource.end + resource.deltaStart;

// 責務：ファイルからLem用に変換したEntityを生成する
// =================================================================================================================================================

const convertSecondsToMilliseconds = (seconds: number) => Math.ceil(seconds * SECONDS_CONVERT_MILLISECONDS);
const getVideoDuration = (video: HTMLVideoElement) => convertSecondsToMilliseconds(video.duration);

const getViewTime = (resources: Resources) => {
  return resources.reduce((c, resource) => c + resource.end, 0);
};

const getVideoRecource = (texture: PIXI.Texture) => {
  // @ts-ignore
  return texture.baseTexture.resource.source as HTMLVideoElement;
};

const createVideoTexture = (video: HTMLVideoElement) => {
  return PIXI.Texture.from(video);
};

// Video Elementを作成し、video reference pathを読み込ませる
const createVideoRef = (pathVideoRef: string) => {
  const video = document.createElement('video');
  video.crossOrigin = 'anonymous';
  video.preload = '';
  video.src = pathVideoRef;
  return video;
};

// ファイルからpathを生成する
const createVideoPath = (file: File) => URL.createObjectURL(file);

// ファイルから
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

const resources: Resources = [];

const createResource = (texture: PIXI.Texture) => {
  const deltaStart = getViewTime(resources);
  const video = getVideoRecource(texture);
  const end = getVideoDuration(video);
  const start = 0;

  return {
    texture,
    start,
    end,
    deltaStart
  };
};

/**
 *
 * @param file
 * @returns IVideoResource[]
 *
 * ファイルを入力に渡すと、VideoResouceに変換し、今までのVideoResouceとconcatした配列を返す
 */
const loadAsset = async (file: File) => {
  try {
    const video = await createVideo(file);
    const texture = createVideoTexture(video);
    const resource = createResource(texture);
    [...resources, resource];
  } catch (error) {
    throw error;
  }
};

// 責務：Resources内にある任意のresourceから、読み込み実行可能なSourceを生成する
// =================================================================================================================================================

const createSprite = (texture: PIXI.Texture) => {
  const sprite = PIXI.Sprite.from(texture);
  sprite.width = getScreenWidth();
  sprite.height = getScreenHeight();
  return sprite;
};

const createSource = (resource: Resource) => {
  const texture = resource.texture;

  const sprite = createSprite(texture);
  const video = getVideoRecource(texture);

  return {
    video,
    sprite
  };
};

// 責務：Cuurent TimeでのResourceで、Sourceを生成する
// =================================================================================================================================================

const getCurrentResouce = (time: number) =>  resources.find((resource)=> )
const loadSource = (currentTime: number) => {};
