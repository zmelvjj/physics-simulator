import Matter from "matter-js";
import React from "react";
import { mousePos } from "./addState/mousePos";

let MoveSelectObj:Matter.Body | null

export let selectObject:Matter.Body | null = null
export let objectState:{Angle:number,width:number,height:number} | null;
let mouseOffset:{x:number,y:number};

let selectMoveIs = false
let corruten

const onClick = ()=>{
    selectMoveIs=true;
    if (MoveSelectObj) mouseOffset = {
        x:mousePos.x-MoveSelectObj.position.x,
        y:mousePos.y-MoveSelectObj.position.y
    }
    corruten = window.setInterval(()=>{
        isDrage()
    },100)
};

const isDrage = () => {
    if (MoveSelectObj && selectMoveIs){
        MoveSelectObj.isStatic = true;
        Matter.Body.setPosition(MoveSelectObj,{
            x:mousePos.x-mouseOffset.x,
            y:mousePos.y-mouseOffset.y});
    };
};

window.addEventListener('mouseup', () => {
    selectMoveIs=false;
    if (MoveSelectObj) {
        MoveSelectObj.isStatic = false;
        MoveSelectObj = null
    }
    
});

export const undateObjectState = ()=>{
    if (selectObject){
        console.log("vvv")
        objectState = {
            Angle: selectObject.angle*180/Math.PI,
            width: selectObject.bounds.max.x - selectObject.bounds.min.x,
            height: selectObject.bounds.max.y - selectObject.bounds.min.y
        }
    }
}

const SetSelectObj = (obj:Matter.Body | null)=>{
    if (obj !== selectObject && obj || !obj) {
        if (selectObject) selectObject.render.lineWidth = 0;
        if (obj) obj.render.lineWidth = 10;
        selectObject = obj;
    }

    MoveSelectObj = obj;
    undateObjectState()
    onClick()
}

export default SetSelectObj;