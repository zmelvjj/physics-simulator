export let mousePos:{x:number,y:number} = {x:0,y:0};

const SetMousePos = (Pos:any)=>{
    mousePos.x = Pos.clientX;
    mousePos.y = Pos.clientY;
}

window.addEventListener("mousedown", (Pos) => SetMousePos(Pos))
window.addEventListener("mousemove", (Pos) => SetMousePos(Pos))
window.addEventListener("mouseup", (Pos) => SetMousePos(Pos))