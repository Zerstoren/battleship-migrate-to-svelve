import { ISnapshotOutLobbyStore } from '../../stores/lobby';
import { FormErrors, FormInputData } from './types';

export const calculateRequredFieldSize = (
  ships4n: number,
  ships3n: number,
  ships2n: number,
  ships1n: number,
) : number => Number(((ships4n * 4) + (ships3n * 3) + (ships2n * 2) + (ships1n * 1)) * 1.65);

export const convertFormDataToModel = (values: FormInputData) : ISnapshotOutLobbyStore => ({
  lobbyName: values.lobbyName,
  x: Number.parseInt(values.x),
  y: Number.parseInt(values.y),
  ships1n: Number.parseInt(values.ships1n),
  ships2n: Number.parseInt(values.ships2n),
  ships3n: Number.parseInt(values.ships3n),
  ships4n: Number.parseInt(values.ships4n),
});

export const onValidate = (formData: FormInputData) : FormErrors => {
  const err: FormErrors = {};
  const fields = convertFormDataToModel(formData);

  if (!fields.lobbyName.length) {
    err.lobbyName = 'Lobby name is required';
  }

  if (fields.x <= 4) {
    err.x = 'Field is too short';
  } else if (fields.x >= 50) {
    err.x = 'Field is too long';
  }

  if (fields.y <= 4) {
    err.y = 'Field is too short';
  } else if (fields.y >= 50) {
    err.y = 'Field is too long';
  }

  if (
    (fields.x * fields.y) < calculateRequredFieldSize(fields.ships4n, fields.ships3n, fields.ships2n, fields.ships1n)
  ) {
    err.shipsCount = 'Need less ships';
    err.ships4n = 'Need less ships';
    err.ships3n = 'Need less ships';
    err.ships2n = 'Need less ships';
    err.ships1n = 'Need less ships';
  }

  return err;
};
