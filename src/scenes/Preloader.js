export class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  init() {
    const WIDTH = this.game.scale.width;
    const HEIGHT = this.game.scale.height;

    this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH / 2, HEIGHT / 128, 0x999999);
    const bar = this.add.rectangle((WIDTH / 2) - (WIDTH / 4), HEIGHT / 2, 0, HEIGHT / 32, 0xffffff).setOrigin(0, 0.5);
    const loadText = this.add.text(WIDTH / 2, (HEIGHT / 2) + (HEIGHT / 16), 'Loading...').setOrigin(0.5);

    this.load.on('progress', (progress) => {
      bar.width = (WIDTH / 2) * progress;
      if(progress === 1) setTimeout(() => loadText.setText('Click anywhere to start!'), 1);
    });
  }

  preload() {
    this.load.setPath('./public/assets');

    //DELETE
    this.load.image('LEGEND', 'IMG_0056.JPG');

    this.load.image('table', 'table.png');
    this.load.image('plate', 'plate.png');

    this.load.image('clear', 'clear.png');
    this.load.image('undo', 'undo.png');
    this.load.image('done', 'done.png');
  }

  create() {
    this.input.on('pointerdown', () => {
      this.scene.transition({
        target: 'Decorate',
        duration: 0,
        remove: true
      });
    });
  }
}