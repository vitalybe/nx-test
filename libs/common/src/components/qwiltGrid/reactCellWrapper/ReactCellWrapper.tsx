import * as React from "react";
import { ReactNode, useEffect, useState } from "react";
import { loggerCreator } from "../../../utils/logger";
import styled from "styled-components";
import { useRef } from "react";
import { TextTooltip } from "../../textTooltip/TextTooltip";
import { ICellRendererParams } from "ag-grid-community";

const moduleLogger = loggerCreator("__filename");

const ReactCellWrapperView = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface Props {
  children: ReactNode;
  cellRendererParams: ICellRendererParams;
  tooltipText?: string;

  className?: string;
}
// This class is for Cypress tests
// AgGrid acts weird with react components - It re-renders them twice in a strange way that causes Cypress to disconnect from the react cell
// it previously found. We could get around that by adding random sleeps but that was an error prone solution.
// This wrapper adds a "cell-mounted" classname that only appears once the react cell has settled down and get be processed by Cypress.
// It is used automatically by React cells in Ag-Grid.
export const ReactCellWrapper = (props: Props) => {
  const viewRef = useRef<HTMLDivElement | null>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isEventListenerAdded, setIsEventListenerAdded] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isEventListenerAdded) {
      props.cellRendererParams.api.addEventListener("columnResized", () => {
        if (viewRef.current) {
          setIsOverflowing(viewRef.current.offsetWidth < viewRef.current.scrollWidth);
        }
      });

      setIsEventListenerAdded(true);
    }
  }, [isEventListenerAdded, isMounted, props.cellRendererParams.api]);

  return (
    <TextTooltip
      content={props.tooltipText ?? ""}
      isEnabled={isOverflowing}
      delay={[800, 0]}
      followCursor={"initial"}
      arrow={false}
      distance={2}
      animation={"fade"}>
      <ReactCellWrapperView
        ref={viewRef}
        className={`react-cell-wrapper ${props.className ?? ""} ${isMounted ? "cell-mounted" : ""}`}>
        {props.children}
      </ReactCellWrapperView>
    </TextTooltip>
  );
};
