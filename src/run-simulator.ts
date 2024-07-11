import { allObjectList } from "./App";
import Matter from "matter-js";

export let isRunningSimulator: Boolean = false;
window.addEventListener("keydown", (key) => {
  if (key.code == "Space" && allObjectList && !isRunningSimulator) {
    console.log("StartRunuing!!");
    isRunningSimulator = true;
    allObjectList.forEach((object) => {
      if (object.label == "workBox") {
        Matter.Sleeping.set(object, false);
      }
    });
  } else if (key.code == "Escape" && isRunningSimulator) {
    console.log("StopRunning!!");
    isRunningSimulator = false;
    if (allObjectList) {
      allObjectList.forEach((object) => {
        if (object.label == "workBox") {
          Matter.Sleeping.set(object, true);
        }
      });
    }
  }
});
