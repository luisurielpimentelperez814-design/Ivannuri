import React from "react";
import { ARC_COLORS, Grid } from "../engine/types";

interface GridDisplayProps {
  grid: Grid;
  title?: string;
  cellSize?: number;
}

export const GridDisplay: React.FC<GridDisplayProps> = ({ grid, title, cellSize = 24 }) => {
  const rows = grid.length;
  const cols = grid[0].length;

  return (
    <div className="flex flex-col gap-2">
      {title && <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{title}</h3>}
      <div 
        className="glass-panel p-2 inline-block bg-black/60"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          gap: "1px"
        }}
      >
        {grid.map((row, r) => 
          row.map((cell, c) => (
            <div 
              key={`${r}-${c}`}
              className="arc-grid-cell"
              style={{ backgroundColor: ARC_COLORS[cell] || "#000" }}
              title={`(${r},${c}): ${cell}`}
            />
          ))
        )}
      </div>
      <div className="text-[10px] text-slate-500 font-mono">
        {cols}x{rows}
      </div>
    </div>
  );
};
