export {};

declare global {
  interface Window {
    setPlayerHp?: (hp: number) => void;
  }
}