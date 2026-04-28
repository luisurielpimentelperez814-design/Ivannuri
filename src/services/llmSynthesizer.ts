import { GoogleGenAI, Type } from "@google/genai";
import { ARCExample, Grid } from "../engine/types";
import { PerceptionEngine } from "../engine/perception";
import { Transforms } from "../engine/transforms";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface LearnedSolution {
  fingerprint: string;
  pipeline: string[];
  successCount: number;
}

export class LLMSynthesizer {
  private static learnedSolutions: LearnedSolution[] = this.loadFromStorage();

  private static loadFromStorage(): LearnedSolution[] {
    try {
      const saved = localStorage.getItem("ivannuri_learned_solutions");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  private static saveToStorage() {
    try {
      localStorage.setItem("ivannuri_learned_solutions", JSON.stringify(this.learnedSolutions));
    } catch (e) {
      console.warn("Storage quota exceeded, synthesis memory limited.");
    }
  }

  /**
   * Records a successful solution to improve future synthesis.
   */
  static onTaskSolved(examples: ARCExample[], pipeline: string[]) {
    const fingerprint = this.getTaskFingerprint(examples);
    const existing = this.learnedSolutions.find(s => s.fingerprint === fingerprint);
    
    if (existing) {
      existing.successCount++;
      // Update pipeline if the new one is shorter
      if (pipeline.length < existing.pipeline.length) {
        existing.pipeline = pipeline;
      }
    } else {
      this.learnedSolutions.push({
        fingerprint,
        pipeline,
        successCount: 1
      });
    }
    
    // Sort by success to prioritize robust patterns
    this.learnedSolutions.sort((a, b) => b.successCount - a.successCount);
    this.saveToStorage();
  }

  static getMemorySize(): number {
    return this.learnedSolutions.length;
  }

  private static getTaskFingerprint(examples: ARCExample[]): string {
    return examples.map(ex => PerceptionEngine.getFingerprint(ex.input)).join("::");
  }

  /**
   * Synthesizes a DSL pipeline using LLM reasoning + learned knowledge.
   */
  static async synthesize(examples: ARCExample[]): Promise<string[] | null> {
    if (!process.env.GEMINI_API_KEY) return null;

    const currentFingerprint = this.getTaskFingerprint(examples);
    
    // Retrieve "Memory" - similar solved tasks
    const memory = this.learnedSolutions
      .slice(0, 5)
      .map(s => `Fingerprint: ${s.fingerprint} -> Pipeline: [${s.pipeline.join(", ")}]`)
      .join("\n");

    const availableOps = Object.keys(Transforms).join(", ");

    const prompt = `
      ARC-AGI SOLVER CORE: DSL SYNTHESIS
      
      AVAILABLE OPERATIONS:
      ${availableOps}
      
      PREVIOUS SUCCESSFUL SOLUTIONS (MEMORY):
      ${memory || "No memory entries yet."}
      
      CURRENT TASK:
      Fingerprint: ${currentFingerprint}
      Examples: ${JSON.stringify(examples.map(ex => ({ input: ex.input, output: ex.output })))}
      
      GOAL:
      Synthesize a pipeline of operations from the AVAILABLE OPERATIONS list that transforms each input to its corresponding output.
      The solution should be a simple ordered list of operation names.
      Reason about symmetry, colors, and topology.
      
      Return as a JSON object with a "pipeline" key.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              pipeline: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              reasoning: { type: Type.STRING }
            },
            required: ["pipeline"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      const pipeline = data.pipeline as string[];
      
      // Basic validation: ensure all ops exist
      const validPipeline = pipeline.filter(op => Transforms[op as keyof typeof Transforms]);
      
      return validPipeline.length > 0 ? validPipeline : null;
    } catch (error) {
      console.error("Synthesis failed:", error);
      return null;
    }
  }
}
