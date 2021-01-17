import styled from 'styled-components';

const shipColor = 'rgba(0,0,255,0.25)';
const shipShadowColor = 'rgba(0,0,255,0.12)';
const shipErrShadowColor = 'rgba(255,0,0,0.12)';

interface FieldTableProps {
  sizeX: number,
  sizeY: number,
}

export const FieldTable = styled.table.attrs(() => ({
  className: 'table table-bordered',
}))`
width: ${(props: FieldTableProps) => (props.sizeX + 1) * 30}px;
height: ${(props: FieldTableProps) => (props.sizeY + 1) * 30}px;

& td {
  width: 30px;
  height: 30px;
  padding: 0;

  &.ship-shadow {
    background-color: ${shipShadowColor};
  }
  &.ship-err-shadow {
    background-color: ${shipErrShadowColor};
  }
  &.ship-set {
    cursor: pointer;
    background-color: ${shipColor};
  }
  &.disabled {
    background-color: rgba(50,50,50,0.25);
  }
}
`;

export const ShipBlockPadding = styled.div`
padding-left: 25px;
`;

export const ShipBlockElement = styled.div.attrs(() => ({
  className: 'd-flex',
}))`
padding: 10px 0;

& span {
  padding-left: 10px;
}
`;

export const ButtonReadyBlock = styled.div`
text-align: left;
`;

export const ButtonReady = styled.button.attrs(() => ({
  className: 'btn btn-primary',
}))``;
