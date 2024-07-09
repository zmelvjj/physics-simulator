import Matter from "matter-js";
import React from "react";
import { mousePos } from "./addState/mousePos";
import ResizeObject, { Reranders } from "./ObjectResizeEvent";

let MoveSelectObj:Matter.Body | null

export let selectObject:Matter.Body | null = null
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

const SetSelectObj = (obj:Matter.Body | null)=>{
    if (obj !== selectObject && obj || !obj) {
        if (selectObject) selectObject.render.lineWidth = 0;
        if (obj) obj.render.lineWidth = 5;
        selectObject = obj;
    }
    MoveSelectObj = obj;
    onClick()
    Reranders()
}

export default SetSelectObj;