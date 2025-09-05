
import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = { x: number; y: number; z: number };

export default function BlochSphereGL({ x, y, z }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<THREE.ArrowHelper | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 4);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth || 800, mount.clientHeight || 420);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Sphere
    const geo = new THREE.SphereGeometry(1, 48, 48);
    const mat = new THREE.MeshPhongMaterial({ wireframe: true, opacity: 0.4, transparent: true });
    const sphere = new THREE.Mesh(geo, mat);
    scene.add(sphere);

    // Axes
    const axes = new THREE.AxesHelper(1.5);
    scene.add(axes);

    // Arrow (state vector)
    const dir = new THREE.Vector3(0,0,1).normalize();
    const origin = new THREE.Vector3(0,0,0);
    const len = 1.0;
    const arrow = new THREE.ArrowHelper(dir, origin, len);
    scene.add(arrow);
    arrowRef.current = arrow;

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dl = new THREE.DirectionalLight(0xffffff, 0.6); dl.position.set(5,5,5); scene.add(dl);

    const onResize = () => {
      const w = mount.clientWidth || 800, h = mount.clientHeight || 420;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    const tick = () => { renderer.render(scene, camera); requestAnimationFrame(tick); };
    tick();

    return () => {
      window.removeEventListener("resize", onResize);
      if (rendererRef.current) {
        mount.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Update vector on props change
  useEffect(() => {
    const v = new THREE.Vector3(x, y, z);
    if (v.length() > 1e-8) v.normalize();
    arrowRef.current?.setDirection(v);
  }, [x, y, z]);

  return <div ref={mountRef} style={{ width: "100%", height: "420px", borderRadius: 12, overflow: "hidden", background: "#fff" }} />;
}
