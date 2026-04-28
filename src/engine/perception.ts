import { ARCObject, Grid, Scene } from "./types";

export class PerceptionEngine {
  static detectBackground(grid: Grid): number {
    const counts: Record<number, number> = {};
    let maxVal = 0;
    let maxCount = -1;

    // Check border first
    const rows = grid.length;
    const cols = grid[0].length;
    const border: number[] = [];
    for (let r = 0; r < rows; r++) {
      border.push(grid[r][0], grid[r][cols - 1]);
    }
    for (let c = 0; c < cols; c++) {
      border.push(grid[0][c], grid[rows - 1][c]);
    }

    for (const val of border) {
      counts[val] = (counts[val] || 0) + 1;
      if (counts[val] > maxCount) {
        maxCount = counts[val];
        maxVal = val;
      }
    }

    // Heuristic: if a color covers more than 30% of the grid, it's likely background
    const totalPixels = rows * cols;
    const allCounts: Record<number, number> = {};
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const val = grid[r][c];
        allCounts[val] = (allCounts[val] || 0) + 1;
      }
    }

    for (const [valStr, count] of Object.entries(allCounts)) {
      if (count / totalPixels > 0.4) {
        return parseInt(valStr);
      }
    }

    return maxVal;
  }

  static extract(grid: Grid, bgColor?: number): Scene {
    const bg = bgColor ?? this.detectBackground(grid);
    const rows = grid.length;
    const cols = grid[0].length;
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const objects: ARCObject[] = [];
    let objectId = 1;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] !== bg && !visited[r][c]) {
          const pixels: { r: number; c: number }[] = [];
          const color = grid[r][c];
          const stack: { r: number; c: number }[] = [{ r, c }];
          visited[r][c] = true;

          let minR = r, maxR = r, minC = c, maxC = c;

          while (stack.length > 0) {
            const curr = stack.pop()!;
            pixels.push(curr);
            minR = Math.min(minR, curr.r);
            maxR = Math.max(maxR, curr.r);
            minC = Math.min(minC, curr.c);
            maxC = Math.max(maxC, curr.c);

            // 8-connectivity like Ivannuri V2
            for (let dr = -1; dr <= 1; dr++) {
              for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = curr.r + dr;
                const nc = curr.c + dc;
                if (
                  nr >= 0 && nr < rows &&
                  nc >= 0 && nc < cols &&
                  !visited[nr][nc] &&
                  grid[nr][nc] === color
                ) {
                  visited[nr][nc] = true;
                  stack.push({ r: nr, c: nc });
                }
              }
            }
          }

          objects.push({
            id: objectId++,
            color,
            pixels,
            bbox: { minR, minC, maxR, maxC },
            size: pixels.length,
          });
        }
      }
    }

    return { grid, bgColor: bg, objects, width: cols, height: rows };
  }

  static getFingerprint(grid: Grid): string {
    const rows = grid.length;
    const cols = grid[0].length;
    const colorCounts: Record<number, number> = {};
    for (const val of grid.flat()) {
        colorCounts[val] = (colorCounts[val] || 0) + 1;
    }
    const colorSig = Object.entries(colorCounts).sort().map(e => `${e[0]}:${e[1]}`).join(",");
    
    // Topology signature: sum of non-zero pixels in rows and columns
    const rowSig = grid.map(r => r.filter(v => v !== 0).length).join("-");
    const colSig = Array.from({ length: cols }, (_, c) => grid.filter(r => r[c] !== 0).length).join("-");

    return `${rows}x${cols}|${colorSig}|R:${rowSig}|C:${colSig}`;
  }
}
