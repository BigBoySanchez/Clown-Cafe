import { Scene } from "phaser";

export class Decorate extends Scene {
  constructor() {
    super('Decorate');
  }

  init() {
    const WIDTH = this.game.scale.width;
    const HEIGHT = this.game.scale.height;
    const TOPPING_H = 375;
    const TOPPING_W = 150;
    const MAX_TOPPINGS = 5;

    this.add.rectangle(0, 0, TOPPING_W, TOPPING_H, 0x4b3952).setOrigin(0, 0);
    
    const toppings = [
      this.add.arc(0, 0, 128, 0, 180, true, 0xfffdd0).setOrigin(0.5, 0.3).setScale(0.3),
      this.add.circle(0, 0, 20, 0x4c3228).setOrigin(0.5),
      this.add.triangle(0, 0, 0, 128, 64, 0, 128, 128, 0xC4A484).setOrigin(0.5).setScale(0.3)
    ]
    
    for (let i = 0; i < MAX_TOPPINGS; i++) {
      const SEPARATOR = i * TOPPING_H / 5;
      
      if(i < toppings.length) {
        toppings[i].setX(TOPPING_W / 2);
        toppings[i].setY(SEPARATOR + (TOPPING_H / MAX_TOPPINGS / 2)); //to get topping between separators
      }
      
      //first separator would be at 0
      if(i !== 0) this.add.rectangle(0, SEPARATOR, TOPPING_W, 5, 0xffffff).setOrigin(0, 0);
    }

    

    this.add.image(WIDTH / 2, 500, 'table').setScale(0.41);
    this.add.image(WIDTH / 2, 600, 'plate').setScale(0.2);
  }
}