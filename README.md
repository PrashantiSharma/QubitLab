
# Qubit Lab — Bloch Playground (MVP)

A tiny MVP for your faculty showcase: live Bloch sphere, H/X/Y/Z gates, and dephasing noise that visibly reduces purity.

## Quickstart
```bash
# 1) Extract zip, then:
cd qubit-lab
npm install
npm run dev
# Open the shown localhost URL (usually http://localhost:5173)
```

## What this MVP includes
- React + TypeScript + Vite scaffold
- Web Worker math engine (keeps UI at 60 fps)
- 1-qubit density matrix evolution
- Gates: H, X, Y, Z
- Dephasing noise slider
- Live Bloch sphere (Three.js), purity readout

## Next steps (suggested)
1) Add amplitude damping and depolarizing channels.
2) Build a drag-and-drop circuit timeline.
3) Extend to 2 qubits (Bell + CHSH).
4) Add error mitigation (readout calibration + ZNE).
5) Polish UI and export screenshots/CSV.
```
