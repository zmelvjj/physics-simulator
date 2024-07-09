import React, { useState, useEffect, ReactElement, useRef } from "react";
import { selectObject } from "./selectOrMove";
import "./style.css";
import { mousePos } from "./addState/mousePos";
import { isDrage } from "./addState/mouseState";

let UpdateUI : () => void;
let newUI:ReactElement | null;
let elementRef:any;

export let isResizeing:Boolean = false; //외부기능 정지용

window.addEventListener("mouseup", ()=>{
    if (selectObject) {
        Reranders()
    }
})

const ResizeMouseMove = (direction:string) => (event:React.MouseEvent<HTMLDivElement,MouseEvent>)=>{
    if (isResizeing && isDrage){
        const el = event.currentTarget;
        const rect = el.getBoundingClientRect();
        const offset:{x:number,y:number} = {x:mousePos.x-rect.left,y:mousePos.y-rect.top}

        console.log(rect.left)

        if (direction == "rightX" || direction == "leftX") el.style.transform = `translateX(${event.clientX}px)`
        //else el.style.top = mousePos.y-offset.y + 'px'
    }
}

export const Reranders = () => {
    if (selectObject) {
        const commonStyle = {
            left: selectObject.position.x,
            top: selectObject.position.y
        }

        const objectAngle = selectObject.angle*180/Math.PI;
        newUI = (
            <div onMouseEnter={()=>isResizeing = true} onMouseLeave={()=>isResizeing = false}>
                <div onMouseMove={ResizeMouseMove("rightX")} ref={(el)=>elementRef.current["rightX"] = el} id="hitbox" style={{...commonStyle,transform: `translate(-50%, -50%) rotate(${objectAngle}deg) translateX(25px)`}} ></div>
                <div onMouseMove={ResizeMouseMove("leftX")} ref={(el)=>elementRef.current["leftX"] = el} id="hitbox" style={{...commonStyle,transform: `translate(-50%, -50%) rotate(${objectAngle}deg) translateX(-25px)`}}></div>
                <div onMouseMove={ResizeMouseMove("bottomY")} ref={(el)=>elementRef.current["bottomY"] = el} id="hitbox" style={{...commonStyle,transform: `translate(-50%, -50%) rotate(${objectAngle+90}deg) translateX(25px)`}}></div>
                <div onMouseMove={ResizeMouseMove("upY")}  ref={(el)=>elementRef.current["upY"] = el} id="hitbox" style={{...commonStyle,transform: `translate(-50%, -50%) rotate(${objectAngle+90}deg) translateX(-25px)`}}></div>
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