import styled from "styled-components";

export const InputRow = styled.div<{ columns: string }>`
  display: grid;
  grid-template-columns: ${(props) => props.columns};
  gap: 1rem;
  align-items: center;
`;
