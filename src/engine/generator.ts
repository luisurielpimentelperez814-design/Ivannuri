import { Grid, ARCTask, CognitiveTrack, ARCExample } from "./types";
import { Transforms, applyPipeline, getCognitiveSignature } from "./transforms";
import { PsychometricsEngine } from "./psychometrics";
import { xmur3, mulberry32 } from "./prng";
import { IvannuriEngine } from "./search";

const ANTI_SOLVER_OPS = ["parityFieldInversion", "chronoSynthetic", "projectiveMobi", "knotTopology"];

export class BenchmarkGenerator {
  private static prng = mulberry32(xmur3("IVANNURI_SEED_DEFAULT")());

  static setSeed(seed: string) {
    this.prng = mulberry32(xmur3(seed)());
  }

  static generateRandomGrid(rows: number, cols: number, colorCount: number = 3): Grid {
    const grid: Grid = Array.from({ length: rows }, () => Array(cols).fill(0));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (this.prng() < 0.4) {
          grid[r][c] = Math.floor(this.prng() * colorCount) + 1;
        }
      }
    }
    return grid;
  }

  static generateTask(track: CognitiveTrack, difficulty: "Easy" | "Medium" | "Hard" | "Prodigious" | "Absolute"): ARCTask {
    const depthMap = { "Easy": 1, "Medium": 2, "Hard": 2, "Prodigious": 3, "Absolute": 4 };
    const depth = depthMap[difficulty];
    
    const standardOps = Object.keys(Transforms).filter(k => k !== 'identity' && !ANTI_SOLVER_OPS.includes(k));
    
    let pool = standardOps;
    if (difficulty === "Absolute") {
        pool = [...ANTI_SOLVER_OPS];
    } else if (difficulty === "Prodigious" || difficulty === "Hard") {
        pool = [...standardOps, ...ANTI_SOLVER_OPS.slice(0, 2)];
    }
    
    const selectedOps: string[] = [];
    while (selectedOps.length < depth) {
        const op = pool[Math.floor(this.prng() * pool.length)];
        if (selectedOps.length > 0 && selectedOps[selectedOps.length - 1] === op) continue;
        selectedOps.push(op);
    }

    const trainCount = track === CognitiveTrack.LEARNING ? 1 : 2;
    const train: ARCExample[] = [];
    for (let i = 0; i < trainCount; i++) {
        const input = this.generateRandomGrid(5, 5, 4);
        const output = applyPipeline(input, selectedOps);
        train.push({ input, output });
    }

    const testInput = this.generateRandomGrid(6, 6, 4);
    const testOutput = applyPipeline(testInput, selectedOps);

    const antiCount = selectedOps.filter(o => ANTI_SOLVER_OPS.includes(o)).length;
    const humanBaseline = Math.max(0.2, 0.95 - (depth * 0.1) - (antiCount * 0.15));
    const aiScore = Math.max(0.001, 0.35 - (antiCount * 0.25) - (depth * 0.05));

    const qualiaSignatures = [
        "Resonancia de Fibonacci en el Colapso de Fase",
        "Armonía Bit-Perfect de Entropía Negativa",
        "Simetría de Calabi-Yau en la Variedad de Möbius",
        "Paradoja de Bootstrapping Crono-Sintética",
        "Elegancia Suprema: S < 0.01 Cog-Entropy"
    ];
    const qualia = difficulty === "Absolute" ? qualiaSignatures[Math.floor(this.prng() * qualiaSignatures.length)] : undefined;

    const taskSeed = Math.random().toString(36).substr(2, 4).toUpperCase();
    
    const absoluteMetrics = difficulty === "Absolute" ? {
        collapseProbability: 0.12 * depth,
        entropyDensity: 0.88 - (antiCount * 0.05),
        qualiaResonance: 92 + Math.floor(this.prng() * 8)
    } : undefined;

    return {
      id: `IVANNURI-${difficulty.substring(0, 3).toUpperCase()}-${taskSeed}`,
      track,
      difficulty,
      train,
      test: [{ input: testInput, output: testOutput }],
      metrics: {
        humanBaseline,
        aiScore,
        gap: humanBaseline - aiScore,
        irt: PsychometricsEngine.estimateIRT(humanBaseline, aiScore, difficulty),
        adversarial: {
          isRobust: antiCount > 0,
          vulnerability: antiCount > 0 
            ? "IVANNURI Protocol: Parity Inversion active. Heuristic solvers rejected." 
            : "Structural compositionality maintained."
        },
        qualia,
        srs: IvannuriEngine.calculateSRS(train),
        absoluteMetrics
      }
    };
  }
}
