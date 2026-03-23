<script lang="ts">
  import { onMount } from "svelte";
  import canvasApi, { type Options } from "./canvasApi";
  import { getNextState } from "./services/gameOfLife";

  let canvas: HTMLCanvasElement | null = null;
  let ctx: CanvasRenderingContext2D | null = $state(null);
  let api: ReturnType<typeof canvasApi> | null = $state(null);
  let animation_frame = $state(0);
  let is_paused = $state(true);
  let fps = $state(30);

  let WIDTH = 400;
  let HEIGHT = 240;
  let RECT_SIZE = $state(20);
  let ACTIVE_COLOR = $state("#ffffff");
  let INACTIVE_COLOR = $state("#FF0000");
  let current_state: number[] = $state([]);
  let old_state: number[] = $derived(Array.from({length: Math.floor(WIDTH / RECT_SIZE) * Math.floor(HEIGHT / RECT_SIZE)}));

  const options: Options = $derived({
    background_color: "#000000",
    rectActive_color: ACTIVE_COLOR,
    rectInactive_color: INACTIVE_COLOR,
    rect_size: RECT_SIZE,
  });

  const updateGraphicsLoop = () => {
    if (!api) return;
    const { setBackground, rect } = api;

    setBackground();

    const number_of_columns = Math.floor(WIDTH / RECT_SIZE);

    for (let i = 0; i < current_state.length; ++i) {
        const y = Math.floor(i / number_of_columns);
        rect(current_state[i] === 1, i % number_of_columns, y);
    }

    animation_frame = requestAnimationFrame(updateGraphicsLoop);
  };

  onMount(() => {
    if (!canvas) return;
    ctx = canvas.getContext("2d")!;
    api = canvasApi(ctx, WIDTH, HEIGHT, options);

    old_state.fill(0);

    current_state = getNextState(old_state, {
      width: Math.floor(WIDTH / RECT_SIZE),
      height: Math.floor(HEIGHT / RECT_SIZE),
      col_number: Math.floor(WIDTH / RECT_SIZE),
    });

    updateGraphicsLoop();
  });
</script>

<div class="canvas">
  <canvas id="canvas" bind:this={canvas} width={WIDTH} height={HEIGHT}></canvas>
</div>

<style>
  .canvas {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, calc(-50% - 25px));
  }
</style>
