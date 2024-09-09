export class DonePresent extends Phaser.Scene {
    constructor() {
        super('DonePresent');
    }

    create() {
        const WIDTH = this.game.scale.width;
        const HEIGHT = this.game.scale.height;

        const text =
            '';

        this.add.text(10, HEIGHT / 2, text, {
            fontFamily: 'Verdana',
            fontStyle: undefined,
            fontSize: '24px',
            stroke: '#000',
            strokeThickness: 0,
            wordWrap:{
                width: WIDTH / 1.5,
                useAdvancedWrap: true
            },
            align: 'center'
        }).setOrigin(0, 0.5);

        this.add.image(WIDTH, HEIGHT / 2, 'LEGEND').setOrigin(1, 0.5).setScale(0.4);
    }
};