import { GameObjects, Scene } from "phaser";
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
    const table = this.physics.add.staticImage((WIDTH + TOPPING_W) / 2, 500, 'table').setScale(0.41).setImmovable(true);
    const plate = this.physics.add.staticImage((WIDTH + TOPPING_W) / 2, 600, 'plate').setScale(0.2).setImmovable(true);
    
    const toppingBox = this.add.rectangle(0, 0, TOPPING_W, TOPPING_H, 0x4b3952).setOrigin(0, 0);
    const toppingBody = this.physics.add.staticBody(0, 0, TOPPING_W, TOPPING_H);
    
    // table.body.onCollide = true;
    // table.refreshBody();
    // table.body.y = 220; //has to be a better way
    // table.body.setSize(WIDTH - TOPPING_W, 150);
    
    plate.body.onCollide = true;
    plate.refreshBody();
    plate.body.y = plate.body.y + 195;
    plate.body.setSize(plate.body.width * 0.9, 300);
    
    toppingBody.onOverlap = true;
    
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
    
    const creamGroup = this.physics.add.staticGroup([]);

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

    this.input.on('dragend', (pointer, gameObject, dropped) => {
      const newGuy = this.physics.add.existing(gameObject, false);
      const dropping = newGuy.body;
      this.input.clear(gameObject, true);
      
      //fixing collision boxes
      if(gameObject.name === 'ice cream') {
        dropping.height /= 2;

        //and allow toppings to go on it
      } else {
        this.physics.add.collider(gameObject, creamGroup);
      }
      
      if(gameObject.name === 'cone') {
        dropping.setOffset(0, -100)
        dropping.setSize(216, dropping.height * 1.4);
      }

      //this.physics.add.overlap(gameObject, plate);
      //this.physics.add.overlap(gameObject, table);
      this.physics.add.overlap(gameObject, toppingBody);
      
      this.physics.add.collider(gameObject, plate);
      this.physics.add.collider(gameObject, table);
      dropping.setCollideWorldBounds(true, 0, 0, true);
    });

    this.physics.world.on('overlap', (obj1, obj2, b1, b2) => {
      const topping = /*(b1.onOverlap)? obj2 :*/ obj1;
      
      this.add.tween({
        targets: topping,
        delay: 0,
        duration: 150,
        ease: 'Power0',
        x: TOPPING_W / 2,
        y: toppings[this.lazyFind(topping, toppings)].y,
        angle: 0,
        onComplete: (tween, targets) => {
          targets[0].body.destroy();
          setTimeout(() => targets[0].destroy(), 200);
          
          tween.remove();
        },
        completeDelay: 0,
        persist: true
      });
    });

    this.physics.world.on('collide', (obj1, obj2, b1, b2) => {
      console.log("collision");
      if(b1.touching.down) b1.setAllowGravity(false);

      if(obj1?.name === 'ice cream') {
        creamGroup.add(obj1, false);
        creamGroup.refresh();
        console.log(creamGroup.getLength());
      } 
      
      else obj1.body.destroy();
    });

    this.physics.world.on('worldbounds', (body, up, down) => {
     if(down) body.destroy();
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
    if(newTopping.name === 'cone') {
      // hitBox.y -= 108;

      // hitBox.width *= 1.65;
      // hitBox.height *= 1.65;

      newTopping.setInteractive({
        hitArea: newTopping.geom,
        hitAreaCallback: Phaser.Geom.Triangle.Contains,
        draggable: true,
        useHandCursor: true
      });
    } else {
      if(newTopping.name === 'ice cream') hitBox.height /= 2;
      newTopping.setInteractive({
        hitArea: hitBox,
        hitAreaCallback: Phaser.Geom.Rectangle.Contains,
        draggable: true,
        useHandCursor: true
      });
    }    

    if(this.physics.getConfig().debug) {
      newTopping.on('destroy', (gameObject, fromScene) => {
        console.log(`obj: ${gameObject.name} | fromScene: ${fromScene}`);
      });
      newTopping.addListener('removedfromscene', (gameObject) => {
        console.log(`${gameObject.name} removed`);
      });
      this.input.enableDebug(newTopping);
    }
    
    
    return newTopping;
  }

  //this is TERRIBLE
  lazyFind(obj, toppings) {
    for(let i = 0; i < toppings.length; i++) {
      if(toppings[i].name === obj.name) return i;
    }

    return -1;
  };
}