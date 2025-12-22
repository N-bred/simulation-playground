<script lang="ts">
  import { onMount } from "svelte";
  import canvasApi, { type Options } from "./canvasApi";
  import { create_board } from "./utils";

  let canvas: HTMLCanvasElement | null = null;
  let ctx: CanvasRenderingContext2D | null = $state(null);
  let api: ReturnType<typeof canvasApi> | null = $state(null);
  let animation_frame = $state(0);
  let is_paused = $state(true);
  let is_apocaliptic = $state(false);
  let fps = $state(30);

  let WIDTH = $state(400);
  let HEIGHT = $state(240);
  let RECT_SIZE = $state(20);

  const options: Options = $derived({
    background_color: "#000000",
    rectActive_color: "#ffffff",
    rectInactive_color: "#ff0000",
    rect_size: RECT_SIZE,
  });

  let board_state = $derived(create_board(Math.ceil(WIDTH / RECT_SIZE), Math.ceil(HEIGHT / RECT_SIZE)));
  let next_board_state = $derived(create_board(Math.ceil(WIDTH / RECT_SIZE), Math.ceil(HEIGHT / RECT_SIZE)));

  const generateChecks = (x: number, y: number) => {
    const top = y - 1;
    const bottom = y + 1;
    const left = x - 1;
    const right = x + 1;

    const checks = new Map();
    checks.set("top", [x, top]);
    checks.set("bottom", [x, bottom]);
    checks.set("left", [left, y]);
    checks.set("right", [right, y]);
    checks.set("top_left", [left, top]);
    checks.set("top_right", [right, top]);
    checks.set("bottom_left", [left, bottom]);
    checks.set("bottom_right", [right, bottom]);

    return checks;
  };

  const getAvailableSides = (x: number, y: number, checks: Map<any, any>) => {
    if (y === 0) {
      checks.delete("top");
      checks.delete("top_left");
      checks.delete("top_right");
    }

    if (y === Math.ceil(HEIGHT / RECT_SIZE) - 1) {
      checks.delete("bottom");
      checks.delete("bottom_left");
      checks.delete("bottom_right");
    }

    if (x === 0) {
      checks.delete("left");
      checks.delete("top_left");
      checks.delete("bottom_left");
    }

    if (x === Math.ceil(WIDTH / RECT_SIZE) - 1) {
      checks.delete("right");
      checks.delete("top_right");
      checks.delete("bottom_right");
    }

    return checks;
  };

  const updateCell = (x: number, y: number, is_active: boolean) => {
    const checks = generateChecks(x, y);
    const availableSides = getAvailableSides(x, y, checks);

    let active_cells = 0;

    for (let side of availableSides.values()) {
      const newX = side[0];
      const newY = side[1];
      active_cells += board_state[newX][newY];
    }

    let result = 0;

    if (is_active || is_apocaliptic) {
      if (active_cells < 2) result = 0;
      if (active_cells > 3) result = 0;
      if (active_cells > 1 && active_cells <= 3) result = 1;
    }

    if (!is_active || is_apocaliptic) {
      if (active_cells === 3) result = 1;
    }

    return result;
  };

  const update = () => {
    if (!api) return;
    const { setBackground, rect } = api;

    setBackground();

    for (let x = 0; x < board_state.length; ++x) {
      const col = board_state[x];
      for (let y = 0; y < col.length; ++y) {
        const row = col[y];
        const is_active = row === 1;
        rect(is_active, x * RECT_SIZE, y * RECT_SIZE);
        if (!is_paused) {
          next_board_state[x][y] = updateCell(x, y, is_active);
        }
      }
    }

    if (!is_paused) {
      board_state = JSON.parse(JSON.stringify(next_board_state));
    }

    animation_frame = setTimeout(update, 1000 / fps);
  };

  onMount(() => {
    if (!canvas) return;
    ctx = canvas.getContext("2d")!;
    api = canvasApi(ctx, WIDTH, HEIGHT, options);
    update();
  });

  $effect(() => {
    if (!canvas) return;
    if (!ctx) return;
    api = canvasApi(ctx, WIDTH, HEIGHT, options);
  });

  const alterStatus = (x: number, y: number) => {
    let status = board_state[x][y];
    status = status === 1 ? 0 : 1;
    board_state[x][y] = status;
  };

  const onclick = (e: MouseEvent) => {
    const { x, y } = canvas!.getBoundingClientRect();
    const { clientX, clientY } = e;
    const new_x = Math.floor((clientX - x) / RECT_SIZE);
    const new_y = Math.floor((clientY - y) / RECT_SIZE);

    alterStatus(new_x, new_y);
  };

  const pause_play = () => {
    if (is_paused) {
      update();
    } else {
      clearTimeout(animation_frame);
    }
    is_paused = !is_paused;
  };

  window.addEventListener("keypress", (e) => {
    if (e.key === "p") {
      pause_play();
    }
  });
</script>

<div class="canvas">
  <canvas id="canvas" bind:this={canvas} width={WIDTH} height={HEIGHT} {onclick}></canvas>
</div>

<div class="status_bar">
  <div class="status_item">
    <button onclick={() => pause_play()} style="min-width: 70px;">
      {#if is_paused}
        PAUSED
      {:else}
        PLAYING
      {/if}
    </button>
  </div>
  <div class="status_item">
    <button onclick={() => (is_apocaliptic = !is_apocaliptic)} style="min-width: 210px;"
      >IN DEAD WE THRIVE: {is_apocaliptic ? "Active" : "False"}</button
    >
  </div>
  <div class="status_item">
    <label for="fps_input">FPS: </label>
    <input name="fps_input" id="fps_input" type="number" min="1" max="144" bind:value={fps} />
  </div>
  <div class="status_item">
    <label for="rect_size_input">RECT SIZE: </label>
    <input
      name="rect_size_input"
      id="rect_size_input"
      type="number"
      min="5"
      max="50"
      value={RECT_SIZE}
      onchange={(e) => {
        const target = e.target as EventTarget & { value: string };
        const { value } = target;
        RECT_SIZE = Number(value);
        if (Number(value) < 5) RECT_SIZE = 5;
        if (Number(value) > 50) RECT_SIZE = 50;
        target.value = RECT_SIZE.toString();
      }}
    />
  </div>
  <div class="status_item">
    <label for="width_input">WIDTH: </label>
    <input
      name="width_input"
      id="width_input"
      type="number"
      min="100"
      max="3840"
      value={WIDTH}
      onchange={(e) => {
        const target = e.target as EventTarget & { value: string };
        const { value } = target;
        WIDTH = Number(value);
        if (Number(value) < 100) WIDTH = 100;
        target.value = WIDTH.toString();
        is_paused = true;
      }}
    />
  </div>
  <div class="status_item">
    <label for="height_input">HEIGHT: </label>
    <input
      name="height_input"
      id="height_input"
      type="number"
      min="100"
      max="2160"
      value={HEIGHT}
      onchange={(e) => {
        const target = e.target as EventTarget & { value: string };
        const { value } = target;
        HEIGHT = Number(value);
        if (Number(value) < 100) HEIGHT = 100;
        target.value = HEIGHT.toString();
        is_paused = true;
      }}
    />
  </div>
</div>

<style>
  .canvas {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .status_bar {
    position: absolute;
    background-color: #444;
    bottom: 0px;
    left: 0;
    display: flex;
    border: 1px solid #fff;
    border-left: none;
    border-right: none;
    width: 100%;
  }

  .status_item {
    border-right: 1px solid #000;

    button {
      all: unset;
      color: #ffff;
      font-size: 1.6rem;
      cursor: pointer;
      padding: 10px;
      text-align: center;

      &:active {
        background-color: #222;
      }
    }

    label {
      color: #fff;
      font-size: 1.6rem;
      padding: 10px;
    }

    input {
      margin: 10px 0;
      padding-left: 5px;
      margin-right: 10px;
    }
  }
</style>
