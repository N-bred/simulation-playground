

<script lang="ts">


</script>


<div class="status_bar">
  <div class="status_item">
    <label for="fps_input">FPS: </label>
    <input name="fps_input" id="fps_input" type="number" min="1" max="144" bind:value={fps} />
  </div>
  <div class="status_item">
    <button onclick={() => pausePlay()} style="min-width: 70px;">
      {#if is_paused}
        PAUSED
      {:else}
        PLAYING
      {/if}
    </button>
  </div>
  <div class="status_item">
    <button onclick={() => (is_apocaliptic = !is_apocaliptic)} style="min-width: 210px;"
      >IN DEAD WE THRIVE: {is_apocaliptic ? "Active" : "False"}</button
    >
  </div>

  <div class="status_item">
    <label for="rect_size_input">RECT SIZE: </label>
    <input
      name="rect_size_input"
      id="rect_size_input"
      type="number"
      min="1"
      max="50"
      value={RECT_SIZE}
      onchange={(e) => {
        const target = e.target as EventTarget & { value: string };
        const { value } = target;
        RECT_SIZE = Number(value);
        if (Number(value) < 1) RECT_SIZE = 1;
        if (Number(value) > 50) RECT_SIZE = 50;
        target.value = RECT_SIZE.toString();
      }}
    />
  </div>
  <div class="status_item">
    <label for="width_input">WIDTH: </label>
    <input
      name="width_input"
      id="width_input"
      type="number"
      min="100"
      max="3840"
      value={WIDTH}
      onchange={(e) => {
        const target = e.target as EventTarget & { value: string };
        const { value } = target;
        WIDTH = Number(value);
        if (Number(value) < 100) WIDTH = 100;
        target.value = WIDTH.toString();
        is_paused = true;
      }}
    />
  </div>
  <div class="status_item">
    <label for="height_input">HEIGHT: </label>
    <input
      name="height_input"
      id="height_input"
      type="number"
      min="100"
      max="2160"
      value={HEIGHT}
      onchange={(e) => {
        const target = e.target as EventTarget & { value: string };
        const { value } = target;
        HEIGHT = Number(value);
        if (Number(value) < 100) HEIGHT = 100;
        target.value = HEIGHT.toString();
        is_paused = true;
      }}
    />
  </div>
  <div class="status_item">
    <label for="active_color_input">COLOR 1: </label>
    <input name="active_color_input" id="active_color_input" type="color" bind:value={ACTIVE_COLOR} />
  </div>
  <div class="status_item">
    <label for="inactive_color_input">COLOR 2: </label>
    <input name="inactive_color_input" id="inactive_color_input" type="color" bind:value={INACTIVE_COLOR} />
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