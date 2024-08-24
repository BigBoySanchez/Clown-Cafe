import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super('Preloader');
  }

  init() {
    const WIDTH = this.game.scale.width;
    const HEIGHT = this.game.scale.height;

    this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH / 2, HEIGHT / 128, 0x999999);
    const bar = this.add.rectangle(WIDTH / 4, HEIGHT / 2, 0, HEIGHT / 32, 0xffffff)

    this.load.on('progress', (progress) => {
      bar.width = (WIDTH / 2) * progress;
    });
  }

  preload() {
    this.load.setPath('/assets');

    this.load.image('plate', 'plate.png');
  }
}