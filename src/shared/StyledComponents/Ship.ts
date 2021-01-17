import styled from 'styled-components';

const shipColor = 'rgba(0,0,0,0.25)';

export const ShipBlock = styled.div`
width: 30px;
height: 30px;
border-left: 1px solid ${shipColor};
border-top: 1px solid ${shipColor};
border-bottom: 1px solid ${shipColor};
border-radius: 2px;

:last-child {
  border-right: 1px solid ${shipColor};
}
`;

export const Ship = styled.div.attrs((props) => ({
  className: `d-flex ${props.className as string}`,
}))`

${ShipBlock} {
  background-color: rgba(0,0,200, 0.12);
}

&.disabled {
  ${ShipBlock} {
    background-color: rgba(100,100,100, 0.12);
  }
}

:hover {
  ${ShipBlock} {
    background-color: rgba(0,0,200, 0.25);
  }
}

&.disabled:hover {
  ${ShipBlock} {
    background-color: rgba(100,100,100, 0.12);
  }
}
`;
