export type Grid = number[][];

export enum CognitiveTrack {
  LEARNING = "Learning",
  METACOGNITION = "Metacognition",
  ATTENTION = "Attention",
  EXECUTIVE_FUNCTIONS = "Executive Functions",
  SOCIAL_COGNITION = "Social Cognition",
  CHRONO_SYNTHETIC = "Crono-Sintético",
  VARIABLE_TOPOLOGY = "Topología Variable",
  CRYPTO_COGNITION = "Cripto-Cognición",
  ABSOLUTE = "Absoluto"
}

export interface Metric {
  humanBaseline: number;
  aiScore: number;
  gap: number;
  irt?: {
    discrimination: number;
    difficulty: number;
    information: number;
  };
  adversarial?: {
    isRobust: boolean;
    vulnerability?: string;
  };
  srs?: number;
  qualia?: string; // Aesthetic/Intentional signature
  enc?: {
    score: number;
    kolmogorov: number;
    editDistance: number;
    penaltyScale: number;
  };
  neuroGolf?: {
    accuracy: number;
    inferenceSpeed: number; // ms
    resourceConsumption: number; // FLOPs index
    parameterCount: number;
  };
  absoluteMetrics?: {
    collapseProbability: number;
    entropyDensity: number;
    qualiaResonance: number; // 0-100
  };
  mutationProfile?: {
    generation: number;
    mutationRate: number;
    survivability: number; // 0-100
    fitnessScore: number;
    evolvedGenes: string[];
  };
}

export interface ARCObject {
  id: number;
  color: number;
  pixels: { r: number; c: number }[];
  bbox: { minR: number; minC: number; maxR: number; maxC: number };
  size: number;
}

export interface Scene {
  grid: Grid;
  bgColor: number;
  objects: ARCObject[];
  width: number;
  height: number;
}

export interface ARCExample {
  input: Grid;
  output: Grid;
}

export interface ARCTask {
  id: string;
  track: CognitiveTrack;
  difficulty: "Easy" | "Medium" | "Hard" | "Prodigious" | "Absolute";
  train: ARCExample[];
  test: ARCExample[];
  arcGen?: ARCExample[];
  metrics?: Metric;
  ambiguous?: boolean;
  instruction?: string;
}

export const ARC_COLORS: Record<number, string> = {
  0: "#02040a", // Black / Deep
  1: "#00f2ff", // Cyan
  2: "#ff0070", // Pinkish Red
  3: "#00ff80", // Green
  4: "#ffcc00", // Yellow
  5: "#8888dd", // Soft Blue
  6: "#ff00ff", // Magenta
  7: "#ff7000", // Orange
  8: "#7000ff", // Purple
  9: "#444444", // Grey
};
