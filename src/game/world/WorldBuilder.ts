import Phaser from "phaser";

export interface WorldObjects {
    floor: Phaser.GameObjects.TileSprite;
    walls: Phaser.GameObjects.GameObject[];
    pillars: Phaser.GameObjects.GameObject[];
}

export class WorldBuilder {
    private scene: Phaser.Scene;
    private width: number;
    private height: number;

    private readonly PILLAR_OFFSET = 500;

    constructor(scene: Phaser.Scene, width: number, height: number) {
        this.scene = scene;
        this.width = width;
        this.height = height;
    }

    build(): WorldObjects {
        // ===== ПОЛ =====
        const floor = this.scene.add.tileSprite(0, 0, this.width, this.height, "floor");
        floor.setOrigin(0, 0);

        // ===== ФИЗИКА / КАМЕРА =====
        this.scene.physics.world.setBounds(0, 0, this.width, this.height);
        this.scene.cameras.main.setBounds(0, 0, this.width, this.height);
        this.scene.cameras.main.setZoom(1.2);

        // ===== СТЕНЫ =====
        const walls: Phaser.GameObjects.GameObject[] = [];

        const topWall = this.scene.add.tileSprite(this.width / 2, 40, this.width, 80, "wall_front");
        this.scene.physics.add.existing(topWall, true);
        (topWall.body as Phaser.Physics.Arcade.StaticBody).setSize(this.width, 6);
        walls.push(topWall);

        const bottomWall = this.scene.add.tileSprite(this.width / 2, this.height - 7, this.width, 14, "wall_bottom");
        this.scene.physics.add.existing(bottomWall, true);
        walls.push(bottomWall);

        const leftWall = this.scene.add.tileSprite(7, this.height / 2, 14, this.height, "wall_side");
        this.scene.physics.add.existing(leftWall, true);
        walls.push(leftWall);

        const rightWall = this.scene.add.tileSprite(this.width - 7, this.height / 2, 14, this.height, "wall_side");
        rightWall.setRotation(Math.PI);
        this.scene.physics.add.existing(rightWall, true);
        walls.push(rightWall);

        // ===== СТОЛБЫ =====
        const pillars: Phaser.GameObjects.GameObject[] = [];
        const o = this.PILLAR_OFFSET;

        const positions = [
            { x: o, y: o },
            { x: this.width - o, y: o },
            { x: o, y: this.height - o },
            { x: this.width - o, y: this.height - o },
        ];

        for (const pos of positions) {
            const pillar = this.scene.add.image(pos.x, pos.y, "pillar");
            pillar.setDepth(5);

            this.scene.physics.add.existing(pillar, true);
            const body = pillar.body as Phaser.Physics.Arcade.StaticBody;
            body.setSize(pillar.width - 8, pillar.height - 30);
            body.setOffset(8, 0);

            pillars.push(pillar);
        }

        return { floor, walls, pillars };
    }
}
