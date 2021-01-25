<script lang="ts">
import { getContext, onMount } from "svelte";
import { STORE_CONTEXT } from "../../stores";
import useWebsocketServer from "../../shared/hooks/websocketServer";
import Header from "../../shared/StyledComponents/Header.svelte";
import { GameStatus } from "../App/types";
import { get} from "svelte/store";
import type { IStore } from "../../stores";
import type { ILobbySet, ILobbyData } from "../../stores/lobbyList";
import type { ILobby } from "../../stores/lobby";
import type { Readable }   from "svelte/store";

const {
  lobbyList,
  mainStore,
} = getContext<IStore>(STORE_CONTEXT);
const lobbyListStore = lobbyList.store;

const connectToLobby = useWebsocketServer('connectLobby');

const lobbyListRequest = useWebsocketServer('lobbyList', (data: ILobbyData) => {
  lobbyList.updateFromServer(data);
});

onMount(() => {
  lobbyListRequest({});
})

interface ILobbyArrayItem {
  userId: string,
  data: ILobby,
  lobby: Readable<ILobby>,
}

let lobbyListData: ILobbyArrayItem[] = [];

$: {
  lobbyListData = Object.entries($lobbyListStore).map((items) => {
    const [userId, lobby] = items;

    return {
      userId: userId,
      data: get(lobby),
      lobby: lobby,
    };
  });
}

const handleJoin = (user: string, lobby: Readable<ILobby>) => {
  connectToLobby(user);
  mainStore.setLobby(GameStatus.SET_SHIPS, lobby);
  console.log('Joined')
};

</script>

<Header>Lobby list</Header>

<table class="table table-striped table-hover">
  <thead>
    <tr>
      <td />
      <td>Lobby name</td>
      <td>Field size</td>
      <td>Ships 4x/3x/2x/1x</td>
    </tr>
  </thead>
  <tbody>
    {#each lobbyListData as lobbyItem}
      <tr>
        <td>
          <button class="btn btn-secondary" on:click={() => handleJoin(lobbyItem.userId, lobbyItem.lobby)}>Join</button>
        </td>
        <td>{lobbyItem.data.name}</td>
        <td>
          {lobbyItem.data.x} x {lobbyItem.data.y}
        </td>
        <td>
          {lobbyItem.data.ships4n} / {lobbyItem.data.ships3n} / {lobbyItem.data.ships2n} / {lobbyItem.data.ships1n}
        </td>
      </tr>
    {/each}
  </tbody>
</table>