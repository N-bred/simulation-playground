export type GameOfLifeOptions = {
  width: number;
  height: number;
  col_number: number;
};

const WIDTH = 400;
const HEIGHT = 240;
const RECT_SIZE = $state(20);
const BACKGROUND_COLOR = "#000";
const COL_NUMBER = Math.floor(WIDTH / RECT_SIZE);
const ACTIVE_COLOR = $state("#ffffff");
const INACTIVE_COLOR = $state("#FF0000");
const MAX_BOARD_SIZE = Math.floor(WIDTH / RECT_SIZE) * Math.floor(HEIGHT / RECT_SIZE);

export default {
  WIDTH,
  HEIGHT,
  RECT_SIZE,
  ACTIVE_COLOR,
  INACTIVE_COLOR,
  COL_NUMBER,
  MAX_BOARD_SIZE,
  BACKGROUND_COLOR
};
