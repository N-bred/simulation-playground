import CONFIG from "./config.svelte";

let bufferA = new Uint8Array(CONFIG.MAX_BOARD_SIZE);
let bufferB = new Uint8Array(CONFIG.MAX_BOARD_SIZE);

let current_state = $state(bufferA);
export const getCurrentState = () => current_state;

function getNumberOfActiveCells(x: number, y: number, state: Uint8Array) {
  let count = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;

      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && nx < CONFIG.COL_NUMBER && ny >= 0 && ny < CONFIG.ROW_NUMBER) {
        count += state[ny * CONFIG.COL_NUMBER + nx] || 0;
      }
    }
  }
  return count;
}

export function alterCell(x: number, y: number) {
  const index = y * CONFIG.COL_NUMBER + (x % CONFIG.COL_NUMBER);
  const prev_val = current_state[index];
  const final_val = prev_val === 0 ? 1 : 0;
  current_state[index] = final_val;
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

export function reset() {
  bufferA.fill(0);
  bufferB.fill(0);
}

export function getNextState() {
  const next_buffer = (current_state === bufferA) ? bufferB : bufferA;

  for (let y = 0; y < CONFIG.ROW_NUMBER; ++y) {
    for (let x = 0; x < CONFIG.COL_NUMBER; ++x) {
      const i = y * CONFIG.COL_NUMBER + x;
      const number_of_active_cells = getNumberOfActiveCells(x, y, current_state);
      next_buffer[i] = updateCell(current_state[i]!, number_of_active_cells);
    }
  }

  current_state = next_buffer;
}
