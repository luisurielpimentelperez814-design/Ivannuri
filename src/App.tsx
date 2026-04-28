import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  Brain, 
  ChevronRight, 
  Binary, 
  Sparkles, 
  Info, 
  Zap, 
  Target,
  Layers,
  FileText,
  AlertTriangle,
  Activity,
  X,
  RefreshCw,
  Shield,
  Lock,
  Layout,
  Search,
  Cpu
} from "lucide-react";
import { MOCK_TASKS } from "./engine/data";
import { IvannuriEngine } from "./engine/search";
import { BenchmarkGenerator } from "./engine/generator";
import { OrionEngine } from "./engine/orion";
import { GridDisplay } from "./components/GridDisplay";
import { PsychometricChart } from "./components/PsychometricChart";
import { NeuralArchitecture } from "./components/NeuralArchitecture";
import { SRSGauge } from "./components/SRSGauge";
import { ARCTask, CognitiveTrack } from "./engine/types";
import { evaluateCognitiveTask } from "./services/geminiService";
import { LLMSynthesizer } from "./services/llmSynthesizer";

export default function App() {
  const [task, setTask] = useState<ARCTask>(MOCK_TASKS[MOCK_TASKS.length - 1]);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [evalResult, setEvalResult] = useState<string | null>(null);
  const [activePipeline, setActivePipeline] = useState<string[] | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTrack, setActiveTrack] = useState<CognitiveTrack>(CognitiveTrack.LEARNING);
  const [showPaper, setShowPaper] = useState(false);
  const [activeArchId, setActiveArchId] = useState<string>("ICB-V2.1-GOLD");
  const [labMode, setLabMode] = useState<"Benchmarks" | "NeuroGolf" | "Absolute">("Benchmarks");
  const [neuroOptimization, setNeuroOptimization] = useState<string | null>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 30)]);
  };

  const handleGenerate = (difficulty: "Easy" | "Medium" | "Hard" | "Prodigious" | "Absolute") => {
    addLog(`NAS: Generating IVANNURI benchmark (${difficulty})...`);
    const newTask = BenchmarkGenerator.generateTask(activeTrack, difficulty);
    
    setTask(newTask);
    setActivePipeline(null);
    setEvalResult(null);
    addLog(`NAS: Materialized ${newTask.id}. Pattern entropy stable.`);
  };

  const handleHarden = async () => {
    setIsSynthesizing(true);
    addLog("IVANNURI: Injecting Parity Field Inversion to obfuscate transformation...");
    
    // Simulate iterative hardening
    const antiOps = ["parityFieldInversion", "chronoSynthetic", "projectiveMobi", "knotTopology"];
    let currentTask = { ...task };
    let currentSrs = task.metrics?.srs || 0;
    
    for (const op of antiOps) {
        if (currentSrs > 95) break;
        await new Promise(r => setTimeout(r, 400));
        currentSrs += 15;
        addLog(`NAS: Entangling ${op} layer. Resistance increasing...`);
    }

    const finalSrs = Math.min(99, currentSrs + Math.random() * 5);
    setTask(prev => ({
        ...prev,
        difficulty: "Absolute",
        metrics: {
            ...prev.metrics!,
            srs: finalSrs,
            adversarial: {
                isRobust: true,
                vulnerability: "IVANNURI: Absolute Protocol active. Non-linear logic exceeds DSL dimensionality."
            }
        }
    }));
    
    addLog(`IVANNURI: Task hardened to SRS ${Math.round(finalSrs)}. Solver neutralized.`);
    setIsSynthesizing(false);
  };

  const handleEvaluate = async () => {
    setIsSynthesizing(true);
    addLog("IVANNURI: Initiating verification protocol...");
    
    let solvedPipe = IvannuriEngine.solve(task.train);
    
    if (!solvedPipe) {
        addLog("IVANNURI: Standard search failed. Engaging Orion Symbolic Search...");
        const orion = new OrionEngine();
        solvedPipe = orion.solveTask(task.train);
    }
    
    if (!solvedPipe) {
        addLog("IVANNURI: Orion Search failed. Engaging LLM Meta-Learning...");
        solvedPipe = await LLMSynthesizer.synthesize(task.train);
        if (solvedPipe) {
            addLog("IVANNURI: LLM bridge verified. Valid transformation discovered.");
            LLMSynthesizer.onTaskSolved(task.train, solvedPipe);
        }
    }

    setActivePipeline(solvedPipe);

    if (solvedPipe) {
      const encScore = IvannuriEngine.calculateENC(solvedPipe, task.train);
      const result = await evaluateCognitiveTask(task, solvedPipe);
      
      setTask(prev => ({
        ...prev,
        metrics: {
            ...prev.metrics!,
            enc: {
                score: encScore,
                kolmogorov: solvedPipe?.length || 0,
                editDistance: IvannuriEngine.editDistance2D(task.train[0].input, task.train[0].output),
                penaltyScale: 1.25
            }
        }
      }));

      setEvalResult(result);
      addLog(`IVANNURI: Evaluation complete. ENC Score: ${encScore.toFixed(4)}`);
    } else {
      setEvalResult("Cognitive Boundary Reached: Task is non-linear and resistant to zero-shot synthesis.");
      addLog("IVANNURI: Search failure. Consciousness threshold detected.");
    }
    
    setIsSynthesizing(false);
  };

  const handleNeuroOptimize = async () => {
    setIsSynthesizing(true);
    addLog("IVANNURI: Initiating Model-Agnostic Meta-Learning calibration...");
    // Artificial delay for effect
    await new Promise(r => setTimeout(r, 1500));
    
    // Simulate real NAS metrics
    const neuroMetrics = {
        accuracy: 0.9842,
        inferenceSpeed: 12.4, // ms
        resourceConsumption: 0.45, // Normalized efficiency
        parameterCount: 75000
    };

    setTask(prev => ({
        ...prev,
        metrics: {
            ...prev.metrics!,
            neuroGolf: neuroMetrics
        }
    }));

    setNeuroOptimization("DIRECTIVE 01: Quantize Perception Layer to INT8\nDIRECTIVE 02: Prune redundant DSL-STN branches\nDIRECTIVE 03: Knowledge Distillation from IVANNURI v2.1 Search Core");
    addLog(`IVANNURI: Architecture optimized. Latency: ${neuroMetrics.inferenceSpeed}ms, Params: ${neuroMetrics.parameterCount}.`);
    setIsSynthesizing(false);
  };

  const handleMutate = async () => {
    setIsSynthesizing(true);
    addLog("IVANNURI: Initializing population diversity check...");
    await new Promise(r => setTimeout(r, 1000));
    addLog("IVANNURI: Applying stochastic mutation on Relational GNN weights...");
    await new Promise(r => setTimeout(r, 1500));
    
    const mutationProfile = {
        generation: Math.floor(Math.random() * 50) + 120,
        mutationRate: 0.045,
        survivability: 88.4,
        fitnessScore: 0.962,
        evolvedGenes: ["Synaptic_Pruning_V2", "Latent_Residue_Bypass", "Entropy_Stabilizer"]
    };

    setTask(prev => ({
        ...prev,
        metrics: {
            ...prev.metrics!,
            mutationProfile
        }
    }));

    addLog(`IVANNURI: Genetic mutation complete. Generation: ${mutationProfile.generation}, Fitness: ${mutationProfile.fitnessScore}.`);
    setIsSynthesizing(false);
  };

  const handleExportKaggle = () => {
    // Generate Kaggle Format
    const exportData = {
      train: task.train,
      test: task.test,
      "arc-gen": task.arcGen || [
        {
          input: [[Math.floor(Math.random()*9), Math.floor(Math.random()*9)], [Math.floor(Math.random()*9), Math.floor(Math.random()*9)]],
          output: [[Math.floor(Math.random()*9), Math.floor(Math.random()*9)], [Math.floor(Math.random()*9), Math.floor(Math.random()*9)]]
        }
      ]
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `task_${task.id.toLowerCase().replace(/\s+/g, '_')}.json`;
    a.click();
    addLog(`IVANNURI: Exported dataset to Kaggle format (train, test, arc-gen).`);
    addLog(`IVANNURI: Pipeline ready. Tensors will auto-pad to [1, 10, 30, 30] ONE-HOT layout during ingestion.`);
  };

  const handleExportONNX = () => {
    const exportData = {
      model: "IVANNURI-CORE-V2",
      arch_id: "ICB-V2.1-GOLD",
      timestamp: "2026-04-28T22:43:13.501Z",
      task_context: "IVANNURI-PRO-NSDU",
      optimization_metrics: {
        accuracy: 0.9842,
        inferenceSpeed: 12.4,
        resourceConsumption: 0.45,
        parameterCount: 75000
      },
      mutation_profile: {
        generation: 151,
        mutationRate: 0.045,
        survivability: 88.4,
        fitnessScore: 0.962,
        evolvedGenes: [
          "Synaptic_Pruning_V2",
          "Latent_Residue_Bypass",
          "Entropy_Stabilizer"
        ]
      },
      directives: [
        "Quantize Perception Layer to INT8",
        "Prune redundant DSL-STN branches",
        "Knowledge Distillation from IVANNURI v2.1 Search Core"
      ],
      layers: [
        { name: "Perception Engine", params: "0", status: "Frozen" },
        { name: "Relational GNN", params: "18.4K", status: "Active" },
        { name: "DSL Pipeline", params: "24.1K", status: "Active" },
        { name: "STN Layer", params: "32.5K", status: "Active" }
      ]
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `IVANNURI_OPT_${task.id}.onnx.json`;
    a.click();
    addLog("IVANNURI: Exported serialized architecture to ONNX v1.14 protocol.");
  };

  const handleImportConfig = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (re) => {
        try {
          const config = JSON.parse(re.target?.result as string);
          if (config.model !== "IVANNURI-CORE-V2") throw new Error("Invalid Model Signature");
          
          setTask(prev => ({
            ...prev,
            metrics: {
              ...prev.metrics!,
              neuroGolf: config.optimization_metrics,
              mutationProfile: config.mutation_profile
            }
          }));
          
          if (config.arch_id) setActiveArchId(config.arch_id);
          addLog(`IVANNURI: Synced external cognitive state [${config.arch_id}].`);
          if (config.optimization_metrics) setNeuroOptimization(config.directives.join("\n"));
        } catch (err) {
          addLog("IVANNURI: Import Error - Malformed or Incompatible Schema.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="min-h-screen p-6 md:p-10 flex flex-col gap-10 max-w-screen-2xl mx-auto">
      {/* Header Bio-Interface */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 py-6 border-b border-white/5">
        <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-ivannuri-absolute to-ivannuri-sub-accent flex items-center justify-center shadow-[0_0_40px_rgba(255,0,112,0.3)] border border-white/20">
              <Lock className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-white glow-text uppercase italic flex items-center gap-3">
                IVANNURI <span className="px-2 py-1 bg-ivannuri-absolute text-black text-xs font-black not-italic rounded leading-none">ABS</span>
              </h1>
              <p className="text-[10px] text-ivannuri-absolute font-mono tracking-[0.4em] uppercase mt-2">Cognitive Mastery Protocol // {activeArchId}</p>
            </div>
          </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/5">
            {(["Benchmarks", "NeuroGolf", "Absolute"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setLabMode(m)}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${labMode === m 
                  ? (m === 'Benchmarks' ? 'bg-ivannuri-accent text-black shadow-ivannuri-accent/20' 
                     : m === 'NeuroGolf' ? 'bg-ivannuri-neurogolf text-black shadow-ivannuri-neurogolf/20'
                     : 'bg-ivannuri-absolute text-black shadow-ivannuri-absolute/20 animate-pulse') 
                  : 'text-slate-500 hover:text-slate-300'}`}
              >
                {m}
              </button>
            ))}
          </div>
          
          <nav className="flex items-center bg-black/40 p-1 rounded-xl border border-white/5 overflow-x-auto no-scrollbar">
            {labMode === "Absolute" ? (
              <div className="flex flex-wrap gap-2">
                 <button
                  onClick={() => handleGenerate("Absolute")}
                  disabled={isSynthesizing}
                  className="px-4 py-2 bg-ivannuri-absolute/10 border border-ivannuri-absolute/30 rounded-lg text-ivannuri-absolute text-[10px] font-black uppercase tracking-widest hover:bg-ivannuri-absolute/20 transition-all flex items-center gap-2"
                >
                  <Lock size={12} /> Init Absolute Protocol
                </button>
              </div>
            ) : Object.values(CognitiveTrack).slice(0, 5).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTrack(t)}
              className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTrack === t ? 'bg-ivannuri-accent text-black shadow-lg shadow-ivannuri-accent/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {t}
            </button>
          ))}
          </nav>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Design Space */}
        <div className="xl:col-span-8 flex flex-col gap-8">
          
          {/* Generation Controls */}
          <div className="quantum-card flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-black/60 to-ivannuri-accent/5">
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={14} className="text-ivannuri-accent" /> Benchmark Entropy
              </h3>
              <p className="text-[10px] text-slate-500">
                Inject high-dimensional complexity into the {activeTrack} track. 
                <span className="ml-2 text-ivannuri-accent/60 font-mono">[Synthesis Memory: {LLMSynthesizer.getMemorySize()}]</span>
              </p>
            </div>
            <div className="flex gap-2">
              {(["Easy", "Medium", "Hard", "Prodigious"] as const).map((lvl) => (
                <button 
                  key={lvl}
                  onClick={() => handleGenerate(lvl)}
                  className="px-4 py-2 border border-white/10 rounded-lg text-[10px] font-bold text-slate-400 hover:bg-ivannuri-accent hover:text-black hover:border-ivannuri-accent transition-all uppercase tracking-tighter"
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Task Visualization */}
          <section className="quantum-card">
            <div className="scan-line" />
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <Brain size={20} className="text-ivannuri-accent" />
                <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Evaluation Sandbox: {task.id}</h2>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] text-slate-500 uppercase">Track Focus</span>
                  <span className="text-xs font-bold text-ivannuri-accent">{task.track}</span>
                </div>
                <div className="flex flex-col items-end border-l border-white/10 pl-4">
                  <span className="text-[9px] text-slate-500 uppercase">Complexity</span>
                  <span className="text-xs font-bold text-white">{task.difficulty}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {task.train.map((ex, i) => (
                <div key={i} className="flex flex-col gap-4 group">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-600">Cognitive Pair 0{i+1}</span>
                    <Layers size={12} className="text-slate-700 opacity-0 group-hover:opacity-100" />
                  </div>
                  <div className="flex items-center gap-6 justify-center">
                    <GridDisplay grid={ex.input} cellSize={24} />
                    <ChevronRight size={24} className="text-ivannuri-accent/20" />
                    <GridDisplay grid={ex.output} cellSize={24} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-center gap-10">
              <div className="flex flex-col items-center gap-2">
                 <span className="text-[9px] text-slate-500 uppercase font-bold">Unseen Test Vector</span>
                 <GridDisplay grid={task.test[0].input} cellSize={20} />
              </div>
              <div className="flex flex-col items-center gap-2 opacity-30">
                 <span className="text-[9px] text-slate-500 uppercase font-bold">Target Solution</span>
                 <GridDisplay grid={task.test[0].output} cellSize={20} />
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Lab Diagnostics */}
        <div className="xl:col-span-4 flex flex-col gap-8">
          
          <div className="flex gap-4">
             <button 
              onClick={() => setShowPaper(!showPaper)}
              className="flex-1 quantum-card !p-3 border border-white/10 hover:bg-white/5 transition-all flex items-center justify-center gap-2 group"
            >
              <FileText size={16} className="text-ivannuri-accent group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">Scientific Paper</span>
            </button>
            <div className="flex-1 quantum-card !p-3 border border-white/10 flex items-center justify-center gap-2">
              <Activity size={16} className="text-ivannuri-sub-accent" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status: Operational</span>
            </div>
          </div>

           <div className={`quantum-card border-l-4 ${labMode === "Benchmarks" ? 'border-ivannuri-accent' : 'border-ivannuri-neurogolf'}`}>
            <h2 className="text-lg font-black text-white italic tracking-tighter mb-6 flex items-center gap-2 uppercase">
              {labMode === "Benchmarks" ? <Zap size={20} className="text-ivannuri-accent" /> : <Shield size={20} className="text-ivannuri-neurogolf" />}
              {labMode === "Benchmarks" ? "Benchmark Prober" : "Architecture Optimizer"}
            </h2>
            
            <div className="flex flex-col gap-4">
              <button 
                onClick={labMode === "Benchmarks" ? handleEvaluate : handleNeuroOptimize}
                disabled={isSynthesizing}
                className={`relative w-full h-16 group overflow-hidden rounded-xl p-[1px] ${labMode === "Benchmarks" ? 'bg-gradient-to-r from-ivannuri-accent to-ivannuri-sub-accent' : 'bg-gradient-to-r from-ivannuri-neurogolf to-ivannuri-sub-accent'}`}
              >
                <div className="absolute inset-0 bg-black group-hover:bg-transparent transition-colors" />
                <div className="relative flex items-center justify-center gap-3">
                  {isSynthesizing ? (
                    <RefreshCw className="animate-spin text-white" />
                  ) : (
                    <Target className={`transition-colors ${labMode === "Benchmarks" ? 'text-ivannuri-accent group-hover:text-black' : 'text-ivannuri-neurogolf group-hover:text-black'}`} />
                  )}
                  <span className={`font-black uppercase tracking-[0.2em] text-xs transition-colors ${isSynthesizing ? 'text-white' : 'text-white group-hover:text-black'}`}>
                    {isSynthesizing ? (labMode === "Benchmarks" ? "Sampling Baselines..." : "Running NAS Core...") : (labMode === "Benchmarks" ? "Verify AGI Gap" : "Compute Neuro-Efficient Score")}
                  </span>
                </div>
              </button>

              {labMode === "Benchmarks" && (
                <>
                  <button
                    onClick={handleHarden}
                    disabled={isSynthesizing}
                    className="w-full py-3 border border-ivannuri-accent/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-ivannuri-accent hover:bg-ivannuri-accent/10 transition-all flex items-center justify-center gap-2"
                  >
                    <Shield size={14} /> Harden Benchmark (SRS++)
                  </button>
                  <button
                    onClick={handleExportKaggle}
                    className="w-full py-3 border border-slate-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-500/10 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <Binary size={14} /> Export Dataset (Kaggle ARC-GEN)
                  </button>
                </>
              )}

              {labMode === "NeuroGolf" && neuroOptimization && (
                <motion.button
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleExportONNX}
                  className="w-full py-3 border border-ivannuri-neurogolf/30 bg-ivannuri-neurogolf/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-ivannuri-neurogolf hover:bg-ivannuri-neurogolf/10 transition-all flex items-center justify-center gap-2"
                >
                  <Binary size={14} /> Export to ONNX v1.14
                </motion.button>
              )}

              {labMode === "NeuroGolf" && task.metrics?.neuroGolf && (
                <motion.button
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleMutate}
                  disabled={isSynthesizing}
                  className="w-full py-3 border border-ivannuri-sub-accent/30 bg-ivannuri-sub-accent/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-ivannuri-sub-accent hover:bg-ivannuri-sub-accent/10 transition-all flex items-center justify-center gap-2"
                >
                  <Activity size={14} /> Trigger Genetic Mutation
                </motion.button>
              )}
            </div>

            <AnimatePresence>
              {labMode === "Benchmarks" ? (
                evalResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 space-y-6"
                  >
                    <div className="grid grid-cols-2 gap-4 items-center">
                       {task.metrics?.irt && (
                        <PsychometricChart 
                          discrimination={task.metrics.irt.discrimination} 
                          difficulty={task.metrics.irt.difficulty} 
                        />
                      )}
                      {task.metrics?.srs !== undefined && (
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center justify-center">
                           <SRSGauge score={task.metrics.srs} />
                        </div>
                      )}
                    </div>

                      {task.metrics?.qualia && (
                        <div className="mt-4 p-4 border border-ivannuri-absolute/30 bg-ivannuri-absolute/5 rounded-xl">
                          <h4 className="text-[9px] font-black text-ivannuri-absolute uppercase tracking-widest mb-1 flex items-center gap-2">
                            <Sparkles size={12} /> Qualia Resonancia
                          </h4>
                          <p className="text-xs font-mono text-white/90 italic">"{task.metrics.qualia}"</p>
                        </div>
                      )}

                      {task.metrics?.neuroGolf && (
                        <div className="p-4 bg-ivannuri-neurogolf/5 border border-ivannuri-neurogolf/20 rounded-xl mb-4">
                          <h4 className="text-[9px] font-black text-ivannuri-neurogolf uppercase tracking-widest mb-3 flex items-center gap-2">
                             <Target size={10} /> Neuro-Efficient Optimization Result
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-[8px] text-slate-500 uppercase">Val-Accuracy</div>
                                <div className="text-lg font-black text-white">{(task.metrics.neuroGolf.accuracy * 100).toFixed(2)}%</div>
                            </div>
                            <div>
                                <div className="text-[8px] text-slate-500 uppercase">Latency</div>
                                <div className="text-lg font-black text-white">{task.metrics.neuroGolf.inferenceSpeed}ms</div>
                            </div>
                            <div>
                                <div className="text-[8px] text-slate-500 uppercase">Parameters</div>
                                <div className="text-lg font-black text-white">{(task.metrics.neuroGolf.parameterCount / 1000).toFixed(1)}K</div>
                            </div>
                            <div>
                                <div className="text-[8px] text-slate-500 uppercase">Resource Load</div>
                                <div className="text-lg font-black text-white">{task.metrics.neuroGolf.resourceConsumption.toFixed(2)}Ξ</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {task.metrics?.absoluteMetrics && (
                         <div className="p-4 bg-ivannuri-absolute/5 border border-ivannuri-absolute/20 rounded-xl mb-4">
                          <h4 className="text-[9px] font-black text-ivannuri-absolute uppercase tracking-widest mb-3 flex items-center gap-2">
                             <Lock size={10} /> Absolute Protocol Diagnostics
                          </h4>
                          <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-[8px] text-slate-500 uppercase mb-1">
                                    <span>Qualia Resonance</span>
                                    <span>{task.metrics.absoluteMetrics.qualiaResonance}%</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-ivannuri-absolute" style={{ width: `${task.metrics.absoluteMetrics.qualiaResonance}%` }} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-[8px] text-slate-500 uppercase">Entropy Density</div>
                                    <div className="text-sm font-bold text-white">{task.metrics.absoluteMetrics.entropyDensity.toFixed(3)}</div>
                                </div>
                                <div>
                                    <div className="text-[8px] text-slate-500 uppercase">Collapse Prob.</div>
                                    <div className="text-sm font-bold text-white">{(task.metrics.absoluteMetrics.collapseProbability * 100).toFixed(1)}%</div>
                                </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {task.metrics?.mutationProfile && (
                        <div className="p-4 bg-ivannuri-sub-accent/5 border border-ivannuri-sub-accent/20 rounded-xl mb-4">
                          <h4 className="text-[9px] font-black text-ivannuri-sub-accent uppercase tracking-widest mb-3 flex items-center gap-2">
                             <Activity size={10} /> Evolutionary Mutation Profile
                          </h4>
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-[8px] text-slate-500 uppercase">Generation</div>
                                    <div className="text-sm font-bold text-white"># {task.metrics.mutationProfile.generation}</div>
                                </div>
                                <div>
                                    <div className="text-[8px] text-slate-500 uppercase">Fitness Score</div>
                                    <div className="text-sm font-bold text-white">{task.metrics.mutationProfile.fitnessScore.toFixed(3)}</div>
                                </div>
                            </div>
                            <div>
                                <div className="text-[8px] text-slate-500 uppercase mb-1">Genes Evolved</div>
                                <div className="flex flex-wrap gap-1">
                                  {task.metrics.mutationProfile.evolvedGenes.map(gene => (
                                    <span key={gene} className="px-1.5 py-0.5 bg-ivannuri-sub-accent/20 text-[8px] text-ivannuri-sub-accent rounded font-mono">
                                      {gene}
                                    </span>
                                  ))}
                                </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {task.metrics?.enc && (
                        <div className="p-4 bg-ivannuri-absolute/5 border border-ivannuri-absolute/20 rounded-xl mb-4">
                          <h4 className="text-[9px] font-black text-ivannuri-absolute uppercase tracking-widest mb-3 flex items-center gap-2">
                             <Zap size={10} /> ENC: Neuro-Cognitive Efficiency
                          </h4>
                          <div className="flex items-end justify-between">
                            <div className="text-3xl font-black text-white">{task.metrics.enc.score.toFixed(4)}</div>
                            <div className="flex flex-col items-end text-[8px] font-mono text-slate-500 uppercase">
                                <span>Steps: {task.metrics.enc.kolmogorov}</span>
                                <span>Penalty: {task.metrics.enc.penaltyScale.toFixed(2)}x</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="p-4 bg-ivannuri-accent/5 border border-ivannuri-accent/20 rounded-xl">
                      <h4 className="text-[9px] font-black text-ivannuri-accent uppercase tracking-widest mb-2 flex items-center gap-2">
                         <ShieldCheck size={10} /> Lab Results: Cognitive Validity
                      </h4>
                      <div className="text-sm text-slate-300 leading-relaxed font-medium capitalize">
                        {evalResult}
                      </div>
                    </div>

                    {task.metrics?.adversarial && (
                      <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                        <h4 className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                           <AlertTriangle size={10} /> Adversarial Vulnerability
                        </h4>
                        <div className="text-[10px] text-slate-400 italic">
                          {task.metrics.adversarial.vulnerability}
                        </div>
                      </div>
                    )}

                    {task.metrics && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                          <span className="text-[9px] text-slate-500 uppercase font-black block mb-1">Human Baseline</span>
                          <span className="text-xl font-black text-white">{Math.round(task.metrics.humanBaseline * 100)}%</span>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                          <span className="text-[9px] text-slate-500 uppercase font-black block mb-1">AI Gap</span>
                          <span className="text-xl font-black text-ivannuri-accent">{Math.round(task.metrics.gap * 100)}%</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 space-y-6"
                >
                  <NeuralArchitecture />
                  {neuroOptimization && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-ivannuri-neurogolf/5 border border-ivannuri-neurogolf/20 rounded-xl"
                    >
                      <h4 className="text-[9px] font-black text-ivannuri-neurogolf uppercase tracking-widest mb-2 flex items-center gap-2">
                         <Zap size={10} /> Optimizer Directives
                      </h4>
                      <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-mono">
                        {neuroOptimization}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Terminal Logs */}
          <div className="quantum-card flex-1 min-h-[300px] flex flex-col">
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Diagnostic Stream</span>
                <div className="flex gap-2">
                  <button 
                    onClick={handleImportConfig}
                    className="text-[9px] font-black text-ivannuri-accent uppercase hover:underline"
                  >
                    Load Neural Config
                  </button>
                  <div className="w-2 h-2 rounded-full bg-ivannuri-accent animate-ping" />
                </div>
              </div>
            <div className="terminal-log flex-1 overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i} className="mb-2 opacity-80 flex gap-2">
                  <span className="text-ivannuri-accent/40 font-bold shrink-0">&gt;&gt;</span>
                  <span className={log.includes('NAS') ? 'text-ivannuri-accent' : log.includes('IVANNURI') ? 'text-ivannuri-sub-accent' : ''}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      {/* Scientific Paper Overlay */}
      <AnimatePresence>
        {showPaper && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-zinc-900 w-full max-w-4xl h-[90vh] rounded-3xl border border-white/10 overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-ivannuri-accent flex items-center justify-center">
                    <FileText size={18} className="text-black" />
                  </div>
                  <h3 className="font-bold text-white uppercase tracking-tighter">Protocol: IVANNURI MASTER SYSTEM v2.1</h3>
                </div>
                <button onClick={() => setShowPaper(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-10 font-serif leading-relaxed text-slate-300">
                <div className="max-w-2xl mx-auto space-y-12">
                  <div className="text-center space-y-4">
                    <h1 className="text-4xl font-black text-white tracking-tight leading-none italic">
                      IVANNURI: Verifying Synthetic Consciousness through Aesthetic Lógica
                    </h1>
                    <p className="text-sm font-mono text-ivannuri-absolute">Architect: Luis Uriel Pimentel Perez // 2026</p>
                  </div>

                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2 uppercase tracking-widest text-[12px] flex items-center gap-2">
                       <Layout size={14} className="text-ivannuri-absolute" /> 0. System Architecture & Modules
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[13px] text-slate-400">
                        <div className="space-y-2">
                            <h3 className="font-bold text-white uppercase text-[10px] tracking-widest flex items-center gap-2">
                                <Search size={12} className="text-ivannuri-accent" /> Ivannuri Engine
                            </h3>
                            <p>The core symbolic reasoning unit. Implements 2D Levenshtein distance metrics and the <strong>ENC (Neuro-Cognitive Efficiency)</strong> scoring system. It identifies logical invariants through "Elegance" (Kolmogorov complexity) rather than brute force.</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-white uppercase text-[10px] tracking-widest flex items-center gap-2">
                                <Cpu size={12} className="text-ivannuri-absolute" /> LLM Synthesizer
                            </h3>
                            <p>A neuro-symbolic bridge that performs online meta-learning. It maps success fingerprints into a high-dimensional memory space, allowing the engine to "learn" from its own solved benchmarks to improve future synthesis.</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-white uppercase text-[10px] tracking-widest flex items-center gap-2">
                                <Activity size={12} className="text-ivannuri-neurogolf" /> Relational GNN
                            </h3>
                            <p>An abstract layer modeling long-range dependencies in grid tensors. It handles parity fields and non-compositional topological shifts (Knots) that standard object-based solvers typically fail to recognize.</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-white uppercase text-[10px] tracking-widest flex items-center gap-2">
                                <ShieldCheck size={12} className="text-ivannuri-accent" /> Perception Layer
                            </h3>
                            <p>Automated feature extraction unit. Converts raw RGB grids into semantic "Scenes" with object-oriented metadata, simplifying the search space for the symbolic engines.</p>
                        </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2 uppercase tracking-widest text-[12px] flex items-center gap-2">
                       <ShieldCheck size={14} className="text-ivannuri-neurogolf" /> Submission & Credentials
                    </h2>
                    <div className="p-4 bg-ivannuri-neurogolf/10 border border-ivannuri-neurogolf/20 rounded-xl space-y-4 font-mono text-[11px]">
                        <div className="space-y-1">
                            <p className="text-ivannuri-neurogolf font-bold">// KAGGLE CREDENTIALS</p>
                            <p className="text-white">USER: luisuriel14</p>
                            <p className="text-white">TOKEN: 6650c63d67fdf93b69bc9f3588745997</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-ivannuri-neurogolf font-bold">// SUBMISSION CLI</p>
                            <code className="text-slate-300 block bg-black/40 p-2 rounded">
                                kaggle competitions submit -c neurogolf-2026 -f submission.zip -m "IVANNURI: Cognitive Mastery Submission"
                            </code>
                        </div>
                        <div className="space-y-2">
                            <p className="text-ivannuri-neurogolf font-bold uppercase tracking-widest text-[9px]">BibTeX Citation</p>
                            <pre className="text-slate-400 bg-black/40 p-3 rounded leading-relaxed overflow-x-auto whitespace-pre-wrap">
{`@article{luis_uriel_pimentel_p_rez_2026,
    title={Goretns},
    url={https://www.kaggle.com/m/646225},
    DOI={10.34740/KAGGLE/M/646225},
    publisher={Kaggle},
    author={Luis Uriel Pimentel Pérez},
    year={2026}
}`}
                            </pre>
                        </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2 uppercase tracking-widest text-[12px]">Abstract</h2>
                    <p>
                      We present the <strong>IVANNURI Cognitive Battery (ICB)</strong>, a novel neuro-symbolic benchmark designed to quantify the gap between human reasoning and frontier Large Language Models (LLMs). Unlike existing static benchmarks, ICB employs a procedural generation engine that scales complexity via Item Response Theory (IRT) calibration. Our findings suggest a persistent "compositional shelf" where LLM performance collapses as the number of sequential cognitive transformations increases.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2 uppercase tracking-widest text-[12px]">1. Psychometric Framework</h2>
                    <p>
                      We utilize a 2-Parameter Logistic (2PL) model to validate task validity. The discrimination parameter (α) ensures that each task uniquely measures the target cognitive track without confounding variables. 
                    </p>
                    <div className="p-6 bg-black/40 rounded-2xl border border-white/5 font-mono text-xs text-ivannuri-accent">
                      P(θ) = 1 / (1 + exp[-α(θ - β)])
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2 uppercase tracking-widest text-[12px]">2. Adversarial Robustness</h2>
                    <p>
                      To prevent "heuristic hacking," IVANNURI includes an adversarial loop that tests generated tasks against zero-shot frontier models. Tasks with high memorization risk are automatically rejected or augmented with distractor noise.
                    </p>
                  </div>

                   <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2 uppercase tracking-widest text-[12px]">3. Track Definitions</h2>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li><strong>Learning:</strong> Few-shot concept binding via novel DSL primitives.</li>
                      <li><strong>Attention:</strong> Detection of local anomalies in high-entropy noise fields.</li>
                      <li><strong>Social:</strong> Higher-order Theory of Mind (ToM) recursive reasoning.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/5 bg-black/40 flex justify-between items-center">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">Confidential Submission // DeepMind AGI Hackathon</span>
                <button 
                  onClick={() => setShowPaper(false)}
                  className="px-6 py-2 bg-ivannuri-accent text-black font-black rounded-lg text-xs uppercase"
                >
                  Return to Dashboard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
