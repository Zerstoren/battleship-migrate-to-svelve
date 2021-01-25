import { Writable, writable } from 'svelte/store';
import { FireTurn, GameStatus } from '../components/App/types';
import { IMatrix, MatrixFill } from '../components/SetShips/Field/TableField/types';
import { ILobby } from './lobby';

interface IMainStore {
  status: GameStatus,
  currentLobby?: ILobby,
  gameMatrix?: MatrixFill[][],
  fireTurn?: FireTurn,
  error?: string,
}

class MainStore {
  readonly store: Writable<IMainStore>;

  constructor(data: IMainStore) {
    this.store = writable<IMainStore>(data);
  }

  setGameStatus(gameStatus: GameStatus) {
    this.store.update((store) => ({
      ...store, 
      status: gameStatus
    }));
  }

  setLobby(gameStatus: GameStatus, lobby: ILobby | null) {
    this.store.update((store) => ({
      ...store, 
      status: gameStatus,
      currentLobby: lobby || undefined,
    }));
  }

  setGameMatrix(matrix: IMatrix) {
    this.store.update((store) => ({
      ...store, 
      status: GameStatus.GAME,
      gameMatrix: matrix,
    }));
  }

  setFireTurn(fireTurn: FireTurn) {
    this.store.update((store) => ({
      ...store, 
      fireTurn: fireTurn
    }));
  }

  setError(message: string) {
    this.store.update((store) => ({
      ...store, 
      error: message
    }));
  }

  reset() {
    this.store.set({
      status: GameStatus.MAIN
    });
  }
}

export type {
  IMainStore
};

export {
  MainStore
};


const mainStore = new MainStore({
  status: GameStatus.MAIN
});

export default mainStore;
