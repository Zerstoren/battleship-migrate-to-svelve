import { mount } from 'enzyme';
import { Provider } from 'mobx-react';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { ITestBackend, TestBackend } from 'react-dnd-test-backend';
import { wrapInTestContext } from 'react-dnd-test-utils';

jest.mock('../../../shared/hooks/websocketOpponent', () => jest.fn());
import * as Websocket from '../../../shared/hooks/websocketOpponent';

import SetShips from '..';
import { IMainStore, MainStore } from '../../../stores/mainStore';
import { GameStatus } from '../../App/types';
import { act } from 'react-dom/test-utils';
import { IMatrix, MatrixFill } from '../Field/TableField/types';

class SetShipsWrapper extends React.Component {
  render() {
    return (<SetShips />);
  }
}

const mockWebsocket = () => {
  const useWebsocket: jest.Mock = Websocket.default as jest.Mock;
  
  type websocketFn = (data: Record<string, any>) => void;
  const websocketFns: Record<string, websocketFn> = {
    readyFn: () => null
  }

  const ready = jest.fn();
  useWebsocket.mockImplementation((path, fn) => {
    switch(path) {
      case 'ready':
        websocketFns.readyFn = fn;
        return ready;
      default:
        throw new Error(`Path ${path} is not resolved`);
    }
  });

  return {
    ready,
    websocketFns
  };
};

describe('SetShips', () => {
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
      }
    });

    //@ts-ignore
    Websocket.default.mockReset();
  });

  test('Check set ship', async () => {
    const SetShipsWrap = wrapInTestContext(SetShipsWrapper);
    const ref: React.RefObject<any> = React.createRef();
    const tree = mount(
      <DndProvider backend={TestBackend}>
        <Provider mainStore={mainStore}>
          <SetShipsWrap ref={ref} />
        </Provider>
      </DndProvider>
    );

    const backend: ITestBackend = ref.current.getManager().getBackend();

    act(() => {
      backend.simulateBeginDrag([tree.find('ShipElement[shipSize=4] div[data-monitorid]').prop('data-monitorid')]);
      backend.simulateHover([tree.find('Cell[x=0][y=0] td').prop('data-monitorid')]);    
      backend.simulateDrop();
      backend.simulateEndDrag();
    });

    tree.update();
    expect(tree.find('Cell[x=0][y=0] td').props().className).toBe('ship-set');
    expect(tree.find('Cell[x=1][y=0] td').props().className).toBe('ship-set');
    expect(tree.find('Cell[x=2][y=0] td').props().className).toBe('ship-set');
    expect(tree.find('Cell[x=3][y=0] td').props().className).toBe('ship-set');
    expect(tree.find('Cell[x=4][y=0] td').props().className).toBe('');
    expect(tree.find('ShipElement[shipSize=4]+span').text()).toBe(' x0');
    expect(tree.find('.btn-primary').length).toBe(1);
  });

  test('Check start game when opponent ready', () => {
    const { ready, websocketFns } = mockWebsocket();
    const SetShipsWrap = wrapInTestContext(SetShipsWrapper);
    const ref: React.RefObject<any> = React.createRef();
    const tree = mount(
      <DndProvider backend={TestBackend}>
        <Provider mainStore={mainStore}>
          <SetShipsWrap ref={ref} />
        </Provider>
      </DndProvider>
    );
    const mockSetGameMatrix = jest.spyOn(mainStore, 'setGameMatrix');
    websocketFns.readyFn({});

    const backend: ITestBackend = ref.current.getManager().getBackend();

    act(() => {
      backend.simulateBeginDrag([tree.find('ShipElement[shipSize=4] div[data-monitorid]').prop('data-monitorid')]);
      backend.simulateHover([tree.find('Cell[x=0][y=0] td').prop('data-monitorid')]);    
      backend.simulateDrop();
      backend.simulateEndDrag();
    });

    tree.update();
    expect(tree.find('Cell[x=0][y=0] td').props().className).toBe('ship-set');
    expect(tree.find('Cell[x=1][y=0] td').props().className).toBe('ship-set');
    expect(tree.find('Cell[x=2][y=0] td').props().className).toBe('ship-set');
    expect(tree.find('Cell[x=3][y=0] td').props().className).toBe('ship-set');
    expect(tree.find('Cell[x=4][y=0] td').props().className).toBe('');
    tree.find('.btn-primary').simulate('click');

    expect(mockSetGameMatrix).toBeCalled();
    const matrix: IMatrix = mockSetGameMatrix.mock.calls[0][0];
    expect(matrix[0][0]).toBe(MatrixFill.SET);
    expect(matrix[0][1]).toBe(MatrixFill.SET);
    expect(matrix[0][2]).toBe(MatrixFill.SET);
    expect(matrix[0][3]).toBe(MatrixFill.SET);
    expect(matrix[0][4]).toBe(MatrixFill.EMPTY);

    expect(ready).toBeCalled();
  });

  test('Check start game after opponent ready', () => {
    const { ready, websocketFns } = mockWebsocket();
    const SetShipsWrap = wrapInTestContext(SetShipsWrapper);
    const ref: React.RefObject<any> = React.createRef();
    const tree = mount(
      <DndProvider backend={TestBackend}>
        <Provider mainStore={mainStore}>
          <SetShipsWrap ref={ref} />
        </Provider>
      </DndProvider>
    );
    const mockSetGameMatrix = jest.spyOn(mainStore, 'setGameMatrix');

    const backend: ITestBackend = ref.current.getManager().getBackend();

    act(() => {
      backend.simulateBeginDrag([tree.find('ShipElement[shipSize=4] div[data-monitorid]').prop('data-monitorid')]);
      backend.simulateHover([tree.find('Cell[x=0][y=0] td').prop('data-monitorid')]);    
      backend.simulateDrop();
      backend.simulateEndDrag();
    });

    tree.update();
    expect(tree.find('Cell[x=0][y=0] td').props().className).toBe('ship-set');
    expect(tree.find('Cell[x=1][y=0] td').props().className).toBe('ship-set');
    expect(tree.find('Cell[x=2][y=0] td').props().className).toBe('ship-set');
    expect(tree.find('Cell[x=3][y=0] td').props().className).toBe('ship-set');
    expect(tree.find('Cell[x=4][y=0] td').props().className).toBe('');

    expect(tree.find('.btn-primary').prop('disabled')).toBeFalsy();
    tree.find('.btn-primary').simulate('click');
    expect(tree.find('.btn-primary').prop('disabled')).toBeTruthy();

    expect(ready).toBeCalled();

    expect(mockSetGameMatrix).not.toBeCalled();

    // No to action
    websocketFns.readyFn({});

    expect(mockSetGameMatrix).toBeCalled();
    const matrix: IMatrix = mockSetGameMatrix.mock.calls[0][0];
    expect(matrix[0][0]).toBe(MatrixFill.SET);
    expect(matrix[0][1]).toBe(MatrixFill.SET);
    expect(matrix[0][2]).toBe(MatrixFill.SET);
    expect(matrix[0][3]).toBe(MatrixFill.SET);
    expect(matrix[0][4]).toBe(MatrixFill.EMPTY);
  });

  test('Remove ship from field', () => {
    const SetShipsWrap = wrapInTestContext(SetShipsWrapper);
    const ref: React.RefObject<any> = React.createRef();
    const tree = mount(
      <DndProvider backend={TestBackend}>
        <Provider mainStore={mainStore}>
          <SetShipsWrap ref={ref} />
        </Provider>
      </DndProvider>
    );

    const backend: ITestBackend = ref.current.getManager().getBackend();
    expect(tree.find('ShipElement[shipSize=4]+span').text()).toBe(' x1');

    act(() => {
      backend.simulateBeginDrag([tree.find('ShipElement[shipSize=4] div[data-monitorid]').prop('data-monitorid')]);
      backend.simulateHover([tree.find('Cell[x=0][y=0] td').prop('data-monitorid')]);    
      backend.simulateDrop();
      backend.simulateEndDrag();
    });

    tree.update();
    expect(tree.find('Cell[x=0][y=0] td').props().className).toBe('ship-set');
    expect(tree.find('Cell[x=1][y=0] td').props().className).toBe('ship-set');
    expect(tree.find('Cell[x=2][y=0] td').props().className).toBe('ship-set');
    expect(tree.find('Cell[x=3][y=0] td').props().className).toBe('ship-set');
    expect(tree.find('ShipElement[shipSize=4]+span').text()).toBe(' x0');

    tree.find('Cell[x=2][y=0]').simulate('click');
    tree.update();
    expect(tree.find('Cell[x=0][y=0] td').props().className).toBe('');
    expect(tree.find('Cell[x=1][y=0] td').props().className).toBe('');
    expect(tree.find('Cell[x=2][y=0] td').props().className).toBe('');
    expect(tree.find('Cell[x=3][y=0] td').props().className).toBe('');
    expect(tree.find('ShipElement[shipSize=4]+span').text()).toBe(' x1');
  });

  test('Check shadow in map', () => {
    const SetShipsWrap = wrapInTestContext(SetShipsWrapper);
    const ref: React.RefObject<any> = React.createRef();
    const tree = mount(
      <DndProvider backend={TestBackend}>
        <Provider mainStore={mainStore}>
          <SetShipsWrap ref={ref} />
        </Provider>
      </DndProvider>
    );

    const backend: ITestBackend = ref.current.getManager().getBackend();
    expect(tree.find('ShipElement[shipSize=4]+span').text()).toBe(' x1');

    act(() => {
      backend.simulateBeginDrag([tree.find('ShipElement[shipSize=4] div[data-monitorid]').prop('data-monitorid')]);
      backend.simulateHover([tree.find('Cell[x=0][y=0] td').prop('data-monitorid')]);    
    });

    tree.update();
    expect(tree.find('Cell[x=0][y=0] td').props().className).toBe('ship-shadow');
    expect(tree.find('Cell[x=1][y=0] td').props().className).toBe('ship-shadow');
    expect(tree.find('Cell[x=2][y=0] td').props().className).toBe('ship-shadow');
    expect(tree.find('Cell[x=3][y=0] td').props().className).toBe('ship-shadow');
    expect(tree.find('Cell[x=4][y=0] td').props().className).toBe('');
    
    act(() => {
      backend.simulateDrop();
      backend.simulateEndDrag();
    });
  });

  test('Check shadow err in map', () => {
    const SetShipsWrap = wrapInTestContext(SetShipsWrapper);
    const ref: React.RefObject<any> = React.createRef();
    const tree = mount(
      <DndProvider backend={TestBackend}>
        <Provider mainStore={mainStore}>
          <SetShipsWrap ref={ref} />
        </Provider>
      </DndProvider>
    );

    const backend: ITestBackend = ref.current.getManager().getBackend();
    expect(tree.find('ShipElement[shipSize=4]+span').text()).toBe(' x1');

    act(() => {
      backend.simulateBeginDrag([tree.find('ShipElement[shipSize=4] div[data-monitorid]').prop('data-monitorid')]);
      backend.simulateHover([tree.find('Cell[x=7][y=0] td').prop('data-monitorid')]);    
    });

    tree.update();
    expect(tree.find('Cell[x=7][y=0] td').props().className).toBe('ship-err-shadow');
    expect(tree.find('Cell[x=8][y=0] td').props().className).toBe('ship-err-shadow');
    expect(tree.find('Cell[x=9][y=0] td').props().className).toBe('ship-err-shadow');

    act(() => {
      backend.simulateDrop();
      backend.simulateEndDrag();
    });

    tree.update();
    expect(tree.find('Cell[x=7][y=0] td').props().className).toBe('');
    expect(tree.find('Cell[x=8][y=0] td').props().className).toBe('');
    expect(tree.find('Cell[x=9][y=0] td').props().className).toBe('');
  });
});
