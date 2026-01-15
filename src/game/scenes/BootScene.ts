import Phaser from "phaser";
import type { TextureKey } from "../../types/TextureKey";

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
        this.load.image("html" satisfies TextureKey, "assets/html.png");
        this.load.spritesheet("trail_fire", "assets/CSS_trail.png", {
            frameWidth: 22,
            frameHeight: 28
        });
        this.load.image("ts_halo" satisfies TextureKey, "assets/TS_srite.png");
    }   


    create() {
        this.scene.start("MainScene");
    }
}
