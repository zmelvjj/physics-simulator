import React, { useEffect, useRef, RefObject } from "react";
import { selectObject, objectState, undateObjectState, MoveIsDrage, selectEventlistener } from "./selectOrMove";
import "./style.css";
import Matter from "matter-js";
import interact from "interactjs";
import { mousePos } from "./addState/mousePos";

export let isResizeing: Boolean = false; //외부기능 정지용
let ResizeingObject: RefObject<HTMLDivElement>;

window.addEventListener("mouseup", () => {
  undateObjectState();
  ResizeingObjectWorkPos();
  x = 0;
  y = 0;
});

export const selectResizeingObject = ()=>{
    if (!selectObject && ResizeingObject.current) {
        ResizeingObject.current.style.display = "none"
        ResizeingObject.current.style.width = 0 + "px";
        ResizeingObject.current.style.height = 0 + "px";
      }
}

setTimeout(()=>selectEventlistener.push(()=>{
  selectResizeingObject()
  ResizeingObjectWorkPos()
}),100)

//window.addEventListener("mousedown", () => {setTimeout(selectResizeingObject,50)});

let isRotate: boolean = false;
window.addEventListener("keydown", (key) => {
  if (key.code == "KeyR") {
    isRotate = !isRotate;
    ResizeingObjectWorkPos();
  }
});

window.addEventListener("mousemove", () => {
  if (isRotate && selectObject && ResizeingObject.current) {
    const rotate = Math.atan2(
      mousePos.y - selectObject.position.y,
      mousePos.x - selectObject.position.x,
    );
    Matter.Body.setAngle(selectObject, rotate);
  }
});

const ResizeingObjectWorkPos = () => {
  if (selectObject && ResizeingObject.current && objectState) {
    ResizeingObject.current.style.display = "block"
    ResizeingObject.current.style.transform = ""
    ResizeingObject.current.style.left =
      selectObject.position.x - objectState.width / 2 + "px";
    ResizeingObject.current.style.top =
      selectObject.position.y - objectState.height / 2 + "px";
    ResizeingObject.current.style.width = objectState.width + "px";
    ResizeingObject.current.style.height = objectState.height + "px";
  }
};

let x = 0, y = 0

const Resize: React.FC = () => {
  ResizeingObject = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // rerenber됨은 selectObject값이 변경됨
    interact(".resizable")
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
          move(event) {

            const target = event.target;

            target.style.width = `${event.rect.width}px`;
            target.style.height = `${event.rect.height}px`;

            x += event.deltaRect.left;
            y += event.deltaRect.top;

            target.style.transform = `translate(${x}px, ${y}px)`;



            if (selectObject && ResizeingObject.current){
                const rorect = ResizeingObject.current.getBoundingClientRect()
                Matter.Body.setPosition(selectObject, {
                    x:rorect.left+rorect.width/2,
                    y:rorect.top+rorect.height/2
                })  
            }
          },  
        },
        cursorChecker() {
          return 'default'; // 기본 커서 모양으로 설정
        },  
        modifiers: [
          interact.modifiers.restrictEdges({
            outer: "parent",
          }),
          interact.modifiers.restrictSize({
            min: { width: 25, height: 25 },
          }),
        ],
        inertia: false,
      })
      .on("resizemove", (event) => {
        const { width, height } = event.rect;

        if (selectObject) {
          Matter.Body.setVertices(selectObject, [
            {
              x: selectObject.position.x - width / 2,
              y: selectObject.position.y - height / 2,
            },
            {
              x: selectObject.position.x + width / 2,
              y: selectObject.position.y - height / 2,
            },
            {
              x: selectObject.position.x + width / 2,
              y: selectObject.position.y + height / 2,
            },
            {
              x: selectObject.position.x - width / 2,
              y: selectObject.position.y + height / 2,
            },
          ]);
        }
      });
    interact(".resizable").draggable({
      inertia: false,
      listeners: {
        start() {
          MoveIsDrage()
        },
      },
      cursorChecker() {
        return 'default'; // 기본 커서 모양으로 설정
      },
    });
  });

  return (
    <div
      className="resizable"
      style={{
        position: "absolute",
        width: "50px",
        height: "50px",
        backgroundColor: "blue",
        opacity: 0,
        cursor: "none",
      }}
      ref={ResizeingObject}
      onMouseEnter={() => (isResizeing = true)}
      onMouseLeave={() => (isResizeing = false)}
    ></div>
  );
};

export default Resize;