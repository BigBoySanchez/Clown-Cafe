import { Scene } from "phaser";

export class Boot extends Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.load.image('preloader', 'assets/preloader.png');
  }

  create() {
    this.scene.start('Preloader');
  }
}