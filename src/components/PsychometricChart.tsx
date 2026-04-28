import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { PsychometricsEngine } from "../engine/psychometrics";

interface PsychometricChartProps {
  discrimination: number;
  difficulty: number;
}

export const PsychometricChart: React.FC<PsychometricChartProps> = ({ discrimination, difficulty }) => {
  const data = PsychometricsEngine.getICCPoints(discrimination, difficulty);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-black text-ivannuri-accent uppercase tracking-widest">Item Characteristic Curve (ICC)</h4>
        <div className="flex gap-4 text-[9px] font-mono">
          <span className="text-slate-500">α: <span className="text-white">{discrimination}</span></span>
          <span className="text-slate-500">β: <span className="text-white">{difficulty}</span></span>
        </div>
      </div>
      <div className="h-44 w-full bg-black/20 rounded-xl p-2 border border-white/5">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
            <XAxis 
              dataKey="theta" 
              stroke="#475569" 
              fontSize={9} 
              tickFormatter={(val) => `θ=${val}`}
              domain={[-4, 4]}
            />
            <YAxis 
              stroke="#475569" 
              fontSize={9} 
              domain={[0, 1]} 
              tickFormatter={(val) => `${Math.round(val * 100)}%`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: "#02040a", border: "1px solid #1e293b", fontSize: "10px" }}
              itemStyle={{ color: "#00f2ff" }}
              labelFormatter={(val) => `Ability Target: ${val}`}
            />
            <ReferenceLine x={difficulty} stroke="#7000ff" strokeDasharray="3 3" label={{ position: 'top', value: 'b-Param', fill: '#7000ff', fontSize: 8 }} />
            <Line 
              type="monotone" 
              dataKey="probability" 
              stroke="#00f2ff" 
              strokeWidth={2} 
              dot={false}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[9px] text-slate-500 italic leading-relaxed">
        Visualization of the 2-Parameter Logistic (2PL) model. The curve represents the probability of a correct response as a function of subject latent ability (Theta).
      </p>
    </div>
  );
};
