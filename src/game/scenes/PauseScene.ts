import Phaser from "phaser";

export class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: "PauseScene" });
  }

  create() {
    this.add.rectangle(0, 0, 9999, 9999, 0x000000, 0.6).setOrigin(0);

    this.add
      .text(400, 300, "PAUSED", {
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.input.keyboard!.once("keydown-ESC", () => {
      this.resumeGame();
    });
  }

  private resumeGame() {
    this.scene.stop();
    this.scene.resume("MainScene");
  }
}
