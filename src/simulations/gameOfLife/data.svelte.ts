import CONFIG from "./config.svelte";

const BASE_ARRAY = new Array(CONFIG.MAX_BOARD_SIZE).fill(0);
export let current_state: number[] = $state([...BASE_ARRAY]);
export let old_state: number[] = $state([...BASE_ARRAY]);

function getNumberOfActiveCells(index: number, state: number[]) {
  let has_top = true;
  let has_right = true;
  let has_bottom = true;
  let has_left = true;
  let has_top_left = true;
  let has_top_right = true;
  let has_bottom_left = true;
  let has_bottom_right = true;

  const y = Math.floor(index / CONFIG.COL_NUMBER);

  if (y === 0) {
    has_top = false;
    has_top_left = false;
    has_top_right = false;
  }

  if (y === CONFIG.HEIGHT) {
    has_bottom = false;
    has_bottom_left = false;
    has_bottom_right = false;
  }

  if (index % 6 === 0) {
    has_left = false;
    has_top_left = false;
    has_bottom_left = false;
  }

  if ((index + 1) % CONFIG.COL_NUMBER === 0) {
    has_right = false;
    has_top_right = false;
    has_bottom_right = false;
  }

  let counter = 0;

  const top = (y - 1) * CONFIG.COL_NUMBER + (index % CONFIG.COL_NUMBER);
  const bottom = (y + 1) * CONFIG.COL_NUMBER + (index % CONFIG.COL_NUMBER);
  const right = y * CONFIG.COL_NUMBER + ((index + 1) % CONFIG.COL_NUMBER);
  const left = y * CONFIG.COL_NUMBER + ((index - 1) % CONFIG.COL_NUMBER);
  const top_left = (y - 1) * CONFIG.COL_NUMBER + ((index - 1) % CONFIG.COL_NUMBER);
  const top_right = (y - 1) * CONFIG.COL_NUMBER + ((index + 1) % CONFIG.COL_NUMBER);
  const bottom_left = (y + 1) * CONFIG.COL_NUMBER + ((index - 1) % CONFIG.COL_NUMBER);
  const bottom_right = (y + 1) * CONFIG.COL_NUMBER + ((index + 1) % CONFIG.COL_NUMBER);

  if (has_top) counter += state[top];
  if (has_right) counter += state[right];
  if (has_bottom) counter += state[bottom];
  if (has_left) counter += state[left];
  if (has_top_left) counter += state[top_left];
  if (has_top_right) counter += state[top_right];
  if (has_bottom_left) counter += state[bottom_left];
  if (has_bottom_right) counter += state[bottom_right];

  return counter;
}

function updateCell(value_at_cell: number, number_of_active_cells: number) {
  const is_alive = value_at_cell === 1;
  let result = 0;

  if (is_alive) {
    if (number_of_active_cells < 2) result = 0;
    if (number_of_active_cells > 3) result = 0;
    if (number_of_active_cells > 1 && number_of_active_cells <= 3) result = 1;
  }

  if (!is_alive) {
    if (number_of_active_cells === 3) result = 1;
  }

  return result;
}

export function getNextState() {
  const new_state = [];

  for (let i = 0; i < old_state.length; ++i) {
    const number_of_active_cells = getNumberOfActiveCells(i, old_state);
    new_state[i] = updateCell(old_state[i], number_of_active_cells);
  }

  current_state = [...new_state];
  return current_state;
}
