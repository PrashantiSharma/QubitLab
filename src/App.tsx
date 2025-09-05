
import { useEffect, useMemo, useState } from "react";
import BlochSphereGL from "./components/BlochSphereGL";
import { useApp } from "./store";

export default function App() {
  const { state, setWorker, update, worker } = useApp();
  const [p, setP] = useState(0);

  const w = useMemo(()=> new Worker(new URL("./engine/engine.worker.ts", import.meta.url), { type: "module" }),[]);

  useEffect(()=>{
    setWorker(w);
    w.onmessage = (ev: MessageEvent<any>) => {
      const { x, y, z, purity } = ev.data;
      update({ x, y, z, purity });
    };
    w.postMessage({ type: "reset" });
    return ()=> w.terminate();
  }, [setWorker, update, w]);

  const applyNoise = (val:number) => {
    setP(val);
    worker?.postMessage({ type: "dephase", p: val });
  };

  return (
    <div>
      <h1 style={{ margin: "8px 0 16px" }}>Qubit Lab — Bloch Playground</h1>
      <BlochSphereGL x={state.x} y={state.y} z={state.z} />
      <p>Purity: <b>{state.purity.toFixed(3)}</b></p>

      <div style={{ display:"flex", gap:8, margin:"12px 0", flexWrap: "wrap" }}>
        <button onClick={()=>worker?.postMessage({ type:"reset" })}>Reset |0⟩</button>
        <button onClick={()=>worker?.postMessage({ type:"gate", gate:"H" })}>H</button>
        <button onClick={()=>worker?.postMessage({ type:"gate", gate:"X" })}>X</button>
        <button onClick={()=>worker?.postMessage({ type:"gate", gate:"Y" })}>Y</button>
        <button onClick={()=>worker?.postMessage({ type:"gate", gate:"Z" })}>Z</button>
      </div>

      <label>
        Dephasing p = <b>{p.toFixed(2)}</b>
        <input type="range" min={0} max={1} step={0.01}
              value={p}
              onChange={(e)=>applyNoise(parseFloat(e.target.value))} />
      </label>

      <p style={{ color: "#666" }}>
        Tip: Click H to create |+⟩ (vector toward +X). Increase dephasing — the Bloch vector shrinks toward the Z-axis and purity decreases.
      </p>
    </div>
  );
}
