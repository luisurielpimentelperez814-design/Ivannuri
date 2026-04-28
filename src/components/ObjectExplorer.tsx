import React from "react";
import { Scene, ARC_COLORS } from "../engine/types";
import { motion } from "motion/react";

interface ObjectExplorerProps {
  scene: Scene;
}

export const ObjectExplorer: React.FC<ObjectExplorerProps> = ({ scene }) => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-white/10 pb-2">
        Perception: {scene.objects.length} Objects Detected
      </h3>
      <div className="flex flex-wrap gap-3">
        {scene.objects.map((obj) => (
          <motion.div 
            key={obj.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 p-2 glass-panel bg-white/5 border-white/5"
          >
            <div 
              className="w-4 h-4 rounded-full shadow-[0_0_5px_rgba(255,255,255,0.2)]" 
              style={{ backgroundColor: ARC_COLORS[obj.color] }} 
            />
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-slate-300">ID: {obj.id}</span>
              <span className="text-[10px] font-mono text-slate-500">Pixels: {obj.size}</span>
            </div>
          </motion.div>
        ))}
      </div>
      {scene.objects.length === 0 && (
        <span className="text-xs text-slate-500 italic">No objects detected (likely pure background)</span>
      )}
    </div>
  );
};
