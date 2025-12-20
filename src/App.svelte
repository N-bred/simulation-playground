<script lang="ts">
  import { onMount } from "svelte";
  import canvasApi, { type Options } from "./canvasApi";

  let canvas: HTMLCanvasElement | null = null;
  const WIDTH = 900;
  const HEIGHT = 600;

  const state = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ];

  const options: Options = {
    backgroundColor: "#000000",
    rectActiveColor: "#ffffff",
    rectInactiveColor: "#ff0000",
    rectSize: 50,
  };

  onMount(() => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const { setBackround, rect } = canvasApi(ctx, WIDTH, HEIGHT, options);

    setBackround();

    for (let y = 0; y < state.length; ++y) {
      const row = state[y];
      for (let x = 0; x < row.length; ++x) {
        const col = row[x];
        const isActive = col === 1;
        rect(isActive, x, y);
      }
    }
  });
</script>

<div class="canvas">
  <canvas id="canvas" bind:this={canvas} width={WIDTH} height={HEIGHT}></canvas>
</div>

<style>
</style>
