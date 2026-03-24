export type GameOfLifeOptions = {
  width: number;
  height: number;
  col_number: number;
};

const WIDTH = 200;
const HEIGHT = 100;
const RECT_SIZE = $state(10);
const BACKGROUND_COLOR = "#000";
const COL_NUMBER = Math.floor(WIDTH / RECT_SIZE);
const ROW_NUMBER = Math.floor(HEIGHT / RECT_SIZE);
const ACTIVE_COLOR = $state("#ffffff");
const MAX_BOARD_SIZE = Math.floor(WIDTH / RECT_SIZE) * Math.floor(HEIGHT / RECT_SIZE);

export default {
  WIDTH,
  HEIGHT,
  RECT_SIZE,
  ACTIVE_COLOR,
  COL_NUMBER,
  ROW_NUMBER,
  MAX_BOARD_SIZE,
  BACKGROUND_COLOR
};
