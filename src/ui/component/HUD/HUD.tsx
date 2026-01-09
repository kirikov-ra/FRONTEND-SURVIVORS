import { useState, useEffect } from "react";

export const HUD = () => {
  const [hp, setHp] = useState(100);

  useEffect(() => {
    window.setPlayerHp = setHp;
    return () => {
      window.setPlayerHp = undefined;
    };
  }, []);

  return (
    <div style={{ position: "absolute", top: 10, left: 10 }}>
      <div style={{ width: 200, height: 20, background: "#555" }}>
        <div
          style={{
            width: `${(hp / 100) * 200}px`,
            height: "100%",
            background: "red",
            transition: "width 0.1s linear",
          }}
        />
      </div>
      <span style={{ color: "white" }}>{hp} / 100</span>
    </div>
  );
};

export default HUD;