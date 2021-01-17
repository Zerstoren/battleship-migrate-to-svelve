import styled from 'styled-components';

export const CenteredDiv = styled.div`
  width: 600px;
  margin: 0 auto;
  text-align: center;
`;

export const AlertError = styled.div.attrs(() => ({
  className: 'alert alert-warning alert-dismissible fade show',
}))`
text-align: center;
`;
