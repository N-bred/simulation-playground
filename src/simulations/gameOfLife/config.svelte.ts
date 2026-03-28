import DebouncedState from "@/dataUtilities/DebouncedState.svelte";

export type GameOfLifeOptions = {
  width: number;
  height: number;
  col_number: number;
};

export const INITIAL_PROPERTIES_VALUES = {
  FPS: {
    label: "FPS:",
    type: "number",
    id: "fps_input",
    value: 5,
    min: 1,
    max: 120,
    onInput: false,
    onChange: true,
    onBlur: true,
    onKeyDown: true,
  },
  RECT_SIZE: {
    label: "RECT SIZE:",
    type: "number",
    id: "rect_size_input",
    value: 10,
    min: 1,
    max: 50,
    onChange: true,
    onBlur: true,
    onKeyDown: true,
    onInput: true,
  },
  HEIGHT: {
    label: "HEIGHT:",
    type: "number",
    id: "height_input",
    value: 320,
    min: 1,
    max: 2000,
    onChange: true,
    onBlur: true,
    onKeyDown: true,
    onInput: true,
  },
  WIDTH: {
    label: "WIDTH:",
    type: "number",
    id: "width_input",
    value: 600,
    min: 1,
    max: 2000,
    onChange: true,
    onBlur: true,
    onKeyDown: true,
    onInput: true,
  },
};

const PROPERTIES = $state({
  FPS: { value: INITIAL_PROPERTIES_VALUES.FPS.value },
  RECT_SIZE: new DebouncedState(INITIAL_PROPERTIES_VALUES.RECT_SIZE.value, {
    debounce: 500,
  }),
  HEIGHT: new DebouncedState(INITIAL_PROPERTIES_VALUES.HEIGHT.value, {
    debounce: 500,
  }),
  WIDTH: new DebouncedState(INITIAL_PROPERTIES_VALUES.WIDTH.value, {
    debounce: 500,
  }),
});

export type PROPERTIES_INDEX = keyof typeof PROPERTIES;

export const INITIAL_GRAPHICS_VALUES = {
  ACTIVE_COLOR: {
    label: "COLOR 1:",
    type: "color",
    id: "active_color_input",
    value: "#ffffff",
  },
  BACKGROUND_COLOR: {
    label: "COLOR 2:",
    type: "color",
    id: "active_color_input",
    value: "#000",
  },
};

const GRAPHICS = $state({
  ACTIVE_COLOR: INITIAL_GRAPHICS_VALUES.ACTIVE_COLOR,
  BACKGROUND_COLOR: INITIAL_GRAPHICS_VALUES.BACKGROUND_COLOR,
});

export type GRAPHICS_INDEX = keyof typeof GRAPHICS;

const STATE = $state({
  PAUSED: true,
});

const COMPUTED = $derived({
  COL_NUMBER: Math.floor(PROPERTIES.WIDTH.debounced / PROPERTIES.RECT_SIZE.value),
  ROW_NUMBER: Math.floor(PROPERTIES.HEIGHT.debounced / PROPERTIES.RECT_SIZE.value),
  MAX_BOARD_SIZE:
    Math.floor(PROPERTIES.WIDTH.debounced / PROPERTIES.RECT_SIZE.value) * Math.floor(PROPERTIES.HEIGHT.debounced / PROPERTIES.RECT_SIZE.value),
});

export default {
  PROPERTIES,
  GRAPHICS,
  STATE,
  COMPUTED: () => COMPUTED,
};
