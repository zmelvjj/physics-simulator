import React, { useRef, useState } from "react";
import img from "./setting.png";
import "../style.css";

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

export const setInertial = (
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
  const SettingScreenRef = useRef<HTMLDivElement>(null);

  const onClick = () => {
    console.log("354345");
    setIsSetting((prevIsSetting) => !prevIsSetting);
    if (SettingScreenRef.current) {
      SettingScreenRef.current.style.display = isSetting ? "none" : "block";
    }
  };

  const applySettings = () => {
    setInertial(friction, frictionAir, frictionStatic);
    restitution = restitutions;
    // 추가적인 설정 적용 로직...
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
          top: "70vh",
          width: "30vh",
          height: "27vh",
          opacity: "0.4",
          transition: "opacity 0.5s",
          borderRadius: "2vh",
          border: "thick double black",
        }}
      >
        <div style={{ position: "absolute", borderRadius: "1vh" }}>
          <div>
            <label
              style={{
                position: "absolute",
                top: "1vh",
                left: "4vh",
                color: "white",
              }}
            >
              마찰력:
              <input
                type="number"
                value={friction}
                onChange={(e) => setFriction(Number(e.target.value))}
                style={{ borderRadius: "1vh", height: "2vh" }}
              />
            </label>
            <label
              style={{
                position: "absolute",
                top: "6vh",
                left: "4vh",
                color: "white",
              }}
            >
              공기저항:
              <input
                type="number"
                value={frictionAir}
                onChange={(e) => setFrictionAir(Number(e.target.value))}
                style={{ borderRadius: "1vh", height: "2vh" }}
              />
            </label>
            <label
              style={{
                position: "absolute",
                top: "11vh",
                left: "4vh",
                color: "white",
              }}
            >
              정지마찰:
              <input
                type="number"
                value={frictionStatic}
                onChange={(e) => setFrictionStatic(Number(e.target.value))}
                style={{ borderRadius: "1vh", height: "2vh" }}
              />
            </label>
            <label
              style={{
                position: "absolute",
                top: "16vh",
                left: "4vh",
                color: "white",
              }}
            >
              탄성력:
              <input
                type="number"
                value={restitutions}
                onChange={(e) => setRestitution(Number(e.target.value))}
                style={{ borderRadius: "1vh", height: "2vh" }}
              />
            </label>
            <div
              onMouseDown={applySettings}
              style={{
                borderRadius: "2vh",
                position: "absolute",
                left: "3vh",
                top: "23vh",
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
