import React, { useRef } from "react";
import { setEngine } from "../App";
import Matter from "matter-js";
import "../style.css";

interface prop {
    top:number
}

const Floor:React.FC<prop> = ({top})=>{
    let targetObject = useRef<null | Matter.Body>(null).current;

    const MouseDown = (pos:any)=>{
        const newTarget = Matter.Bodies.rectangle(pos.clientX,pos.clientY,50,50,{ isStatic:true })
        Matter.World.add(setEngine.world,newTarget)
        targetObject = newTarget;
        console.log("aaa")
    }

    window.addEventListener("mousemove", (pos)=>{
        if (targetObject){
           Matter.Body.setPosition(targetObject,{x:pos.clientX,y:pos.clientY})
        }
    })
    
    window.addEventListener("mouseup", ()=>{
        if (targetObject){
            targetObject = null;
            console.log(targetObject)
        }
    })

    return(
      <div>
        <div className="object" style={{top:top+'vh'}} onMouseDown={MouseDown}>바닥</div>
      </div>
    )
}

export default Floor;