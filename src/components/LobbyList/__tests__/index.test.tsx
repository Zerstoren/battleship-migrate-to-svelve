import React from 'react';
import {mount, ReactWrapper} from 'enzyme';
import { Provider } from 'mobx-react';

jest.mock('../../../shared/hooks/websocketServer', () => jest.fn());
import * as WebsocketServer from '../../../shared/hooks/websocketServer';

import { ILobbyList, LobbyList as LobbyListStore } from '../../../stores/lobbyList';
import LobbyList from '..';
import { applySnapshot } from 'mobx-state-tree';
import { ILobbyStore } from '../../../stores/lobby';
import { GameStatus } from '../../App/types';

const mockWebsocket = () => {
  const useWebsocket: jest.Mock = WebsocketServer.default as jest.Mock;
  
  type websocketFn = (data: Record<string, any>) => void;
  const websocketFns: Record<string, websocketFn> = {
    lobbyListFn: () => null,
    connectLobbyFn: () => null
  }

  const lobbyList = jest.fn();
  const connectLobby = jest.fn();
  useWebsocket.mockImplementation((path, fn) => {
    switch(path) {
      case 'lobbyList':
        websocketFns.lobbyListFn = fn;
        return lobbyList;
      
      case 'connectLobby':
        websocketFns.connectLobbyFn = fn;
        return connectLobby;

      default:
        throw new Error(`Path ${path} is not resolved`);
    }
  });

  return {
    lobbyList,
    connectLobby,
    websocketFns
  };
};

describe('LobbyList', () => {
  let tree: ReactWrapper;
  let fn: jest.Mock;
  let lobbyList: ILobbyList;

  beforeEach(() => {
    lobbyList = LobbyListStore.create();
    fn = jest.fn(() => null);
  });
  
  test('Snapshot empty list', () => {
    mockWebsocket();
    tree = mount(<Provider lobbyList={lobbyList}><LobbyList handleSetLobby={fn} /></Provider>)
    expect(tree.debug()).toMatchSnapshot();
  });

  test('Snapshot load on startup item', () => {
    const { lobbyList: lobbyListWebsocket, websocketFns } = mockWebsocket();

    let tree = mount(<Provider lobbyList={lobbyList}><LobbyList handleSetLobby={fn} /></Provider>);
    expect(lobbyListWebsocket).toBeCalled();
    websocketFns.lobbyListFn({
      'LName': {
        'lobbyName': 'S',
        'x': 10,
        'y': 10,
        'ships4n': 1,
        'ships3n': 1,
        'ships2n': 1,
        'ships1n': 1,
      }
    });
    tree.update();
    expect(tree.debug()).toMatchSnapshot();
  });

  test('Join to lobby', () => {
    const { lobbyList: lobbyListWebsocket, connectLobby, websocketFns } = mockWebsocket();
    
    let tree = mount(<Provider lobbyList={lobbyList}><LobbyList handleSetLobby={fn} /></Provider>);
    expect(lobbyListWebsocket).toBeCalled();
    websocketFns.lobbyListFn({
      'LName': {
        'lobbyName': 'S',
        'x': 10,
        'y': 10,
        'ships4n': 1,
        'ships3n': 1,
        'ships2n': 1,
        'ships1n': 1,
      }
    });

    const lobby = lobbyList.lobbys.get('LName')?.value as ILobbyStore;
    tree.update();
    tree.find('.btn-secondary').simulate('click');

    expect(connectLobby).toHaveBeenCalled();
    expect(connectLobby.mock.calls[0][0]).toBe('LName');
    expect(fn).toHaveBeenCalled();
    expect(fn.mock.calls[0][0]).toBe(GameStatus.SET_SHIPS);
    expect(fn.mock.calls[0][1]).toBe(lobby);
  });
});