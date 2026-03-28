<script lang="ts">
  import { onMount } from "svelte";
  import canvasApi, { type Api } from "@/canvasApi2";
  import { reset, alterCell, stopDataLoop, updateDataLoop, handlePauseAndPlay, CURRENT_STATE } from "./provider.svelte";
  import { setEvents, removeEvents } from "./events";
  import CONFIG from "./config.svelte";
  import Canvas from "@/components/canvas.svelte";
  import Panel from "./panel.svelte";

  let ctx: CanvasRenderingContext2D | null = $state(null);
  let api: Api | null = $state(null);
  let animation_frame = $state(0);

  function updateGraphicsLoop() {
    api?.background(CONFIG.PROPERTIES.WIDTH.value, CONFIG.PROPERTIES.HEIGHT.value, CONFIG.GRAPHICS.BACKGROUND_COLOR.value);

    api?.setFill(CONFIG.GRAPHICS.ACTIVE_COLOR.value);
    const board = CURRENT_STATE();
    for (let y = 0; y < CONFIG.COMPUTED().ROW_NUMBER; ++y) {
      for (let x = 0; x < CONFIG.COMPUTED().COL_NUMBER; ++x) {
        if (board[y * CONFIG.COMPUTED().COL_NUMBER + x] === 1) {
          api?.rect(
            x * CONFIG.PROPERTIES.RECT_SIZE.value,
            y * CONFIG.PROPERTIES.RECT_SIZE.value,
            CONFIG.PROPERTIES.RECT_SIZE.value,
            CONFIG.PROPERTIES.RECT_SIZE.value
          );
        }
      }
    }

    animation_frame = requestAnimationFrame(updateGraphicsLoop);
  }

  function onClick(e: MouseEvent) {
    const canvas = e.target as HTMLCanvasElement;
    const { x, y } = canvas.getBoundingClientRect();
    const { clientX, clientY } = e;

    const new_x = Math.floor((clientX - x) / CONFIG.PROPERTIES.RECT_SIZE.value);
    const new_y = Math.floor((clientY - y) / CONFIG.PROPERTIES.RECT_SIZE.value);

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
      stopDataLoop();
      cancelAnimationFrame(animation_frame);
    };
  });
</script>

<Canvas width={CONFIG.PROPERTIES.WIDTH.debounced} height={CONFIG.PROPERTIES.HEIGHT.debounced} bind:ctx {onClick} />

<Panel />
