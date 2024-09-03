import { Scene } from "phaser";
import Phaser from "phaser";

export class Decorate extends Scene {
  constructor() {
    super('Decorate');
  }

  create() {
    const WIDTH = this.game.scale.width;
    const HEIGHT = this.game.scale.height;
    const TOPPING_H = HEIGHT;
    const TOPPING_W = 400;
    const MAX_TOPPINGS = 5;
    
    //this.physics.add.image((WIDTH + TOPPING_W) / 2, 500, 'table').setScale(0.41);
    //this.physics.add.image((WIDTH + TOPPING_W) / 2, 600, 'plate').setScale(0.2).refreshBody();
    this.physics.add.staticImage((WIDTH + TOPPING_W) / 2, 500, 'table').setScale(0.41);
    this.physics.add.staticImage((WIDTH + TOPPING_W) / 2, 600, 'plate').setScale(0.2);
    this.add.rectangle(0, 0, TOPPING_W, TOPPING_H, 0x4b3952).setOrigin(0, 0);
    
    const toppings = [
      new Phaser.GameObjects.Arc(this, 0, 0, 145, 180, 360, false, 0xfffdd0)
                            .setOrigin(0.5, 0.25)
                            .setName('ice cream'),        
      new Phaser.GameObjects.Ellipse(this, 0, 0, 320, 60, 0x4c3228)
                            .setName('cookie'),
      new Phaser.GameObjects.Triangle(this, 0, 0, 400, 0, 0, 108, 0, -108, 0xC4A484)
                            .setOrigin(0.5, 0)
                            .setScale(0.6)
                            .setName('cone'),                                        
      new Phaser.GameObjects.Ellipse(this, 0, 0, 32, 40, 0xD20A2E)
                            .setName('cherry'),
      new Phaser.GameObjects.Arc(this, 0, 0, 16, 0, 360, false, 0x7B3F00)
                            .setName('chocolate')
    ]
    
    
    for (let i = 0; i < MAX_TOPPINGS; i++) {
      const SEPARATOR = i * TOPPING_H / MAX_TOPPINGS;
      
      if(i < toppings.length) {
        toppings[i].setX(TOPPING_W / 2);
        toppings[i].setY(SEPARATOR + (TOPPING_H / MAX_TOPPINGS / 2)); //to get topping between separators
        
        this.addTopping(toppings[i]);
      }
      
      //first separator would be at 0
      if(i !== 0) this.add.rectangle(TOPPING_W / 2, SEPARATOR, TOPPING_W, 5, 0xffffff).setOrigin(0.5, 0.5);
    }

    //event handlers
    this.input.on('dragstart', (pointer, gameObject) => {
      this.children.bringToTop(gameObject);
      if(gameObject.name === 'cone') {
        this.add.tween({
          targets: gameObject,
          delay: 0,
          duration: 150,
          ease: 'Power10',
          angle: -90,
          onComplete: (tween) => tween.remove(),
          persist: true
        });
      }

      this.addTopping(gameObject);
    });

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on('dragend', (pointer, gameObject) => {
      const dropping = this.physics.add.existing(gameObject, false).body;
      dropping.setCollideWorldBounds(true);
      
      //gameObject.destroy();
    });
  }

  addTopping(topping) {
    var newTopping = undefined;
    var hitBox = undefined;
    
    if(topping.type === 'Arc') {
      newTopping = this.add.arc(topping.x, topping.y, 
                                topping.radius, topping.startAngle, topping.endAngle, 
                                topping.anticlockwise, topping.fillColor)
                           .setOrigin(topping.originX, topping.originY)
                           .setScale(topping.scaleX, topping.scaleY)
                           .setName(topping.name);
    } else if(topping.type === 'Rectangle') {
      newTopping = this.add.rectangle(topping.x, topping.y, 
                                      topping.width, topping.height, 
                                      topping.fillColor)
                           .setOrigin(topping.originX, topping.originY)
                           .setScale(topping.scaleX, topping.scaleY)
                           .setName(topping.name);
                            
    } else if(topping.type === 'Triangle') {
      const geom = topping.geom;
      
      newTopping = this.add.triangle(topping.x, topping.y, 
                                     geom.x1, geom.y1, 
                                     geom.x2, geom.y2, 
                                     geom.x3, geom.y3, topping.fillColor)
                           .setOrigin(topping.originX, topping.originY)
                           .setScale(topping.scaleX, topping.scaleY)
                           .setName(topping.name);
    } else if(topping.type === 'Ellipse') {
      newTopping = this.add.ellipse(topping.x, topping.y, 
                                    topping.width, topping.height, topping.fillColor)
                           .setOrigin(topping.originX, topping.originY)
                           .setScale(topping.scaleX, topping.scaleY)
                           .setName(topping.name);
    } else {
      return null;
    }

    const topLeft = newTopping.getLocalPoint(newTopping.getTopLeft().x, newTopping.getTopLeft().y);
    hitBox = newTopping.getBounds();
    hitBox.x = topLeft.x;
    hitBox.y = topLeft.y;
    
    //edge cases where hitbox aint right
    if(newTopping.name === 'ice cream') hitBox.height /= 2;
    else if(newTopping.name === 'cone') {
      hitBox.y -= 108;

      hitBox.width *= 1.65;
      hitBox.height *= 1.65;
    }

    newTopping.on('destroy', (gameObject, fromScene) => {
      console.log(`obj: ${gameObject.name} | fromScene: ${fromScene}`);
    });
    
    newTopping.setInteractive({
      hitArea: hitBox,
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      draggable: true,
      useHandCursor: true
    });
    
    newTopping.addListener('removedfromscene', (gameObject) => {
      console.log(`${gameObject.name} removed`);
    });
    this.input.enableDebug(newTopping);
    
    
    return newTopping;
  }
}