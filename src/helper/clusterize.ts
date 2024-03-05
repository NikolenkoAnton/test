// @ts-nocheck

import { isEqual, pick } from 'lodash';
import seedrandom from 'seedrandom';

export interface ClusteringOutput {
  centroid: number[];
  cluster: number[][];
  clusterInd: number[];
}

function euclidianDistance(a: number[], b: number[]): number | Error {
  if (a.length !== b.length) {
    return new Error('The vectors must have the same length');
  }
  let d = 0.0;
  for (let i = 0; i < a.length; i++) {
    d += (a[i] - b[i]) ** 2;
  }
  return Math.sqrt(d);
}

class Group {
  centroidMoved: boolean;
  centroid: number[];
  centroidOld: number[];
  cluster: number[][];
  clusterInd: number[];
  distances: number[];
  centroidIndex: number;

  constructor() {
    this.centroidMoved = true;
    this.centroid = [];
    this.centroidOld = [];
    this.cluster = [];
    this.clusterInd = [];
    this.distances = [];
    this.centroidIndex = -1;
  }

  initCluster(): void {
    this.cluster = [];
    this.clusterInd = [];
  }

  defineCentroid(self: Clusterize): Group {
    this.centroidOld = this.centroid ? [...this.centroid] : [];
    if (this.centroid && this.cluster.length > 0) {
      this.calculateCentroid();
    } else {
      const rand = self.seed == null ? Math.random() : seedrandom(self.seed)();
      const i = Math.floor(rand * self.indexes.length);
      this.centroidIndex = self.indexes[i];
      self.indexes.splice(i, 1);
      this.centroid = [];
      if (!Array.isArray(self.v[this.centroidIndex])) {
        this.centroid[0] = self.v[this.centroidIndex] as unknown as number;
      } else {
        for (let j = 0; j < self.v[this.centroidIndex].length; j++) {
          this.centroid[j] = self.v[this.centroidIndex][j];
        }
      }
    }
    this.centroidMoved = !isEqual(this.centroid, this.centroidOld);
    return this;
  }

  calculateCentroid(): Group {
    this.centroid = [];
    for (let i = 0; i < this.cluster.length; i++) {
      for (let j = 0; j < this.cluster[i].length; j++) {
        this.centroid[j] = this.centroid[j] ? this.centroid[j] + this.cluster[i][j] : this.cluster[i][j];
      }
    }
    for (let i = 0; i < this.centroid.length; i++) {
      this.centroid[i] = this.centroid[i] / this.cluster.length;
    }
    return this;
  }

  distanceObjects(self: Clusterize): Group {
    for (let i = 0; i < self.v.length; i++) {
      this.distances[i] = self.distanceFunction(this.centroid, self.v[i]) as number;
    }
    return this;
  }
}

interface ClusterizeOptions {
  k: number;
  seed?: number;
  distance?: (a: number[], b: number[]) => number;
}

class Clusterize {
  options: ClusterizeOptions;
  v: number[][];
  k: number;
  seed?: number;
  distanceFunction: (a: number[], b: number[]) => number;
  groups: Group[];
  indexes: number[];

  constructor(vector: number[][], options: ClusterizeOptions, callback: (err: Error | null, result?: Group[]) => void) {
    if (!callback || !options || !vector) {
      throw new Error('Provide 3 arguments: vector, options, callback');
    }
    if (typeof callback !== 'function') {
      throw new Error('Provide a callback function');
    }
    if (!options || !options.k || options.k < 1) {
      return callback(new Error('Provide a correct number k of clusters'));
    }
    if (options.distance && typeof options.distance !== 'function') {
      return callback(new Error('options.distance must be a function with two arguments'));
    }
    if (!Array.isArray(vector)) {
      return callback(new Error('Provide an array of data'));
    }

    this.options = options;
    this.v = this.checkV(vector);
    this.k = this.options.k;
    this.seed = this.options.seed;
    this.distanceFunction = this.options.distance || euclidianDistance;
    if (this.v.length < this.k) {
      const errMessage = `The number of points must be greater than the number k of clusters`;
      return callback(new Error(errMessage));
    }

    this.initialize();

    const self = this;
    let moved = -1;

    function iterate(): void {
      if (moved === 0) {
        return callback(null, self.output());
      }
      moved = 0;
      for (const group of self.groups) {
        group.defineCentroid(self);
        group.distanceObjects(self);
      }
      self.clustering();
      for (const group of self.groups) {
        if (group.centroidMoved) {
          moved++;
        }
      }
      process.nextTick(iterate);
    }

    iterate();
  }

  checkV(v: number[][]): number[][] {
    let dim = 1;
    if (Array.isArray(v[0])) {
      dim = v[0].length;
    }
    for (let i = 0; i < v.length; i++) {
      if (!Array.isArray(v[i])) {
        if (dim !== 1) {
          throw new Error('All the elements must have the same dimension');
        }
        v[i] = [Number(v[i])];
        if (Number.isNaN(v[i][0])) {
          throw new Error('All the elements must be float type');
        }
      } else {
        if (v[i].length !== dim) {
          throw new Error('All the elements must have the same dimension');
        }
        for (let j = 0; j < v[i].length; j++) {
          v[i][j] = Number(v[i][j]);
          if (Number.isNaN(v[i][j])) {
            throw new Error('All the elements must be float type');
          }
        }
      }
    }
    return v;
  }

  initialize() {
    this.groups = [];
    for (let i = 0, max = this.k; i < max; ++i) {
      this.groups[i] = new Group(this);
    }
    this.indexes = []; // used to choose randomly the initial centroids
    for (let i = 0, max = this.v.length; i < max; ++i) {
      this.indexes[i] = i;
    }
    return this;
  }
  clustering() {
    for (let j = 0, max = this.groups.length; j < max; ++j) {
      this.groups[j].initCluster();
    }
    for (let i = 0, max = this.v.length; i < max; ++i) {
      let min = this.groups[0].distances[i];
      let indexGroup = 0;
      for (let j = 1, max2 = this.groups.length; j < max2; ++j) {
        if (this.groups[j].distances[i] < min) {
          min = this.groups[j].distances[i];
          indexGroup = j;
        }
      }
      this.groups[indexGroup].cluster.push(this.v[i]);
      this.groups[indexGroup].clusterInd.push(i);
    }
    return this;
  }

  output() {
    const out = [];
    for (let j = 0, max = this.groups.length; j < max; ++j) {
      out[j] = pick(this.groups[j], 'centroid', 'cluster', 'clusterInd');
    }
    return out;
  }
}

export const clusterize = (
  vector: number[][],
  options: ClusterizeOptions,
  callback: (err: Error | null, result?: any) => void,
): Clusterize => {
  return new Clusterize(vector, options, callback);
};

export const _class = Clusterize;
