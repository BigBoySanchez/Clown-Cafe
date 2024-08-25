import { Scene } from "phaser";

export class Decorate extends Scene {
  constructor() {
    super('Decorate');
  }

  init() {
    const WIDTH = this.game.scale.width;
    const TABLE_HEIGHT = 500;

    this.add.image(WIDTH / 2, TABLE_HEIGHT, 'table').setScale(0.41);
    this.add.image(WIDTH / 2, 600, 'plate').setScale(0.2);
  }
}