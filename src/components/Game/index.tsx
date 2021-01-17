import { inject, observer } from 'mobx-react';
import React, {
  FC, useEffect, useRef, useState,
} from 'react';
import useWebsocketOpponent from '../../shared/hooks/websocketOpponent';
import { AppHeader } from '../../shared/StyledComponents/Headers';
import { ILobbyStore } from '../../stores/lobby';
import { IMainStore } from '../../stores/mainStore';
import { FireTurn, GameStatus } from '../App/types';
import { matrix } from '../SetShips/Field/TableField/helperFn';
import { IMatrix } from '../SetShips/Field/TableField/types';
import { useFireByPosition, useGameComplete, useHitResovle } from './hooks';
import MyField from './MyField';
import OpponentField from './OpponentField';
import { FlexGameField, MyGameField, OpponentGameField } from './styledComponents';
import { IProps } from './types';

const Game: FC<IProps> = inject('mainStore')(observer((props) => {
  const mainStore = props.mainStore as IMainStore;
  const lobby = mainStore?.currentLobby as ILobbyStore;
  const [dataMyMatrix, setMyMatrix] = useState<IMatrix>(mainStore?.gameMatrix as IMatrix);
  const [dataOpponentMatrix, setOpponentMatrix] = useState<IMatrix>(matrix(lobby.x, lobby.y));
  const randInt = useRef(Math.random());

  const selectWhoFirst = useWebsocketOpponent(
    'selectWhoFirst',
    (data: {rand: number}) => mainStore?.setFireTurn(data.rand > randInt.current ? FireTurn.OPPONENT : FireTurn.ME),
  );

  const gameComplete = useGameComplete(() => {
    mainStore.setGameStatus(GameStatus.GAMEWIN);
  });

  const hitResolve = useHitResovle(dataOpponentMatrix, (
    opponentMatrix: IMatrix,
    fireTurn: FireTurn | null,
  ) : void => {
    if (fireTurn) {
      mainStore?.setFireTurn(FireTurn.OPPONENT);
    }

    setOpponentMatrix(opponentMatrix);
  });

  const fire = useFireByPosition(
    dataMyMatrix,
    hitResolve,
    (dataMatrix: IMatrix, fireTurn: FireTurn | null) => {
      if (fireTurn) {
        mainStore?.setFireTurn(fireTurn);
      }

      setMyMatrix(dataMatrix);
    },
    () => {
      gameComplete({ game: 'you_win' });
      mainStore?.setGameStatus(GameStatus.GAMEOVER);
    },
  );

  useEffect(() => {
    if (mainStore?.fireTurn === FireTurn.NOBODY) {
      selectWhoFirst({
        rand: randInt.current,
      });
    }
  }, [randInt, mainStore?.fireTurn, selectWhoFirst]);

  return (
    <>
      <AppHeader>Fight</AppHeader>
      <FlexGameField>
        <OpponentGameField sizeX={lobby.x} sizeY={lobby.y}>
          <OpponentField
            lobby={lobby}
            matrix={dataOpponentMatrix}
            handleFire={mainStore?.fireTurn === FireTurn.ME ? fire : null}
          />
        </OpponentGameField>

        <MyGameField sizeX={lobby.x} sizeY={lobby.y}>
          <MyField lobby={lobby} matrix={dataMyMatrix} />
        </MyGameField>
      </FlexGameField>
    </>
  );
}));

export default Game;
