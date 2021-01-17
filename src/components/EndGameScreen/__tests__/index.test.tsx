import { mount } from 'enzyme';
import { Provider } from 'mobx-react';
import React from 'react';
import renderer from 'react-test-renderer';
import EndGameScreen from '..';
import { MainStore } from '../../../stores/mainStore';
import { GameStatus } from '../../App/types';

describe('EndGameScreen', () => {
  test('win screen screenshot', () => {
    const mainStore = MainStore.create({
      status: GameStatus.GAMEWIN
    });

    const test = renderer.create(<Provider mainStore={mainStore}><EndGameScreen gameResult={GameStatus.GAMEWIN} /></Provider>);
    expect(test.toJSON()).toMatchSnapshot();
  });

  test('loose screen screenshot', () => {
    const mainStore = MainStore.create({
      status: GameStatus.GAMEOVER
    });

    const test = renderer.create(<Provider mainStore={mainStore}><EndGameScreen gameResult={GameStatus.GAMEOVER} /></Provider>);
    expect(test.toJSON()).toMatchSnapshot();
  });

  test('reset store', () => {
    const mainStore = MainStore.create({
      status: GameStatus.GAMEWIN
    });

    const reset = jest.spyOn(mainStore, 'reset');
    const test = mount(<Provider mainStore={mainStore}><EndGameScreen gameResult={GameStatus.GAMEWIN} /></Provider>);
    test.find('button').simulate('click')
    expect(reset).toHaveBeenCalled();
    expect(mainStore.status).toBe(GameStatus.MAIN);
  });
});