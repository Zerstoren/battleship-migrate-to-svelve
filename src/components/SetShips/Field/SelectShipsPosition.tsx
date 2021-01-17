import { observer } from 'mobx-react';
import React, { FC } from 'react';
import { ShipBlockElement, ShipBlockPadding } from '../styledComponents';
import ShipElement from './ShipElement';

interface IProp {
  ships4n: number,
  ships3n: number,
  ships2n: number,
  ships1n: number,
  decraseShip: (shipSize: number) => void
}

const SelectShipsPosition: FC<IProp> = observer((props: React.PropsWithChildren<IProp>) => {
  const {
    ships4n, ships3n, ships2n, ships1n, decraseShip,
  } = props;

  return (
    <>
      <ShipBlockPadding>
        <ShipBlockElement>
          <ShipElement shipSize={4} disabled={!ships4n} onDragComplete={() => decraseShip(4)} />
          <span>
            {' '}
            x
            {ships4n}
          </span>
        </ShipBlockElement>
        <ShipBlockElement>
          <ShipElement shipSize={3} disabled={!ships3n} onDragComplete={() => decraseShip(3)} />
          <span>
            {' '}
            x
            {ships3n}
          </span>
        </ShipBlockElement>
        <ShipBlockElement>
          <ShipElement shipSize={2} disabled={!ships2n} onDragComplete={() => decraseShip(2)} />
          <span>
            {' '}
            x
            {ships2n}
          </span>
        </ShipBlockElement>
        <ShipBlockElement>
          <ShipElement shipSize={1} disabled={!ships1n} onDragComplete={() => decraseShip(1)} />
          <span>
            {' '}
            x
            {ships1n}
          </span>
        </ShipBlockElement>

        {props.children}
      </ShipBlockPadding>
    </>
  );
});

export default SelectShipsPosition;
