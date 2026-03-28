<script lang="ts">
  import CONFIG, { INITIAL_PROPERTIES_VALUES, INITIAL_GRAPHICS_VALUES, type PROPERTIES_INDEX, type GRAPHICS_INDEX } from "./config.svelte";
  import { handlePauseAndPlay, pause } from "./provider.svelte";
  import { clamp } from "@/utils";

  let paused_text = $derived(CONFIG.STATE.PAUSED ? "PAUSED" : "PLAYING");

  function clampInput(e: any, ref: { value: number }, min: number, max: number) {
    const newVal = clamp(Number(e.target.value), min, max);
    ref.value = newVal;
    e.target.value = newVal;
  }

  function handleKeyEnterBlur(e: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }) {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  }
</script>

<div class="status_bar">
  <div class="status_item">
    <button onclick={handlePauseAndPlay} style="min-width: 70px;">
      {paused_text}
    </button>
  </div>

  {#each Object.entries(INITIAL_PROPERTIES_VALUES) as INITIAL_PROPERTIES}
    {@const name = INITIAL_PROPERTIES[0] as PROPERTIES_INDEX};
    {@const values = INITIAL_PROPERTIES[1]};

    <div class="status_item">
      <label for={values.id}>{values.label}</label>
      <input
        id={values.id}
        type={values.type}
        min={values.min}
        max={values.max}
        value={values.value}
        oninput={values.onInput ? pause : () => {}}
        onchange={(e) => clampInput(e, CONFIG.PROPERTIES[name], values.min, values.max)}
        onblur={(e) => clampInput(e, CONFIG.PROPERTIES[name], values.min, values.max)}
        onkeydown={handleKeyEnterBlur}
      />
    </div>
  {/each}

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
