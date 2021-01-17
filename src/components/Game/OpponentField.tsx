import React, { FC } from 'react';
import getMapField from '../../shared/helpers/mapField';
import { ILobbyStore } from '../../stores/lobby';
import { IMatrix, MatrixFill } from '../SetShips/Field/TableField/types';

interface IProps {
  lobby: ILobbyStore,
  matrix: IMatrix,
  handleFire: null | ((data: {x: number, y: number}) => void)
}

const OpponentField: FC<IProps> = (props: IProps) => {
  const { lobby, handleFire, matrix } = props;

  const handleClick = (x: number, y: number) => {
    if (handleFire) handleFire({ x, y });
  };

  return getMapField(lobby, (x, y) => {
    let classNames = '';
    if (handleFire && matrix[y][x] === MatrixFill.EMPTY) {
      classNames += ' fire';
    } else if (matrix[y][x] === MatrixFill.MISS) {
      classNames += ' miss';
    } else if (matrix[y][x] === MatrixFill.SET_KILL) {
      classNames += ' hit';
    }

    return (
      <td
        className={classNames}
        data-x={x}
        data-y={y}
        onClick={() => handleClick(x, y)}
        key={`${y}-${x}`}
      />
    );
  });
};

export default OpponentField;
