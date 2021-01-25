import lobbyList, { LobbyList } from "./lobbyList";
import mainStore, { MainStore } from "./mainStore";

export const STORE_CONTEXT = 'store_context';

export interface IStore {
  mainStore: MainStore,
  lobbyList: LobbyList
}

const Stores: IStore = {
  mainStore,
  lobbyList,
};

export default Stores;
