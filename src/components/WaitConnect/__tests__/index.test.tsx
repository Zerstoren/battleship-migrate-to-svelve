import { mount } from 'enzyme';
import { Provider } from 'mobx-react';
import React from 'react';

jest.mock('../../../shared/hooks/websocketServer', () => jest.fn());
import * as WebsocketServer from '../../../shared/hooks/websocketServer';

import WaitConnect from '..';
import { IMainStore, MainStore } from '../../../stores/mainStore';
import { GameStatus } from '../../App/types';


const mockWebsocket = () => {
  const useWebsocket: jest.Mock = WebsocketServer.default as jest.Mock;
  
  type websocketFn = (data: Record<string, any>) => void;
  const websocketFns: Record<string, websocketFn> = {
    gamePrepareFn: () => null,
    unPubLobbyFn: () => null
  }

  const gamePrepare = jest.fn();
  const unPubLobby = jest.fn();
  useWebsocket.mockImplementation((path, fn) => {
    switch(path) {
      case 'gamePrepare':
        websocketFns.gamePrepareFn = fn;
        return gamePrepare;
      
      case 'unPubLobby':
        websocketFns.unPubLobbyFn = fn;
        return unPubLobby;

      default:
        throw new Error(`Path ${path} is not resolved`);
    }
  });

  return {
    gamePrepare,
    unPubLobby,
    websocketFns
  };
};

describe('WaitConnect', () => {
  let mainStore: IMainStore;
  
  beforeEach(() => {
    mainStore = MainStore.create({
      status: GameStatus.WAIT_CONNECT,
      currentLobby: {
        lobbyName: 'Ok',
        x: 10,
        y: 10,
        ships4n: 1,
        ships3n: 1,
        ships2n: 1,
        ships1n: 1,
      }
    });

    //@ts-ignore
    WebsocketServer.default.mockReset();
  })

  test('Back to the main page', () => {
    const { unPubLobby } = mockWebsocket();
    const setGameStatus = jest.spyOn(mainStore, 'setGameStatus');
    const tree = mount(<Provider mainStore={mainStore}><WaitConnect /></Provider>);
    tree.find('.btn').simulate('click');
    expect(unPubLobby).toBeCalled();
    expect(setGameStatus).toBeCalled();
    expect(setGameStatus.mock.calls[0][0]).toEqual(GameStatus.MAIN);
  });

  test('Game start', () => {
    const { websocketFns } = mockWebsocket();
    const setGameStatus = jest.spyOn(mainStore, 'setGameStatus');
    const tree = mount(<Provider mainStore={mainStore}><WaitConnect /></Provider>);

    websocketFns.gamePrepareFn({});
    expect(setGameStatus).toBeCalled();
    expect(setGameStatus.mock.calls[0][0]).toEqual(GameStatus.SET_SHIPS);
  });
});