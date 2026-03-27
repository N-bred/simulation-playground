import SearchState from "@/dataUtilities/SearchState.svelte";

export type GameOfLifeOptions = {
  width: number;
  height: number;
  col_number: number;
};

const PROPERTIES = $state({
  FPS: new SearchState(5, {
    clamp: true,
    min: 1,
    max: 60,
  }),
  RECT_SIZE: new SearchState(10, {
    clamp: true,
    min: 1,
    max: 50,
  }),
  HEIGHT: new SearchState(400, {
    clamp: true,
    min: 1,
    max: 50,
  }),
  WIDTH: new SearchState(600, {
    clamp: true,
    min: 1,
    max: 50,
  }),
});

const GRAPHICS = $state({
  ACTIVE_COLOR: "#ffffff",
  BACKGROUND_COLOR: "#000000",
});

const STATE = $state({
  PAUSED: true,
});

const COMPUTED = {
  COL_NUMBER: Math.floor(PROPERTIES.WIDTH.value / PROPERTIES.RECT_SIZE.value),
  ROW_NUMBER: Math.floor(PROPERTIES.HEIGHT.value / PROPERTIES.RECT_SIZE.value),
  MAX_BOARD_SIZE: Math.floor(PROPERTIES.WIDTH.value / PROPERTIES.RECT_SIZE.value) * Math.floor(PROPERTIES.HEIGHT.value / PROPERTIES.RECT_SIZE.value),
};

export default {
  PROPERTIES,
  GRAPHICS,
  STATE,
  COMPUTED,
};
