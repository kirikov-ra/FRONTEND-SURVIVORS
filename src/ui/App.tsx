import { useEffect } from "react";
import { startGame } from "../game";
import HUD from "./component/HUD/HUD";

export default function App() {
  useEffect(() => {
    const game = startGame();
    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <>
      <div id="game-root" />
      <HUD />
    </>
  );
}
