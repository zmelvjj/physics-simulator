import React, { useEffect, useRef, RefObject } from "react";
import { selectObject, objectState, undateObjectState } from "./selectOrMove";
import "./style.css";
import Matter from "matter-js";
import interact from "interactjs";
import { mousePos } from "./addState/mousePos";

export let isResizeing: Boolean = false; //외부기능 정지용
let ResizeingObject: RefObject<HTMLDivElement>;

window.addEventListener("mouseup", () => {
  undateObjectState();
  ResizeingObjectWorkPos();
});

export const selectResizeingObject = ()=>{
    if (!selectObject && ResizeingObject.current) {
        ResizeingObject.current.style.display = "none"
        ResizeingObject.current.style.width = 0 + "px";
        ResizeingObject.current.style.height = 0 + "px";
      }
}
window.addEventListener("mousedown", () => {setTimeout(selectResizeingObject,50)});

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

let undoPos:{x:number, y:number} = {x:0,y:0}
let translateOffsetPos:{top:number,left:number} = {top:0,left:0}
const Resize: React.FC = () => {
  ResizeingObject = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // rerenber됨은 selectObject값이 변경됨

    interact(".resizable")
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
          move(event) {
            // const target = event.target;
            // const rect = event.rect;
            // const deltaRect = event.deltaRect;
            // const offset = {x:mousePos.x-parseFloat(target.style.left), y:mousePos.y-parseFloat(target.style.top)}

            // // left, top 방향 조절
            // let x = parseFloat(target.getAttribute('data-x')) || 0;
            // let y = parseFloat(target.getAttribute('data-y')) || 0;
            

            // if (!x || !y){
            //     x = target.style.left
            //     y = target.style.top
            //     console.log(offset)
            //     target.setAttribute("data-x", x.toString());
            //     target.setAttribute("data-y", y.toString());
                
            // }

            

            // // 크기 조절
            // target.style.width = `${rect.width}px`;
            // target.style.height = `${rect.height}px`;

            // // dataset 업데이트
            // target.setAttribute('data-x', x + deltaRect.left);
            // target.setAttribute('data-y', y + deltaRect.top);

            // target.style.left = `${x + deltaRect.left}px`;
            // target.style.top = `${y + deltaRect.top}px`;

            // translateOffsetPos = {
            //     top: edge.top !== 0 ? offsetPos.y : 0,
            //     left: edge.left !== 0 ? offsetPos.x : 0
            // };
            

            // if (translateOffsetPos.left !== 0 || translateOffsetPos.top !== 0){
            //     console.log(translateOffsetPos)
            //     event.target.style.transfrom = `translate(${translateOffsetPos.top*2}px, ${translateOffsetPos.left*2}px)`
            // }

            if (selectObject && ResizeingObject.current){
                const rorect = ResizeingObject.current.getBoundingClientRect()
                Matter.Body.setPosition(selectObject, {
                    x:rorect.left+rorect.width/2,
                    y:rorect.top+rorect.height/2
                })
            }
            
            undoPos = {x:mousePos.x,y:mousePos.y}
          },    
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
        const target = event.target;
        const { width, height } = event.rect;
        // Update element size
        target.style.width = `${width}px`;
        target.style.height = `${height}px`;

        // Update Matter.js body
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
        move(event) {
          const target = event.target;
          const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
          const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

          // Translate the element
          target.style.transform = `translate(${x}px, ${y}px) rotate(${target.getAttribute("data-angle")}deg)`;

          // Update the position attributes

          // Update Matter.js body position
          if (selectObject) {
            Matter.Body.setPosition(selectObject, {
              x: selectObject.position.x + event.dx,
              y: selectObject.position.y + event.dy,
            });
          }
        },
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

// let UpdateUI : () => void;
// let newUI:ReactElement | null;
// let elementRef:any;

// export let isResizeing:Boolean = false; //외부기능 정지용

// let offset:{x:number,y:number}
// let selectHitbox:{hitBloxPos:{x:number,y:number},direction:string,undoOffset:number,el:HTMLDivElement}|null=null

// window.addEventListener("mouseup", ()=>{
//     if (selectObject) {
//         Reranders()
//         selectHitbox = null
//         isResizeing = false
//     }
// })

// const setSelectHitbox = (direction:string,undoOffset:number) => (event:React.MouseEvent<HTMLDivElement,MouseEvent>)=>{
//     isResizeing = true
//     const rect = event.currentTarget.getBoundingClientRect();
//     offset = {x:mousePos.x-rect.left,y:mousePos.y-rect.top}
//     selectHitbox = {hitBloxPos:{x:rect.left,y:rect.top},direction:direction,undoOffset:undoOffset,el:event.currentTarget}
// }
// window.addEventListener("mousemove",()=>{
//     if (selectHitbox && isDrage && selectObject && objectState){
//         if (selectHitbox.direction == "rightX" || selectHitbox.direction == "leftX") {
//             // const unX = (selectHitbox.direction == "rightX" ? elementRef.current["leftX"] : elementRef.current["rightX"]).getBoundingClientRect();

//             // // 마우스의 상대 좌표로 이동량을 계산
//             // const deltaX = mousePos.x - selectHitbox.el.getBoundingClientRect().left;

//             // // 막대의 이동량을 그대로 반영
//             // const newX = unX.left + deltaX;
//             // console.log(newX);

//             // // 기존 transform 값 가져오기
//             // const currentTransform = selectHitbox.el.style.transform;
//             // const currentTranslateMatch = currentTransform.match(/translateX\(([^)]+)px\)/);
//             // let currentTranslateX = currentTranslateMatch ? parseFloat(currentTranslateMatch[1]) : 0;

//             // // 새로운 translateX 값 계산
//             // const newTranslateX = currentTranslateX + deltaX;
//             // const newTransform = currentTransform.replace(/translateX\([^)]+\)/, `translateX(${newTranslateX}px)`) || `${currentTransform} translateX(${newTranslateX}px)`;

//             // // transform 속성 설정
//             // selectHitbox.el.style.transform = newTransform;

//             // // Matter.js 객체 위치 설정
//             // Matter.Body.setPosition(selectObject, { x: newX, y: selectObject.position.y });
//         }
//         else {
//             const undoPos = selectHitbox.hitBloxPos;
//             const redAngle = objectState.Angle*Math.PI/180

//             //delta 새로 이동할 이동량(상대좌표)
//             const deltaY = (mousePos.y-undoPos.y)*Math.cos(redAngle)
//             const deltaX = (mousePos.x-undoPos.x)*Math.sin(redAngle)

//             const newY = undoPos.y + deltaY
//             const newX = undoPos.x + deltaX

//             const currentTransform = selectHitbox.el.style.transform;

//             const delta = Math.sqrt(deltaX**2+deltaY**2)
//             selectHitbox.el.style.transform = `${currentTransform} translateX(${delta * (deltaY-deltaX <= 0 ? -1 : 1)}px)`
//             console.log(deltaY <= 0 ? -1 : 1)

//             Matter.Body.translate(selectObject,{y:deltaY/2,x:deltaX/2})

//             selectHitbox.hitBloxPos = {
//                 x:newX,
//                 y:newY
//             }
//         }
//     }
//     // if (selectHitbox && isDrage && selectObject && objectState) {
//     //     const angleRad = objectState.Angle * (Math.PI / 180);

//     //     if (selectHitbox.direction == "rightX" || selectHitbox.direction == "leftX") {
//     //         // 마우스의 상대 좌표로 이동량을 계산 (offset 반영)
//     //         const deltaX = (mousePos.x - offset.x) * Math.cos(angleRad) - (mousePos.y - offset.y) * Math.sin(angleRad);
//     //         const deltaY = (mousePos.x - offset.x) * Math.sin(angleRad) + (mousePos.y - offset.y) * Math.cos(angleRad);

//     //         // 새로운 좌표 계산
//     //         const newX = selectObject.position.x + deltaX;
//     //         const newY = selectObject.position.y + deltaY;
//     //         console.log(`New X: ${newX}, New Y: ${newY}`);

//     //         // 막대의 위치 설정
//     //         selectHitbox.el.style.left = `${newX}px`;
//     //         selectHitbox.el.style.top = `${newY}px`;

//     //         // Matter.js 객체 위치 설정
//     //         Matter.Body.setPosition(selectObject, { x: newX, y: newY });
//     //     } else {
//     //         // Y축 이동 처리 부분 (비슷한 방식으로 처리)
//     //         const deltaY = (mousePos.y - offset.y) * Math.cos(angleRad) - (mousePos.x - offset.x) * Math.sin(angleRad);
//     //         const deltaX = (mousePos.y - offset.y) * Math.sin(angleRad) + (mousePos.x - offset.x) * Math.cos(angleRad);

//     //         // 새로운 좌표 계산
//     //         const newY = selectObject.position.y + deltaY;
//     //         const newX = selectObject.position.x + deltaX;
//     //         console.log(`New X: ${newX}, New Y: ${newY}`);

//     //         // 막대의 위치 설정
//     //         selectHitbox.el.style.left = `${newX}px`;
//     //         selectHitbox.el.style.top = `${newY}px`;

//     //         // Matter.js 객체 위치 설정
//     //         Matter.Body.setPosition(selectObject, { x: newX, y: newY });
//     //     }
//     // }
// })

// //디버스 스틱
// window.addEventListener("keydown",(key)=>{
//     if (selectObject && key.code == "KeyR") {
//         Matter.Body.rotate(selectObject,45)
//     }
// })

// export const Reranders = () => {
//     if (selectObject && objectState) {
//         const commonStyle = {
//             left: selectObject.position.x,
//             top: selectObject.position.y,
//         }

//         newUI = (
//             <div>
//                 <div onMouseDown={setSelectHitbox("rightX", -objectState.width/2)} ref={(el)=>elementRef.current["rightX"] = el} id="hitbox" style={{...commonStyle,height: objectState.width+"px",transform: `translate(-50%, -50%) rotate(${objectState.Angle}deg) translateX(${objectState.width/2}px)`}} ></div>
//                 <div onMouseDown={setSelectHitbox("leftX", objectState.width/2)} ref={(el)=>elementRef.current["leftX"] = el} id="hitbox" style={{...commonStyle,height: objectState.width+"px",transform: `translate(-50%, -50%) rotate(${objectState.Angle}deg) translateX(${-objectState.width/2}px)`}}></div>
//                 <div onMouseDown={setSelectHitbox("bottomY", -objectState.height/2)} ref={(el)=>elementRef.current["bottomY"] = el} id="hitbox" style={{...commonStyle,height: objectState.height+"px",transform: `translate(-50%, -50%) rotate(${objectState.Angle+90}deg) translateX(${objectState.height/2}px)`}}></div>
//                 <div onMouseDown={setSelectHitbox("upY", objectState.height/2)}  ref={(el)=>elementRef.current["upY"] = el} id="hitbox" style={{...commonStyle,height: objectState.height+"px",transform: `translate(-50%, -50%) rotate(${objectState.Angle+90}deg) translateX(${-objectState.height/2}px)`}}></div>
//             </div>
//         );
//     } else {
//         newUI = null;
//     }
//     UpdateUI()
// };

// const ResizeObject: React.FC = () => {
//     const [UI, setUI] = useState<JSX.Element | null>(null);
//     elementRef = useRef<{[key:string]:HTMLDivElement | null}>({})

//     // 컴포넌트가 마운트된 후 Reranders 함수를 호출하여 UI를 초기화
//     useEffect(() => {
//         UpdateUI = ()=>{setUI(newUI)}
//     }, []);

//     // UI 상태가 변경될 때마다 컴포넌트가 다시 렌더링됨
//     return <>{UI}</>;
// };

// export default ResizeObject;
