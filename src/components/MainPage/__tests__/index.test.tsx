import React from 'react';
import { mount } from "enzyme";
import MainPage from '..';
import { ButtonCreateLobby, ButtonSearchUser } from '../styledComponents';
import { GameStatus } from '../../App/types';

it('render main page', () => {
  const tree = mount(<MainPage handleChangeGameStatus={() => {}} />)
  expect(tree.debug()).toMatchSnapshot();
});

it('check create lobby', () => {
  let gGameStatus = null;
  const handleGameStatus = (gameStatus: GameStatus) => gGameStatus = gameStatus;

  const wrapper = mount(<MainPage handleChangeGameStatus={handleGameStatus} />);
  wrapper.find(ButtonCreateLobby).simulate('click');
  expect(gGameStatus).toEqual(GameStatus.CREATE_LOBBY);
});

it('check search lobby', () => {
  let gGameStatus = null;
  const handleGameStatus = (gameStatus: GameStatus) => gGameStatus = gameStatus;

  const wrapper = mount(<MainPage handleChangeGameStatus={handleGameStatus} />);
  wrapper.find(ButtonSearchUser).simulate('click');
  expect(gGameStatus).toEqual(GameStatus.LOBBY_LIST);
});
