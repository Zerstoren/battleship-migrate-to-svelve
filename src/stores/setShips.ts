import { get, Writable, writable } from 'svelte/store';
import { ILobby } from './lobby';

export interface ISetShipsData {
  ships4n: number,
  ships3n: number,
  ships2n: number,
  ships1n: number,
  isReady: boolean,
  opponentReady: boolean,
}

class SetShips {
  readonly store: Writable<ISetShipsData>;

  constructor(lobby: ILobby) {
    const lobbyData = get(lobby);
    this.store = writable<ISetShipsData>({
      ships4n: lobbyData.ships4n,
      ships3n: lobbyData.ships3n,
      ships2n: lobbyData.ships2n,
      ships1n: lobbyData.ships1n,
      isReady: false,
      opponentReady: false,
    });
  }

  decraseShip(shipSize: number) {
    this.store.update((store) => {
      // @ts-expect-error: TS can associate state with dynamic object
      store[`ships${shipSize}n`] -= 1;
      return store;
    });
  }

  increseShip(shipSize: number) {
    this.store.update((store) => {
      // @ts-expect-error: TS can associate state with dynamic object
      store[`ships${shipSize}n`] += 1;
      return store;
    });
  }

  setReady() {
    this.store.update((store) => ({
      ...store,
      isReady: true
    }))
  }
  
  setOpponentReady() {
    this.store.update((store) => ({
      ...store,
      opponentReady: true
    }));
  }
}

export default SetShips;