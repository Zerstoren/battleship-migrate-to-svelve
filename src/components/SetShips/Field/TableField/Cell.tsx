import { EventEmitter } from 'events';
import React, { FC, useEffect, useState } from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { MatrixFill, DragObjectItem, DropResult } from './types';

interface IProps {
  onDropShip: (x: number, y: number, shipSize: number) => boolean,
  onShadowShipDrop: (x: number, y: number, shipSize: number) => void,
  onRemoveFromField: (x: number, y: number) => void,
  emitter: EventEmitter,
  fill: MatrixFill,
  x: number,
  y: number,
  disabled: boolean,
}

const Cell : FC<IProps> = (props: IProps) => {
  const {
    onDropShip,
    onShadowShipDrop,
    onRemoveFromField,
    x,
    y,
    fill,
    disabled,
    emitter,
  } = props;

  const [collectedProps, drop] = useDrop<DragObjectItem, DropResult, Record<string, string>>({
    accept: 'ship',
    collect: (monitor: DropTargetMonitor): Record<string, string> => ({
      monitorId: monitor.getHandlerId() as string,
    }),

    drop: (item, monitor): DropResult | undefined => ({
      item,
      monitor,
      result: onDropShip(x, y, item.size),
    }),

    hover: (item) => {
      onShadowShipDrop(x, y, item.size);
    },
  });

  const [classNames, setClassNames] = useState<string>('');
  const [fillState, setFillState] = useState<MatrixFill>(fill);

  const handleClick = () => fillState === MatrixFill.SET && onRemoveFromField(x, y);

  useEffect(() => {
    let fillClass = '';

    switch (fillState) {
      case MatrixFill.SHADOW:
        fillClass = 'ship-shadow';
        break;

      case MatrixFill.ERR_SHADOW:
        fillClass = 'ship-err-shadow';
        break;

      case MatrixFill.SET:
        fillClass = 'ship-set';
        break;

      default:
        break;
    }

    if (fillClass && disabled) {
      fillClass = 'disabled';
    }

    setClassNames(fillClass);
  }, [fillState, disabled, setClassNames]);

  useEffect(() => {
    const getMessage = (emitterFill: MatrixFill) => {
      setFillState(emitterFill);
    };

    emitter.on(`${x}_${y}`, getMessage);

    return () => {
      emitter.off(`${x}_${y}`, getMessage);
    };
  }, [emitter, x, y]);

  return (<td ref={drop} data-monitorid={collectedProps.monitorId} className={classNames} onClick={handleClick} />);
};

export default Cell;
