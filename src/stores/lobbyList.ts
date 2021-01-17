import { applySnapshot, Instance, types } from 'mobx-state-tree';
import LobbyStore, { IDataFromServer } from './lobby';

const LobbyElement = types.model('LobbyElement', {
  name: types.identifier,
  value: types.late(() => LobbyStore),
});

const LobbyList = types.model('LobbyList', {
  lobbys: types.map(LobbyElement),
}).actions((self) => ({
  updateFromServer(data: IDataFromServer) {
    const lobbys: Record<string, unknown> = {};

    Object.keys(data).forEach((key: string) => {
      lobbys[key] = {
        name: key,
        value: data[key],
      };
    });

    const snapshotData: Record<string, unknown> = {
      lobbys,
    };

    applySnapshot(self, snapshotData);
  },
}));

const lobbyList = LobbyList.create();

export {
  LobbyList,
};
export type ILobbyList = Instance<typeof LobbyList>;
export default lobbyList;
