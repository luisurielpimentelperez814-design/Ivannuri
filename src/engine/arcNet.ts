import * as tf from '@tensorflow/tfjs';

export class ARCNet {
  private gnnWeights: tf.Variable;
  private dslWeights: tf.Variable;
  private stnWeights: tf.Variable;

  constructor() {
    // Relational GNN: approx 18.4K params
    // Conv2D weights: [kernelHeight, kernelWidth, inChannels, outChannels]
    this.gnnWeights = tf.variable(tf.randomNormal([5, 5, 10, 73], 0, 0.1), true, 'gnn_weights'); // ~18.25K
    
    // Neural DSL Pipeline: approx 24.1K params
    this.dslWeights = tf.variable(tf.randomNormal([5, 5, 73, 13], 0, 0.1), true, 'dsl_weights'); // ~23.7K
    
    // Differentiable STN (Spatial Transformer Network approximation) / Output: approx 32.5K params
    this.stnWeights = tf.variable(tf.randomNormal([5, 5, 13, 100], 0, 0.1), true, 'stn_weights_hidden'); // ~32.5K
  }

  // Perception Layer (frozen, 0 params): pad and one-hot encode
  private perceptionLayer(grid: number[][]): tf.Tensor4D {
    return tf.tidy(() => {
      const h = grid.length;
      const w = grid[0].length;
      const tensor2d = tf.tensor2d(grid, [h, w], 'int32');
      const padH = 30 - h;
      const padW = 30 - w;
      
      const oneHot = tf.oneHot(tensor2d, 10).cast('float32'); // [h, w, 10]
      const padded = tf.pad(oneHot, [[0, padH], [0, padW], [0, 0]]); // [30, 30, 10]
      return padded.expandDims(0) as tf.Tensor4D; // [1, 30, 30, 10]
    });
  }

  public forward(grid: number[][]): tf.Tensor4D {
    const input = this.perceptionLayer(grid); // [1, 30, 30, 10]

    // Relational GNN (Message passing via convolutions)
    const gnnOut = tf.relu(tf.conv2d(input, this.gnnWeights as tf.Tensor4D, 1, 'same'));

    // DSL Pipeline 
    const dslOut = tf.relu(tf.conv2d(gnnOut, this.dslWeights as tf.Tensor4D, 1, 'same'));

    // STN Layer / Projection to 10 channels 
    
    const stnOutRaw = tf.conv2d(dslOut, this.stnWeights as tf.Tensor4D, 1, 'same'); // [1, 30, 30, 100]
    // sum across channels to get 10
    const stnOut = tf.sum(stnOutRaw.reshape([1, 30, 30, 10, 10]), 4); // [1, 30, 30, 10]
    
    return stnOut as tf.Tensor4D;
  }

  public predict(grid: number[][], outH: number, outW: number): number[][] {
    return tf.tidy(() => {
      const logits = this.forward(grid);
      const preds = tf.argMax(logits, -1); // [1, 30, 30]
      const array3d = preds.arraySync() as number[][][];
      const result2d = array3d[0];
      
      const finalOut: number[][] = [];
      for (let r = 0; r < outH; r++) {
        finalOut.push(result2d[r].slice(0, outW));
      }
      return finalOut;
    });
  }

  public getWeights(): tf.Variable[] {
    return [this.gnnWeights, this.dslWeights, this.stnWeights];
  }

  public dispose() {
    this.gnnWeights.dispose();
    this.dslWeights.dispose();
    this.stnWeights.dispose();
  }
}
