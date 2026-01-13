export {};

declare global {
  interface Window {
    setPlayerHp?: (hp: number) => void;
    setPlayerSpeed?: (speed: number) => void;
    setPlayerRollState?: (state) => void;
    setPlayerXp?: (xp: number) => void;
  }
}