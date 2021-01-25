<script lang="ts">
import { getContext } from 'svelte';
import type { IStore } from '../../stores';
import { STORE_CONTEXT } from '../../stores';
import CreateLobby from '../CreateLobby/CreateLobby.svelte';
import LobbyList from '../LobbyList/LobbyList.svelte';
import MainPage from '../MainPage/MainPage.svelte';
import SetShips from '../SetShips/SetShips.svelte';
import WaitConnect from '../WaitConnect/WaitConnect.svelte';
import { GameStatus } from './types';

const mainStore = getContext<IStore>(STORE_CONTEXT).mainStore;
let store = mainStore.store;

const handleAcceptError = () => {
  mainStore.setError('');
}

</script>

<div>
  {#if $store.error}
    <div class="alertError alert alert-warning alert-dismissible fade show">
      <strong>{$store.error}</strong>
      <input type="button" class="btn-close" onClick={handleAcceptError} />
    </div>
  {/if}
  <div class="centerDiv">
    {#if $store.status === GameStatus.MAIN}
      <MainPage />
    {:else if $store.status === GameStatus.CREATE_LOBBY}
      <CreateLobby />
    {:else if $store.status === GameStatus.WAIT_CONNECT}
      <WaitConnect />
    {:else if $store.status === GameStatus.LOBBY_LIST}
      <LobbyList />
    {:else if $store.status === GameStatus.SET_SHIPS}
      <SetShips />
    {/if}
  </div>
</div>

<style>
.centerDiv {
  width: 600px;
  margin: 0 auto;
  text-align: center;
}

.alertError {
  text-align: center;
}
</style>