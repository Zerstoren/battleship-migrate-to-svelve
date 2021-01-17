import { DropTargetMonitor } from 'react-dnd';
import { DragObjectWithType } from 'react-dnd/lib/interfaces/hooksApi';

export enum MatrixFill {
  EMPTY = '',
  SHADOW = 's',
  ERR_SHADOW = 'e',
  SET = 'w',
  SET_KILL = 'k',
  MISS = 'm',
}

export type IMatrix = Array<Array<MatrixFill>>;

export interface DragObjectItem extends DragObjectWithType {
  size: number
}

export interface DropResult {
  item: DragObjectItem,
  monitor: DropTargetMonitor,
  result: boolean,
}
