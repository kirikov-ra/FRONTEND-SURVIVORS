import Phaser from "phaser";

export const gameEvents = new Phaser.Events.EventEmitter();

export const GAME_EVENTS = {
  PLAYER_POSITION: "PLAYER_POSITION",
  TOGGLE_PAUSE: "TOGGLE_PAUSE",
  CLOSE_MENU: "CLOSE_MENU",
  TOGGLE_MENU: "TOGGLE_MENU",
  MENU_SET: "menu:set",
  CURRENCY_ADD: "currency:add",
  CURRENCY_UPDATED: "currency:add:updated",
  NEW_GAME: "NEW_GAME",
  TIMER_TICK: "TIMER_TICK",
  SPAWN_BOSS: "SPAWN_BOSS",
} as const;
