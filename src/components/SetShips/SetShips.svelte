<script lang="ts">
import { getContext } from "svelte";
import Header from "../../shared/StyledComponents/Header.svelte";
import type { IStore } from "../../stores";
import { STORE_CONTEXT } from "../../stores";
import type { ILobby } from "../../stores/lobby";
import Matrix from "../../stores/matrix";
import SetShips from "../../stores/setShips";
import SelectShipsPosition from "./SelectShipsPosition.svelte";
import TableField from "./TableField.svelte";


const main = getContext<IStore>(STORE_CONTEXT).mainStore;
const mainStore = main.store;
const lobby = $mainStore.currentLobby as ILobby;

const state = new SetShips(lobby);
const stateStore = state.store;
const matrix = new Matrix({lobby: lobby});

const increseShip = (n: number) => {

}

const decraseShip = (n: number) => {
  
}

</script>

<Header>Set ships</Header>
<div class="d-flex">
  <div>
    <TableField 
      lobby={lobby}
      shipRestore={increseShip}
      disabled={$stateStore.isReady}
      matrix={matrix}
    />
  </div>

  <SelectShipsPosition
    ships4n={$stateStore.ships4n}
    ships3n={$stateStore.ships3n}
    ships2n={$stateStore.ships2n}
    ships1n={$stateStore.ships1n}
    decraseShip={decraseShip} 
  />
</div>