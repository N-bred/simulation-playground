<script lang="ts">
  import { onMount } from "svelte";
  import canvasApi, { type Api } from "./canvasApi2";
  import CONFIG from "./simulations/gameOfLife/config.svelte";
  import { updateGraphicsLoop } from "./simulations/gameOfLife/graphics";

  let canvas: HTMLCanvasElement | null = null;
  let ctx: CanvasRenderingContext2D | null = null;
  let interval = $state(0);
  let is_paused = $state(true);
  let fps = $state(30);

  onMount(() => {
    if (!canvas) return;
    ctx = canvas.getContext("2d")!;
    const api = canvasApi(ctx);
    interval = setInterval(() => updateGraphicsLoop(api), 1000 / fps);
  });
</script>

<div class="canvas">
  <canvas id="canvas" bind:this={canvas} width={CONFIG.WIDTH} height={CONFIG.HEIGHT}></canvas>
</div>

<style>
  .canvas {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, calc(-50% - 25px));
  }
</style>
