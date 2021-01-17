import React, { FC } from 'react';
import getMapField from '../../shared/helpers/mapField';
import { ILobbyStore } from '../../stores/lobby';
import { IMatrix, MatrixFill } from '../SetShips/Field/TableField/types';

interface IProps {
  lobby: ILobbyStore,
  matrix: IMatrix
}

const MyField: FC<IProps> = (props: IProps) => {
  const { lobby, matrix } = props;

  return getMapField(lobby, (x, y) => {
    let classNames = '';

    if (matrix[y][x] === MatrixFill.MISS) {
      classNames += ' miss';
    } else if (matrix[y][x] === MatrixFill.SET_KILL) {
      classNames += ' hit';
    }

    return (
      <td
        key={`${y}-${x}`}
        className={(matrix[y][x] === 'w' ? 'ship-set' : '') + classNames}
      />
    );
  });
};

export default MyField;
