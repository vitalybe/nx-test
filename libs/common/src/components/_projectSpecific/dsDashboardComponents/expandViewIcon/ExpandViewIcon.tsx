import * as React from "react";
import styled from "styled-components";

//region [[ Styles ]]

const ExpandViewIconSvg = styled.svg<{}>`
  flex: 0 0 auto;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

interface Props {
  isExpanded: boolean;
  className?: string;
}

//endregion [[ Props ]]

export const ExpandViewIcon = ({ isExpanded, ...props }: Props) => {
  return (
    <ExpandViewIconSvg
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16">
      {isExpanded ? (
        <path
          fill="#407BFB"
          fillRule="evenodd"
          d="M14 11v2H5v-2h9zM4 11v2H2v-2h2zm10-4v2H5V7h9zM4 7v2H2V7h2zm10-4v2H5V3h9zM4 3v2H2V3h2z"
        />
      ) : (
        <path
          fill="#407BFB"
          fillRule="evenodd"
          d="M14 12v2H5v-2h9zM4 12v2H2v-2h2zm10-4v2H5V8h9zM4 8v2H2V8h2zm10-7v1h-.002v3h-1V2.909L9.003 6.157 5.68 3.71 2.147 5.74V4.346l3.533-1.96 3.316 2.255L12.15 2H10V1h4z"
        />
      )}
    </ExpandViewIconSvg>
  );
};
