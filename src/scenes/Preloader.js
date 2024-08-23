import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super('Preloader');
  }

  init() {
    const {WIDTH, HEIGHT} = this.sys.game.canvas;

    this.add.rectangle()
  }
}