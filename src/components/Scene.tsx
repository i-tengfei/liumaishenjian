import { useSpring } from '@react-spring/three';
import { Canvas, useFrame } from '@react-three/fiber';
import type { Vector3 } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { Box3, Group, Vector3 as V3, Sphere as TSphere } from 'three';

import { CameraControls } from './CameraControls';
import { Grid } from './three/Grid';
import { Sphere } from '@react-three/drei';

type ControlsProps = {
  active?: boolean;
  boundary?: Box3;
  activated?: Vector3;
  inactivated?: Vector3;
};

const Controls = (props: ControlsProps) => {
  const {
    active = false,
    boundary,
    activated = [0, 0, 0],
    inactivated = [0, 0, 0],
  } = props;
  const update = () => {
    let from = inactivated as number[];
    let to = activated as number[];
    ref.current?.setPosition(
      animate.to([0, 1], [from[0] ?? 0, to[0] ?? 0]).get(),
      animate.to([0, 1], [from[1] ?? 0, to[1] ?? 0]).get(),
      animate.to([0, 1], [from[2] ?? 0, to[2] ?? 0]).get(),
    );
  };
  const ref = useRef<CameraControls>(null);
  const [{ animate }] = useSpring({ animate: active ? 1 : 0 }, [active]);
  useEffect(update, []);
  useEffect(() => {
    if (!ref.current || !boundary) {
      return;
    }
    ref.current.setBoundary(boundary);
    const center = new V3();
    boundary.getCenter(center);
    ref.current.setTarget(center.x, center.y, center.z);
    
    const sphere = boundary.getBoundingSphere(new TSphere());
    ref.current.minDistance = sphere.radius * 0.1;
    ref.current.maxDistance = sphere.radius * 10;
  }, [boundary]);
  useFrame(() => {
    if (animate.isAnimating) {
      update();
    }
  });
  return <CameraControls ref={ref} />;
};

export type SceneProps = {
  scene?: Group;
  point?: V3,
  onHit?: (point: V3) => void;
};

export const Scene = (props: SceneProps) => {
  const { scene, point, onHit } = props;
  const position: Vector3 = [0, 10, 0];
  const [boundary, setBoundary] = useState<Box3>();
  const [activated, setActivated] = useState<Vector3>();

  useEffect(() => {
    if (!scene) {
      return;
    }

    const box = new Box3();
    box.setFromObject(scene);
    const sphere = box.getBoundingSphere(new TSphere());

    setActivated([0, 0, sphere.radius * 1.5])

    setBoundary(box);
  }, [scene]);

  return (
    <div className="h-screen v-screen absolute inset-0">
      <Canvas camera={{ position: position }}>
        {activated && <fog attach="fog" near={activated as number[][2] * 2} far={activated as number[][2] * 2.5} />}
        <Controls
          active={scene !== undefined}
          boundary={boundary}
          activated={activated}
          inactivated={position}
        />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 2]} intensity={3} />
        {/* <Grid /> */}
        {point && <Sphere args={[0.2, 64, 64]} position={point}><meshStandardMaterial roughness={0} color="red" /></Sphere>}
        {scene && <primitive object={scene} onClick={(event: { point: V3 }) => {
          onHit && onHit(event.point)
        }} />}
      </Canvas>
    </div>
  );
};
