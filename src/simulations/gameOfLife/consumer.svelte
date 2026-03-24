<script lang="ts">
  import { onMount } from "svelte";
  import CONFIG from "./config.svelte";
  import { getNextState, reset, alterCell, getCurrentState } from "./provider.svelte";
  import canvasApi, { type Api } from "@/canvasApi2";
  import Canvas from "@/components/canvas.svelte";
  import { setEvents, removeEvents } from "./events";

  let ctx: CanvasRenderingContext2D | null = $state(null);
  let api: Api | null = $state(null);
  let interval = $state(0);
  let animation_frame = $state(0);
  let is_paused = $state(true);
  let fps = 5;

  function updateDataLoop() {
    if (is_paused) return;
    getNextState();
    interval = setTimeout(updateDataLoop, 1000 / fps);
  }

  function updateGraphicsLoop() {
    api?.background(CONFIG.WIDTH, CONFIG.HEIGHT, CONFIG.BACKGROUND_COLOR);
    const board = getCurrentState();

    api?.setFill(CONFIG.ACTIVE_COLOR);

    for (let y = 0; y < CONFIG.ROW_NUMBER; ++y) {
      for (let x = 0; x < CONFIG.COL_NUMBER; ++x) {
        if (board[y * CONFIG.COL_NUMBER + x] === 1) {
          api?.rect(x * CONFIG.RECT_SIZE, y * CONFIG.RECT_SIZE, CONFIG.RECT_SIZE, CONFIG.RECT_SIZE);
        }
      }
    }

    animation_frame = requestAnimationFrame(updateGraphicsLoop);
  }

  function handlePauseAndPlay() {
    if (is_paused) {
      is_paused = false;
      updateDataLoop();
    } else {
      is_paused = true;
      clearInterval(interval);
    }
  }

  function onClick(e: MouseEvent) {
    const canvas = e.target as HTMLCanvasElement;
    const { x, y } = canvas.getBoundingClientRect();
    const { clientX, clientY } = e;

    const new_x = Math.floor((clientX - x) / CONFIG.RECT_SIZE);
    const new_y = Math.floor((clientY - y) / CONFIG.RECT_SIZE);

    alterCell(new_x, new_y);
  }

  const eventHandlers = {
    p: handlePauseAndPlay,
    r: reset,
  };

  onMount(() => {
    if (!ctx) return;
    api = canvasApi(ctx);
    updateDataLoop();
    updateGraphicsLoop();
    setEvents(eventHandlers);

    () => {
      removeEvents(eventHandlers);
      clearInterval(interval);
      cancelAnimationFrame(animation_frame);
    };
  });
</script>

<Canvas width={CONFIG.WIDTH} height={CONFIG.HEIGHT} bind:ctx {onClick} />
