import Phaser from "phaser";
import { GAME_EVENTS, gameEvents } from "../events/gameEvents";

export class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: "PauseScene" });
  }

  create() {
    this.add.rectangle(0, 0, 9999, 9999, 0x000000, 0.6).setOrigin(0);

    this.input.keyboard!.on("keydown-ESC", () => {
      gameEvents.emit(GAME_EVENTS.TOGGLE_PAUSE);
      gameEvents.emit(GAME_EVENTS.TOGGLE_MENU);
    });
  }
}
