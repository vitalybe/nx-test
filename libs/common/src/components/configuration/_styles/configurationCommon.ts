import styled from "styled-components";
import { CommonColors } from "../../../styling/commonColors";
import { lighten } from "polished";

export const SmallTitle = styled.div`
  font-size: 13px;
  font-weight: bold;
  color: ${lighten(0.2, CommonColors.BLACK)};
`;
