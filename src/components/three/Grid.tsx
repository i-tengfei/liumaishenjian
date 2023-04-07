import { Instance, Instances } from '@react-three/drei';

export const Grid = ({ number = 23, lineWidth = 0.025, height = 0.25 }) => (
  // Renders a grid and crosses as instances
  <Instances>
    <planeGeometry args={[lineWidth, height]} />
    <meshBasicMaterial color="#C0C0C0" />
    {Array.from({ length: number }, (_, y) =>
      Array.from({ length: number }, (_, x) => (
        <group
          key={x + ':' + y}
          position={[
            x * 2 - Math.floor(number / 2) * 2,
            0,
            y * 2 - Math.floor(number / 2) * 2,
          ]}
        >
          <Instance rotation={[-Math.PI / 2, 0, 0]} />
          <Instance rotation={[-Math.PI / 2, 0, Math.PI / 2]} />
        </group>
      )),
    )}
    <gridHelper args={[100, 100, '#BBB', '#BBB']} />
  </Instances>
);
