import { writable, Writable } from 'svelte/store';
import { ILobby, ILobbyData, LobbyStoreCreate } from './lobby';

interface ILobbySet {
  [key: string]: ILobby
}

interface ILobbyInputData {
  [key: string]: ILobbyData
}

class LobbyList {
  readonly store: Writable<ILobbySet>;

  constructor(data: ILobbySet) {
    this.store = writable<ILobbySet>(data);
  }

  updateFromServer(data: ILobbyInputData) {
    const saveStoreData: ILobbySet = {};

    Object.keys(data).forEach((userId) => {
      saveStoreData[userId] = LobbyStoreCreate(data[userId]);
    });

    this.store.set(saveStoreData);
  }
}

export type {
  ILobbySet,
  ILobbyInputData,
};
export {
  LobbyList
};


const lobbyList = new LobbyList({});

export default lobbyList;
