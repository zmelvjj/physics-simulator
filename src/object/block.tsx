import React, { useState } from "react";
import "../style.css";
import Matter, { Body } from "matter-js";
import { setEngine } from "../App";
import { mousePos } from "../addState/mousePos";
import { isRunningSimulator } from "../run-simulator";
import { isDrage } from "../addState/mouseState";
import { inertial } from "../addState/CreatedObjectStyle";

interface Top {
  top: number;
}

let isState = false;
let isOver = false;

window.addEventListener("mousedown", () => {
  if (isState && !isOver) {
    PartyMode = false;
    const newObj = Matter.Bodies.rectangle(mousePos.x, mousePos.y, 50, 50, {
      render: { strokeStyle: "black" },
      isSleeping: isRunningSimulator ? false : true,
      label: "workBox",
      friction: inertial.friction,
      frictionAir: inertial.frictionAir,
      frictionStatic: inertial.frictionStatic,
    });
    Matter.World.add(setEngine.world, [newObj]);
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
    setEngine.world.bodies.forEach((object) => {
      if (object.label == "PartyBox") {
        Matter.World.remove(setEngine.world, object);
      }
    });
  }
});

const root = () => {
  if (isDrage) {
    const newObj = Matter.Bodies.rectangle(
      mousePos.x,
      mousePos.y,
      Math.floor(Math.random() * 50)+25,
      Math.floor(Math.random() * 50)+25,
      {
        label: "PartyBox",
      },
    );
    Matter.World.add(setEngine.world, [newObj]);
    setTimeout(root, 50);
  }
};

const Block: React.FC<Top> = ({ top }) => {
  const onClick = () => {
    if (isState) isState = false;
    else isState = true;
  };

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
        rectangle블록
      </div>
    </div>
  );
};

export default Block;
