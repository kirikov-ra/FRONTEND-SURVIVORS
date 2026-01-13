import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
    constructor() {
        super("BootScene");
    }

    preload() {
        this.load.spritesheet(
            "player_asset_sheet",
            "assets/player_asset_sheet.png",
            {
                frameWidth: 22,
                frameHeight: 64,
            }
        );
        this.load.spritesheet(
            "player-roll",
            "assets/player_roll.png",
            { frameWidth: 32, frameHeight: 64 }
        );
        this.load.spritesheet(
            "enemy_sprite_sheet", 
            "assets/bug.png", 
            {
                frameWidth: 22,
                frameHeight: 44,
            });
        this.load.image("floor", "assets/floor.png");
        this.load.image("wall_front", "assets/wall_front.png");
        this.load.image("wall_side", "assets/wall_side.png");
        this.load.image("wall_bottom", "assets/wall_bottom.png");
    }   


    create() {
        this.scene.start("MainScene");
    }
}
