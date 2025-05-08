import Phaser from "phaser";
import Button from "../controls/Button";
import AlignGrid from "../geom/AlignGrid";
import Sounds from "../sounds/Sounds";
import GameParams from "../settings/GameParams";
import UserRepository from "../user/UserRepository";
import User from "../user/User";
import TestApplicationService from "../test-application/TestApplicationService";
import { Logger } from "../main";
import PhasesGrid from "../controls/PhasesGrid";
import { Loading } from "../controls/Loading";

let globalSounds: Sounds;

export default class PreGame extends Phaser.Scene {
  sounds: Sounds;
  playBtn: Button;
  inputObject: Phaser.GameObjects.Text;
  testNumberValue: string = "";
  userRepository: UserRepository;
  testApplicationService: TestApplicationService;
  grid: AlignGrid;
  phasesGrid: PhasesGrid;
  loading: Loading;

  constructor() {
    super("pre-game");
  }

  preload() {
    this.load.image(
      "test-box-clear",
      "assets/ct/pregame/test-game-box-clear.png"
    );
    this.load.image("background", "assets/ct/radial_gradient.png");
    this.load.spritesheet("play-btn", "assets/ct/pregame/play-button.png", {
      frameWidth: 400,
      frameHeight: 152,
    });
    this.sounds.preload(this);
  }

  init() {
    this.sounds = new Sounds();
    this.userRepository = new UserRepository();

    let queryParams = window.location.search;

    this.initializeGameParams(queryParams);
  }

  private initializeGameParams(queryParams: string) {
    Logger.info("Loaded params = " + queryParams);
    const params = new URLSearchParams(queryParams);
    let gameParams = new GameParams(params);
    this.testApplicationService = new TestApplicationService(gameParams);
  }

  async create() {
    this.sounds.create();
    globalSounds = this.sounds;

    this.grid = new AlignGrid(
      this,
      26,
      22,
      this.game.config.width as number,
      this.game.config.height as number
    );

    const isTestApplication = this.testApplicationService.mustLoadFirstItem();


    if (isTestApplication) {
      await this.loadTestApplication();
    }
    this.startGame();
  }

  async loadTestApplication() {
    let user: User = this.userRepository.getOrCreateGuestUser();
    await this.testApplicationService.loadApplicationFromDataUrl(user);
  }

  startGame() {
    this.scene.start("game", this.testApplicationService.getGameParams());
  }
}

export { globalSounds };