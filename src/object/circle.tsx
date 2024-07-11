import React from "react";
import Matter from "matter-js";
import { mousePos } from "../addState/mousePos";
import { isRunningSimulator } from "../run-simulator";
import { setEngine, allObjectList } from "../App";
import "../style.css";
import { isDrage } from "../addState/mouseState";
import { inertial } from "../addState/CreatedObjectStyle";

let isState = false;
let isOver = false;

window.addEventListener("mousedown", () => {
  if (isState && !isOver) {
    PartyMode = false;
    const newObj = Matter.Bodies.circle(mousePos.x, mousePos.y, 50, {
      render: { strokeStyle: "black" },
      isSleeping: isRunningSimulator ? false : true,
      label: "workBox",
      friction: inertial.friction,
      frictionAir: inertial.frictionAir,
      frictionStatic: inertial.frictionStatic,
    });
    Matter.World.add(setEngine.world, [newObj]);
    allObjectList.push(newObj);
  } else if (PartyMode) {
    root();
  }
});

let PartyMode: boolean = false;
window.addEventListener("keydown", (key) => {
  if (key.code == "KeyP" && isState && isRunningSimulator) {
    console.log("Party!!");
    isState = false;
    PartyMode = true;
  } else if (PartyMode && !isRunningSimulator) {
    PartyMode = false;
    allObjectList.forEach((object) => {
      if (object.label == "PartyBox") {
        Matter.World.remove(setEngine.world, object);
      }
    });
  }
});

const root = () => {
  if (isDrage) {
    const newObj = Matter.Bodies.circle(
      mousePos.x,
      mousePos.y,
      Math.floor(Math.random() * 50),
      {
        label: "PartyBox",
      },
    );
    Matter.World.add(setEngine.world, [newObj]);
    allObjectList.push(newObj);
    setTimeout(root, 10);
  }
};

const onClick = () => (isState = !isState);

interface prop {
  top: number;
}

const newCircle: React.FC<prop> = ({ top }) => {
  let style = { top: top + "vh" };
  return (
    <div>
      <div
        className="object"
        style={style}
        onMouseDown={onClick}
        onMouseOver={() => (isOver = true)}
        onMouseLeave={() => (isOver = false)}
      >
        Circle블록
      </div>
    </div>
  );
};

export default newCircle;
