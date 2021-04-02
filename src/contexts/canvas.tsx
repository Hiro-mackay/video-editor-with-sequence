import { createContext, useContext } from 'react';
import { Dispatch, useState, FC, memo, SetStateAction } from 'react';
import * as PIXI from 'pixi.js';

export interface IVideoResource {
  id: number;
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

export function createCtx<T extends {} | null>() {
  const ctx = createContext<T | undefined>(undefined);

  function useCtx() {
    const c = useContext(ctx);
    if (c === undefined) throw new Error('useCtx must be inside a Provider with a value');
    return c;
  }

  return [useCtx, ctx] as const;
}

export interface IEntity {
  app: PIXI.Application;
  currentTime: number;
  viewingTime: number;
  deltaTime: number;
  resources: IVideoResource[];
  source: CurrentSource;
  nextSource: NextSource;
}

export interface IContext {
  app: PIXI.Application;
  currentTime: number;
  viewingTime: number;
  deltaTime: number;
  resources: IVideoResource[];
  source: CurrentSource;
  nextSource: NextSource;

  setApp: Dispatch<SetStateAction<PIXI.Application>>;
  setCurrentTime: Dispatch<SetStateAction<number>>;
  setViewingTime: Dispatch<SetStateAction<number>>;
  setDeltaTime: Dispatch<SetStateAction<number>>;
  setResources: Dispatch<SetStateAction<IVideoResource[]>>;
  setSource: Dispatch<SetStateAction<CurrentSource>>;
  setNextSource: Dispatch<SetStateAction<NextSource>>;
}

export const [useCanvasContext, CanvasContext] = createCtx<IContext>();

export const CanvasProvider: FC = memo(({ children }) => {
  const [app, setApp] = useState<PIXI.Application>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [viewingTime, setViewingTime] = useState(0);
  const [deltaTime, setDeltaTime] = useState(0);
  const [resources, setResources] = useState<IVideoResource[]>([]);
  const [source, setSource] = useState<CurrentSource>({
    sprite: null,
    video: null
  });
  
  const [nextSource, setNextSource] = useState<NextSource>({ sprite: null });

  return (
    <CanvasContext.Provider
      value={{
        app,
        currentTime,
        viewingTime,
        deltaTime,
        resources,
        source,
        nextSource,
        setApp,
        setCurrentTime,
        setViewingTime,
        setDeltaTime,
        setResources,
        setSource,
        setNextSource
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
});
