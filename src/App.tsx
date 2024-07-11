import React, { useRef, useEffect } from "react";
import Workspace from "./workspace";
import Matter from "matter-js";
import SetSelectObj from "./selectOrMove";
import ResizeObject, { isResizeing } from "./ObjectResizeEvent";
import Setting from "./addState/CreatedObjectStyle";

export let setEngine: Matter.Engine;
export let render: Matter.Render;

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => { 
    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    setEngine = Engine.create();
    render = Render.create({
      canvas: canvasRef.current as HTMLCanvasElement,
      engine: setEngine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: "white",
        showSleeping: false,
      },
    });

    const ground = Bodies.rectangle(
      window.innerWidth / 2,
      window.innerHeight + 250,
      window.innerWidth,
      500,
      { isStatic: true, render: { fillStyle: "white" }, label: "MainBox" },
    );
    const topWall = Bodies.rectangle(
      window.innerWidth / 2,
      -250,
      window.innerWidth,
      500,
      { isStatic: true, render: { fillStyle: "white" }, label: "MainBox" },
    );
    const leftWall = Bodies.rectangle(
      -250,
      window.innerWidth / 2,
      500,
      window.innerHeight * 2,
      { isStatic: true, render: { fillStyle: "white" }, label: "MainBox" },
    );
    const rightWall = Bodies.rectangle(
      window.innerWidth + 250,
      window.innerHeight / 2,
      500,
      window.innerHeight,
      { isStatic: true, render: { fillStyle: "white" }, label: "MainBox" },
    );

    const mouse = Matter.Mouse.create(render.canvas);
    const constraint = Matter.MouseConstraint.create(setEngine, {mouse:mouse,collisionFilter: {mask:0}, constraint: {render: { visible: false }}})


    //마우스 클릭 오브잭트 선택 처리
    Matter.Events.on(constraint,"mousedown",event=>{
      if (!isResizeing){
        const foundBodies:Matter.Body[] = Matter.Query.point(setEngine.world.bodies,constraint.mouse.position)

        if (foundBodies.length > 0){
          const selectObj = foundBodies[Math.floor(Math.random() * foundBodies.length)]
          if (setEngine.world.bodies.includes(selectObj) && selectObj.label !== "MainBox") SetSelectObj(selectObj)
        } else {
          SetSelectObj(null)
        }
      }
    })

    //오브잭트, 월드에 추가
    World.add(setEngine.world, [ground, topWall, leftWall, rightWall, constraint]);

    Render.run(render);
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, setEngine);
  }, []);

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
      <Workspace />
      <ResizeObject />
      <Setting />
    </div>
  );
};

export default App;
