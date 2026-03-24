<script lang="ts">
  import { onMount } from "svelte";
  import canvasApi from "./canvasApi2";
  import CONFIG from "./simulations/gameOfLife/config.svelte";

  let canvas: HTMLCanvasElement | null = null;
  let ctx: CanvasRenderingContext2D | null = $state(null);
  let api: ReturnType<typeof canvasApi> | null = $state(null);
  let animation_frame = $state(0);
  let is_paused = $state(true);
  let fps = $state(30);

  onMount(() => {
    if (!canvas) return;
    ctx = canvas.getContext("2d")!;
    api = canvasApi(ctx);
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
