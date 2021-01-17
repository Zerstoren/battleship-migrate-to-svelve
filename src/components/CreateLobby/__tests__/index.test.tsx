import React from 'react';
import {mount} from 'enzyme';

jest.mock('../../../shared/hooks/websocketServer', () => jest.fn());
import * as WebsocketServer from '../../../shared/hooks/websocketServer';

import CreateLobby from '..';
import { GameStatus } from '../../App/types';

const mockWebsocket = () => {
  const useWebsocket: jest.Mock = WebsocketServer.default as jest.Mock;
  const publicLobbyFn = jest.fn();
  useWebsocket.mockImplementation(() => {
    return publicLobbyFn;
  });

  return {
    publicLobbyFn
  };
};

describe('CreateLobby', () => {
  beforeEach(() => {
    //@ts-ignore
    WebsocketServer.default.mockReset();
  });

  test('Type all data', () => {
    mockWebsocket();

    const mockCallback = jest.fn();

    const tree = mount(<CreateLobby handleChangeGameStatus={mockCallback} />);
    expect(tree.debug()).toMatchSnapshot();

    tree.find('input[name="lobbyName"]').simulate("change", { target: { value: "Whooo" }})
    tree.find('input[name="x"]').simulate("change", { target: { value: "20" }})
    tree.find('input[name="y"]').simulate("change", { target: { value: "21" }})
    tree.find('input[name="ships4n"]').simulate("change", { target: { value: "2" }})
    tree.find('input[name="ships3n"]').simulate("change", { target: { value: "3" }})
    tree.find('input[name="ships2n"]').simulate("change", { target: { value: "4" }})
    tree.find('input[name="ships1n"]').simulate("change", { target: { value: "5" }})
    tree.find('button.btn-primary').simulate('click');
    
    const lobby = mockCallback.mock.calls[0][1];
    expect(mockCallback.mock.calls[0][0]).toBe(GameStatus.WAIT_CONNECT);
    expect(lobby.lobbyName).toBe('Whooo');
    expect(lobby.x).toBe(20);
    expect(lobby.y).toBe(21);
    expect(lobby.ships4n).toBe(2);
    expect(lobby.ships3n).toBe(3);
    expect(lobby.ships2n).toBe(4);
    expect(lobby.ships1n).toBe(5);
  });

  test('Check validation name', () => {
    const mockCallback = jest.fn((state, lobby) => null);
    const tree = mount(<CreateLobby handleChangeGameStatus={mockCallback} />);

    tree.find('button.btn-primary').simulate('click');
    expect(mockCallback.mock.calls.length).toBe(0);
    expect(tree.find('input.is-invalid').length).toBe(1);
    expect(tree.debug()).toMatchSnapshot();
  });

  test('Check validation field size', () => {
    const mockCallback = jest.fn((state, lobby) => null);
    const tree = mount(<CreateLobby handleChangeGameStatus={mockCallback} />);

    tree.find('input[name="lobbyName"]').simulate("change", { target: { value: "Whooo" }})
    tree.find('input[name="x"]').simulate("change", { target: { value: "1" }})
    tree.find('input[name="y"]').simulate("change", { target: { value: "1" }})
    tree.find('button.btn-primary').simulate('click');
    expect(mockCallback.mock.calls.length).toBe(0);
    expect(tree.find('input.is-invalid').length).toBe(6);
    expect(tree.debug()).toMatchSnapshot();
  });

  test('Check validation ships size', () => {
    const mockCallback = jest.fn((state, lobby) => null);
    const tree = mount(<CreateLobby handleChangeGameStatus={mockCallback} />);

    tree.find('input[name="lobbyName"]').simulate("change", { target: { value: "Whooo" }})
    tree.find('input[name="ships4n"]').simulate("change", { target: { value: "22" }})
    tree.find('button.btn-primary').simulate('click');
    expect(mockCallback.mock.calls.length).toBe(0);
    expect(tree.find('input.is-invalid').length).toBe(4);
    expect(tree.debug()).toMatchSnapshot();
  });

  test('Lobby name not send to server', () => {
    const { publicLobbyFn } = mockWebsocket();

    const mockCallback = jest.fn();
    const tree = mount(<CreateLobby handleChangeGameStatus={mockCallback} />);

    tree.find('input[name="lobbyName"]').simulate("change", { target: { value: "Whooo" }});
    tree.find('button.btn-primary').simulate('click');

    expect(publicLobbyFn.mock.calls[0][0]).toEqual({
      "lobbyName": "Whooo",
      "ships1n": 4,
      "ships2n": 3,
      "ships3n": 2,
      "ships4n": 1,
      "x": 10,
      "y": 10,
    });
  });
});

