import React, { useState } from "react";
import Block from "./object/block"
import Floor from "./object/floor";
import Circle from "./object/circle"
import "./style.css";

const Workspace: React.FC = () => {
    const [blockClickState, setBlockClickState] = useState(false);
    const [blockStyle, setBlockStyle] = useState({ left: '-20vh' });

    const onClick = () => {
        if (blockClickState) {
            setBlockClickState(false);
            setBlockStyle({ left: '-20vh' });
        } else {
            setBlockClickState(true);
            setBlockStyle({ left: '0vh' });
        }
    };

    return (
        <div className="block" style={blockStyle}>
            <div className="door" onClick={onClick}></div>
            <>
                <Block top={5}/>
                <Floor top={10}/>
                <Circle top={15}/>
            </>
        </div>
    );
};

export default Workspace;