import DebouncedState from "@/dataUtilities/DebouncedState.svelte";

export type GameOfLifeOptions = {
  width: number;
  height: number;
  col_number: number;
};

export const INITIAL_PROPERTIES_VALUES = {
  RECT_SIZE: {
    label: "RECT SIZE:",
    type: "range",
    id: "rect_size_input",
    value: 10,
    min: 1,
    max: 50,
    onInput: true,
  },
  HEIGHT: {
    label: "HEIGHT:",
    type: "range",
    id: "height_input",
    value: 320,
    min: 1,
    max: 2000,
    onInput: true,
  },
  WIDTH: {
    label: "WIDTH:",
    type: "range",
    id: "width_input",
    value: 600,
    min: 1,
    max: 2000,
    onInput: true,
  },
};

const PROPERTIES = $state({
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

export const INITIAL_THEMES_VALUES = {
  default: {
    name: "Default",
    value: "default",
  },
  apocaliptic: {
    name: "Apocaliptic",
    value: "apocaliptic",
  },
};

export type THEME_INDEX = keyof typeof INITIAL_THEMES_VALUES;

const SELECTED_THEME: { value: THEME_INDEX } = $state({ value: INITIAL_THEMES_VALUES.default.value as THEME_INDEX });

const FPS = $state({
  label: "FPS:",
  type: "range",
  id: "fps_input",
  value: 5,
  min: 1,
  max: 120,
});

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
  FPS,
  SELECTED_THEME,
  COMPUTED: () => COMPUTED,
};
