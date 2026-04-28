import { Grid, ARCExample } from './types';

// ==========================================
// BLOCK 1: PERCEPTION
// ==========================================

export interface ARCObject {
    id: number;
    color: number;
    pixels: Set<string>; // "y,x" to store coordinates
}

export class PerceptionEngine {
    detectBg(grid: Grid): number {
        const h = grid.length, w = grid[0].length;
        const counts = new Map<number, number>();
        let total = 0;
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const val = grid[y][x];
                counts.set(val, (counts.get(val) || 0) + 1);
                total++;
            }
        }
        if (counts.has(0) && (counts.get(0)! / total) >= 0.2) {
            return 0;
        }
        
        const borderCounts = new Map<number, number>();
        const borderPixels: number[] = [];
        for (let x = 0; x < w; x++) {
            borderPixels.push(grid[0][x], grid[h-1][x]);
        }
        for (let y = 1; y < h - 1; y++) {
            borderPixels.push(grid[y][0], grid[y][w-1]);
        }
        borderPixels.forEach(v => borderCounts.set(v, (borderCounts.get(v) || 0) + 1));
        
        let maxColor = 0;
        let maxCount = -1;
        borderCounts.forEach((count, color) => {
            if (count > maxCount) {
                maxCount = count;
                maxColor = color;
            }
        });
        return maxColor;
    }

    extractObjects(grid: Grid, bg: number | null = null): { objects: ARCObject[], bg: number } {
        const h = grid.length, w = grid[0].length;
        if (bg === null) bg = this.detectBg(grid);
        
        const visited = Array.from({length: h}, () => Array(w).fill(false));
        const objects: ARCObject[] = [];
        let objId = 0;

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                if (!visited[y][x] && grid[y][x] !== bg) {
                    const color = grid[y][x];
                    const pixels = new Set<string>();
                    const stack: [number, number][] = [[y, x]];
                    
                    while (stack.length > 0) {
                        const [cy, cx] = stack.pop()!;
                        if (cy < 0 || cy >= h || cx < 0 || cx >= w) continue;
                        if (visited[cy][cx] || grid[cy][cx] !== color) continue;
                        
                        visited[cy][cx] = true;
                        pixels.add(`${cy},${cx}`);
                        
                        stack.push([cy - 1, cx], [cy + 1, cx], [cy, cx - 1], [cy, cx + 1]);
                    }
                    
                    objects.push({ id: objId++, color, pixels });
                }
            }
        }
        return { objects, bg };
    }
}

// ==========================================
// BLOCK 2: DSL TRANSFORMS
// ==========================================

export class T {
    static identity(g: Grid): Grid { return g; }

    static rot90(g: Grid): Grid {
        const r = g.length, c = g[0].length;
        const res = Array.from({length: c}, () => Array(r).fill(0));
        for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) res[j][r - 1 - i] = g[i][j];
        return res;
    }

    static rot180(g: Grid): Grid {
        const r = g.length, c = g[0].length;
        const res = Array.from({length: r}, () => Array(c).fill(0));
        for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) res[r - 1 - i][c - 1 - j] = g[i][j];
        return res;
    }

    static rot270(g: Grid): Grid {
        const r = g.length, c = g[0].length;
        const res = Array.from({length: c}, () => Array(r).fill(0));
        for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) res[c - 1 - j][i] = g[i][j];
        return res;
    }

    static flip_h(g: Grid): Grid {
        return g.map(row => [...row].reverse());
    }

    static flip_v(g: Grid): Grid {
        return [...g].reverse().map(row => [...row]);
    }

    static flip_d(g: Grid): Grid {
        const r = g.length, c = g[0].length;
        const res = Array.from({length: c}, () => Array(r).fill(0));
        for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) res[j][i] = g[i][j];
        return res;
    }

    static flip_ad(g: Grid): Grid {
        const r = g.length, c = g[0].length;
        const res = Array.from({length: c}, () => Array(r).fill(0));
        for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) res[c - 1 - j][r - 1 - i] = g[i][j];
        return res;
    }

    static invert_colors(g: Grid): Grid {
        return g.map(row => row.map(v => v === 0 ? 1 : 0));
    }

    static tile_self(g: Grid): Grid {
        const h = g.length, w = g[0].length;
        const out = Array.from({length: h * h}, () => Array(w * w).fill(0));
        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                if (g[i][j] !== 0) {
                    for (let r = 0; r < h; r++) {
                        for (let c = 0; c < w; c++) {
                            out[i * h + r][j * w + c] = g[r][c];
                        }
                    }
                }
            }
        }
        return out;
    }

    static tile_2x2(g: Grid): Grid {
        const h = g.length, w = g[0].length;
        const out = Array.from({length: h * 2}, () => Array(w * 2).fill(0));
        for (let i = 0; i < h * 2; i++) {
            for (let j = 0; j < w * 2; j++) out[i][j] = g[i % h][j % w];
        }
        return out;
    }

    static tile_3x3(g: Grid): Grid {
        const h = g.length, w = g[0].length;
        const out = Array.from({length: h * 3}, () => Array(w * 3).fill(0));
        for (let i = 0; i < h * 3; i++) {
            for (let j = 0; j < w * 3; j++) out[i][j] = g[i % h][j % w];
        }
        return out;
    }

    static zoom2x(g: Grid): Grid {
        const h = g.length, w = g[0].length;
        const out = Array.from({length: h * 2}, () => Array(w * 2).fill(0));
        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                const val = g[i][j];
                out[i * 2][j * 2] = val;
                out[i * 2 + 1][j * 2] = val;
                out[i * 2][j * 2 + 1] = val;
                out[i * 2 + 1][j * 2 + 1] = val;
            }
        }
        return out;
    }

    static zoom3x(g: Grid): Grid {
        const h = g.length, w = g[0].length;
        const out = Array.from({length: h * 3}, () => Array(w * 3).fill(0));
        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                const val = g[i][j];
                for (let di = 0; di < 3; di++) {
                    for (let dj = 0; dj < 3; dj++) {
                        out[i * 3 + di][j * 3 + dj] = val;
                    }
                }
            }
        }
        return out;
    }

    static crop_nonzero(g: Grid): Grid {
        let minR = g.length, maxR = -1;
        let minC = g[0].length, maxC = -1;
        for (let r = 0; r < g.length; r++) {
            for (let c = 0; c < g[0].length; c++) {
                if (g[r][c] !== 0) {
                    if (r < minR) minR = r;
                    if (r > maxR) maxR = r;
                    if (c < minC) minC = c;
                    if (c > maxC) maxC = c;
                }
            }
        }
        if (maxR === -1) return g;
        const res: Grid = [];
        for (let r = minR; r <= maxR; r++) {
            res.push(g[r].slice(minC, maxC + 1));
        }
        return res;
    }

    static fill_holes(g: Grid, bg: number = 0): Grid {
         // Placeholder implementation for simplicity.
         return g;
    }

    static gravity_down(g: Grid, bg: number = 0): Grid {
        const h = g.length, w = g[0].length;
        const out = Array.from({length: h}, () => Array(w).fill(bg));
        for (let c = 0; c < w; c++) {
            let writeY = h - 1;
            for (let r = h - 1; r >= 0; r--) {
                if (g[r][c] !== bg) {
                    out[writeY][c] = g[r][c];
                    writeY--;
                }
            }
        }
        return out;
    }

    static gravity_up(g: Grid, bg: number = 0): Grid {
        const h = g.length, w = g[0].length;
        const out = Array.from({length: h}, () => Array(w).fill(bg));
        for (let c = 0; c < w; c++) {
            let writeY = 0;
            for (let r = 0; r < h; r++) {
                if (g[r][c] !== bg) {
                    out[writeY][c] = g[r][c];
                    writeY++;
                }
            }
        }
        return out;
    }

    static sort_rows(g: Grid): Grid {
        return g.map(row => [...row].sort((a, b) => a - b));
    }

    static unique_colors_only(g: Grid): Grid {
        const counts = new Map<number, number>();
        for (const row of g) {
            for (const cell of row) {
                counts.set(cell, (counts.get(cell) || 0) + 1);
            }
        }
        return g.map(row => row.map(cell => (counts.get(cell)! > 1 ? 0 : cell)));
    }
}

export const TRANSFORMS: Record<string, (g: Grid) => Grid> = {
    'identity': T.identity,
    'rot90': T.rot90,
    'rot180': T.rot180,
    'rot270': T.rot270,
    'flip_h': T.flip_h,
    'flip_v': T.flip_v,
    'flip_d': T.flip_d,
    'flip_ad': T.flip_ad,
    'tile_self': T.tile_self,
    'tile_2x2': T.tile_2x2,
    'tile_3x3': T.tile_3x3,
    'zoom2x': T.zoom2x,
    'zoom3x': T.zoom3x,
    'crop_nonzero': T.crop_nonzero,
    'fill_holes': T.fill_holes,
    'gravity_down': T.gravity_down,
    'gravity_up': T.gravity_up,
    'invert_colors': T.invert_colors,
    'sort_rows': T.sort_rows,
    'unique_colors_only': T.unique_colors_only
};

export function gridsEqual(a: Grid, b: Grid): boolean {
    if (!a || !b) return false;
    if (a.length !== b.length || a[0].length !== b[0].length) return false;
    for (let r = 0; r < a.length; r++) {
        for (let c = 0; c < a[0].length; c++) {
            if (a[r][c] !== b[r][c]) return false;
        }
    }
    return true;
}

export function applyPipeline(g: Grid, pipeline: string[], bg: number = 0): Grid | null {
    let current = g;
    for (const name of pipeline) {
        if (!TRANSFORMS[name]) continue;
        try {
            current = TRANSFORMS[name](current);
        } catch {
            return null;
        }
    }
    return current;
}

// ==========================================
// BLOCK 3: SPECIALIZED SOLVERS
// ==========================================

export class TilePatternSolver {
    static solve(examples: ARCExample[]): string[] | null {
        for (const ex of examples) {
            const h = ex.input.length, w = ex.input[0].length;
            const oh = ex.output.length, ow = ex.output[0].length;
            if ((oh !== h * h || ow !== w * w) && (oh !== h * 3 || ow !== w * 3)) {
                return null;
            }
        }
        let allMatch = true;
        for (const ex of examples) {
            const pred = T.tile_self(ex.input);
            if (!gridsEqual(pred, ex.output)) {
                allMatch = false;
                break;
            }
        }
        return allMatch ? ['tile_self'] : null;
    }
}

export class SymmetrySolver {
    static solve(examples: ARCExample[]): string[] | null {
        const candidates = ['rot90', 'rot180', 'rot270', 'flip_h', 'flip_v', 'flip_d', 'flip_ad'];
        for (const op of candidates) {
            const match = examples.every(ex => gridsEqual(TRANSFORMS[op](ex.input), ex.output));
            if (match) return [op];
        }
        return null;
    }
}

export class ZoomSolver {
    static solve(examples: ARCExample[]): string[] | null {
        for (const op of ['zoom2x', 'zoom3x']) {
            const match = examples.every(ex => gridsEqual(TRANSFORMS[op](ex.input), ex.output));
            if (match) return [op];
        }
        return null;
    }
}

export class GravitySolver {
    static solve(examples: ARCExample[]): string[] | null {
        for (const op of ['gravity_down', 'gravity_up']) {
            const match = examples.every(ex => gridsEqual(TRANSFORMS[op](ex.input), ex.output));
            if (match) return [op];
        }
        return null;
    }
}

export class HiddenMatrixSolver {
    static solve(examples: ARCExample[]): string[] | null {
        if (!examples || examples.length === 0) return null;
        
        const first = examples[0];
        const h = first.input.length;
        const w = first.input[0].length;
        
        for (const ex of examples) {
            if (ex.input.length !== h || ex.input[0].length !== w) return null;
            if (ex.output.length !== h || ex.output[0].length !== w) return null;
        }
        
        const M = new Map<string, number>();
        let consistent = true;
        
        for (const ex of examples) {
            for (let i = 0; i < h; i++) {
                for (let j = 0; j < w; j++) {
                    const diff = (ex.output[i][j] - ex.input[i][j] + 10) % 10;
                    const key = `${i},${j}`;
                    if (M.has(key)) {
                        if (M.get(key) !== diff) {
                            consistent = false;
                            break;
                        }
                    } else {
                        M.set(key, diff);
                    }
                }
                if (!consistent) break;
            }
            if (!consistent) break;
        }
        
        if (!consistent) return null;
        
        const transformName = `_hidden_matrix_${Date.now()}`;
        TRANSFORMS[transformName] = (g: Grid): Grid => {
            if (g.length !== h || g[0].length !== w) return g;
            const res = Array.from({length: h}, () => Array(w).fill(0));
            for (let i = 0; i < h; i++) {
                for (let j = 0; j < w; j++) {
                    const offset = M.get(`${i},${j}`) || 0;
                    res[i][j] = (g[i][j] + offset) % 10;
                }
            }
            return res;
        };
        
        const allMatch = examples.every(ex => gridsEqual(TRANSFORMS[transformName](ex.input), ex.output));
        
        if (allMatch) {
            return [transformName];
        }
        
        return null;
    }
}

// ==========================================
// BLOCK 5: MAIN ORION ENGINE
// ==========================================

export class OrionEngine {
    private solvers = [
        TilePatternSolver,
        SymmetrySolver,
        ZoomSolver,
        GravitySolver,
        HiddenMatrixSolver
    ];

    solveTask(examples: ARCExample[]): string[] | null {
        for (const solver of this.solvers) {
            const pipe = solver.solve(examples);
            if (pipe) return pipe;
        }
        
        // Identity fallback
        if (examples.every(ex => gridsEqual(ex.input, ex.output))) return ['identity'];
        
        return null;
    }

    evaluateTask(task: {train: ARCExample[], test: {input: Grid, output: Grid}[]}) {
        const pipe = this.solveTask(task.train);
        const results = task.test.map(t => {
            const pred = applyPipeline(t.input, pipe || []);
            return {
                prediction: pred,
                correct: pred && gridsEqual(pred, t.output),
                pipeline: pipe
            };
        });
        return results;
    }
}
