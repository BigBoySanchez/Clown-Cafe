import { Boot } from './scenes/Boot.js';
import { Preloader } from './scenes/Preloader.js';
import { Decorate } from './scenes/Decorate.js';
import { DonePresent } from './scenes/DonePresent.js';

const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  parent: "game-container",
  backgroundColor: '#dcbcdf',
  antialias: true,
  
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    resizeInterval: 500
  },

  physics: {
    default: 'arcade',
    arcade: {
      fps: 60,
      fixedStep: true,
      overlapBias: 0,
      gravity: {
        y: 800
      },
      debug: false
    }
  },

  scene: [
    Boot,
    Preloader,
    Decorate,
    DonePresent
  ]
};

export default new Phaser.Game(config);