import Matter, { World } from "matter-js";
import React from "react";
import { mousePos } from "./addState/mousePos";
import { setEngine } from "./App";
import { selectResizeingObject } from "./ObjectResizeEvent";

let MoveSelectObj: Matter.Body | null;

export let selectObject: Matter.Body | null = null;
export let objectState: { Angle: number; width: number; height: number } | null;
export let selectEventlistener:Function[] = [];
let mouseOffset: { x: number; y: number };

let selectMoveIs = false;
let corruten:any;

export const MoveIsDrage = () => {
  selectMoveIs = true;
  if (selectObject){
    mouseOffset = {
      x: mousePos.x - selectObject.position.x,
      y: mousePos.y - selectObject.position.y,
    };
    corruten = window.setInterval(() => {
      isDrage();
    }, 10);
  }
};

const isDrage = () => {
  if (selectObject && selectMoveIs) {

    selectObject.isStatic = true;
    Matter.Body.setPosition(selectObject, {
      x: mousePos.x - mouseOffset.x,
      y: mousePos.y - mouseOffset.y,
    });
  }
};

window.addEventListener("mouseup", () => {
  clearInterval(corruten)
  if (MoveSelectObj) {
    MoveSelectObj.isStatic = false;
    MoveSelectObj = null;
  }
});

export const undateObjectState = () => {
  if (selectObject) {
    objectState = {
      Angle: (selectObject.angle * 180) / Math.PI,
      width: selectObject.bounds.max.x - selectObject.bounds.min.x,
      height: selectObject.bounds.max.y - selectObject.bounds.min.y,
    };
  }
};

window.addEventListener("keydown", (key) => {
  if (key.code == "KeyD" && selectObject) {
    World.remove(setEngine.world, selectObject);
    selectObject = null

    selectResizeingObject()
  }
});

const SetSelectObj = (obj: Matter.Body | null) => {
  if ((obj !== selectObject && obj) || !obj) {
    if (selectObject) selectObject.render.lineWidth = 0;
    if (obj) obj.render.lineWidth = 10;
    selectObject = obj;
  }

  selectEventlistener.forEach(f=>f())

  clearInterval(corruten)
  MoveSelectObj = obj;
  undateObjectState();
  MoveIsDrage();
};

export default SetSelectObj;
