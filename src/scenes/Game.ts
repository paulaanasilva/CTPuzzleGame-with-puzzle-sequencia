import { inputHandler } from './class/InputHandler'
import { fitShape } from './class/fitShape'
import { positionValidation } from './class/positionValidation'
import { GameObjects, Types, Scene } from 'phaser'
import { MatrixMode } from '../geom/Matrix'
import CodeEditor, { PlayPhaseOptions } from '../controls/CodeEditor'
import Sounds from '../sounds/Sounds'
import AlignGrid from '../geom/AlignGrid'
import MazePhasesLoader from '../phases/MazePhasesLoader'
import MazePhase, { CommandName } from '../phases/MazePhase'
import { Logger } from '../main'
import { globalSounds } from './PreGame'
import GameParams from '../settings/GameParams'
import TestApplicationService from '../test-application/TestApplicationService'
import GameState from './GameState'
import MessageBox from '../sprites/MessageBox'
import Button from '../controls/Button'

export const DEPTH_OVERLAY_PANEL_TUTORIAL = 50

export default class Game extends Scene {

  codeEditor: CodeEditor
  poligonoSelecionado: GameObjects.Image;
  sounds: Sounds
  grid: AlignGrid
  mode: MatrixMode = MatrixMode.ISOMETRIC
  phasesLoader: MazePhasesLoader
  currentPhase: MazePhase
  gameParams: GameParams
  testApplicationService: TestApplicationService
  gameState: GameState
  loadingText: GameObjects.Text
  messageBox: MessageBox
  textCurrentPhase: GameObjects.Text
  shapes: Phaser.GameObjects.Polygon[] = [];
  private positionValidationInstance: positionValidation;

  constructor() {
    super('game')
    this.positionValidationInstance = new positionValidation(this);
  }

  preload() {
    this.load.image('background', 'assets/ct/radial_gradient.png');
    this.load.image('tile', `assets/ct/tile_${this.mode}.png`);
    this.load.image('x', 'assets/ct/x.png');
    this.load.image('block', `assets/ct/obstacle_orange_${this.mode}.png`);
    this.load.image('message_box', 'assets/ct/message.png');
    this.load.image('intention_comamnd', 'assets/ct/intention_comamnd.png');
    //this.load.image('tutorial-block-click-background', 'assets/ct/tutorial-block-click-background.png');
    this.load.spritesheet('giroleft', 'assets/ct/giro_left.png', { frameWidth: 100, frameHeight: 100 });
    this.load.spritesheet('giroright', 'assets/ct/giro_right.png', { frameWidth: 100, frameHeight: 100 });
    this.load.spritesheet('btn-play', 'assets/ct/btn_play.png', { frameWidth: 100, frameHeight: 100 });
    this.load.spritesheet('btn-exit', 'assets/ct/btn_exit.png', { frameWidth: 81, frameHeight: 96 });
    this.load.spritesheet('btn-jump', 'assets/ct/btn_jump.png', { frameWidth: 81, frameHeight: 96 });
    this.load.spritesheet('btn-restart', 'assets/ct/btn_restart.png', { frameWidth: 81, frameHeight: 96 });
    this.load.spritesheet('btn-music', 'assets/ct/btn_music.png', { frameWidth: 81, frameHeight: 96 });
    this.load.spritesheet('btn-speed', 'assets/ct/btn_speed.png', { frameWidth: 81, frameHeight: 96 });
    this.load.spritesheet('btn-ok', 'assets/ct/btn_ok.png', { frameWidth: 278, frameHeight: 123 });
    this.load.spritesheet('btn-cancel', 'assets/ct/btn_cancel.png', { frameWidth: 194, frameHeight: 123 });
    this.load.spritesheet('btn-close-message', 'assets/ct/btn_close_message.png', { frameWidth: 68, frameHeight: 69 });
    this.load.spritesheet('btn-stop', 'assets/ct/btn_stop.png', { frameWidth: 100, frameHeight: 100 });
    this.load.spritesheet('btn-step', 'assets/ct/btn_step.png', { frameWidth: 100, frameHeight: 100 });
    this.load.spritesheet('tile-drop-zone', 'assets/ct/tile_drop_zone.png', { frameWidth: 79, frameHeight: 69 });
    this.load.spritesheet('block-sprite', 'assets/ct/block_sprite.png', { frameWidth: 92, frameHeight: 81 });
  }

  init(data: GameParams) {
    this.gameParams = data
    this.testApplicationService = new TestApplicationService(this.gameParams)
    this.gameState = new GameState()
  }

  async create() {

    this.sounds = globalSounds
    this.createGrid(30, 25)

    this.grid = new AlignGrid(this, 30, 25, this.game.config.width as number, this.game.config.height as number);

    //this.grid.show(0.4);

    //this.grid.showPoints();

    //this.grid.showPointsEvery50PX();

    this.grid.addImage(0, 0, 'background', this.grid.cols, this.grid.rows);
    this.input.setDefaultCursor('pointer');
    this.codeEditor = new CodeEditor(this, this.sounds, this.grid);
    this.messageBox = new MessageBox(this, this.grid)
    this.messageBox.onFinishTalk = () => {
      let isReplaying = this.gameState.isReplayingPhase();
      this.playPhase(this.currentPhase, {
        muteInstructions: true,
        clearResponseState: !isReplaying,
      });
    };

    this.showLoading();
    this.phasesLoader = this.getPhasesLoader();
    await this.phasesLoader.load(this.gameParams);
    if (this.testApplicationService.mustLoadFirstItem()) {
      return;
    }
    this.hideLoading();

    this.createTextCurrentPhase();
    this.createBtnExit()
    this.createBtnJump()
    this.createBtnRestart()
    this.createBtnMusic()

    this.codeEditor.onRotateLeft = () => {
      this.poligonoSelecionado.angle -= 15;
      this.gameState.registerRotationUse()
    }

    this.codeEditor.onRotateRight = () => {
      this.poligonoSelecionado.angle += 15;
      this.gameState.registerRotationUse()
    }

    //Aqui está a lógica de quando o botão de play é clicado
    //Trocou de fase sem nenhuma validação. Depois eu devo colocar uma validação
    this.codeEditor.onClickRun = () => {
      this.positionValidationInstance.logAllShapesPointsPositions();
      if (this.validateShapes(this.currentPhase)) {
        this.gameState.registerPlayUse();
        this.showSuccessMessage();
      } else {
        this.showErrorMessage()
      }
    }

    this.codeEditor.onReplayCurrentPhase = () => {
      this.replayCurrentPhase();
    }

    this.playNextPhase();
  }


  private showErrorMessage() {
    let messageBox = new MessageBox(this, this.grid, { showCancelButton: false });
    this.sounds.error();
    messageBox.setText("Erro! As formas não estão montadas corretamente.");
    messageBox.onClickOk = () => {
      messageBox.close();
    };
  }

  private async respondAndAdvance() {
    debugger
    const nextItemUrl = await this.sendResponse({ setFinished: true });
    console.log('nextItemUrl:', nextItemUrl);
    setTimeout(() => {
      if (nextItemUrl) {
        location.href = nextItemUrl;
        return;
      }
      this.playNextPhase();
    }, 1000);
  }

  private showSuccessMessage() {
    let messageBox = new MessageBox(this, this.grid, { showCancelButton: false });
    this.sounds.success();
    messageBox.setText("Parabéns! Você completou a fase!");
    messageBox.onClickOk = async () => {
      messageBox.close();
      await this.respondAndAdvance();
    };
  }

  private createTextCurrentPhase() {
    let cell = this.grid.getCell(0.5, 0.5)
    this.textCurrentPhase =
      this.add.text(cell.x, cell.y, '', { fontFamily: 'Dyuthi, sans-serif' })
        .setScale(this.grid.scale)
        .setTint(0x640000)
        .setFontSize(35)
  }

  validateShapes(phase: MazePhase): boolean {
    const pontosDestino = phase.pontosDestino.map(point => ({ x: point.x, y: point.y }));
    return this.positionValidationInstance.isShapeInCorrectPosition(pontosDestino);
  }

  private createBtnExit() {
    let btnExit = new Button(this, this.sounds, 0, 0, 'btn-exit', () => {
      let messageBox = new MessageBox(this, this.grid, { showCancelButton: true })
      messageBox.setText(this.currentPhase.exitPhaseMessage)
      messageBox.onClickOk = () => {
        messageBox.close()
        this.exit()
      }
    })
    this.grid.placeAt(0.5, 14.5, btnExit.sprite, 1.3)
  }

  private createBtnJump() {
    let btnJump = new Button(this, this.sounds, 0, 0, 'btn-jump', () => {
      let messageBox = new MessageBox(this, this.grid, { showCancelButton: true })
      messageBox.setText(this.currentPhase.skipPhaseMessage)
      messageBox.onClickOk = () => {
        messageBox.close()
        this.giveUp()
      }
    })
    this.grid.placeAt(0.5, 8.5, btnJump.sprite, 1.3)
  }


  private createBtnRestart() {
    let btnJump = new Button(this, this.sounds, 0, 0, 'btn-restart', () => {
      let messageBox = new MessageBox(this, this.grid, { showCancelButton: true })
      messageBox.setText(this.currentPhase.restartPhaseMessage)
      messageBox.onClickOk = () => {
        //Logger.clear();
        messageBox.close()
        this.gameState.registerRestartUse()
        this.gameState.setReplayingPhase(true);
        this.replayCurrentPhase({
          clearCodeEditor: true,
          muteInstructions: false,
          clearResponseState: false
        })
      }
    })
    this.grid.placeAt(0.5, 17.5, btnJump.sprite, 1.3)
  }

  private createBtnMusic() {
    let btn = new Button(this, this.sounds, 0, 0, 'btn-music', () => {
      const newState = globalSounds.togglePlayingBackgroundMusic()
      this.gameState.setBackgroundMusicEnabled(newState)
    })
    btn.toggle(!this.gameState.isBackgroundMusicEnabled())
    this.grid.placeAt(0.5, 11.5, btn.sprite, 1.3)
  }


  exit() {
    if (this.testApplicationService.mustLoadFirstItem()) {
      this.startEndScene();
      return;
    }
    this.destroy();
    this.scene.start("pre-game");
  }

  giveUp() {
    this.gameState.registerGiveUp()
    this.respondAndAdvance();
  }

  destroy() {
    this.currentPhase = null
    globalSounds.stopPlayBackgroundMusic()
  }

  getPhasesLoader(): MazePhasesLoader {
    let gridCenterX = this.grid.width / 3.2;
    let gridCenterY = this.grid.height / 2.4;
    let gridCellWidth = this.grid.cellWidth * 1.1;

    return new MazePhasesLoader(
      this,
      this.grid,
      this.codeEditor,
      MatrixMode.ISOMETRIC,
      gridCenterX,
      gridCenterY,
      gridCellWidth
    );
  }

  private showLoading() {
    let gridCenterX = this.grid.width / 3.2;
    let gridCenterY = this.grid.height / 2;
    let loadingText = this.add.text(
      gridCenterX,
      gridCenterY,
      'Loading...', {
      fontSize: '30pt'
    })
      .setScale(this.grid.scale);
    loadingText.setX(loadingText.x - loadingText.width / 2)
    this.loadingText = loadingText;
  }

  private hideLoading() {
    this.children.remove(this.loadingText)
  }

  private createGrid(cols: number, rows: number) {
    this.grid = new AlignGrid(
      this, cols, rows,
      this.game.config.width as number,
      this.game.config.height as number
    )
  }


  playNextPhase() {
    if (this.currentPhase) {
      this.gameState.setReplayingPhase(false);
    }
    const phase = this.phasesLoader.getNextPhase();

    this.playPhase(phase, { clearCodeEditor: true, clearResponseState: true });
  }

  replayCurrentPhase(options: PlayPhaseOptions =
    {
      clearCodeEditor: this.currentPhase?.isTutorialPhase(),
      muteInstructions: true
    }) {
    this.playPhase(this.currentPhase, options)
  }

  drawDashedLine(graphics, x1, y1, x2, y2, dashLength, gapLength) {
    const totalLength = Phaser.Math.Distance.Between(x1, y1, x2, y2);
    const dx = (x2 - x1) / totalLength;
    const dy = (y2 - y1) / totalLength;

    let currentLength = 0;
    while (currentLength < totalLength) {
      const nextLength = Math.min(currentLength + dashLength, totalLength);
      const startX = x1 + dx * currentLength;
      const startY = y1 + dy * currentLength;
      const endX = x1 + dx * nextLength;
      const endY = y1 + dy * nextLength;

      graphics.moveTo(startX, startY);
      graphics.lineTo(endX, endY);
      currentLength += dashLength + gapLength;
    }
  }



  async desenhaPoligonoDestino(phase: MazePhase) {
    const graphics = this.add.graphics();

    const pontosPoligonoDestinos = phase.poligonoDestino.map(point => ({ x: point.x, y: point.y }));

    // Define o estilo da linha (cor e espessura)
    graphics.lineStyle(2, 0x000000); // Preto com espessura de 3px

    graphics.beginPath();

    for (let i = 0; i < pontosPoligonoDestinos.length; i++) {
      graphics.lineTo(pontosPoligonoDestinos[i].x, pontosPoligonoDestinos[i].y); // Desenha uma linha para o próximo ponto
    }

    graphics.closePath();
    graphics.strokePath();


    const rect = new Phaser.Geom.Polygon(pontosPoligonoDestinos);

    return { graphics, rect };
  }

  geraCorAleatoriamente(): number {
    let color;
    do {
      color = Math.floor(Math.random() * 0xFFFFFF); // Gera uma cor aleatória
    } while (color === 0x000000); // Repete se a cor for preta
    return color;
  }

  async desenhaPoligonos(phase: MazePhase) {
    this.currentPhase = phase;
    if (this.currentPhase) {
      const polygons = this.currentPhase.poligonos;
      const InputHandler = new inputHandler(this);
      const FitShape = new fitShape(this);

      const points = polygons.pontos.map(point => ({ x: point.x, y: point.y }));
      const positions = polygons.posicao;
      //const color = polygons.cor || 0xB0E0E6; // Default color if not specified
      
      const quantidade = polygons.quantidade || 1;


      for (let i = 0; i < quantidade; i++) {
        const color = this.geraCorAleatoriamente();
        if (points.length > 0) {
          const centerX = points.reduce((sum, point) => sum + point.x, 0) / points.length;
          const centerY = points.reduce((sum, point) => sum + point.y, 0) / points.length;

          positions.forEach(position => {
            const polygon = this.add.polygon(position.x + centerX, position.y + centerY, points, color).setOrigin(0.5, 0.5);
            

            InputHandler.enableDrag(polygon);
            FitShape.enablePartialFit(polygon, this.currentPhase.poligonoDestino);

            polygon.on('pointerdown', () => {
              this.poligonoSelecionado = polygon;
              console.log('Polígono selecionado:', this.poligonoSelecionado);

              if (this.poligonoSelecionado) {
                this.gameState.registerClickUse()
              }
            });

            this.positionValidationInstance.addShape(polygon);
          });
        }
      }
    }
  }

  private removePoligonos() {
    const polygons = this.children.list.filter(child =>
      child instanceof Phaser.GameObjects.Polygon || child instanceof Phaser.GameObjects.Graphics
    );
    polygons.forEach(polygon => polygon.destroy());
  }

  async playPhase(phase: MazePhase, playPhaseOptions: PlayPhaseOptions) {

    this.playBackgroundMusic();
    if (!phase) {
      if (this.gameParams.isPlaygroundTest()) {
        this.replayCurrentPhase();
        return;
      }
    }

    this.currentPhase = phase

    if (!this.currentPhase) {
      this.startEndScene();
    }

    if (this.currentPhase) {
      if (playPhaseOptions.clearResponseState) {
        this.gameState.initializeResponse();
      }
      this.updateLabelCurrentPhase();

      this.currentPhase.setupMatrixAndTutorials()

      //remove os poligonos
      this.removePoligonos();

      //desenha o novo poligono
      this.desenhaPoligonoDestino(this.currentPhase);

      //desenha os poligonos
      this.desenhaPoligonos(this.currentPhase);

      //this.desenhaPoligonoEncaixe(this.currentPhase);
    }
  }

  private updateLabelCurrentPhase() {
    let label = this.testApplicationService.getCurrentPhaseString();
    if (!label) {
      label =
        "Fases restantes: " +
        (this.phasesLoader.phases.length - this.phasesLoader.currentPhase);
    }
    this.textCurrentPhase.setText(label);
  }

  playBackgroundMusic() {
    if (this.gameState.isBackgroundMusicEnabled()) {
      globalSounds.playBackgroundMusic()
    }
  }

  startEndScene() {
    this.destroy();
    this.scene.start('end-game', this.testApplicationService);
  }

  async sendResponse(
    options: {
      setFinished: boolean;
    } = {
        setFinished: false,
      }
  ): Promise<string> {
    let phase = this.currentPhase;
    if (phase) {
      if (this.gameParams.isItemToPlay()) {
        try {
          if (this.currentPhase) {
            if (options.setFinished) {
              this.gameState.setFinished();
            }
            this.gameState.registerTimeSpent()
            const response = this.gameState.getResponse();
            const res = await this.testApplicationService.sendResponse(
              response
            );
            if (options.setFinished) {
              return res.next;
            }
          }
        } catch (e) {
          Logger.log("ErrorSendingResponse", e);
          Logger.error(e);
          this.replayCurrentPhase();
          return;
        }
      }
    }
  }
}