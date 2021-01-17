import { calculateRequredFieldSize, onValidate } from '../helpersFns';
import { FormInputData } from '../types';

test('testFnForCheckMinimalFieldSize', () => {
  expect(calculateRequredFieldSize(1, 2, 3, 4)).toEqual(33);
});

test('Lobby name and field validation', () => {
  const values: FormInputData = {
    lobbyName: '',
    x: '0',
    y: '0',
    ships4n: '0',
    ships3n: '0',
    ships2n: '0',
    ships1n: '0',
  };

  expect(onValidate(values)).toHaveProperty('lobbyName', 'Lobby name is required');
  expect(onValidate(values)).toHaveProperty('x', 'Field is too short');
  expect(onValidate(values)).toHaveProperty('y', 'Field is too short');

  values.x = '100';
  values.y = '100';
  expect(onValidate(values)).toHaveProperty('x', 'Field is too long');
  expect(onValidate(values)).toHaveProperty('y', 'Field is too long');
});

test('Check lobby field size validate', () => {
  const values: FormInputData = {
    lobbyName: 'Name',
    x: '10',
    y: '10',
    ships4n: '1',
    ships3n: '2',
    ships2n: '3',
    ships1n: '4',
  };

  expect(onValidate(values)).toMatchObject({});

  values.ships4n = '12';
  expect(onValidate(values)).toHaveProperty('shipsCount', 'Need less ships');
});
