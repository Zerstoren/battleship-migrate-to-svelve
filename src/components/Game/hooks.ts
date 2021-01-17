import useWebsocketOpponent, { ISendFn } from '../../shared/hooks/websocketOpponent';
import { FireTurn } from '../App/types';
import {
  matrixCountElements, matrixSetKillByPosition, matrixSetMissByPosition,
} from '../SetShips/Field/TableField/helperFn';
import { IMatrix, MatrixFill } from '../SetShips/Field/TableField/types';

type IGameComplete = ISendFn;
type TUseGameCompleteFn = () => void;
const useGameComplete = (
  fn: TUseGameCompleteFn,
) : IGameComplete => useWebsocketOpponent('gameComplete', (data: {game: string}) => {
  if (data.game === 'you_win') {
    fn();
  }
});

type IHitResolve = ISendFn;
type TUseHitResolveArg = (opponentMatrix: IMatrix, turn: FireTurn | null) => void;
const useHitResovle = (
  dataOpponentMatrix: IMatrix,
  fn: TUseHitResolveArg,
) : IHitResolve => useWebsocketOpponent('hitResolve', (data: {x: number, y: number, hit: boolean}) => {
  const { hit, x, y } = data;

  if (!hit) {
    fn(
      matrixSetMissByPosition(dataOpponentMatrix, x, y),
      FireTurn.OPPONENT,
    );
  } else {
    fn(
      matrixSetKillByPosition(dataOpponentMatrix, x, y),
      null,
    );
  }
});

type TApplyMyMatrix = (matrix: IMatrix, fireTurn: FireTurn | null) => void;
type TGameComplete = () => void;
const useFireByPosition = (
  dataMyMatrix: IMatrix,
  hitResolve: IHitResolve,
  fnApplyMatrix: TApplyMyMatrix,
  gameComplete: TGameComplete,
) : ISendFn => useWebsocketOpponent('fireToPosition', (data: {x: number, y: number}) => {
  const [x, y] = [data.x, data.y];

  hitResolve({
    hit: dataMyMatrix[y][x] === MatrixFill.SET,
    x,
    y,
  });

  if (dataMyMatrix[y][x] !== MatrixFill.SET) {
    fnApplyMatrix(
      matrixSetMissByPosition(dataMyMatrix, x, y),
      FireTurn.ME,
    );
  } else {
    const newMatrix = matrixSetKillByPosition(dataMyMatrix, x, y);
    fnApplyMatrix(
      newMatrix,
      null,
    );

    if (matrixCountElements(newMatrix, MatrixFill.SET) === 0) {
      gameComplete();
    }
  }
});

export {
  useGameComplete,
  useHitResovle,
  useFireByPosition,
};
