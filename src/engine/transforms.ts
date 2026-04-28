import { Grid } from "./types";

export type TransformFn = (grid: Grid) => Grid;

export const Transforms: Record<string, TransformFn> = {
  identity: (g) => g.map(row => [...row]),
  
  rot90: (g) => {
    const r = g.length, c = g[0].length;
    const res = Array.from({ length: c }, () => Array(r).fill(0));
    for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) res[j][r - 1 - i] = g[i][j];
    return res;
  },

  rot180: (g) => {
    const r = g.length, c = g[0].length;
    const res = Array.from({ length: r }, () => Array(c).fill(0));
    for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) res[r - 1 - i][c - 1 - j] = g[i][j];
    return res;
  },

  flipV: (g) => g.map(row => [...row].reverse()),
  flipH: (g) => [...g].reverse().map(row => [...row]),

  transpose: (g) => {
    const r = g.length, c = g[0].length;
    const res = Array.from({ length: c }, () => Array(r).fill(0));
    for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) res[j][i] = g[i][j];
    return res;
  },

  cropToContent: (g) => {
    let minR = g.length, maxR = 0, minC = g[0].length, maxC = 0, found = false;
    for (let r = 0; r < g.length; r++) {
      for (let c = 0; c < g[0].length; c++) {
        if (g[r][c] !== 0) {
          minR = Math.min(minR, r); maxR = Math.max(maxR, r);
          minC = Math.min(minC, c); maxC = Math.max(maxC, c);
          found = true;
        }
      }
    }
    return found ? g.slice(minR, maxR + 1).map(row => row.slice(minC, maxC + 1)) : g;
  },

  // ANTI-SOLVER OPS: IVANNURI PROTOCOL
  
  parityFieldInversion: (g) => {
    const r = g.length, c = g[0].length;
    return g.map((row, i) => row.map((val, j) => {
      const fieldStrength = (i * 3 + j * 7 + val) % 10;
      return (val + fieldStrength) % 10;
    }));
  },

  chronoSynthetic: (g) => {
    const r = g.length, c = g[0].length;
    const res = g.map(row => [...row]);
    // Recursive loop persistence constraint (CSP style)
    for (let i = 0; i < r; i++) {
        for (let j = 0; j < c; j++) {
            if (g[i][j] !== 0) {
                let neighbors = 0;
                [[i-1,j],[i+1,j],[i,j-1],[i,j+1]].forEach(([ni, nj]) => {
                    if (ni >= 0 && ni < r && nj >= 0 && nj < c && g[ni][nj] !== 0) neighbors++;
                });
                if (neighbors < 2) res[i][j] = 0;
            }
        }
    }
    return res;
  },

  projectiveMobi: (g) => {
    const r = g.length, c = g[0].length;
    const res = Array.from({ length: r }, () => Array(c).fill(0));
    for (let i = 0; i < r; i++) {
        for (let j = 0; j < c; j++) {
            const targetJ = c - 1 - j;
            const targetI = (i + Math.floor(j/2)) % r;
            res[targetI][targetJ] = g[i][j];
        }
    }
    return res;
  },

  knotTopology: (g) => {
    const r = g.length, c = g[0].length;
    const res = g.map(row => [...row]);
    // Knot linkage: cells with the same color are "linked" and their movement is interdependent
    const links: Record<number, {r: number, c: number}[]> = {};
    for(let i=0; i<r; i++) for(let j=0; j<c; j++) {
        if(g[i][j] !== 0) {
            if(!links[g[i][j]]) links[g[i][j]] = [];
            links[g[i][j]].push({r: i, c: j});
        }
    }
    // Entangle colors: color N affects position of color (N+1)%10
    Object.keys(links).forEach(colorStr => {
        const color = parseInt(colorStr);
        const shiftR = Math.floor(links[color].length / 2);
        const nextColor = (color + 1) % 10;
        if(links[nextColor]) {
            links[nextColor].forEach(p => {
                const ni = (p.r + shiftR) % r;
                res[ni][p.c] = nextColor;
                if (ni !== p.r) res[p.r][p.c] = 0;
            });
        }
    });
    return res;
  }
};

export function getCognitiveSignature(g: Grid): string {
  let real = 0, imag = 0;
  g.forEach((row, i) => row.forEach((val, j) => {
    const angle = (2 * Math.PI * (i + j)) / (g.length * g[0].length);
    real += val * Math.cos(angle);
    imag += val * Math.sin(angle);
  }));
  return Math.sqrt(real * real + imag * imag).toFixed(4);
}

export function gridsEqual(a: Grid, b: Grid): boolean {
  if (a.length !== b.length || a[0].length !== b[0].length) return false;
  for (let r = 0; r < a.length; r++) {
    for (let c = 0; c < a[0].length; c++) {
      if (a[r][c] !== b[r][c]) return false;
    }
  }
  return true;
}

export function applyPipeline(grid: Grid, pipeline: string[]): Grid {
  let current = grid;
  for (const op of pipeline) {
    if (Transforms[op]) {
      current = Transforms[op](current);
    }
  }
  return current;
}
