# IVANNURI
## Cognitive Mastery Protocol // ICB-V2.1-GOLD

*A neuro-symbolic AGI verification ecosystem for ARC-AGI benchmark tasks*

![TypeScript](https://img.shields.io/badge/TypeScript-97.8%25-blue.svg)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-real%20gradients-orange.svg)
![ARC-AGI](https://img.shields.io/badge/ARC--AGI-compatible-green.svg)
![Params](https://img.shields.io/badge/Params-%3C100K-purple.svg)

---

## ¿Qué es IVANNURI?

IVANNURI es un **ecosistema híbrido neuro-simbólico** diseñado para verificar y medir brechas de inteligencia artificial general (AGI) mediante tareas de razonamiento abstracto tipo [ARC-AGI](https://arcprize.org/).

El sistema combina tres capas de inferencia en cascada:

1. **ARCNet** — Red neuronal real con TensorFlow.js (< 100K params, tf.Variable, Adam)
2. **OrionEngine** — Motor simbólico con DSL, beam search y solvers especializados
3. **LLMSynthesizer** — Sintetizador heurístico de respaldo vía Gemini API

---

## Arquitectura Neural

```
Input Grid [H×W]
      │
      ▼
Perception Engine   (0 params, frozen)   One-hot → [1, 10, 30, 30]
      │
      ▼
Relational GNN      (~18.4K params)      Message passing, spatial relations
      │
      ▼
Neural DSL Pipeline (~24.1K params)      copy, rotate, reflect, tile, mask
      │
      ▼
Differentiable STN  (~32.5K params)      Spatial Transformer, output logits
      │
      ▼
Output Grid [H×W]

Total: 74,475 params (< 100K competition limit) ✓
```

---

## OrionEngine — Solvers Simbólicos

| Solver | Transformación detectada |
|--------|--------------------------|
| `TilePatternSolver` | Fractal: `output[i,j] = grid if input[i,j] != 0` |
| `SymmetrySolver` | Rotaciones 90/180/270° y reflexiones |
| `ZoomSolver` | Escalado 2x / 3x |
| `GravitySolver` | Gravedad arriba/abajo |
| `ColorPermutationSolver` | Remapeo consistente de colores |
| `FillHolesSolver` | Relleno de huecos interiores |
| `HiddenMatrixSolver` | `output = (input + M) % 10` |
| `BeamSearch` | Composición de hasta 3 operaciones DSL |

---

## Métricas Psicométricas

Basado en Teoría de Respuesta al Ítem (IRT):

- **ICC** — Modelo logístico 2PL con parámetros α (discriminación) y β (dificultad)
- **SRS Score** (0–99) — Puntuación de Razonamiento Simbólico
- **ENC** — Eficiencia Neurocognitiva: `(EditDistance × exp(-Steps × 0.1)) × ParamEfficiency`

---

## Instalación

```bash
git clone https://github.com/luisurielpimentelperez814-design/Ivannuri
cd Ivannuri
npm install
cp .env.ejemplo .env.local
# Agrega tu GEMINI_API_KEY en .env.local
npm run dev
```

---

## Cargar una tarea ARC

```json
{
  "train": [
    {"input": [[0,7,7],[7,7,7],[0,7,7]],
     "output": [[0,0,0,0,7,7,0,7,7],[0,0,0,7,7,7,7,7,7],[0,0,0,0,7,7,0,7,7],
                [0,7,7,0,7,7,0,7,7],[7,7,7,7,7,7,7,7,7],[0,7,7,0,7,7,0,7,7],
                [0,0,0,0,7,7,0,7,7],[0,0,0,7,7,7,7,7,7],[0,0,0,0,7,7,0,7,7]]}
  ],
  "test": [{"input": [[7,0,7],[7,0,7],[7,7,0]], "output": [...]}],
  "arc-gen": []
}
```

---

## OrionEngine (Python standalone)

```python
from orion import OrionEngine

engine = OrionEngine(beam_width=50)
results = engine.evaluate_task(task)
engine.summary()
# Tareas: 1 | Resueltas: 1 (100.0%) | Método: tile
```

---

## Estructura

```
src/
├── components/     GridDisplay, NeuralArchitecture, PsychometricChart, SRSGauge
├── engine/         arcNet.ts, trainer.ts, perception.ts, generator.ts, data.ts
├── services/       geminiService.ts, llmSynthesizer.ts
└── App.tsx
```

---

## Autor

**Luis Uriel Pimentel Pérez**
IVANNURI Cognitive Mastery Protocol — Diseño y arquitectura original

---

## Licencia

MIT — libre para uso académico y comercial con atribución.

---

*"The goal is not to pass the test. The goal is to understand why the test exists."*

**IVANNURI // ICB-V2.1-GOLD // STATUS: OPERATIONAL**
