export class Decorate extends Phaser.Scene {
  constructor() {
    super('Decorate');
  }

  create() {
    this.toppingStack = [];
    
    const WIDTH = this.game.scale.width;
    const HEIGHT = this.game.scale.height;
    const TOPPING_H = HEIGHT;
    const TOPPING_W = 400;
    const MAX_TOPPINGS = 5;
    
    var cream = undefined;
    var creamCollide = undefined;

    const table = this.physics.add.staticImage((WIDTH + TOPPING_W) / 2, 500, 'table').setScale(0.41).setImmovable(true);
    const plate = this.physics.add.staticImage((WIDTH + TOPPING_W) / 2, 600, 'plate').setScale(0.2).setImmovable(true);
    
    const toppingBox = this.add.rectangle(0, 0, TOPPING_W, TOPPING_H, 0x4b3952).setOrigin(0, 0);
    const toppingBody = this.physics.add.staticBody(0, 0, TOPPING_W, TOPPING_H);
    
    //undo and clear buttons
    // const rad = 20;
    // this.add.circle(WIDTH - rad * 1.1, 0 + rad * 1.1, rad, 0xffffff);
    const undoSize = 512;
    const undoScale = 0.22;
    const undoCombo = undoSize * undoScale;
    
    const clear = this.add.image(WIDTH - undoCombo, 0, 'clear')
                          .setScale(undoScale / 5.125)
                          .setOrigin(0)
                          .setInteractive()
                          .on('pointerdown', () => {
                            this.toppingStack.forEach(element => {
                              element.destroy();
                              if(element.name === 'ice cream' && cream) {
                                cream = undefined;
                                this.addTopping(toppings[0]);
                                done.destroy();
                              }
                            });
                            this.toppingStack.length = 0;
                          });

    const undo = this.add.image(WIDTH - undoCombo, 0 + undoCombo, 'undo')
                          .setScale(undoScale)
                          .setOrigin(0)
                          .setInteractive()
                          .on('pointerdown', () => {
                            const popped = this.toppingStack.pop();
                            if(!popped) return;
                            
                            popped.destroy();
                            if(popped.name === 'ice cream' && cream) {
                              cream = undefined;
                              this.addTopping(toppings[0]);
                              done.destroy();
                            }
                            if(this.physics.getConfig().debug) console.log(this.toppingStack);
                          });
    
    var done = undefined;
    
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

      if(gameObject.name !== 'ice cream') this.addTopping(gameObject);
    });

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on('dragend', (pointer, gameObject, dropped) => {
      // Make sure the object has a physics body
      if (!gameObject.body) {
        this.physics.add.existing(gameObject, false); // Add physics body to the gameObject
      }
      
      //const newGuy = this.physics.add.existing(gameObject, false);
      const dropping = gameObject.body;
      this.input.clear(gameObject, true);
      
      //fixing collision boxes
      if(gameObject.name === 'ice cream') {
        dropping.setSize(gameObject.width, gameObject.height / 2.1, false);
        dropping.setOffset(0, 8);
      }
      
      if(gameObject.name === 'cone') {
        dropping.setOffset(0, 0)
        dropping.setSize(216, dropping.height * 1.2);
      }

      this.physics.add.overlap(gameObject, toppingBody);
      
      const coll = this.physics.add.collider(gameObject, plate);
      if(gameObject.name === 'ice cream') creamCollide = coll;
      else if(cream) this.physics.add.collider(gameObject, cream);
      dropping.setCollideWorldBounds(true, 0, 0, true);

      dropping.setVelocity(0, 0);
    });

    this.physics.world.on('overlap', (obj1, obj2, b1, b2) => {
      const topping = obj1;
      topping.body.destroy();
      
      this.add.tween({
        targets: topping,
        delay: 0,
        duration: 150,
        ease: 'Power10',
        x: TOPPING_W / 2,
        y: toppings[this.lazyFind(topping, toppings)].y,
        angle: 0,
        onComplete: (tween, targets) => {          
          if(targets[0].name !== 'ice cream'){
            setTimeout(() => targets[0].destroy(), 200);
          } else {
            setTimeout(() => targets[0].destroy(), 200);
            this.addTopping(toppings[0]);
          }
          
          tween.remove();
        },
        completeDelay: 0,
        persist: false
      });
    });

    this.physics.world.on('collide', (obj1, obj2, b1, b2) => {
      // Ensure the object stops moving
      obj1.body.enable = false;
      obj1.body.setImmovable(true);
      obj1.body.setAllowGravity(false) 
      obj1.body.stop();

      if(obj1.name === 'ice cream' && creamCollide) {
        //console.log(obj1.y);
        obj1.body.enable = true;
        this.physics.world.removeCollider(creamCollide);
        obj1.body.onCollide = true;
        cream = obj1;

        //make done button
        done = this.add.image(WIDTH - undoCombo, undoCombo * 2, 'done');
        done.setScale(undo.width / done.width * undoScale);
        done.setOrigin(0);
        done.setInteractive();
        done.on('pointerdown', () => {
          this.scene.transition({
            target: 'DonePresent',
            duration: 1000,
            sleep: false, //change after present
            remove: true, //same here
            allowInput: false,
            moveBelow: true,
            onUpdate: (progress) => {
              this.cameras.main.setAlpha(1 - progress);
            }
          });
        });

      } else {
        this.physics.world.remove(obj1.body);
      }

      this.toppingStack.push(obj1);
    });

    this.physics.world.on('worldbounds', (body, up, down) => {
     if(down) {
      this.physics.world.remove(body);
      this.toppingStack.push(body.gameObject);
    }
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