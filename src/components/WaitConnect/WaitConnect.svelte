<script lang="ts">
import { getContext } from "svelte";

import useWebsocketServer from "../../shared/hooks/websocketServer";
import Header from "../../shared/StyledComponents/Header.svelte";
import { STORE_CONTEXT } from "../../stores";
import type { IStore } from "../../stores";
import { GameStatus } from "../App/types";

const mainStore = getContext<IStore>(STORE_CONTEXT).mainStore;
const store = mainStore.store;

const unPubLobby = useWebsocketServer('unPubLobby');

useWebsocketServer('gamePrepare', () => {
  if ($store.status === GameStatus.WAIT_CONNECT && $store.currentLobby !== null) {
    mainStore.setGameStatus(GameStatus.SET_SHIPS);
  }
});

const stopProcessing = () => {
  unPubLobby({});
  mainStore.setGameStatus(GameStatus.MAIN);
}

</script>

<Header>Wait connect</Header>
<button class="btn btn-warning" onClick={stopProcessing}>Discard</button>
