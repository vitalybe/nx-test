import * as React from "react";
import styled from "styled-components";

//region [[ Styles ]]

const ExpandCaretSvg = styled.svg`
  path {
    transition: 100ms ease-in;
  }
`;
//endregion [[ Styles ]]

//region [[ Props ]]
export interface Props {
  isExpanded?: boolean;
  onClick?: (event: React.MouseEvent<SVGElement>) => void;
  className?: string;
}
//endregion [[ Props ]]

export const ExpandCaret = ({ isExpanded, ...props }: Props) => {
  return (
    <ExpandCaretSvg
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16">
      <path
        fill="#07394C"
        fillRule="evenodd"
        d="M11 11.833L7.27 8 11 4.167 9.865 3 5 8 9.865 13z"
        transform={`rotate(${isExpanded ? "-90" : "-180"} 8 8)`}
      />
    </ExpandCaretSvg>
  );
};
