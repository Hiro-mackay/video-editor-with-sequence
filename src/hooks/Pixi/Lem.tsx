import * as PIXI from 'pixi.js';

type FunctionVoid = () => void;
const SECONDS_CONVERT_MILLISECONDS = 1000;

export interface IVideoResource {
  texture: PIXI.Texture;
  start: number;
  end: number;
  deltaStart: number;
}

export interface CurrentSource {
  sprite: PIXI.Sprite;
  video: HTMLVideoElement;
}

export interface NextSource {
  sprite: PIXI.Sprite;
}

export interface Player {
  isPlayed: boolean;
  isPaused: boolean;
}

export class Player {
  constructor() {
    this._pause();
  }

  _play() {
    this.isPlayed = true;
    this.isPaused = false;
  }

  _pause() {
    this.isPlayed = false;
    this.isPaused = true;
  }

  play(_update: FunctionVoid) {
    this._play();
    this.update(_update);
  }

  pause() {
    this._pause();
  }

  update(_update: FunctionVoid) {
    if (this.isPaused) return;
    _update();
    requestAnimationFrame(() => this.update(_update));
  }
}

export interface Lem {
  // PIXI Application
  app: PIXI.Application;

  // Sequenceの現在タイマー
  // ms
  currentTime: number;

  // 総再生時間
  // ms
  viewingTime: number;

  // 動画再生時のバッファ時間
  // ms
  deltaTime: number;

  // Sequenceのプライヤー制御
  Player: Player;

  // 動画ソースの配列
  resources: IVideoResource[];

  // 現在表示の動画ソース
  source: CurrentSource;

  // 次に表示する動画ソース
  nextSource: NextSource;
}

export class Lem {
  constructor() {
    this.currentTime = 0;

    this.viewingTime = 0;

    this.deltaTime = 0;

    this.Player = new Player();

    this.resources = [];

    this.source = {
      video: null,
      sprite: null
    };

    this.nextSource = {
      sprite: null
    };

    this.update = this.update.bind(this);
  }

  initApp = (ref: HTMLCanvasElement) => {
    this.app = new PIXI.Application({ view: ref, backgroundColor: 0xffffff });
    return this.app;
  };

  deltaStart = (resource: IVideoResource) => resource.start + resource.deltaStart;

  deltaEnd = (resource: IVideoResource) => resource.end + resource.deltaStart;

  convertSecondsToMilliseconds = (seconds: number) => Math.ceil(seconds * SECONDS_CONVERT_MILLISECONDS);

  // Videoの合計再生時間をm秒で取得
  getVideoDuration = (video: HTMLVideoElement) => this.convertSecondsToMilliseconds(video.duration);

  // Videoの合計再生時間をm秒で取得
  getVideoCuurentTime = (video: HTMLVideoElement) => this.convertSecondsToMilliseconds(video.currentTime);

  addViewingTime = (time: number) => {
    this.viewingTime += time;
  };

  getScreenWidth = () => this.app.screen.width;

  getScreenHeight = () => this.app.screen.height;

  existsNextResource = (currentIndex) => currentIndex !== -1 && this.resources.length - 1 > currentIndex;

  hasNextResource = () => !!this.nextSource.sprite;

  createSprite = (texture: PIXI.Texture) => {
    const sprite = PIXI.Sprite.from(texture);
    sprite.width = this.getScreenWidth();
    sprite.height = this.getScreenHeight();
    return sprite;
  };

  getVideoRecource = (texture: PIXI.Texture) => {
    // @ts-ignore
    return texture.baseTexture.resource.source as HTMLVideoElement;
  };

  createVideo(file: File) {
    const path = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.preload = '';
    video.src = path;
    video.pause();
    return video;
  }

  // Resoucesに追加するsourceを生成する
  // videを引数渡せば生成される
  createResouce(video: HTMLVideoElement): IVideoResource {
    const duration = this.getVideoDuration(video);
    const texture = PIXI.Texture.from(video);
    return {
      texture,
      start: 0,
      end: duration,
      deltaStart: this.viewingTime
    };
  }

  // 生成されたresourceをresourcesに追加する
  addResource(resouce: IVideoResource) {
    this.resources = [...this.resources, resouce];
    this.addViewingTime(resouce.end);
  }

  // 読み込まれたVideoをResoucesに追加する
  setResouce(video: HTMLVideoElement) {
    video.onloadeddata = () => {
      const resource = this.createResouce(video);

      this.addResource(resource);

      this.load();

      this.puase();
    };
  }

  // Inputから入力されたファイルをResoucesに読み込む
  loadAsset(file: File) {
    const video = this.createVideo(file);
    this.setResouce(video);
  }

  findCurrentRecource() {
    return this.resources.findIndex((resource) => {
      return this.deltaStart(resource) <= this.currentTime && this.currentTime < this.deltaEnd(resource);
    });
  }

  setStageSprite(sprite: PIXI.Sprite) {
    this.app.stage.addChild(sprite);
  }

  // 現在レンダリング中の動画をセットする
  setSource(sprite: PIXI.Sprite) {
    const videoRecource = this.getVideoRecource(sprite.texture);
    this.source.sprite = sprite;
    this.source.video = videoRecource;
  }

  // Current Time時の動画をセットする
  setCurrentRecource(sprite: PIXI.Sprite) {
    this.setSource(sprite);
    this.setStageSprite(sprite);
  }

  setNextResource(sprite: PIXI.Sprite) {
    this.nextSource.sprite = sprite;
  }

  // Current Time時の動画をStageにセットする
  loadResource() {
    const currentResourceIndex = this.findCurrentRecource();
    if (currentResourceIndex === -1) {
      return;
    }

    const texture = this.resources[currentResourceIndex].texture;
    const sprite = this.createSprite(texture);

    this.setCurrentRecource(sprite);
  }

  // CurrentTimeを基準に、次にレンダリングする動画をプリロード
  async preloadResource() {
    const currentResourceIndex = this.findCurrentRecource();
    const hasNext = this.existsNextResource(currentResourceIndex);
    if (!hasNext) {
      this.nextSource.sprite = null;
      return;
    }
    const nextTexture = this.resources[currentResourceIndex + 1].texture;
    const sprite = this.createSprite(nextTexture);
    this.setNextResource(sprite);
    this.puaseSprite(sprite);
  }

  // nextSourceにセットされているResourceをレンダリングにセットする
  next() {
    const hasNext = this.hasNextResource();
    if (!hasNext) {
      this.puase();
      return;
    }

    this.deltaTime += this.getVideoDuration(this.source.video);

    this.setCurrentRecource(this.nextSource.sprite);
    this.preloadResource();
    this._play();
  }

  // 動画再生時の更新とレンダリング
  update() {
    this.currentTime = this.deltaTime + this.getVideoCuurentTime(this.source.video);
    if (this.source.video.paused) {
      this.next();
    }
  }

  load() {
    this.loadResource();
    this.preloadResource();
  }

  private _play() {
    this.source.video.play();
  }

  play() {
    if (!this.source.video) return;
    this._play();
    this.Player.play(this.update);
  }
  private _pause() {
    this.source.video.pause();
  }

  puase() {
    this._pause();
    this.Player.pause();
  }

  puaseSprite(sprite: PIXI.Sprite) {
    const video = this.getVideoRecource(sprite.texture);
    video.pause();
  }
}
