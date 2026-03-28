import CONFIG from "./config.svelte";

let bufferA = $derived(new Uint8Array(CONFIG.COMPUTED().MAX_BOARD_SIZE));
let bufferB = $derived(new Uint8Array(CONFIG.COMPUTED().MAX_BOARD_SIZE));
let interval = $state(0);
let toggle = $state(0);

export function CURRENT_STATE() {
  return toggle === 0 ? bufferA : bufferB;
}

function NEXT_STATE() {
  return toggle === 0 ? bufferB : bufferA;
}

function getNumberOfActiveCells(x: number, y: number, state: Uint8Array) {
  let count = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;

      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && nx < CONFIG.COMPUTED().COL_NUMBER && ny >= 0 && ny < CONFIG.COMPUTED().ROW_NUMBER) {
        count += state[ny * CONFIG.COMPUTED().COL_NUMBER + nx] || 0;
      }
    }
  }
  return count;
}

export function alterCell(x: number, y: number) {
  const index = y * CONFIG.COMPUTED().COL_NUMBER + (x % CONFIG.COMPUTED().COL_NUMBER);
  const prev_val = CURRENT_STATE()[index];
  const final_val = prev_val === 0 ? 1 : 0;
  CURRENT_STATE()[index] = final_val;
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
  const next_buffer = NEXT_STATE();

  for (let y = 0; y < CONFIG.COMPUTED().ROW_NUMBER; ++y) {
    for (let x = 0; x < CONFIG.COMPUTED().COL_NUMBER; ++x) {
      const i = y * CONFIG.COMPUTED().COL_NUMBER + x;
      const number_of_active_cells = getNumberOfActiveCells(x, y, CURRENT_STATE());
      next_buffer[i] = updateCell(CURRENT_STATE()[i]!, number_of_active_cells);
    }
  }

  toggle = toggle === 0 ? 1 : 0;
}

export function reset() {
  bufferA.fill(0);
  bufferB.fill(0);
}

export function updateDataLoop() {
  if (CONFIG.STATE.PAUSED) return;
  getNextState();
  interval = setTimeout(updateDataLoop, 1000 / CONFIG.PROPERTIES.FPS.value);
}

export function stopDataLoop() {
  clearInterval(interval);
}

export function pause() {
  CONFIG.STATE.PAUSED = true;
  stopDataLoop();
}

export function play() {
  CONFIG.STATE.PAUSED = false;
  updateDataLoop();
}

export function handlePauseAndPlay() {
  if (!CONFIG.STATE.PAUSED) {
    pause();
  } else {
    500;
    play();
  }
}
