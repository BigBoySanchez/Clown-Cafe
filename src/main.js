import Phaser, { Physics } from 'phaser';
import { Game } from 'phaser';

import { Boot } from './scenes/Boot';
import { Preloader } from './scenes/Preloader';
import { Decorate } from './scenes/Decorate';

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
      fixedStep: false,
      overlapBias: 0,
      gravity: {
        y: 800
      },
      debug: true
    }
  },

  scene: [
    Boot,
    Preloader,
    Decorate
  ]
};

export default new Game(config);