import React, { FC } from 'react';
import { inject } from 'mobx-react';
import { GameStatus } from '../App/types';
import { AppHeader } from '../../shared/StyledComponents/Headers';
import { IMainStore } from '../../stores/mainStore';
import { ButtonComplete } from './styledComponents';

interface IProps {
  mainStore?: IMainStore,
  gameResult: GameStatus,
}

const EndGameScreen: FC<IProps> = inject('mainStore')((props) => {
  const { gameResult, mainStore } = props;

  const handleToMainPage = () => {
    mainStore?.reset();
  };

  return (
    <>
      <AppHeader>{(gameResult === GameStatus.GAMEWIN ? 'You are win' : 'You are loose')}</AppHeader>
      <ButtonComplete onClick={handleToMainPage}>To main menu</ButtonComplete>
    </>
  );
});

export default EndGameScreen;
