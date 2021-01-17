import React, { FC } from 'react';
import { useDrag } from 'react-dnd';
import { Ship, ShipBlock } from '../../../shared/StyledComponents/Ship';
import { DropResult } from './TableField/types';

interface IProp {
  onDragComplete: () => void,
  shipSize: number,
  disabled: boolean,
}

const ShipElement : FC<IProp> = (props: IProp) => {
  const { shipSize, onDragComplete, disabled } = props;
  const [collectedProps, drag] = useDrag({
    item: { type: 'ship', size: shipSize },
    collect: (monitor): Record<string, string> => ({
      monitorId: monitor.getHandlerId() as string,
    }),
    end: (item, monitor) => {
      const dropResults = monitor.getDropResult() as DropResult;
      if (monitor.didDrop() && dropResults.result) {
        onDragComplete();
      }
    },
  });

  const items: JSX.Element[] = [];

  for (let i = 0; i < shipSize; i++) {
    items.push(<ShipBlock key={`ship_size_element_${i}`} />);
  }

  if (disabled) {
    return (
      <Ship className="disabled">
        {items}
      </Ship>
    );
  }
  return (
    <Ship ref={drag} data-monitorid={collectedProps.monitorId}>
      {items}
    </Ship>
  );
};

export default ShipElement;
