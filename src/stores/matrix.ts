import { get, Readable, writable, Writable } from "svelte/store";
import { ILobby } from "./lobby";

export enum MatrixFill {
  EMPTY = '',
  SHADOW = 's',
  ERR_SHADOW = 'e',
  SET = 'w',
  SET_KILL = 'k',
  MISS = 'm',
}

export type IMatrix = MatrixFill[][];

class Matrix {
  readonly store: Writable<IMatrix>;

  constructor({lobby, matrixData}: {lobby?: ILobby, matrixData?: IMatrix}) {
    if (lobby) {
      const lobbyData = get(lobby);
      this.store = writable<IMatrix>(this.matrix(lobbyData.x, lobbyData.y));
    } else if (matrixData) {
      this.store = writable<IMatrix>(matrixData);
    } else {
      this.store = writable<IMatrix>([]);
    }
  }

  clearShadows() {
    this.store.update((store) => {
      return store.map((y) => y.map((x) => (x === MatrixFill.SHADOW || x === MatrixFill.ERR_SHADOW ? MatrixFill.EMPTY : x)));
    });
    return this;
  }

  setShadow(x: number, y: number, shipSize: number) {
    this.matrixSetFill(x, y, shipSize, MatrixFill.SHADOW);
    return this;
  }

  setErrShadow(x: number, y: number, shipSize: number) {
    this.matrixSetFill(x, y, shipSize, MatrixFill.ERR_SHADOW);
    return this;
  }

  setShip(x: number, y: number, shipSize: number) {
    this.matrixSetFill(x, y, shipSize, MatrixFill.SET);
    return this;
  }

  matrixSetKillByPosition(x: number, y: number) : IMatrix {
    const dataMatrix = get(this.store);
    const cloneMatrix = dataMatrix.map((yLine) => [...yLine]);
    cloneMatrix[y][x] = MatrixFill.SET_KILL;
    return cloneMatrix;
  }

  matrixSetMissByPosition(x: number, y: number) : IMatrix {
    const dataMatrix = get(this.store);
    const cloneMatrix = dataMatrix.map((yLine) => [...yLine]);
    cloneMatrix[y][x] = MatrixFill.MISS;
    return cloneMatrix;
  }

  matrixCountElements (fill: MatrixFill) : number {
    const dataMatrix = get(this.store);
    return dataMatrix.reduce((accumulator, yLine) => {
      yLine.forEach((xLine) => {
        if (xLine === fill) {
          accumulator += 1;
        }
      });
  
      return accumulator;
    }, 0)
  }

  matrixPointExists(x: number, y: number) : boolean {
    const dataMatrix = get(this.store);
    return (dataMatrix[y] ? dataMatrix[y][x] !== undefined : false);
  }

  matrixCheckCollision(x: number, y: number, shipSize: number) : boolean {
    const dataMatrix = get(this.store);
    const collisionMap: Array<[number, number]> = [];
  
    // Check only ship cells
    for (let dx = x; dx < x + shipSize; dx++) {
      if (!this.matrixPointExists(dx, y)) {
        return false;
      } if (this.matrixPointExists(dx, y) && dataMatrix[y][dx] === MatrixFill.SET) {
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
      !this.matrixPointExists(lx, ly) || dataMatrix[ly][lx] !== MatrixFill.SET);
  }

  private matrixSetFill(x: number, y: number, shipSize: number, fill: MatrixFill) {
    this.store.update((store) => {
      let dy = -1;
      return store.map((yLine) => {
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
    });
  }

  private matrix(x: number, y: number) : IMatrix {
    const dataMatrix: Array<Array<MatrixFill>> = [];
  
    for (let dy = 0; dy < y; dy++) {
      const matrixRow: Array<MatrixFill> = [];
      for (let dx = 0; dx < x; dx++) {
        matrixRow.push(MatrixFill.EMPTY);
      }
  
      dataMatrix.push(matrixRow);
    }
  
    return dataMatrix;
  }
}

export default Matrix;
