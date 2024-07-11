import Matter from "matter-js";
import { setEngine } from "./App";

export let isRunningSimulator: Boolean = false;
window.addEventListener("keydown", (key) => {
  if (key.code == "Space" && setEngine.world.bodies && !isRunningSimulator) {
    console.log("StartRunuing!!");
    isRunningSimulator = true;
    setEngine.world.bodies.forEach((object) => {
      if (object.label == "workBox") {
        Matter.Sleeping.set(object, false);
      }
    });
  } else if (key.code == "Escape" && isRunningSimulator) {
    console.log("StopRunning!!");
    isRunningSimulator = false;
    if (setEngine.world.bodies) {
      setEngine.world.bodies.forEach((object) => {
        if (object.label == "workBox") {
          Matter.Sleeping.set(object, true);
        }
      });
    }
  }
});


