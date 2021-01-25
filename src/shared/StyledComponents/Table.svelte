<script lang="ts">
import { get } from "svelte/store";

import type { ILobby } from "../../stores/lobby";
import getLetters from "../helpers/letters";

export let lobby: ILobby;
const lobbyData = get(lobby);

const letters = getLetters();
const rangeY = [...Array(lobbyData.y).keys()];
const rangeX = [...Array(lobbyData.x).keys()];

</script>

<table class="table table-bordered" style="--width: {rangeX.length}; --height: {rangeY.length};">
  <thead>
    <tr>
      <td></td>
      {#each rangeX as x}
        <td>{letters[x]}</td>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each rangeY as y}
      <tr>
        <td>{y + 1}</td>
        {#each rangeX as x}
          <slot y={y} x={x}></slot>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<style lang="scss">
table {
  width: calc(var(--width) * 30)px;
  height: calc(var(--height) * 30)px;

  & :global(td) {
    width: 30px;
    height: 30px;
    padding: 0;

    &.ship-shadow {
      background-color: rgba(0,0,255,0.12);
    }
    &.ship-err-shadow {
      background-color: rgba(255,0,0,0.12);
    }
    &.ship-set {
      cursor: pointer;
      background-color: rgba(0,0,255,0.25);
    }
    &.disabled {
      background-color: rgba(50,50,50,0.25);
    }
  }
}
</style>