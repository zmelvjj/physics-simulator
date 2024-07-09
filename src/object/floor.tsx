import React, { useRef } from "react";
import { setEngine } from "../App";
import Matter from "matter-js";
import "../style.css";
import SetSelectObj from "../selectOrMove";
import { mousePos } from "../addState/mousePos";
import { allObjectList } from "../App";

interface prop {
    top:number
}
let newTarget:Matter.Body

const Floor:React.FC<prop> = ({top})=>{
    //let targetObject = useRef<null | Matter.Body>(null).current;

    const MouseDown = ()=>{
        newTarget = Matter.Bodies.rectangle(mousePos.x,mousePos.y,50,50,{ isSleeping:true, render:{ fillStyle:"gray", strokeStyle:"black" } });
        newTarget.render.opacity = 1;
        allObjectList.push(newTarget)
        Matter.World.add(setEngine.world,newTarget);
        SetSelectObj(newTarget)
    }
    // window.addEventListener("mousemove", ()=>{
    //     if (targetObject){
    //        Matter.Body.setPosition(targetObject,{x:mousePos.x,y:mousePos.y});
    //     }
    // })
    
    // window.addEventListener("mouseup", ()=>{
    //     if (targetObject){
    //         targetObject = null;
    //     }
    // }) 

    return(
      <div>
        <div className="object" style={{top:top+'vh'}} onMouseDown={MouseDown}>바닥</div>
      </div>
    )
}

export default Floor;