<script lang="ts">
  import { onMount } from "svelte";

  let { width, height, ctx = $bindable(), onClick } = $props();
  let canvas: HTMLCanvasElement | null = null;

  onMount(() => {
    if (!canvas) return;
    ctx = canvas.getContext("2d");
  });
</script>

<div class="canvas">
  <canvas id="canvas" bind:this={canvas} {width} {height} onclick={onClick}></canvas>
</div>

<style>
  .canvas {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, calc(-50% - 25px));
  }
</style>
