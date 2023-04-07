import { Receiver } from "@/components/Receiver";
import { SceneDynamic } from '@/components/Scene.dynamic';
import { useCallback, useEffect, useState } from "react";
import { Group, Vector3, WebGLRenderer } from 'three';
import { DRACOLoader, GLTFLoader, KTX2Loader } from 'three-stdlib';
// @ts-ignore
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [scene, setScene] = useState<Group>();
  const [data, setData] = useState<ArrayBuffer>();
  const [point, setPoint] = useState<Vector3>();
  
  const file = files[0];

  useEffect(() => {
    if (!file) {
      setData(undefined);
      return;
    }
    (async () => {
      setData(await file.arrayBuffer());
    })();
  }, [file]);

  useEffect(() => {
    const loader = new GLTFLoader();

    const ktx2Loader = new KTX2Loader()
      .setTranscoderPath('/basis/')
      .detectSupport(new WebGLRenderer());

    const dracoLoader = new DRACOLoader().setDecoderPath('/draco/').preload();

    loader.setDRACOLoader(dracoLoader);
    loader.setKTX2Loader(ktx2Loader);
    loader.setMeshoptDecoder(MeshoptDecoder);

    const parse = async () => {
      if (!data) {
        return;
      }
      loader.parse(data, '', (data) => {
        setScene(data.scene);
      });
    };
    parse();
  }, [data]);

  const handleReceive = useCallback(
    (files: File[]) => {
      setFiles(files);
    },
    [setFiles],
  );

  const handleHit = useCallback(
    (point: Vector3) => {
      setPoint(point);
    },
    [setPoint],
  );

  const active = scene !== undefined;
  return (<>
    <SceneDynamic scene={scene} point={point} onHit={handleHit} />
    {!active && <Receiver onReceive={handleReceive} />}
    {point && (<div className="font-mono">
      <div>X: {point.x.toFixed(4)}</div>
      <div>Y: {point.y.toFixed(4)}</div>
      <div>Z: {point.z.toFixed(4)}</div>
    </div>)}
  </>)
}
