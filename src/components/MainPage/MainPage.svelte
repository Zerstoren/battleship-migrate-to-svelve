<script lang="ts">
import { getContext } from "svelte";
import { get } from "svelte/store";

import Header from "../../shared/StyledComponents/Header.svelte";
import { STORE_CONTEXT } from "../../stores";
import type { IStore } from "../../stores";
import { GameStatus } from "../App/types";

const mainStore = getContext<IStore>(STORE_CONTEXT).mainStore;
let store = get(mainStore.store);

const onClickSearchOpponent = () => {
  mainStore.setGameStatus(GameStatus.LOBBY_LIST);
}

const onClickCreateLobby = () => {
  mainStore.setGameStatus(GameStatus.CREATE_LOBBY);
}

</script>

<Header>Battleship</Header>
<div>
  <button class="btn btn-secondary" on:click={onClickSearchOpponent}>Search opponent</button>
  <button class="btn btn-secondary" on:click={onClickCreateLobby}>Create lobby</button>
</div>

<style>
  button {
    margin: 0 12px;
  }
</style>