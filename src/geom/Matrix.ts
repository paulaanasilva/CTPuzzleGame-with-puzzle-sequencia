import IsometricPoint from './IsometricPoint'
import { Scene } from 'phaser'
import { isDebug } from '../utils/Utils';

export enum MatrixMode { ISOMETRIC = "ISOMETRIC", NORMAL = "NORMAL" }

export default class Matrix {

  static MODE_ISOMETRIC = "ISOMETRIC"

  // Depreciado
  static MODE_NORMAL = "NORMAL"

  scene: Phaser.Scene;
  x: number;
  y: number;
  points: IsometricPoint[][];
  width: number;
  height: number;
  matrix: string[][];
  mode: MatrixMode

  constructor(scene: Scene, mode: MatrixMode, matrix: string[][], x: integer, y: integer, distanceBetweenPoints: integer) {
    this.mode = mode;
    this.x = x;
    this.y = y;

    const graphics = scene.add.graphics();
    graphics.fillStyle(0xff0000)
    graphics.setDepth(100)

    this.scene = scene;
    this.matrix = matrix;

    if (isDebug(scene)) {
      graphics.fillCircle(x, y, 30);
    }

    
    this.points = []
    for (let y = 0; y < 10; y++) {
      this.points[y] = []
    }
    
    
    this.height = 10;
    this.width = 10;

    this.x = this.x - (this.width - this.height) * distanceBetweenPoints / 2
    this.y = this.y - (this.height * distanceBetweenPoints / 2) / 2

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        let point: IsometricPoint = new IsometricPoint(col * distanceBetweenPoints, row * distanceBetweenPoints)
        point.x += this.x
        point.y += this.y

        if (isDebug(scene)) {
          const pt = new Phaser.Geom.Point(point.x, point.y);
          this.scene.add.text(pt.x, pt.y, `(${pt.y.toFixed(2)})`);
          graphics.fillCircle(pt.x, pt.y, 3);
        }
        this.points[row][col] = point
      }
    }
  }

  getPoint(y: number, x: number): IsometricPoint {
    let point = null
    const row = this.points[y];
    if (row) {
      point = row[x];
    }
    return point;
  }

  getKey(y: number, x: number): string {
    let key = null
    const row = this.matrix[y];
    if (row) {
      key = row[x];
    }
    return key;
  }

  getTotalElements(): number {
    return this.width * this.height
  }
}
