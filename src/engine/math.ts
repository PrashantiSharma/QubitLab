
// --- Complex helpers ---
export type C = { re: number; im: number };
const c = (re=0, im=0): C => ({ re, im });
const add = (a:C,b:C)=>c(a.re+b.re, a.im+b.im);
const mul = (a:C,b:C)=>c(a.re*b.re - a.im*b.im, a.re*b.im + a.im*b.re);
const conj = (a:C)=>c(a.re, -a.im);

// 2x2 complex matrix
export type M2 = [[C,C],[C,C]];
export const I: M2 = [[c(1),c(0)],[c(0),c(1)]];
export const X: M2 = [[c(0),c(1)],[c(1),c(0)]];
export const Y: M2 = [[c(0),c(0,-1)],[c(0,1),c(0)]];
export const Z: M2 = [[c(1),c(0)],[c(0),c(-1)]];
export const H: M2 = [[c(1/Math.SQRT2),c(1/Math.SQRT2)],[c(1/Math.SQRT2),c(-1/Math.SQRT2)]];

export const ket0bra0 = (): M2 => [[c(1),c(0)],[c(0),c(0)]];

// multiply 2x2 matrices: a*b
const m2mul = (a:M2,b:M2): M2 => {
  const r: M2 = [[c(),c()],[c(),c()]];
  for (let i=0;i<2;i++){
    for(let j=0;j<2;j++){
      let s=c();
      for(let k=0;k<2;k++) s = add(s, mul(a[i][k], b[k][j]));
      r[i][j]=s;
    }
  }
  return r;
};

// dagger (conj transpose)
const dag = (m:M2): M2 => [[conj(m[0][0]),conj(m[1][0])],[conj(m[0][1]),conj(m[1][1])]];

// ρ' = U ρ U†
export const applyUnitary = (rho:M2, U:M2): M2 => m2mul(m2mul(U, rho), dag(U));

// Dephasing with prob p: ρ'=(1-p)ρ + p ZρZ
export const applyDephase = (rho:M2, p:number): M2 => {
  const ZrhoZ = m2mul(m2mul(Z, rho), Z);
  const r: M2 = [[c(),c()],[c(),c()]];
  for(let i=0;i<2;i++){
    for(let j=0;j<2;j++){
      r[i][j] = c((1-p)*rho[i][j].re + p*ZrhoZ[i][j].re, (1-p)*rho[i][j].im + p*ZrhoZ[i][j].im);
    }
  }
  return r;
};

// Tr(A B)
const traceProd = (a:M2,b:M2): C => {
  const ab = m2mul(a,b);
  return c(ab[0][0].re + ab[1][1].re, ab[0][0].im + ab[1][1].im);
};

// ⟨X⟩,⟨Y⟩,⟨Z⟩ and purity Tr(ρ²)
export const blochAndPurity = (rho:M2) => {
  const ex = traceProd(rho, X).re;
  const ey = traceProd(rho, Y).re;
  const ez = traceProd(rho, Z).re;
  // Purity = Tr(rho^2)
  const rr = traceProd(rho, rho).re;
  return { x: ex, y: ey, z: ez, purity: rr };
};
