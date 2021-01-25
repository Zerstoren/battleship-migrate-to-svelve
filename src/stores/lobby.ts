import { readable, Readable } from 'svelte/store';

interface ILobbyData {
  name: string,
  x: number,
  y: number,
  ships4n: number,
  ships3n: number,
  ships2n: number,
  ships1n: number,
}

const LobbyStoreCreate = (data: ILobbyData) : Readable<ILobbyData> => {
  return readable<ILobbyData>({
    ...data,
  }, () => {});
}

type ILobby = Readable<ILobbyData>;

export type {
  ILobby,
  ILobbyData
};

export {
  LobbyStoreCreate
};
