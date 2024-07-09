import React, { useState } from "react";
import "../style.css";
import Matter, { Body } from "matter-js";
import { setEngine, allObjectList } from "../App"
import { mousePos } from "../addState/mousePos";

interface Top {
  top: number;
}

let isState = false;
let isOver = false

window.addEventListener("mousedown",()=>{
  if (isState && !isOver) {
    const newObj = Matter.Bodies.rectangle(mousePos.x,mousePos.y,50,50,{render:{strokeStyle:"black"}});
    newObj.collisionFilter.category = 1
    Matter.World.add(setEngine.world,[newObj]);
    allObjectList.push(newObj);
  }
})

const Muon: React.FC<Top> = ({ top }) => {
  const onClick = () => {
    if (isState) isState = false;
    else isState = true
  };

  let style = {top: top + "vh"};

  return (
    <div>
      <div className="object" style={style} onMouseDown={onClick} onMouseOver={() => isOver=true} onMouseLeave={()=>isOver=false}>블록</div></div>
  );
};

export default Muon;
