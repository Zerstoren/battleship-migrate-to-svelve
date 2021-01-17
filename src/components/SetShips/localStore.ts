import { Instance, types } from 'mobx-state-tree';
import { useState } from 'react';
import { ILobbyStore } from '../../stores/lobby';

const SetShipsState = types.model('SetShipsLocalState', {
  ships4n: types.number,
  ships3n: types.number,
  ships2n: types.number,
  ships1n: types.number,
  isReady: types.optional(types.boolean, false),
  opponentReady: types.optional(types.boolean, false),
}).actions((self) => ({
  decraseShip(shipSize: number) {
    // @ts-expect-error: TS can associate state with dynamic object
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    self[`ships${shipSize}n`] -= 1;
  },

  increseShip(shipSize: number) {
    // @ts-expect-error: TS can associate state with dynamic object
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    self[`ships${shipSize}n`] += 1;
  },

  setReady() {
    self.isReady = true;
  },

  setOpponentReady() {
    self.opponentReady = true;
  },
})).views((self) => ({
  get isNoShipsLeft() : boolean {
    return self.ships4n === 0 && self.ships3n === 0 && self.ships2n === 0 && self.ships1n === 0;
  },
}));

type ISetShipState = Instance<typeof SetShipsState>;
const useLocalState = (lobby: ILobbyStore) : ISetShipState => {
  const [state] = useState(SetShipsState.create({
    ships4n: lobby.ships4n,
    ships3n: lobby.ships3n,
    ships2n: lobby.ships2n,
    ships1n: lobby.ships1n,
  }));

  return state;
};

export {
  useLocalState,
};
