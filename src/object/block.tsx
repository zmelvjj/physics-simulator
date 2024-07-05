import React, { useState } from "react";
import "../style.css";
import Matter, { Body } from "matter-js";
import { setEngine } from "../App"

interface Top {
  top: number;
}

let isState = false;

window.addEventListener("mousedown",(pos)=>{
  if (isState) {
    const newObj = Matter.Bodies.rectangle(pos.clientX,pos.clientY,50,50)
    Matter.World.add(setEngine.world,newObj);
  }
})

const Muon: React.FC<Top> = ({ top }) => {
  const onClick = () => {
    console.log("a")
    if (!isState) isState = true;
    else isState = false
  };

  let style = {top: top + "vh"};

  return (
    <div>
      <div className="object" style={style} onClick={onClick}>블록</div></div>
  );
};

export default Muon;
