import React, { FC } from 'react';
import { AppHeader } from '../../shared/StyledComponents/Headers';
import { GameStatus, IProps } from '../App/types';
import { ButtonCreateLobby, ButtonSearchUser } from './styledComponents';

const Main: FC<IProps> = ({ handleChangeGameStatus: handleStartGame } : IProps) => (
  <>
    <AppHeader>Battleship</AppHeader>
    <div>
      <ButtonSearchUser onClick={() => handleStartGame(GameStatus.LOBBY_LIST)}>
        Search opponent
      </ButtonSearchUser>

      <ButtonCreateLobby onClick={() => handleStartGame(GameStatus.CREATE_LOBBY)}>
        Create lobby
      </ButtonCreateLobby>
    </div>
  </>
);

export default Main;
