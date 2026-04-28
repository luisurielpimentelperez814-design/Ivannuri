import React from "react";
import { motion } from "motion/react";
import { Cpu, Network, Zap, Shield, Minimize2, Share2 } from "lucide-react";

interface LayerProps {
  name: string;
  params: string;
  icon: React.ReactNode;
  color: string;
  active?: boolean;
}

const ArchitectureLayer: React.FC<LayerProps> = ({ name, params, icon, color, active }) => (
  <motion.div 
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    className={`p-4 rounded-xl border border-white/5 flex items-center justify-between gap-4 transition-all ${active ? 'bg-white/10 border-white/20' : 'bg-black/20'}`}
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${color} text-black font-bold`}>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-black text-white uppercase tracking-tighter">{name}</span>
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Frozen Module // Static</span>
      </div>
    </div>
    <div className="flex flex-col items-end">
      <span className="text-[10px] font-mono text-ivannuri-neurogolf font-bold">{params}</span>
      <span className="text-[9px] text-slate-600 uppercase">PARAMS</span>
    </div>
  </motion.div>
);

export const NeuralArchitecture: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
           <Minimize2 size={16} className="text-ivannuri-neurogolf" /> Param Efficiency Map
        </h3>
        <div className="text-[10px] font-mono p-1 px-2 rounded-full border border-ivannuri-neurogolf/30 text-ivannuri-neurogolf bg-ivannuri-neurogolf/5">
          TARGET: &lt;100K 
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <ArchitectureLayer 
          name="Perception Engine v8" 
          params="0 (Frozen)" 
          icon={<Shield size={16} />} 
          color="bg-slate-400" 
        />
        <div className="flex justify-center -my-1 text-ivannuri-neurogolf/40">
           <div className="w-[1px] h-4 bg-gradient-to-b from-slate-400 to-ivannuri-neurogolf" />
        </div>
        <ArchitectureLayer 
          name="Relational GNN" 
          params="18.4K" 
          icon={<Network size={16} />} 
          color="bg-ivannuri-neurogolf" 
          active
        />
        <div className="flex justify-center -my-1 text-ivannuri-neurogolf/40">
           <div className="w-[1px] h-4 bg-gradient-to-b from-ivannuri-neurogolf to-ivannuri-sub-accent" />
        </div>
        <ArchitectureLayer 
          name="Neural DSL Pipeline" 
          params="24.1K" 
          icon={<Cpu size={16} />} 
          color="bg-ivannuri-sub-accent" 
          active
        />
        <div className="flex justify-center -my-1">
           <div className="w-[1px] h-4 bg-gradient-to-b from-ivannuri-sub-accent to-ivannuri-accent" />
        </div>
        <ArchitectureLayer 
          name="Differentiable STN" 
          params="32.5K" 
          icon={<Zap size={16} />} 
          color="bg-ivannuri-accent" 
          active
        />
      </div>

      <div className="mt-4 p-4 quantum-card bg-ivannuri-neurogolf/5 border-ivannuri-neurogolf/20">
        <div className="flex items-center justify-between font-black italic text-lg uppercase tracking-tighter">
          <span className="text-white">Total Footprint</span>
          <span className="text-ivannuri-neurogolf">75.0K</span>
        </div>
        <div className="mt-2 w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "75%" }}
            className="h-full bg-ivannuri-neurogolf" 
          />
        </div>
      </div>
      
      <button className="w-full py-2 group flex items-center justify-center gap-2 border border-white/10 rounded-lg hover:bg-white/5 transition-all">
         <Share2 size={14} className="text-slate-500 group-hover:text-white" />
         <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white">Export to ONNX v1.14</span>
      </button>
    </div>
  );
};
