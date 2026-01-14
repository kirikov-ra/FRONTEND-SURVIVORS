import Phaser from "phaser";

export const gameEvents = new Phaser.Events.EventEmitter();

export const GAME_EVENTS = {
  PLAYER_POSITION: "PLAYER_POSITION",
  TOGGLE_PAUSE: "TOGGLE_PAUSE",
};
