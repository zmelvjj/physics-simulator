import React, { useRef, useState } from "react";
import img from "./setting.png";
import "../style.css";
import { setEngine } from "../App";

export let inertial: {
  friction: number;
  frictionAir: number;
  frictionStatic: number;
} = {
  friction: 0,
  frictionAir: 0,
  frictionStatic: 0,
};

export let restitution: number = 0;
export let gravity:number = 0;
const settingHeight = 40

const setInertial = (
  friction: number,
  frictionAir: number,
  frictionStatic: number,
) => {
  inertial = {
    friction,
    frictionAir,
    frictionStatic,
  };
};

const Setting = () => {
  const [isSetting, setIsSetting] = useState(false);
  const [friction, setFriction] = useState(inertial.friction);
  const [frictionAir, setFrictionAir] = useState(inertial.frictionAir);
  const [frictionStatic, setFrictionStatic] = useState(inertial.frictionStatic);
  const [restitutions, setRestitution] = useState(restitution);
  const [gravitys, setGravity] = useState(gravity);

  const SettingScreenRef = useRef<HTMLDivElement>(null);

  const onClick = () => {
    console.log("354345");
    setIsSetting((prevIsSetting) => !prevIsSetting);
    console.log("354345");
    setIsSetting((prevIsSetting) => !prevIsSetting);
    if (SettingScreenRef.current) {
      SettingScreenRef.current.style.display = isSetting ? "none" : "block";
      SettingScreenRef.current.style.display = isSetting ? "none" : "block";
    }
  };

  const applySettings = () => {
    setInertial(friction, frictionAir, frictionStatic);
    restitution = restitutions;
    gravity = gravitys

    setEngine.world.bodies.forEach(el=>{
      el.friction = inertial.friction
      el.frictionAir = inertial.frictionAir
      el.frictionStatic = inertial.frictionStatic
      el.restitution = restitution
    })
    setEngine.gravity.y = gravity
    // 추가적인 설정 적용 로직...
  };

  const Interface = (setF: any, top:number, value:number, text:string) => {
    return <label
      style={{
        position: "absolute",
        top: top+"vh",
        left: "4vh",
        color: "white",
      }}
    >
      {text}:
      <input
        type="number"
        value={value}
        onChange={(e) => setF(Number(e.target.value))}
        style={{ borderRadius: "1vh", height: "2vh" }}
      />
    </label>
  };

  return (
    <div>
      <div
        ref={SettingScreenRef}
        style={{
          display: "none",
          position: "absolute",
          background: "gray",
          left: "168vh",
          top: `${97-settingHeight}vh`,
          width: "30vh",
          height: `${settingHeight}vh`,
          opacity: "0.4",
          transition: "opacity 0.5s",
          borderRadius: "2vh",
          border: "thick double black",
        }}>
        <div style={{ position: "absolute", borderRadius: "1vh" }}>
          <div>
            {Interface(setFriction, 1, friction, "마찰력")}
            {Interface(setFrictionAir, 6, frictionAir, "공기저항")}
            {Interface(setFrictionStatic, 11, frictionStatic, "정지마찰")}
            {Interface(setRestitution, 16, restitutions, "탄성력")}
            {Interface(setGravity, 21, gravitys, "중력")}

            <div
              onMouseDown={applySettings}
              style={{
                borderRadius: "2vh",
                position: "absolute",
                left: "3vh",
                top: `${settingHeight-4}vh`,
                width: "20vh",
                height: "2vh",
                backgroundColor: "black",
                color: "white",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
              }}
            >
              저장
            </div>
          </div>
        </div>
      </div>
      <img onMouseDown={onClick} src={img} id="img" />
    </div>
  );
};

export default Setting;

