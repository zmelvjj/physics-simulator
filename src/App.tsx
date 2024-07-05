import React, { useRef, useEffect } from "react";
import Workspace from "./workspace";
import Matter from "matter-js";

export let setEngine: Matter.Engine;

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    setEngine = Engine.create();
    let render = Render.create({
      canvas: canvasRef.current as HTMLCanvasElement,
      engine: setEngine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: "white",
      },
    });

    const ground = Bodies.rectangle(
      window.innerWidth / 2,
      window.innerHeight + 250,
      window.innerWidth,
      500,
      { isStatic: true, render: { fillStyle: "white" } },
    );
    const topWall = Bodies.rectangle(
      window.innerWidth / 2,
      -250,
      window.innerWidth,
      500,
      { isStatic: true, render: { fillStyle: "white" } },
    );
    const leftWall = Bodies.rectangle(
      -250,
      window.innerWidth / 2,
      500,
      window.innerHeight * 2,
      { isStatic: true, render: { fillStyle: "white" } },
    );
    const rightWall = Bodies.rectangle(
      window.innerWidth + 250,
      window.innerHeight / 2,
      500,
      window.innerHeight,
      { isStatic: true, render: { fillStyle: "white" } },
    );

    World.add(setEngine.world, [ground, topWall, leftWall, rightWall]);
    Render.run(render);
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, setEngine);
  }, []);

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
      <Workspace />
    </div>
  );
};

export default App;
