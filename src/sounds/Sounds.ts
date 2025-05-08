// Site com sons
// https://www.zapsplat.com/sound-effect-category/cartoon-impacts/

import { androidPlayAudio } from "../utils/Utils";

export default class Sounds {


  playRobotSound(name: string) {
    if (name == 'arrow-up' || name == 'arrow-down') {
      this.robotWalk()
    } else {
      this.robotTurn()
    }
  }

  scene: Phaser.Scene;
  dragSound: Phaser.Sound.BaseSound;
  dropSound: Phaser.Sound.BaseSound;
  hoverSound: Phaser.Sound.BaseSound;
  removeSound: Phaser.Sound.BaseSound;
  errorSound: Phaser.Sound.BaseSound;
  coinSound: Phaser.Sound.BaseSound;
  blockedSound: Phaser.Sound.BaseSound;
  startSound: Phaser.Sound.BaseSound;
  blinkSound: Phaser.Sound.BaseSound;
  successSound: Phaser.Sound.BaseSound;
  clickSound: Phaser.Sound.BaseSound;
  robotTurnSound: Phaser.Sound.BaseSound;
  robotWalkSound: Phaser.Sound.BaseSound;
  backMusic: Phaser.Sound.BaseSound;

  create() {
    this.dragSound = this.scene.sound.add('drag');
    this.dropSound = this.scene.sound.add('drop');
    this.hoverSound = this.scene.sound.add('hover');
    this.removeSound = this.scene.sound.add('remove');
    this.errorSound = this.scene.sound.add('error');
    this.startSound = this.scene.sound.add('start');
    this.blockedSound = this.scene.sound.add('blocked');
    this.coinSound = this.scene.sound.add('coin');
    this.blinkSound = this.scene.sound.add('blink');
    this.successSound = this.scene.sound.add('success');
    this.clickSound = this.scene.sound.add('click');
    this.robotWalkSound = this.scene.sound.add('robot');
    this.robotTurnSound = this.scene.sound.add('noise');
    this.backMusic = this.scene.sound.add('back-music');
  }

  preload(scene: Phaser.Scene) {
    this.scene = scene;
    this.scene.load.audio('blocked', 'assets/ct/sounds/blocked.mp3');
    this.scene.load.audio('error', 'assets/ct/sounds/error.ogg');
    this.scene.load.audio('drag', 'assets/ct/sounds/drag.ogg');
    this.scene.load.audio('drop', 'assets/ct/sounds/drop.ogg');
    this.scene.load.audio('hover', 'assets/ct/sounds/hover.mp3');
    this.scene.load.audio('remove', 'assets/ct/sounds/remove.ogg');
    this.scene.load.audio('start', 'assets/ct/sounds/start.ogg');
    this.scene.load.audio('coin', 'assets/ct/sounds/coin.wav');
    this.scene.load.audio('blink', 'assets/ct/sounds/blink.mp3');
    this.scene.load.audio('success', 'assets/ct/sounds/success.mp3');
    this.scene.load.audio('click', 'assets/ct/sounds/click.mp3');
    this.scene.load.audio('noise', 'assets/ct/sounds/robot.wav');
    this.scene.load.audio('robot', 'assets/ct/sounds/seat_lower.mp3');

    //https://freesound.org/people/mickleness/sounds/316975/
    this.scene.load.audio('back-music', 'assets/ct/sounds/background_music.mp3');
  }

  playBackgroundMusic() {
    this.playSound(this.backMusic, { loop: true })
  }

  stopPlayBackgroundMusic() {
    this.stopSound(this.backMusic)
  }

  togglePlayingBackgroundMusic(): boolean {
    let enabled = false;
    if (this.backMusic.isPlaying) {
      this.stopPlayBackgroundMusic()
    } else {
      this.playBackgroundMusic()
      enabled = true
    }
    return enabled
  }

  drag() {
    this.playSound(this.dragSound);
  }

  drop() {
    this.playSound(this.dropSound);
  }

  hover() {
    this.playSound(this.hoverSound);
  }

  remove() {
    this.playSound(this.removeSound);
  }

  error() {
    this.playSound(this.errorSound);
  }

  coin() {
    this.playSound(this.coinSound);
  }

  robotTurn() {
    this.playSound(this.robotTurnSound)
  }

  robotWalk() {
    this.playSound(this.robotWalkSound)
  }

  start() {
    this.playSound(this.startSound);
  }

  blocked() {
    this.playSound(this.blockedSound);
  }

  stop() {
    //this.blockedSound.play()
  }

  blink() {
    this.playSound(this.blinkSound)
  }

  success() {
    this.playSound(this.successSound)
  }

  click() {
    this.playSound(this.clickSound)
  }

  stopSound(sound: Phaser.Sound.BaseSound) {
    //if (!androidPlayAudio(sound.key)) {
    sound.stop()
    //}
  }

  playSound(sound: Phaser.Sound.BaseSound, config: { loop: boolean } = { loop: false }) {
    if (!androidPlayAudio(sound.key)) {
      if (!sound.isPlaying) {
        sound.play({ loop: config.loop })
      }
    }
  }
}
