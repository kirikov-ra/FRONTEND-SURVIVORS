import Phaser from "phaser";

export const gameEvents = new Phaser.Events.EventEmitter();

export const GAME_EVENTS = {
  PLAYER_POSITION: "PLAYER_POSITION",
  TOGGLE_PAUSE: "TOGGLE_PAUSE",
  CURRENCY_ADD: "currency:add",
  NEW_GAME: 'NEW_GAME',
  TIMER_TICK: 'TIMER_TICK',
  SPAWN_BOSS: 'SPAWN_BOSS',
};
