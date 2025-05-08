import { GameObjects, Scene } from "phaser";
import { Logger } from "../main";
import drawRect from "../utils/Utils";
import AlignGrid from "./AlignGrid";

export default class FlexFlow {

  children: (GameObjects.Sprite | GameObjects.Image)[]

  scene: Scene;
  flow: string = 'row'
  width: number;
  height: number;
  x: number;
  y: number;
  constructor(scene: Scene) {
    this.scene = scene;
    this.children = []
    this.width = this.scene.game.config.width as number
    this.height = this.scene.game.config.height as number
  }

  organizeSelf() {
    const countObjs = this.children.length;
    Logger.log('FLEX_ROW [countObs]', countObjs);
    const positionEach: number = this.width / countObjs;
    this.children.forEach((child, index) => {
      if (child) {
        child.y = this.y + this.height / 2
        child.x = this.x + (index + 0.5) * positionEach
      }
    })
    drawRect(this.scene, this.x, this.y, this.width, this.height)
  }

  setChildAt(child: GameObjects.Sprite, index: number, splice: number = 1) {
    this.children.splice(index, splice, child);
    this.organizeSelf();
  }

  addChild(child: GameObjects.Sprite | GameObjects.Image): { x: number, y: number } {
    this.children.push(child)
    this.organizeSelf()
    return { x: child.x, y: child.y }
  }

  setPositionByGrid(cellX: number, cellY: number, rowspan: number, colspan: number, grid: AlignGrid) {
    const cell = grid.getCell(cellX, cellY);
    this.x = cell.x;
    this.y = cell.y;
    this.width = grid.cellWidth * rowspan;
    this.height = grid.cellHeight * colspan;
  }
}
