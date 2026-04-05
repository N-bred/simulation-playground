<script lang="ts">
  import CONFIG, {
    INITIAL_PROPERTIES_VALUES,
    INITIAL_GRAPHICS_VALUES,
    type PROPERTIES_INDEX,
    type GRAPHICS_INDEX,
    INITIAL_THEMES_VALUES,
  } from "./config.svelte";
  import { handlePauseAndPlay, pause } from "./provider.svelte";
  import { clamp, getContrastColor } from "@/utils";

  let paused_text = $derived(CONFIG.STATE.PAUSED ? "⏸ PAUSED" : "▶ RUNNING");

  function clampInput(e: any, ref: { value: number }, min: number, max: number) {
    const newVal = clamp(Number(e.target.value), min, max);
    ref.value = newVal;
    e.target.value = newVal;
  }

  let contrastingText = $derived(getContrastColor(CONFIG.GRAPHICS.ACTIVE_COLOR.value) > 0.5 ? "#000" : "#fff");
</script>

<div class="status_bar" style="--selected-color: {CONFIG.GRAPHICS.ACTIVE_COLOR.value}; --contrasting-text: {contrastingText}">
  <h1>CONFIG PANEL</h1>

  <span class="divider">[Simulation]</span>

  <div class="status_item">
    <button onclick={handlePauseAndPlay} style="min-width: 70px;">
      {paused_text}
    </button>
  </div>

  <div class="status_item">
    <label for="theme_selector">MODE: </label>
    <select id="theme_selector" bind:value={CONFIG.SELECTED_THEME.value}>
      {#each Object.values(INITIAL_THEMES_VALUES) as THEME}
        <option value={THEME.value}>{THEME.name}</option>
      {/each}
    </select>
  </div>

  <div class="status_item">
    <label for={CONFIG.FPS.id}>{CONFIG.FPS.label} {CONFIG.FPS.value}</label>
    <input
      id={CONFIG.FPS.id}
      type={CONFIG.FPS.type}
      min={CONFIG.FPS.min}
      max={CONFIG.FPS.max}
      value={CONFIG.FPS.value}
      oninput={(e) => clampInput(e, CONFIG.FPS, CONFIG.FPS.min, CONFIG.FPS.max)}
    />
  </div>

  <span class="divider">[Grid]</span>

  {#each Object.entries(INITIAL_PROPERTIES_VALUES) as INITIAL_PROPERTIES}
    {@const name = INITIAL_PROPERTIES[0] as PROPERTIES_INDEX};
    {@const values = INITIAL_PROPERTIES[1]};

    <div class="status_item">
      <label for={values.id}>{values.label} {CONFIG.PROPERTIES[name].value}</label>
      <input
        id={values.id}
        type={values.type}
        min={values.min}
        max={values.max}
        value={values.value}
        oninput={(e) => {
          clampInput(e, CONFIG.PROPERTIES[name], values.min, values.max);
          values.onInput && pause();
        }}
      />
    </div>
  {/each}

  <span class="divider">[Appereance]</span>

  {#each Object.entries(INITIAL_GRAPHICS_VALUES) as INITIAL_GRAPHICS}
    {@const name = INITIAL_GRAPHICS[0] as GRAPHICS_INDEX};
    {@const values = INITIAL_GRAPHICS[1]};

    <div class="status_item">
      <label for={values.id}>{values.label}</label>
      <input id={values.id} type={values.type} bind:value={CONFIG.GRAPHICS[name].value} />
    </div>
  {/each}
</div>

<style>
  .divider {
    color: #fff;
    font-size: 14px;
    text-align: left;
    font-weight: bold;
    margin-bottom: 15px;
    margin-top: 5px;
  }

  .status_bar {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 20px;
    font-family: monospace;
    background: rgba(30, 30, 30, 0.8);
    backdrop-filter: blur(5px);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
  }

  h1 {
    color: #ccc;
    text-align: center;
    margin-bottom: 20px;
    font-size: 18px;
  }

  .status_item {
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
    width: 100%;

    label {
      color: #fff;
      font-size: 12px;
      margin-bottom: 5px;
    }
    input[type="color"],
    select {
      background: #000;
      color: #fff;
      border: none;
      padding: 2px 0;
      padding-left: 7px;
      border-radius: 5px;
      width: 100%;

      &:hover {
        cursor: pointer;
      }
    }

    input[type="color"] {
      outline: none;
      padding: 0;
      height: 20px;
    }

    input[type="range"] {
      width: 100%;
      accent-color: var(--selected-color);
      cursor: pointer;
    }
  }

  button {
    background: #000;
    outline: 1px solid #aaa;
    font-size: 16px;
    border: none;
    color: #fff;
    border-radius: 5px;
    padding: 5px;
    font-weight: bold;
    height: 30px;
    transition: background 0.3s ease-out;

    &:hover {
      cursor: pointer;
      background: var(--selected-color);
      color: var(--contrasting-text);
    }
  }
</style>
