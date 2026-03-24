<script lang="ts">
  import { onMount } from "svelte";
  import CONFIG from "./config.svelte";
  import { current_state, getNextState, reset, alterCell } from "./provider.svelte";
  import canvasApi, { type Api } from "@/canvasApi2";
  import Canvas from "@/components/canvas.svelte";
  import { setEvents, removeEvents } from "./events";

  let ctx: CanvasRenderingContext2D | null = $state(null);
  let api: Api | null = $state(null);
  let interval = $state(0);
  let animation_frame = $state(0);
  let is_paused = $state(true);
  let fps = $state(30);

  function updateDataLoop() {
    getNextState();
    interval = setInterval(updateDataLoop, 1000 / fps);
  }

  function updateGraphicsLoop() {
    if (!api) return;
    const { background, rect } = api;

    background(CONFIG.WIDTH, CONFIG.HEIGHT, CONFIG.BACKGROUND_COLOR);

    for (let i = 0; i < current_state.length; ++i) {
      const x = i % CONFIG.COL_NUMBER;
      const y = Math.floor(i / CONFIG.COL_NUMBER);
      const isActive = current_state[i] === 1;
      rect(x, y, CONFIG.RECT_SIZE, CONFIG.RECT_SIZE, isActive ? CONFIG.ACTIVE_COLOR : CONFIG.INACTIVE_COLOR);
    }

    animation_frame = requestAnimationFrame(updateGraphicsLoop);
  }

  function handlePauseAndPlay() {
    if (is_paused) {
      clearInterval(interval);
    } else {
      interval = setInterval(updateDataLoop, 1000 / fps);
    }

    is_paused = !is_paused;
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
