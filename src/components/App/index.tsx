import { inject, observer } from 'mobx-react';
import React, { FC } from 'react';
import { ILobbyStore } from '../../stores/lobby';
import { IMainStore } from '../../stores/mainStore';
import CreateLobby from '../CreateLobby';
import EndGameScreen from '../EndGameScreen';
import Game from '../Game';
import LobbyList from '../LobbyList';
import Main from '../MainPage';
import SetShips from '../SetShips';
import WaitConnect from '../WaitConnect';
import useWebsocketAppReconnect from './hooks';
import { AlertError, CenteredDiv } from './styledComponents';
import { GameStatus } from './types';

interface IAppProps {
  mainStore?: IMainStore
}

const App: FC<IAppProps> = inject('mainStore')(observer((props) => {
  const state = props.mainStore as IMainStore;

  useWebsocketAppReconnect(state);

  const handleGameStart = (startGame: GameStatus) => state?.setGameStatus(startGame);
  const handleSetLobby = (startGame: GameStatus, lobby: ILobbyStore) => state?.setLobby(startGame, lobby);
  const handleWaitLobby = (
    startGame: GameStatus,
    lobby: ILobbyStore | null = null,
  ) => state.setLobby(startGame, lobby);

  const handleAcceptError = () => state?.setError('');

  let component = null;

  switch (state.status) {
    case GameStatus.MAIN:
      component = (<Main handleChangeGameStatus={handleGameStart} />);
      break;

    case GameStatus.CREATE_LOBBY:
      component = (<CreateLobby handleChangeGameStatus={handleWaitLobby} />);
      break;

    case GameStatus.WAIT_CONNECT:
      component = (<WaitConnect />);
      break;

    case GameStatus.LOBBY_LIST:
      component = (<LobbyList handleSetLobby={handleSetLobby} />);
      break;

    case GameStatus.SET_SHIPS:
      component = (<SetShips />); break;

    case GameStatus.GAME:
      component = (<Game />);
      break;

    case GameStatus.GAMEWIN:
    case GameStatus.GAMEOVER:
      component = (<EndGameScreen gameResult={state.status as GameStatus} />);
      break;

    default:
      break;
  }

  let err = null;

  if (state?.error) {
    err = (
      <AlertError>
        <strong>{state?.error}</strong>
        <input type="button" className="btn-close" onClick={handleAcceptError} />
      </AlertError>
    );
  }

  return (
    <>
      {err}
      <CenteredDiv>
        {component}
      </CenteredDiv>
    </>
  );
}));

export default App;
