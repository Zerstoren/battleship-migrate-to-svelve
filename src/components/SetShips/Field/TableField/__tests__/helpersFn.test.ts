import * as helperFn from '../helperFn';
import { MatrixFill } from '../types';

test('matrix create', () => {
  const dataMatrix = helperFn.matrix(4, 3);

  expect(dataMatrix.length).toEqual(3);
  expect(dataMatrix[0].length).toEqual(4);
});

test('matrixPointExists', () => {
  const dataMatrix = helperFn.matrix(3, 3);

  expect(helperFn.matrixPointExists(dataMatrix, 0, 0)).toBeTruthy();
  expect(helperFn.matrixPointExists(dataMatrix, 1, 0)).toBeTruthy();
  expect(helperFn.matrixPointExists(dataMatrix, 2, 0)).toBeTruthy();
  expect(helperFn.matrixPointExists(dataMatrix, 0, 1)).toBeTruthy();
  expect(helperFn.matrixPointExists(dataMatrix, 0, 2)).toBeTruthy();

  expect(helperFn.matrixPointExists(dataMatrix, -1, 0)).toBeFalsy();
  expect(helperFn.matrixPointExists(dataMatrix, 0, -1)).toBeFalsy();
  expect(helperFn.matrixPointExists(dataMatrix, 3, 0)).toBeFalsy();
  expect(helperFn.matrixPointExists(dataMatrix, 0, 3)).toBeFalsy();
});

test('matrixSetFill', () => {
  let dataMatrix = helperFn.matrix(4, 3);
  dataMatrix = helperFn.matrixSetShip(dataMatrix, 1, 1, 2);

  expect(dataMatrix[0][1]).toEqual(MatrixFill.EMPTY);
  expect(dataMatrix[2][1]).toEqual(MatrixFill.EMPTY);
  expect(dataMatrix[1][0]).toEqual(MatrixFill.EMPTY);
  expect(dataMatrix[1][1]).toEqual(MatrixFill.SET);
  expect(dataMatrix[1][2]).toEqual(MatrixFill.SET);
  expect(dataMatrix[1][3]).toEqual(MatrixFill.EMPTY);
});

test('matrixCollision', () => {
  let dataMatrix = helperFn.matrix(4, 4);

  expect(helperFn.matrixCheckCollision(dataMatrix, 1, 1, 1)).toBeTruthy();

  dataMatrix = helperFn.matrixSetShip(dataMatrix, 1, 1, 1);

  expect(helperFn.matrixCheckCollision(dataMatrix, 3, 3, 1)).toBeTruthy();
  expect(helperFn.matrixCheckCollision(dataMatrix, 1, 2, 1)).toBeFalsy();
  expect(helperFn.matrixCheckCollision(dataMatrix, 1, 1, 1)).toBeFalsy();
});

test('matrixCollision_bigShipOutOfEdge', () => {
  const dataMatrix = helperFn.matrix(3, 3);
  expect(helperFn.matrixCheckCollision(dataMatrix, 1, 1, 3)).toBeFalsy();
});

test('matrixClearShadows', () => {
  let dataMatrix = helperFn.matrix(3, 3);
  dataMatrix = helperFn.matrixSetShadow(dataMatrix, 1, 1, 1);
  expect(dataMatrix[1][1]).toEqual(MatrixFill.SHADOW);

  dataMatrix = helperFn.matrixClearShadows(dataMatrix);
  expect(dataMatrix[1][1]).toEqual(MatrixFill.EMPTY);

  dataMatrix = helperFn.matrixSetErrShadow(dataMatrix, 1, 1, 1);
  expect(dataMatrix[1][1]).toEqual(MatrixFill.ERR_SHADOW);

  dataMatrix = helperFn.matrixClearShadows(dataMatrix);
  expect(dataMatrix[1][1]).toEqual(MatrixFill.EMPTY);
});
