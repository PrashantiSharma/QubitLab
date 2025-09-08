
/// <reference lib="webworker" />
import { M2, H, X, Y, Z, applyUnitary, applyDephase, blochAndPurity, ket0bra0, rhoFromBloch } from "./math";

let rho: M2 = ket0bra0();

type Msg =
  | { type: "reset" }
  | { type: "gate", gate: "H" | "X" | "Y" | "Z" }
  | { type: "dephase", p: number }
  | { type: "setBloch", x: number, y: number, z: number }
  | { type: "snapshot" };

const post = () => (self as any).postMessage({
  kind: "state",
  ...blochAndPurity(rho)
});

self.addEventListener("message", (ev: MessageEvent<Msg>) => {
  const m = ev.data;
  switch (m.type) {
    case "reset":
      rho = ket0bra0();
      break;
    case "gate": {
      const table: Record<string, M2> = { H, X, Y, Z };
      const U = table[m.gate];
      rho = applyUnitary(rho, U);
      break;
    }
    case "dephase":
      rho = applyDephase(rho, m.p);
      break;
    case "setBloch":
      rho = rhoFromBloch(m.x, m.y, m.z);
      break;
    case "snapshot":
      break;
  }
  post();
});
