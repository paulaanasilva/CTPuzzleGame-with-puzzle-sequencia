import { Scene } from "phaser";
import AlignGrid from "../geom/AlignGrid";
import { globalSounds } from "../scenes/PreGame";
import { TestApplication } from "../test-application/TestApplication";
import UserRepository from "../user/UserRepository";
import { replaceUserUuidTokenByUserHash } from "../utils/Utils";
import Button from "./Button";

export default class PhasesGrid {
  scene: Scene;
  grid: AlignGrid;
  userRepository: UserRepository;

  onRequestPlay: (gameUrl: string) => void

  constructor(scene: Scene, grid: AlignGrid, userRepository: UserRepository) {
    this.scene = scene;
    this.grid = grid;
    this.userRepository = userRepository;
  }

  emitGameUrl(testApplication: TestApplication) {
    let userUuid = this.userRepository.getOrCreateGuestUser().hash;
    const gameUrl = replaceUserUuidTokenByUserHash(testApplication?.url, userUuid)
    this.onRequestPlay(gameUrl)
    globalSounds.drag()
  }

  setApplications(testApplications: TestApplication[]) {
    let btnPlays: Button[] = []
    let scale = this.grid.scale;


    if (testApplications.length == 1) {
      const application = testApplications[0];
      if (application) {
        this.emitGameUrl(application)
      }
      return
    }

    testApplications.forEach((testApplication: TestApplication, index: number) => {
      let x = 5;
      if (index > 5) {
        x = 15
      }
      let cell = this.grid.getCell(x, index % 6);
      let btn = new Button(this.scene, globalSounds,
        cell.x,
        this.grid.cellHeight * 4 + cell.y * 3,
        'yellow-btn',
        () => {
          this.emitGameUrl(testApplication)
          btn.disable()
          setTimeout(() => {
            btn.enable()
          }, 4000);
        }
      )
      btnPlays.push(btn)
      let name = testApplication.name.toUpperCase();
      name = `${index + 1} - ${name}`
      btn.setFontSize(24);
      btn.setScale(scale)
      btn.setText(name);
      btn.ajustTextPosition(20, 25)
    })
    
  }
}
