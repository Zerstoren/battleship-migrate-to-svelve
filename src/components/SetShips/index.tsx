import { inject, observer } from 'mobx-react';
import React, { FC, useState } from 'react';
import useWebsocketOpponent from '../../shared/hooks/websocketOpponent';
import { AppHeader } from '../../shared/StyledComponents/Headers';
import { ILobbyStore } from '../../stores/lobby';
import { IMainStore } from '../../stores/mainStore';
import SelectShipsPosition from './Field/SelectShipsPosition';
import TableField from './Field/TableField';
import { matrix } from './Field/TableField/helperFn';
import { IMatrix } from './Field/TableField/types';
import { useLocalState } from './localStore';
import { ButtonReady, ButtonReadyBlock } from './styledComponents';
import { IProps } from './types';

const SetShips: FC<IProps> = inject('mainStore')(observer((props: IProps) => {
  const mainStore = props.mainStore as IMainStore;
  const lobby = mainStore.currentLobby as ILobbyStore;

  const [dataMatrix, setMatrix] = useState<IMatrix>(matrix(lobby.x, lobby.y));

  const state = useLocalState(lobby);

  const sendReady = useWebsocketOpponent('ready', () => {
    state.setOpponentReady();

    if (state.isReady && state.opponentReady) {
      mainStore.setGameMatrix(dataMatrix);
    }
  });

  const handleReady = () => {
    state.setReady();
    sendReady({});

    if (state.isReady && state.opponentReady) {
      mainStore.setGameMatrix(dataMatrix);
    }
  };

  let buttonReady = null;

  if (state.isNoShipsLeft) {
    buttonReady = <ButtonReady onClick={handleReady} disabled={state.isReady}>Ready</ButtonReady>;
  }

  return (
    <>
      <AppHeader>Set ships</AppHeader>
      <div className="d-flex">
        <div>
          <TableField
            lobby={lobby}
            shipRestore={(n: number) => state.increseShip(n)}
            disabled={state.isReady}
            dataMatrix={dataMatrix}
            setMatrix={setMatrix}
          />
        </div>
        <SelectShipsPosition
          ships4n={state.ships4n}
          ships3n={state.ships3n}
          ships2n={state.ships2n}
          ships1n={state.ships1n}
          decraseShip={(n: number) => state.decraseShip(n)}
        >
          <ButtonReadyBlock>
            {buttonReady}
          </ButtonReadyBlock>
        </SelectShipsPosition>
      </div>
    </>
  );
}));

export default SetShips;
