
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

  
const makePlus = () => {
  setP(0);
  worker?.postMessage({ type: "reset" });
  // Slight delay not strictly needed, but keeps order visually obvious
  setTimeout(()=>worker?.postMessage({ type:"gate", gate:"H" }), 0);
};

const demoDephase = () => {
  setP(0);
  worker?.postMessage({ type: "reset" });
  setTimeout(()=>worker?.postMessage({ type:"gate", gate:"H" }), 0);
  setTimeout(()=>{
    setP(0.5);
    worker?.postMessage({ type:"dephase", p: 0.5 });
  }, 0);
};

  const resetAll = () => {
    setP(0);
    worker?.postMessage({ type: "reset" });
  };

  return (
    <div>
      <h1 style={{ margin: "8px 0 6px" }}>Qubit Lab — Bloch Playground</h1>
      <p style={{ marginTop: 0, color: "#666" }}>H/X/Y/Z gates + Dephasing noise. Arrow length encodes mixedness (|r|). Note: You start in |0⟩ (on +Z). Dephasing has no visible effect on |0⟩ — first create a superposition (e.g., click H for |+⟩).</p>
      <BlochSphereGL x={state.x} y={state.y} z={state.z} onVectorChange={(nx,ny,nz)=>update({ x:nx, y:ny, z:nz, purity:1 })} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 8 }}>
        <div>⟨X⟩ = <b>{state.x.toFixed(3)}</b></div>
        <div>⟨Y⟩ = <b>{state.y.toFixed(3)}</b></div>
        <div>⟨Z⟩ = <b>{state.z.toFixed(3)}</b></div>
        <div>Purity = <b>{state.purity.toFixed(3)}</b></div>
      </div>

      <div style={{ display:"flex", gap:8, margin:"12px 0", flexWrap: "wrap" }}>
        <button onClick={resetAll}>Reset |0⟩</button>
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
        Try: Click <b>H</b> → vector jumps from +Z to +X (⟨X⟩≈1, ⟨Z⟩≈0). Increase <b>p</b> → arrow <i>shrinks</i> (|r|↓) and Purity approaches 0.5.
        Rotate with the mouse to inspect the direction.
      </p>
    </div>
  );
}
