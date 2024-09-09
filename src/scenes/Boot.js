export class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    //this.load.image('preloader', 'assets/preloader.png');
  }

  create() {
    this.scene.start('Preloader');
  }
}