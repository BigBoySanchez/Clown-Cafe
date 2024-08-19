import Phaser from 'phaser';
import { Game } from 'phaser';

import { Boot } from './scenes/Boot';

const config = {
  //Graphics
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  parent: "game-container",
  backgroundColor: '#dcbcdf',
  scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      resizeInterval: 500
  },

  scene: [
      Boot
  ]
};

export default new Game(config);