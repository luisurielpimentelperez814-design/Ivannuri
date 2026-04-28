import { Metric } from "./types";

export class PsychometricsEngine {
  /**
   * Estimates IRT parameters based on a task's performance profile.
   * In a real lab, this would use a large sample of human/AI data.
   * Here we simulate Item Response Theory (IRT) modeling.
   */
  static estimateIRT(humanBaseline: number, aiScore: number, difficultyLabel: string): Metric['irt'] {
    const diffMap: Record<string, number> = { "Easy": -1.5, "Medium": 0, "Hard": 1.5, "Prodigious": 3.0, "Absolute": 4.5 };
    
    // a-parameter (discrimination): higher for "cleaner" cognitive tasks
    // We simulate lower discrimination for tasks where models and humans overlap confusingly
    const discrimination = Math.abs(humanBaseline - aiScore) * 4;
    
    // b-parameter (difficulty): calibrated against the IRT theta scale (-4 to 4)
    const difficulty = diffMap[difficultyLabel] || 0;
    
    // Information value (simulated 2PL model calculation at theta=0)
    // I(0) = a^2 * P(0)*(1-P(0))
    const p0 = 1 / (1 + Math.exp(discrimination * (0 - difficulty)));
    const information = Math.pow(discrimination, 2) * p0 * (1 - p0);

    return {
      discrimination: parseFloat(discrimination.toFixed(3)),
      difficulty: parseFloat(difficulty.toFixed(3)),
      information: parseFloat(information.toFixed(3))
    };
  }

  /**
   * Generates data points for the Item Characteristic Curve (ICC)
   */
  static getICCPoints(discrimination: number, difficulty: number): { theta: number; probability: number }[] {
    const points = [];
    for (let theta = -4; theta <= 4; theta += 0.5) {
      const prob = 1 / (1 + Math.exp(-discrimination * (theta - difficulty)));
      points.push({ theta, probability: parseFloat(prob.toFixed(3)) });
    }
    return points;
  }
}
