import { ILobbyStore } from '../../stores/lobby';

export enum GameStatus {
  MAIN = 'main',
  LOBBY_LIST = 'list',
  CREATE_LOBBY = 'create',
  WAIT_CONNECT = 'wait',
  SET_SHIPS = 'set_ships',
  GAME = 'game_process',
  GAMEOVER = 'game_loose',
  GAMEWIN = 'game_win',
}

export enum FireTurn {
  NOBODY = 'nobody',
  ME = 'me',
  OPPONENT = 'opponent',
}

export interface IGameState {
  gameStatus: GameStatus,
  gameWithUser: boolean,

  setGameStatus: (status: GameStatus) => void,
}

export interface IProps {
  handleChangeGameStatus: (startGame: GameStatus, lobby?: ILobbyStore | null) => void,
}

export interface ISetLobbyProps {
  handleSetLobby: (startGame: GameStatus, lobby: ILobbyStore) => void
}
