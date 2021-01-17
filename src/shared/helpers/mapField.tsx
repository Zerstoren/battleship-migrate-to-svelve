import React from 'react';
import { ILobbyStore } from '../../stores/lobby';
import getLetters from './letters';

type TGetElementFn = (x: number, y: number) => JSX.Element;

const getMapField = (lobby: ILobbyStore, fn: TGetElementFn): JSX.Element => {
  const letters = getLetters();
  const theadTd: JSX.Element[] = [<td key="empty" />];
  const tr: JSX.Element[] = [];

  for (let y = 0; y < lobby.y; y++) {
    const td: JSX.Element[] = [<td key={`head-${y}`}>{y + 1}</td>];

    for (let x = 0; x < lobby.x; x++) {
      td.push(fn(x, y));
    }

    tr.push(<tr key={y}>{td}</tr>);
  }

  for (let x = 0; x < lobby.x; x++) {
    theadTd.push(<td key={`head-${x}`}>{letters[x]}</td>);
  }

  return (
    <>
      <thead>
        <tr>
          {theadTd}
        </tr>
      </thead>
      <tbody>
        {tr}
      </tbody>
    </>
  );
};

export default getMapField;
