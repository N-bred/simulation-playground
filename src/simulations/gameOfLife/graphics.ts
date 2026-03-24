import type { Api } from "@/canvasApi2";
import CONFIG from "./config.svelte";
import { current_state, getNextState } from "./data.svelte";

export const updateGraphicsLoop = (api: Api) => {
  const { background, rect } = api;

  background(CONFIG.WIDTH, CONFIG.HEIGHT, CONFIG.BACKGROUND_COLOR);

  for (let i = 0; i < current_state.length; ++i) {
    const x = i % CONFIG.COL_NUMBER;
    const y = Math.floor(i / CONFIG.COL_NUMBER);
    const isActive = current_state[i] === 1;
    rect(x, y, CONFIG.RECT_SIZE, CONFIG.RECT_SIZE, isActive ? CONFIG.ACTIVE_COLOR : CONFIG.INACTIVE_COLOR);
  }

  getNextState();
};
