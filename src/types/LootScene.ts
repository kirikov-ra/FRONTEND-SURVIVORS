import Phaser from "phaser";
// import { Coin } from "../entities/Coin";

export interface LootScene extends Phaser.Scene {
  coins: Phaser.Physics.Arcade.Group;
}
