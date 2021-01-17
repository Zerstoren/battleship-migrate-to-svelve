import {
  Instance, SnapshotIn, SnapshotOut, types,
} from 'mobx-state-tree';

export const lobbyIndexes = {
  lobbyName: types.string,
  x: types.optional(types.number, 10),
  y: types.optional(types.number, 10),
  ships4n: types.optional(types.number, 1),
  ships3n: types.optional(types.number, 2),
  ships2n: types.optional(types.number, 3),
  ships1n: types.optional(types.number, 4),
};

const LobbyStore = types.model('Lobby', lobbyIndexes);

const LobbyElementsStores = types.model('LobbyElements', {
  lobbys: types.array(LobbyStore),
});

export const lobbyElementsStores = LobbyElementsStores.create();

export type ILobbyStore = Instance<typeof LobbyStore>;
export type ISnapshotInLobbyStore = SnapshotIn<typeof LobbyStore>;
export type ISnapshotOutLobbyStore = SnapshotOut<typeof LobbyStore>;
export interface IDataFromServer {
  [key: string]: ISnapshotOutLobbyStore
}

export default LobbyStore;
