
import { create } from "zustand";

type State = { x:number; y:number; z:number; purity:number };
type Store = {
  state: State;
  worker: Worker | null;
  setWorker: (w:Worker)=>void;
  update: (s:Partial<State>)=>void;
};
export const useApp = create<Store>((set)=>({
  state: { x:0, y:0, z:1, purity:1 },
  worker: null,
  setWorker: (w)=>set({worker:w}),
  update: (s)=>set((prev)=>({ state: { ...prev.state, ...s } }))
}));
