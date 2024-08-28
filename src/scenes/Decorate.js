import { Scene } from "phaser";
import Phaser from "phaser";

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
      this.add.arc(0, 0, 128, 0, 180, true, 0xfffdd0)             //ice cream
              .setOrigin(0.5, 0.3)
              .setScale(0.3)
              .setState('decoration'),        
      this.add.circle(0, 0, 20, 0x4c3228)                         //cookie
              .setOrigin(0.5)
              .setState('decoration'),                                   
      this.add.triangle(0, 0, 0, 128, 64, 0, 128, 128, 0xC4A484)  //cone
              .setOrigin(0.5)
              .setScale(0.3)
              .setState('decoration'),                                        
      this.add.ellipse(0, 0, 32, 40, 0xD20A2E)                    //cherry
              .setState('decoration'),
      this.add.circle(0, 0, 16, 0x7B3F00)                         //chocolate
              .setState('decoration')
    ]
    
    for (let i = 0; i < MAX_TOPPINGS; i++) {
      const SEPARATOR = i * TOPPING_H / MAX_TOPPINGS;
      
      if(i < toppings.length) {
        toppings[i].setX(TOPPING_W / 2);
        toppings[i].setY(SEPARATOR + (TOPPING_H / MAX_TOPPINGS / 2)); //to get topping between separators

        toppings[i].setInteractive();
        // toppings[i].on('pointerdown', (pointer) => {
        //   if(!pointer.leftButtonDown()) return;

        //   //create draggable copy of the topping
        //   const toPlace = Phaser.Utils.Objects.DeepCopy(toppings[i]);
        //   this.input.setDraggable(toPlace, true);

        //   toPlace.on('drag', () => {
        //     this
        //   });
        // });
      }
      
      //first separator would be at 0
      if(i !== 0) this.add.rectangle(TOPPING_W / 2, SEPARATOR, TOPPING_W, 5, 0xffffff).setOrigin(0.5, 0.5);
    }

    this.input.on('gameobjectdown', (pointer, gameObject) => {
      if(!pointer.leftButtonDown()) return;
      
      console.log(gameObject.type);
    });
    

    this.add.image(WIDTH / 2, 500, 'table').setScale(0.41);
    this.add.image(WIDTH / 2, 600, 'plate').setScale(0.2);
  }
}