import { ARCExample, Grid } from "./types";
import { Transforms, applyPipeline, gridsEqual } from "./transforms";
import { PerceptionEngine } from "./perception";
import { LLMSynthesizer } from "../services/llmSynthesizer";

export class IvannuriEngine {
  /**
   * 2D Levenshtein-style Edit Distance for Grids.
   */
  static editDistance2D(pred: Grid, target: Grid): number {
    if (pred.length !== target.length || pred[0].length !== target[0].length) {
        return Math.max(pred.length * pred[0].length, target.length * target[0].length);
    }
    let diff = 0;
    for (let r = 0; r < pred.length; r++) {
      for (let c = 0; c < pred[0].length; c++) {
        if (pred[r][c] !== target[r][c]) diff++;
      }
    }
    return diff;
  }

  static score(pred: Grid, target: Grid): number {
    const total = target.length * target[0].length;
    const dist = this.editDistance2D(pred, target);
    return (total - dist) / total;
  }

  /**
   * Neuro-Cognitive Efficiency (ENC) Formula:
   * ENC = (1 - NormalizedEditDistance) * Exp(-Steps * 0.1) * ParameterMultiplier
   */
  static calculateENC(pipeline: string[], examples: ARCExample[], params: number = 75000): number {
    let avgScore = 0;
    for (const ex of examples) {
        const pred = applyPipeline(ex.input, pipeline);
        avgScore += this.score(pred, ex.output);
    }
    avgScore /= examples.length;

    const kolmogorov = pipeline.length;
    const penaltyScale = params < 100000 ? Math.pow(1.2, (100000 - params) / 10000) : 1.0;
    
    return avgScore * Math.exp(-kolmogorov * 0.05) * penaltyScale;
  }

  private static symbolicCache: Map<string, string[]> = new Map();

  static solve(examples: ARCExample[], maxDepth = 5): string[] | null {
    const ops = Object.keys(Transforms).filter(op => op !== "identity");
    const taskFingerprint = examples.map(ex => PerceptionEngine.getFingerprint(ex.input)).join("::");
    
    if (this.symbolicCache.has(taskFingerprint)) {
        const cachedPipeline = this.symbolicCache.get(taskFingerprint)!;
        if (examples.every(ex => this.score(applyPipeline(ex.input, cachedPipeline), ex.output) === 1.0)) {
            return cachedPipeline;
        }
    }

    let beams: { pipeline: string[]; score: number }[] = [{ pipeline: [], score: 0 }];

    for (let depth = 0; depth < maxDepth; depth++) {
      const nextBeams: { pipeline: string[]; score: number }[] = [];
      for (const beam of beams) {
        for (const op of ops) {
          if (beam.pipeline.length > 0 && beam.pipeline[beam.pipeline.length - 1] === op) continue;
          const newPipeline = [...beam.pipeline, op];
          let totalScore = 0;
          let perfectMatches = 0;
          for (const ex of examples) {
            try {
              const s = this.score(applyPipeline(ex.input, newPipeline), ex.output);
              totalScore += s;
              if (s === 1.0) perfectMatches++;
            } catch (e) { break; }
          }
          if (perfectMatches === examples.length) {
            this.symbolicCache.set(taskFingerprint, newPipeline);
            LLMSynthesizer.onTaskSolved(examples, newPipeline);
            return newPipeline;
          }
          if (totalScore > 0) {
            nextBeams.push({ pipeline: newPipeline, score: totalScore / examples.length });
          }
        }
      }
      beams = nextBeams.sort((a, b) => b.score - a.score).slice(0, 50);
      if (beams.length === 0) break;
    }
    return null;
  }

  static calculateSRS(examples: ARCExample[]): number {
    const start = Date.now();
    const sol = this.solve(examples, 3);
    const elapsed = Date.now() - start;
    if (sol) return Math.max(10, 40 - (elapsed / 20));
    const deepSol = this.solve(examples, 5);
    if (deepSol) return Math.min(85, 55 + deepSol.length * 5);
    return 98; // Absolute Protocol Resistance
  }
}
