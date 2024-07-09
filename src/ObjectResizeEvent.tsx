import React, { useState, useEffect, ReactElement, useRef } from "react";
import { selectObject, objectState } from "./selectOrMove";
import "./style.css";
import { mousePos } from "./addState/mousePos";
import { isDrage } from "./addState/mouseState";
import Matter from "matter-js";

let UpdateUI : () => void;
let newUI:ReactElement | null;
let elementRef:any;

export let isResizeing:Boolean = false; //외부기능 정지용

let offset:{x:number,y:number}
let selectHitbox:{direction:string,undoOffset:number,el:HTMLDivElement}|null=null

window.addEventListener("mouseup", ()=>{
    if (selectObject) {
        Reranders()
        selectHitbox = null
        isResizeing = false
    }
})

const setSelectHitbox = (direction:string,undoOffset:number) => (event:React.MouseEvent<HTMLDivElement,MouseEvent>)=>{
    selectHitbox = {direction:direction,undoOffset:undoOffset,el:event.currentTarget}
    isResizeing = true
    const rect = selectHitbox.el.getBoundingClientRect();
    offset = {x:mousePos.x-rect.left,y:mousePos.y-rect.top}
}

window.addEventListener("mousemove",()=>{
    if (selectHitbox && isDrage && selectObject && objectState){
        if (selectHitbox.direction == "rightX" || selectHitbox.direction == "leftX") {
            const translateXPos = selectHitbox.undoOffset + mousePos.x;
            const unX = (selectHitbox.direction == "rightX" ? elementRef.current["leftX"] : elementRef.current["rightX"]).getBoundingClientRect()
            const newX = unX.left + (mousePos.x - unX.left)/2;
            console.log(newX)
            selectHitbox.el.style.transform = `translateX(${newX*2}px)` // translate형식으로 변경 현제(newX) 고정좌표
            
            Matter.Body.setPosition(selectObject,{x:newX,y:selectObject.position.y})
            
        } 
        else {
            const translateYPos = mousePos.y+selectHitbox.undoOffset
            selectHitbox.el.style.top = translateYPos + 'px';

            const unY = (selectHitbox.direction == "bottomY" ? elementRef.current["upY"] : elementRef.current["bottomY"]).getBoundingClientRect()

            const newY = unY.top + (mousePos.y - unY.top)/2;
            Matter.Body.setPosition(selectObject,{x:selectObject.position.x,y:newY})
        }
    }
})

export const Reranders = () => {
    if (selectObject && objectState) {
        const commonStyle = {
            left: selectObject.position.x,
            top: selectObject.position.y,
        }

        newUI = (
            <div>
                <div onMouseDown={setSelectHitbox("rightX", -objectState.width/2)} ref={(el)=>elementRef.current["rightX"] = el} id="hitbox" style={{...commonStyle,height: objectState.width+"px",transform: `translate(-50%, -50%) rotate(${objectState.Angle}deg) translateX(${objectState.width/2}px)`}} ></div>
                <div onMouseDown={setSelectHitbox("leftX", objectState.width/2)} ref={(el)=>elementRef.current["leftX"] = el} id="hitbox" style={{...commonStyle,height: objectState.width+"px",transform: `translate(-50%, -50%) rotate(${objectState.Angle}deg) translateX(${-objectState.width/2}px)`}}></div>
                <div onMouseDown={setSelectHitbox("bottomY", -objectState.height/2)} ref={(el)=>elementRef.current["bottomY"] = el} id="hitbox" style={{...commonStyle,height: objectState.height+"px",transform: `translate(-50%, -50%) rotate(${objectState.Angle+90}deg) translateX(${objectState.height/2}px)`}}></div>
                <div onMouseDown={setSelectHitbox("upY", objectState.height/2)}  ref={(el)=>elementRef.current["upY"] = el} id="hitbox" style={{...commonStyle,height: objectState.height+"px",transform: `translate(-50%, -50%) rotate(${objectState.Angle+90}deg) translateX(${-objectState.height/2}px)`}}></div>
            </div>
        );
    } else {
        newUI = null;
    }
    UpdateUI()
};

const ResizeObject: React.FC = () => {
    const [UI, setUI] = useState<JSX.Element | null>(null);
    elementRef = useRef<{[key:string]:HTMLDivElement | null}>({})

    // 컴포넌트가 마운트된 후 Reranders 함수를 호출하여 UI를 초기화
    useEffect(() => {
        UpdateUI = ()=>{setUI(newUI)}
    }, []);

    // UI 상태가 변경될 때마다 컴포넌트가 다시 렌더링됨
    return <>{UI}</>;
};

export default ResizeObject;