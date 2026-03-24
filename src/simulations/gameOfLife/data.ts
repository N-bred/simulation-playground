import CONFIG, { type GameOfLifeOptions } from "./config.svelte";

let current_state: number[] = $state([]);
let old_state: number[] = $derived(Array.from({ length: CONFIG.MAX_BOARD_SIZE }));

function getNumberOfActiveCells(index: number, state: number[], options: GameOfLifeOptions) {
  let has_top = true;
  let has_right = true;
  let has_bottom = true;
  let has_left = true;
  let has_top_left = true;
  let has_top_right = true;
  let has_bottom_left = true;
  let has_bottom_right = true;

  const y = Math.floor(index / options.col_number);

  if (y === 0) {
    has_top = false;
    has_top_left = false;
    has_top_right = false;
  }

  if (y === options.height) {
    has_bottom = false;
    has_bottom_left = false;
    has_bottom_right = false;
  }

  if (index % 6 === 0) {
    has_left = false;
    has_top_left = false;
    has_bottom_left = false;
  }

  if ((index + 1) % options.col_number === 0) {
    has_right = false;
    has_top_right = false;
    has_bottom_right = false;
  }

  let counter = 0;

  const top = (y - 1) * options.col_number + (index % options.col_number);
  const bottom = (y + 1) * options.col_number + (index % options.col_number);
  const right = y * options.col_number + ((index + 1) % options.col_number);
  const left = y * options.col_number + ((index - 1) % options.col_number);
  const top_left = (y - 1) * options.col_number + ((index - 1) % options.col_number);
  const top_right = (y - 1) * options.col_number + ((index + 1) % options.col_number);
  const bottom_left = (y + 1) * options.col_number + ((index - 1) % options.col_number);
  const bottom_right = (y + 1) * options.col_number + ((index + 1) % options.col_number);

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

export function getNextState(current_state: number[], options: GameOfLifeOptions): number[] {
  const new_state = [...current_state];

  for (let i = 0; i < current_state.length; ++i) {
    const number_of_active_cells = getNumberOfActiveCells(i, current_state, options);
    const result = updateCell(current_state[i], number_of_active_cells);
    new_state[i] = result;
  }

  return new_state;
}
