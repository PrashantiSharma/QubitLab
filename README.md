
# Qubit Lab — Bloch Playground (MVP v2)

Visual Bloch sphere with H/X/Y/Z gates and **dephasing noise**.
**New in v2:** Arrow length now encodes |r| (mixedness), OrbitControls for rotation, and ⟨X,Y,Z⟩ readouts.

## Quickstart
```bash
cd qubit-lab
npm install
npm run dev
```

- Press **H** to create |+⟩ (⟨X⟩≈1).  
- Increase **Dephasing p** to watch the arrow **shrink** and Purity → 0.5.  
- Rotate the sphere with your mouse if you don’t notice directional changes.
