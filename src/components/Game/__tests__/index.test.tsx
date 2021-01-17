import React from 'react';
import {mount} from 'enzyme';

jest.mock('../../../shared/hooks/websocketOpponent', () => jest.fn());
import * as Websocket from '../../../shared/hooks/websocketOpponent';

import { IMainStore, MainStore } from '../../../stores/mainStore';
import { FireTurn, GameStatus } from '../../App/types';
import { matrix, matrixSetShip } from '../../SetShips/Field/TableField/helperFn';
import { Provider } from 'mobx-react';
import Game from '..';
import { act } from 'react-dom/test-utils';
import wait from '../../../shared/helpers/wait';

const makeMocks = () => {
  const useWebsocket: jest.Mock = Websocket.default as jest.Mock;

  type websocketFn = (data: Record<string, any>) => void;
  const websocketFns: Record<string, websocketFn> = {
    selectWhoFirstFn: () => null,
    gameCompleteFn: () => null,
    hitResolveFn: () => null,
    fireToPositionFn: () => null
  }
    
  const [selectWhoFirst, gameComplete, hitResolve, fireToPosition] = [jest.fn(), jest.fn(), jest.fn(), jest.fn()];

  useWebsocket.mockImplementation((path, fn) => {
    switch(path) {
      case 'selectWhoFirst':
        websocketFns.selectWhoFirstFn = fn;
        return selectWhoFirst;
      case 'gameComplete':
        websocketFns.gameCompleteFn = fn;
        return gameComplete;
      case 'hitResolve':
        websocketFns.hitResolveFn = fn;
        return hitResolve;
      case 'fireToPosition':
        websocketFns.fireToPositionFn = fn;
        return fireToPosition;
      default:
        throw new Error(`Path ${path} is not resolved`);
    }
  });

  return {
    selectWhoFirst, 
    gameComplete, 
    hitResolve, 
    fireToPosition,
    websocketFns
  };
}

describe('GameProcess', () => {
  let mainStore: IMainStore;
  
  beforeEach(() => {
    mainStore = MainStore.create({
      status: GameStatus.SET_SHIPS,
      currentLobby: {
        lobbyName: 'Name',
        x: 10,
        y: 10,
        ships4n: 1,
        ships3n: 0,
        ships2n: 0,
        ships1n: 0,
      },
      gameMatrix: matrixSetShip(matrix(10, 10), 0, 0, 4)
    });

    //@ts-ignore
    Websocket.default.mockReset();
  });

  test('Simple win game', () => {
    const setGameStatus = jest.spyOn(mainStore, 'setGameStatus');

    const {
      fireToPosition,
      selectWhoFirst,
      websocketFns
    } = makeMocks();

    const tree = mount(
      <Provider mainStore={mainStore}>
        <Game />
      </Provider>
    );

    expect(mainStore.fireTurn).toBe(FireTurn.NOBODY);
    expect(selectWhoFirst).toBeCalled();
    expect(selectWhoFirst.mock.calls[0][0].rand).toBeGreaterThan(0);

    websocketFns.selectWhoFirstFn({rand: 0});
    expect(mainStore.fireTurn).toBe(FireTurn.ME);

    act(() => {
      tree.find('OpponentField td[data-x=0][data-y=0]').simulate('click');
      websocketFns.hitResolveFn({hit: true, x: 0, y: 0});
      
      tree.find('OpponentField td[data-x=1][data-y=0]').simulate('click');
      websocketFns.hitResolveFn({hit: true, x: 1, y: 0});
      
      tree.find('OpponentField td[data-x=2][data-y=0]').simulate('click');
      websocketFns.hitResolveFn({hit: true, x: 2, y: 0});
      
      tree.find('OpponentField td[data-x=3][data-y=0]').simulate('click');
      websocketFns.hitResolveFn({hit: true, x: 3, y: 0});
    });

    expect(fireToPosition).toBeCalledTimes(4);
    expect(fireToPosition.mock.calls).toEqual(    [
      [ { x: 0, y: 0 } ],
      [ { x: 1, y: 0 } ],
      [ { x: 2, y: 0 } ],
      [ { x: 3, y: 0 } ]
    ]);
    expect(mainStore.fireTurn).toBe(FireTurn.ME);
    
    websocketFns.gameCompleteFn({game: 'you_win'});
    expect(setGameStatus).toBeCalled();
    expect(setGameStatus.mock.calls[0][0]).toBe(GameStatus.GAMEWIN);
  });

  test('Simple loose game', async () => {
    const setGameStatus = jest.spyOn(mainStore, 'setGameStatus');

    const {
      hitResolve,
      websocketFns
    } = makeMocks();

    const tree = mount(
      <Provider mainStore={mainStore}>
        <Game />
      </Provider>
    );

    websocketFns.selectWhoFirstFn({rand: 1});
    expect(mainStore.fireTurn).toBe(FireTurn.OPPONENT);

    await act(async () => {
      websocketFns.fireToPositionFn({x: 0, y: 0});
      await wait(0);
      websocketFns.fireToPositionFn({x: 1, y: 0});
      await wait(0);
      websocketFns.fireToPositionFn({x: 2, y: 0});
      await wait(0);
      websocketFns.fireToPositionFn({x: 3, y: 0});
      await wait(0);
    });

    expect(hitResolve).toBeCalledTimes(4);
    expect(hitResolve.mock.calls).toEqual([
      [ { hit: true, x: 0, y: 0 } ],
      [ { hit: true, x: 1, y: 0 } ],
      [ { hit: true, x: 2, y: 0 } ],
      [ { hit: true, x: 3, y: 0 } ]
    ]);
    expect(setGameStatus).toBeCalled();
    expect(setGameStatus.mock.calls[0][0]).toBe(GameStatus.GAMEOVER);
  });

  test('Change fire queue when miss', async () => {
    const {
      hitResolve,
      fireToPosition,
      websocketFns
    } = makeMocks();

    const tree = mount(
      <Provider mainStore={mainStore}>
        <Game />
      </Provider>
    );

    websocketFns.selectWhoFirstFn({rand: 1});
    expect(mainStore.fireTurn).toBe(FireTurn.OPPONENT);

    await act(async () => {
      websocketFns.fireToPositionFn({x: 0, y: 1});
      await wait(0);
    });
    
    expect(mainStore.fireTurn).toBe(FireTurn.ME);
    expect(hitResolve).toBeCalled();
    expect(hitResolve.mock.calls[0][0]).toEqual({hit: false, x: 0, y: 1});
    tree.update();

    tree.find('OpponentField td[data-x=0][data-y=1]').simulate('click');
    expect(fireToPosition).toBeCalled();
    expect(fireToPosition.mock.calls[0][0]).toEqual({x: 0, y: 1});
    await act(async () => {
      websocketFns.hitResolveFn({hit: false, x: 0, y: 1});
      await wait(0);
    });
    expect(mainStore.fireTurn).toBe(FireTurn.OPPONENT);
  })
});
