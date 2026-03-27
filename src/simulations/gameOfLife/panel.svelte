<script lang="ts">
  import CONFIG from "./config.svelte";
  import { handlePauseAndPlay } from "./provider.svelte";

  let paused_text = $derived(CONFIG.STATE.PAUSED ? "PAUSED" : "PLAYING");
</script>

<div class="status_bar">
  <div class="status_item">
    <label for="fps_input">FPS: </label>
    <input name="fps_input" id="fps_input" type="number" min="1" max="60" bind:value={CONFIG.PROPERTIES.FPS.value} />
  </div>

  <div class="status_item">
    <button onclick={handlePauseAndPlay} style="min-width: 70px;">
      {paused_text}
    </button>
  </div>

  <div class="status_item">
    <label for="rect_size_input">RECT SIZE: </label>
    <input id="rect_size_input" type="number" min="1" max="50" bind:value={CONFIG.PROPERTIES.RECT_SIZE.value} />
  </div>

  <div class="status_item">
    <label for="width_input">WIDTH: </label>
    <input id="width_input" type="number" min="100" bind:value={CONFIG.PROPERTIES.WIDTH.value} />
  </div>

  <div class="status_item">
    <label for="height_input">HEIGHT: </label>
    <input id="height_input" type="number" min="100" bind:value={CONFIG.PROPERTIES.HEIGHT.value} />
  </div>

  <div class="status_item">
    <label for="active_color_input">COLOR 1: </label>
    <input id="active_color_input" type="color" bind:value={CONFIG.GRAPHICS.ACTIVE_COLOR} />
  </div>
  <div class="status_item">
    <label for="inactive_color_input">COLOR 2: </label>
    <input id="inactive_color_input" type="color" bind:value={CONFIG.GRAPHICS.BACKGROUND_COLOR} />
  </div>
</div>

<style>
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
    display: flex;
    flex-direction: row;
    align-items: center;

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
