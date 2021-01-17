import { IMatrix, MatrixFill } from './types';

export const matrix = (x: number, y: number) : IMatrix => {
  const dataMatrix: Array<Array<MatrixFill>> = [];

  for (let dy = 0; dy < y; dy++) {
    const matrixRow: Array<MatrixFill> = [];
    for (let dx = 0; dx < x; dx++) {
      matrixRow.push(MatrixFill.EMPTY);
    }

    dataMatrix.push(matrixRow);
  }

  return dataMatrix;
};

export const matrixClearShadows = (dataMatrix: IMatrix) : IMatrix =>
  // eslint-disable-next-line implicit-arrow-linebreak
  dataMatrix.map((y) => y.map((x) => (x === MatrixFill.SHADOW || x === MatrixFill.ERR_SHADOW ? MatrixFill.EMPTY : x)));

const matrixSetFill = (dataMatrix: IMatrix, x: number, y: number, shipSize: number, fill: MatrixFill) => {
  let dy = -1;

  return dataMatrix.map((yLine) => {
    dy += 1;
    let dx = -1;

    return yLine.map((xLine) => {
      dx += 1;

      if ((dx >= x && dx <= x + shipSize - 1) && dy === y && xLine === MatrixFill.EMPTY) {
        return fill;
      }

      return xLine;
    });
  });
};

export const matrixPointExists = (dataMatrix: IMatrix, x: number, y: number) : boolean =>
  // eslint-disable-next-line implicit-arrow-linebreak
  (dataMatrix[y] ? dataMatrix[y][x] !== undefined : false);

export const matrixRemoveChained = (dataMatrix: IMatrix, x: number, y: number) : [IMatrix, number] => {
  const matr = dataMatrix.map((yLine) => [...yLine]);
  let shipSize = 1;

  matr[y][x] = MatrixFill.EMPTY;

  let processMinus = true;
  let processPlus = true;

  for (let dx = 1; dx < 4; dx++) {
    if (!matrixPointExists(matr, x - dx, y) || matr[y][x - dx] === MatrixFill.EMPTY) processMinus = false;
    if (!matrixPointExists(matr, x + dx, y) || matr[y][x + dx] === MatrixFill.EMPTY) processPlus = false;

    if (processMinus) {
      shipSize += matr[y][x - dx] === MatrixFill.SET ? 1 : 0;
      matr[y][x - dx] = MatrixFill.EMPTY;
    }
    if (processPlus) {
      shipSize += matr[y][x + dx] === MatrixFill.SET ? 1 : 0;
      matr[y][x + dx] = MatrixFill.EMPTY;
    }
  }

  processMinus = true;
  processPlus = true;
  for (let dy = 1; dy < 4; dy++) {
    if (!matrixPointExists(matr, x, y - dy) || matr[y - dy][x] === MatrixFill.EMPTY) processMinus = false;
    if (!matrixPointExists(matr, x, y + dy) || matr[y + dy][x] === MatrixFill.EMPTY) processPlus = false;

    if (processMinus) {
      shipSize += matr[y - dy][x] === MatrixFill.SET ? 1 : 0;
      matr[y - dy][x] = MatrixFill.EMPTY;
    }
    if (processPlus) {
      shipSize += matr[y + dy][x] === MatrixFill.SET ? 1 : 0;
      matr[y + dy][x] = MatrixFill.EMPTY;
    }
  }

  return [matr, shipSize];
};

export const matrixCheckCollision = (dataMatrix: IMatrix, x: number, y: number, shipSize: number) : boolean => {
  const collisionMap: Array<[number, number]> = [];

  // Check only ship cells
  for (let dx = x; dx < x + shipSize; dx++) {
    if (!matrixPointExists(dataMatrix, dx, y)) {
      return false;
    } if (matrixPointExists(dataMatrix, dx, y) && dataMatrix[y][dx] === MatrixFill.SET) {
      return false;
    }
  }

  // Collect information about around ship positions
  collisionMap.push([x - 1, y]);
  collisionMap.push([x + shipSize, y]);

  for (let dx = x - 1; dx < x + shipSize + 1; dx++) {
    collisionMap.push([dx, y - 1]);
    collisionMap.push([dx, y + 1]);
  }

  return collisionMap.every(([lx, ly]) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    !matrixPointExists(dataMatrix, lx, ly) || dataMatrix[ly][lx] !== MatrixFill.SET);
};

export const matrixSetShadow = (dataMatrix: IMatrix, x: number, y: number, shipSize: number) : IMatrix =>
  // eslint-disable-next-line implicit-arrow-linebreak
  matrixSetFill(dataMatrix, x, y, shipSize, MatrixFill.SHADOW);

export const matrixSetErrShadow = (dataMatrix: IMatrix, x: number, y: number, shipSize: number) : IMatrix =>
  // eslint-disable-next-line implicit-arrow-linebreak
  matrixSetFill(dataMatrix, x, y, shipSize, MatrixFill.ERR_SHADOW);

export const matrixSetShip = (dataMatrix: IMatrix, x: number, y: number, shipSize: number) : IMatrix =>
  // eslint-disable-next-line implicit-arrow-linebreak
  matrixSetFill(dataMatrix, x, y, shipSize, MatrixFill.SET);

export const matrixSetKillByPosition = (dataMatrix: IMatrix, x: number, y: number) : IMatrix => {
  const cloneMatrix = dataMatrix.map((yLine) => [...yLine]);
  cloneMatrix[y][x] = MatrixFill.SET_KILL;
  return cloneMatrix;
};

export const matrixSetMissByPosition = (dataMatrix: IMatrix, x: number, y: number) : IMatrix => {
  const cloneMatrix = dataMatrix.map((yLine) => [...yLine]);
  cloneMatrix[y][x] = MatrixFill.MISS;
  return cloneMatrix;
};

export const matrixCountElements = (dataMatrix: IMatrix, fill: MatrixFill) : number =>
  // eslint-disable-next-line implicit-arrow-linebreak
  dataMatrix.reduce((accumulator, yLine) => {
    yLine.forEach((xLine) => {
      if (xLine === fill) {
        accumulator += 1;
      }
    });

    return accumulator;
  }, 0);

type TCrossingArrayItem = {
  x: number,
  y: number,
  data: MatrixFill
};

export const matrixCrossing = (needleStackMatrix: IMatrix, haystackMatrix: IMatrix) : TCrossingArrayItem[] => {
  const crossingMap: TCrossingArrayItem[] = [];

  haystackMatrix.forEach((yLine, yIndex) => {
    yLine.forEach((xLine, xIndex) => {
      if (xLine !== needleStackMatrix[yIndex][xIndex]) {
        crossingMap.push({
          x: xIndex,
          y: yIndex,
          data: xLine,
        });
      }
    });
  });

  return crossingMap;
};
