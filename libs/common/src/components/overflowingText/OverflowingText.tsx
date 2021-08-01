import * as React from "react";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { TextTooltip } from "common/components/textTooltip/TextTooltip";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const OverflowingTextView = styled.span`
  white-space: nowrap;
  overflow: hidden;

  opacity: 1;
  text-overflow: ellipsis;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  children?: string;
  className?: string;
}

//endregion [[ Props ]]

export const OverflowingText = (props: Props) => {
  const viewRef = useRef<HTMLSpanElement | null>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (viewRef.current) {
      if (viewRef.current.offsetWidth < viewRef.current.scrollWidth) {
        setIsOverflowing(true);
      }
    }
  }, []);

  return (
    <TextTooltip content={props.children ?? ""} isEnabled={isOverflowing}>
      <OverflowingTextView ref={viewRef} className={props.className}>
        {props.children}
      </OverflowingTextView>
    </TextTooltip>
  );
};
