
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type Props = { x: number; y: number; z: number; };

export default function BlochSphereGL({ x, y, z }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<THREE.ArrowHelper | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfafafa);

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(2.5, 1.5, 3.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth || 800, mount.clientHeight || 420);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);
    // Allow gestures to be captured without the browser's default handling
    renderer.domElement.style.touchAction = "none";
    rendererRef.current = renderer;

    // Sphere (wireframe) + equator
    const geo = new THREE.SphereGeometry(1, 48, 48);
    const mat = new THREE.MeshPhongMaterial({ wireframe: true, opacity: 0.5, transparent: true });
    const sphere = new THREE.Mesh(geo, mat);
    scene.add(sphere);

    const equator = new THREE.RingGeometry(0.999, 1.001, 128);
    const eqMat = new THREE.MeshBasicMaterial({ color: 0x555555, side: THREE.DoubleSide });
    const eqMesh = new THREE.Mesh(equator, eqMat);
    eqMesh.rotation.x = Math.PI / 2;
    scene.add(eqMesh);

    // Axes + labels
    const axes = new THREE.AxesHelper(1.4);
    scene.add(axes);
    const label = (txt:string, pos:THREE.Vector3) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = 128; canvas.height = 64;
      ctx.fillStyle = '#000'; ctx.font = '28px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(txt, 64, 32);
      const tex = new THREE.CanvasTexture(canvas);
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
      const spr = new THREE.Sprite(mat);
      spr.scale.set(0.5, 0.25, 1);
      spr.position.copy(pos);
      scene.add(spr);
    };
    label('+X', new THREE.Vector3(1.2, 0, 0));
    label('+Y', new THREE.Vector3(0, 1.2, 0));
    label('+Z', new THREE.Vector3(0, 0, 1.2));

    // Arrow (state vector)
    const dir = new THREE.Vector3(0,0,1).normalize();
    const origin = new THREE.Vector3(0,0,0);
    const len = 1.0;
    const arrow = new THREE.ArrowHelper(dir, origin, len);
    scene.add(arrow);
    arrowRef.current = arrow;

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dl = new THREE.DirectionalLight(0xffffff, 0.7); dl.position.set(5,5,5); scene.add(dl);

    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    // Explicitly allow zooming/rotation and restrict panning
    controls.enableZoom = true;
    controls.enableRotate = true;
    controls.enablePan = false;
    controls.minDistance = 1.2;
    controls.maxDistance = 5;

    const onResize = () => {
      const w = mount.clientWidth || 800, h = mount.clientHeight || 420;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    const tick = () => { controls.update(); renderer.render(scene, camera); requestAnimationFrame(tick); };
    tick();

    return () => {
      window.removeEventListener("resize", onResize);
      controls.dispose();
      if (rendererRef.current) {
        mount.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Update vector on props change (length encodes |r|)
  useEffect(() => {
    const v = new THREE.Vector3(x, y, z);
    const L = Math.min(1, Math.max(0, v.length()));
    if (L > 1e-8) {
      v.normalize();
    } else {
      v.set(0,0,1);
    }
    arrowRef.current?.setDirection(v);
    arrowRef.current?.setLength(L);
  }, [x, y, z]);

  return <div ref={mountRef} style={{ width: "100%", height: "420px", borderRadius: 12, overflow: "hidden", background: "#fff", border: "1px solid #eee" }} />;
}
