export let isDrage:boolean = false;

window.addEventListener("mousedown",()=>isDrage = true);
window.addEventListener("mouseup",()=>isDrage = false);