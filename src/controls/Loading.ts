import { Scene } from "phaser";
import AlignGrid from "../geom/AlignGrid";

export class Loading {
  grid: AlignGrid;
  shadow: Phaser.GameObjects.Graphics;
  bar: Phaser.GameObjects.Graphics;
  scene: Scene;
  timeout: number;

  constructor(scene: Scene, grid: AlignGrid) {
    this.scene = scene;
    this.grid = grid;
    this.createShadow()
    this.createBar();
    this.hide();
  }
  private createBar() {
    this.bar = this.scene.add.graphics();
    this.styleBar();
  }

  private styleBar() {
    this.bar?.clear();
    this.bar?.fillStyle(0xffcc00);
    this.bar?.setDepth(500);
  }

  startProgressing(percent: number) {
    let cell = this.grid.getCell(7, 11);
    this.timeout = setTimeout(() => {
      this.bar.fillRoundedRect(cell.x, cell.y,
        (this.grid.cellWidth * 12) * percent / 100,
        this.grid.cellHeight * 1, 20 * this.grid.scale);

      if (percent > 100) {
        percent = 0;
        this.styleBar();
      }
      this.startProgressing(percent + 10);
    }, Math.random() * 1000)
  }

  stopProgressing() {
    clearTimeout(this.timeout);
  }

  createShadow() {
    let cell = this.grid.getCell(7, 9);
    this.shadow = this.scene.add.graphics()
    this.shadow.fillStyle(0x000000)
    this.shadow.alpha = 0.5
    this.shadow.depth = 500
    this.shadow.fillRoundedRect(cell.x, cell.y,
      this.grid.cellWidth * 12,
      this.grid.cellHeight * 5, 20 * this.grid.scale)
  }

  show() {
    this.setVisible(true);
    this.startProgressing(10);
  }


  hide() {
    this.setVisible(false);
  }

  setVisible(visible: boolean) {
    this.styleBar();
    this.shadow.setVisible(visible);
    this.bar.setVisible(visible);
  }
}
