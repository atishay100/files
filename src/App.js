import Model from "./Model";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import "./app.css";

function App() {
  const [explosionFactor, setExplosionFactor] = useState(0);
  return (
    <>
      <Canvas>
        <ambientLight intensity={Math.PI} />
        <directionalLight intensity={0.5} />
        <OrbitControls panSpeed={3} rotateSpeed={3} />
        <Model explosionFactor={explosionFactor}></Model>
      </Canvas>
      <input
        style={{
          position: "absolute",
          width: "100px",
          height: "100px",
          top: 0,
        }}
        type="range"
        step={1}
        value={explosionFactor}
        max={90}
        onChange={(e) => {
          setExplosionFactor(Number(e.target.value));
        }}
      />
    </>
  );
}

export default App;
