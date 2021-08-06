import styled from "styled-components";

export const CellLogoImg = styled.img`
  height: 2.25rem;
`;
export const CellIconImg = styled.img`
  height: 1rem;
`;
export const CellIconImgHidden = styled(CellIconImg)`
  display: none;
`;

export const CellDiv = styled.div<{ isCentered?: boolean }>`
  display: grid;
  font-size: inherit;
  grid-auto-flow: column;
  align-items: center;
  justify-items: ${(props) => (props.isCentered ? "center" : "initial")};
`;
export const ImgCellDiv = styled(CellDiv)`
  grid-gap: 1rem;
  grid-auto-columns: auto 1fr;
`;
