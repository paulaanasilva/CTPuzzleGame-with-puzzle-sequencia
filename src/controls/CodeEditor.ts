import { Scene, Input, GameObjects } from 'phaser';
import Button from './Button';
import Sounds from '../sounds/Sounds';
import AlignGrid from '../geom/AlignGrid';

export default class CodeEditor {

  scene: Scene;
  onClickRun: () => void = () => { };
  onRotateLeft: () => void = () => { };
  onRotateRight: () => void = () => { };
  onReplayCurrentPhase: () => void = () => { };
  onClickStop: () => void = () => { };

  sounds: Sounds;
  controlsScale: number;
  scale: number
  clickTime: number = this.getTime()
  grid: AlignGrid;
  btnStep: Button;
  btnStop: Button;
  btnPlay: Button;
  btnLeft: Button;
  btnRight: Button;
  onShowInstruction: (instruction: string) => void = () => { };
  onHideLastInstruction: () => void = () => { };


  constructor(scene: Scene, sounds: Sounds, grid: AlignGrid) {
    this.sounds = sounds;
    this.scene = scene;
    this.grid = grid;
    this.scale = grid.scale

    this.createStartStopStepButton();
  }

  getTime(): number {
    return new Date().getTime()
  }

  //Aqui é chamado o botão de play
  private createStartStopStepButton() {
    this.btnPlay = new Button(this.scene, this.sounds, 0, 0, 'btn-play', () => {
      this.onClickRun();
    })
    this.resetPositionsStartStopStepButton();
    this.setPlayBtnModeStoppeds();
  }
  
  resetPositionsStartStopStepButton() {
    this.grid.placeAt(6, 19, this.btnPlay.sprite, 2)
  }

  setPlayBtnModeStoppeds() {
    this.resetPositionsStartStopStepButton()
    this.btnPlay.show()
  }

}

export class PlayPhaseOptions {
  clearCodeEditor?: boolean = true
  clearResponseState?: boolean = false
  muteInstructions?: boolean = true
}
