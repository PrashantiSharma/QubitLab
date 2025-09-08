# Polaris — Quantum State Cartography & Noise Dynamics on the Bloch Sphere

Polaris is an interactive, real‑time simulator for a single qubit. The app maps θ/φ controls directly onto the Bloch sphere so that state preparation and the resulting measurements are visually intuitive.

## Features

* Set the qubit by adjusting θ∈[0,π] and φ∈[0,2π). The Bloch vector updates instantly.
* Read complex amplitudes α, β and probabilities in the Z, X and Y bases.
* Animated panels display the real part of rotating basis amplitudes to make the relative phase tangible.
* Optional noise channels – dephasing, depolarizing and amplitude damping – shorten the Bloch vector and report the state’s purity.
* A two‑qubit Bell/CHSH extension demonstrates entanglement and its fragility under noise.

## Core Pipeline

1. **UI → worker.** The main thread sends angles and noise parameters to a web worker.
2. **Physics.** The worker prepares the state \(|ψ⟩=\cos(θ/2)|0⟩+e^{iφ}\sin(θ/2)|1⟩\), derives the Bloch vector, basis amplitudes and probabilities.
3. **Render.** React and Three.js render the Bloch sphere, probability bars and phase animations.

## Quickstart

```bash
npm install
npm run dev
```

* Drag the arrow or use the sliders to set a state.
* Increase dephasing to watch the vector shrink and the purity approach 0.5.
* Create a Bell pair and check the CHSH value; ideal S≈2.828 falls below 2 with enough noise.
