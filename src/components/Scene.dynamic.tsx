import dynamic from 'next/dynamic';

import { SceneProps } from './Scene';

export const SceneDynamic = dynamic<SceneProps>(
  () => import('./Scene').then((module) => module.Scene),
  { ssr: false },
);
