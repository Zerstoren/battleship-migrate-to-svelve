<script lang="ts">
import { dndzone } from 'svelte-dnd-action';

export let shipSize: number;
export let disabled: boolean;

let shipIterator = [...Array(shipSize).keys()];

let items = [{id: shipSize}];
function handleDndConsider(e: CustomEvent<DndEvent> & {target: EventTarget}) {
  console.log(e);
  e.preventDefault();
}
function handleDndFinalize(e: CustomEvent<DndEvent> & {target: EventTarget}) {
  console.log(e);
  e.preventDefault();
  // items = e.detail.items;
}

</script>

<section class="d-flex" use:dndzone={{items, flipDurationMs: 200}} on:consider={handleDndConsider} on:finalize={handleDndFinalize}>
  <!-- {#each shipIterator as i} -->
    <div class="ship-element">1</div>
  <!-- {/each} -->
</section>

<style lang="scss">
.ship-element {
  width: 30px;
  height: 30px;
  border-left: 1px solid rgba(0,0,0,0.25);
  border-top: 1px solid rgba(0,0,0,0.25);
  border-bottom: 1px solid rgba(0,0,0,0.25);
  border-radius: 2px;

  &:last-child {
    border-right: 1px solid rgba(0,0,0,0.25);
  }
}
</style>