<script lang="ts">
  import { onMount } from "svelte";
  import canvasApi, { type Options } from "./canvasApi";
  import { create_board } from "./utils";

  let canvas: HTMLCanvasElement | null = null;
  let ctx: CanvasRenderingContext2D | null = $state(null);
  let api: ReturnType<typeof canvasApi> | null = $state(null);
  let animation_frame = $state(0);
  let is_paused = $state(false);

  const WIDTH = 400;
  const HEIGHT = 240;
  const RECT_SIZE = 20;

  const options: Options = {
    background_color: "#000000",
    rectActive_color: "#ffffff",
    rectInactive_color: "#ff0000",
    rect_size: RECT_SIZE,
  };

  let board_state = create_board(WIDTH / RECT_SIZE, HEIGHT / RECT_SIZE);

  const alterStatus = (x: number, y: number) => {
    let status = board_state[x][y];
    status = status === 1 ? 0 : 1;
    board_state[x][y] = status;
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
      }
    }

    animation_frame = requestAnimationFrame(update);
  };

  onMount(() => {
    if (!canvas) return;
    ctx = canvas.getContext("2d")!;
    api = canvasApi(ctx, WIDTH, HEIGHT, options);
    update();
  });

  const onclick = (e: MouseEvent) => {
    if (is_paused) return;
    const { x, y } = canvas!.getBoundingClientRect();
    const { clientX, clientY } = e;
    const new_x = Math.floor((clientX - x) / RECT_SIZE);
    const new_y = Math.floor((clientY - y) / RECT_SIZE);

    alterStatus(new_x, new_y);
  };

  window.addEventListener("keypress", (e) => {
    if (e.key === "p") {
      if (is_paused) {
        requestAnimationFrame(update);
      } else {
        cancelAnimationFrame(animation_frame);
      }
      is_paused = !is_paused;
    }
  });
</script>

<div class="canvas">
  <canvas id="canvas" bind:this={canvas} width={WIDTH} height={HEIGHT} {onclick}></canvas>
</div>

<div class="status_bar">
  <div class="status_item">
    {#if is_paused}
      <p>PAUSED</p>
    {:else}
      <p>PLAYING</p>
    {/if}
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
    bottom: 0px;
    left: 0;
    display: flex;
    border: 1px solid #fff;
    border-left: none;
    border-right: none;
    width: 100%;
  }

  .status_item {
    padding: 10px;
    border-right: 1px solid #000;
    p {
      color: #fff;
      font-size: 1.6rem;
    }
  }
</style>
