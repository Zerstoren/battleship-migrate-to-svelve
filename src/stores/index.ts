import lobbyList, { ILobbyList } from './lobbyList';
import mainStore, { IMainStore } from './mainStore';

interface IStore {
  mainStore: IMainStore,
  lobbyList: ILobbyList
}

const Stores: IStore = {
  mainStore,
  lobbyList,
};

export type {
  IStore,
};

export default Stores;
