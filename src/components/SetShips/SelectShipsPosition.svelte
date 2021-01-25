<script lang="ts">
import ShipElement from "./ShipElement.svelte";



type TDecraseShip = (n: number) => void;

export let ships4n: number; 
export let ships3n: number;
export let ships2n: number;
export let ships1n: number;
export let decraseShip: TDecraseShip;

</script>

<div class="block-padding">
  <div class="block-element d-flex">
    <ShipElement shipSize={4} disabled={!ships4n} />
    <span>
      {' '}
      x
      {ships4n}
    </span>
  </div>

  <div class="block-element d-flex">
    <ShipElement shipSize={3} disabled={!ships3n} />
    <span>
      {' '}
      x
      {ships3n}
    </span>
  </div>

  <div class="block-element d-flex">
    <ShipElement shipSize={2} disabled={!ships2n} />
    <span>
      {' '}
      x
      {ships2n}
    </span>
  </div>

  <div class="block-element d-flex">
    <ShipElement shipSize={1} disabled={!ships1n} />
    <span>
      {' '}
      x
      {ships1n}
    </span>
  </div>
</div>

<style lang="scss">
  .block-padding {
    padding-left: 25px;
  }

  .block-element {
    padding: 10px 0;

    & span {
      padding-left: 10px;
    }
  }
</style>