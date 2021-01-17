import styled from 'styled-components';

interface FieldTableProps {
  sizeX: number,
  sizeY: number,
}

const shipColor = 'rgba(0,0,255,0.25)';

export const FlexGameField = styled.div.attrs(() => ({
  className: 'd-flex',
}))``;

export const MyGameField = styled.table.attrs<FieldTableProps>(() => ({
  className: 'table table-bordered',
}))`
width: ${(props: FieldTableProps) => (props.sizeX + 1) * 30}px;
height: ${(props: FieldTableProps) => (props.sizeY + 1) * 30}px;
margin: 0 15px;

& td {
  width: 30px;
  height: 30px;
  padding: 0;

  &.ship-set {
    background-color: ${shipColor};
  }

  &.miss:after {
    content: '.';
  }

  &.hit {
    background-color: rgba(0, 255, 0, 0.125);

    &:after {
      content: 'x';
    }
  }
}
`;

export const OpponentGameField = styled(MyGameField)`

& td {
  &.fire {
    cursor: pointer;
    background-color: rgba(255, 0, 0, 0.05)
  }

  &.miss:after {
    content: '.';
  }

  &.hit {
    background-color: rgba(0, 255, 0, 0.125);

    &:after {
      content: 'x';
    }
  }
}
`;
