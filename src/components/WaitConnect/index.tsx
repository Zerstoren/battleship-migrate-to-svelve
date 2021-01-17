import { inject } from 'mobx-react';
import React, { FC } from 'react';
import useWebsocketServer from '../../shared/hooks/websocketServer';
import { AppHeader } from '../../shared/StyledComponents/Headers';
import { IMainStore } from '../../stores/mainStore';
import { GameStatus } from '../App/types';

interface IProps {
  mainStore?: IMainStore
}

const WaitConnect: FC<IProps> = inject('mainStore')((props: IProps) => {
  const mainStore = props.mainStore as IMainStore;

  const unPubLobby = useWebsocketServer('unPubLobby');

  useWebsocketServer('gamePrepare', () => {
    if (mainStore.status === GameStatus.WAIT_CONNECT && mainStore.currentLobby !== null) {
      mainStore.setGameStatus(GameStatus.SET_SHIPS);
    }
  });

  const stopProcessing = () => {
    unPubLobby({});
    mainStore.setGameStatus(GameStatus.MAIN);
  };

  return (
    <>
      <AppHeader>Wait connect</AppHeader>
      <button className="btn btn-warning" onClick={stopProcessing}>Discard</button>
    </>
  );
});

export default WaitConnect;
