// Cálculo de isometria
// https://gamedevelopment.tutsplus.com/tutorials/creating-isometric-worlds-primer-for-game-developers-updated--cms-28392

export default class IsometricPoint extends Phaser.Geom.Point {
  isometric: boolean;
  constructor(x: integer, y: integer) {
    super(x, y);
    this.toIsometric()
  }

  toIsometric() {
    let isoX = this.x - this.y;
    let isoY = (this.x + this.y) / 2;
    this.x = isoX;
    this.y = isoY;
    this.isometric = true;
    return this
  }

  toCartesian() {
    let cartX = (2 * this.y + this.x) / 2;
    let cartY = (2 * this.y - this.x) / 2;
    this.x = cartX;
    this.y = cartY;
    this.isometric = false;
    return this
  }
}
