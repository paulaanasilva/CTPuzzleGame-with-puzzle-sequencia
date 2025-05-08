import Phaser from "phaser";
import AlignGrid from "../geom/AlignGrid";
import { Logger } from "../main";
import TestApplicationService from "../test-application/TestApplicationService";
import { androidOpenUrl } from "../utils/Utils";

export default class EndGame extends Phaser.Scene {
  grid: AlignGrid;

  constructor() {
    super("end-game");
  }

  init(testApplicationService: TestApplicationService) {
    Logger.log("END_GAME");
    let participation = testApplicationService?.participation;
    if (participation) {
      if (testApplicationService.isItemToPlay()) {
        androidOpenUrl(participation?.urlToEndOfTestQuiz?.url);
      }
    }
  }

  preload() {
    this.load.image("background", "assets/ct/radial_gradient.png");
  }

  create() {
    this.createGrid();
    this.addBackground();
    this.showMessage("Você venceu!");
  }

  private createGrid() {
    let grid = new AlignGrid(
      this, 30, 25,
      this.game.config.width as number,
      this.game.config.height as number
    );
    this.grid = grid;
  }

  private showMessage(message: string) {
    let gridCenterX = this.grid.width / 3.2;
    let gridCenterY = this.grid.height / 2;
    let messageText = this.add
      .text(gridCenterX, gridCenterY, message, {
        fontSize: "30pt",
      })
      .setScale(this.grid.scale);
    messageText.setX(messageText.x - messageText.width / 2);
  }

  private addBackground() {
    this.grid.addImage(0, 0, "background", this.grid.cols, this.grid.rows);
  }
}
