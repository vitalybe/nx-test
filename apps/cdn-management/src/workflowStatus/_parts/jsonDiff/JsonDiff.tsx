import * as React from "react";
import { useEffect, useRef } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { formatters } from "jsondiffpatch";
import { JsonDiffEntity } from "src/workflowStatus/_domain/jsonDiffEntity";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const JsonDiffView = styled.div`
  overflow-y: auto;
  background-color: white;

  .highlight:after {
    margin-left: 0.2rem;
    content: "⬅";
  }
`;

const NoChangesLabel = styled.div`
  font-size: 1.4rem;
  margin: 1em;
  font-weight: bold;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  diff: JsonDiffEntity;

  isOnlyShowDifferences: boolean;
  highlightedChangeIndex: number | undefined;

  className?: string;
}

//endregion [[ Props ]]

export const JsonDiff = (props: Props) => {
  const differentElementsRef = useRef<Element[]>([]);

  useEffect(() => {
    const elements = [
      ...document.querySelectorAll(".jsondiffpatch-added"),
      ...document.querySelectorAll(".jsondiffpatch-deleted"),
      ...document.querySelectorAll(".jsondiffpatch-modified"),
    ] as HTMLElement[];
    differentElementsRef.current = elements.sort((el1, el2) => {
      return el1.offsetTop > el2.offsetTop ? 1 : -1;
    });
  }, []);

  useEffect(() => {
    if (props.highlightedChangeIndex !== undefined) {
      let highlightIndex = props.highlightedChangeIndex % differentElementsRef.current.length;
      if (highlightIndex < 0) {
        highlightIndex = differentElementsRef.current.length + highlightIndex;
      }

      document.querySelectorAll('[class^="jsondiffpatch"]').forEach((node) => node.classList.remove("highlight"));
      differentElementsRef.current[highlightIndex].scrollIntoView();
      differentElementsRef.current[highlightIndex].classList.add("highlight");
    }
  }, [props.highlightedChangeIndex]);

  useEffect(() => {
    formatters.html.showUnchanged(!props.isOnlyShowDifferences);
  }, [props.isOnlyShowDifferences]);

  let contentType: "diff" | "new-only" | "no-changes";
  if (props.diff.changesAmount > 0 || !props.isOnlyShowDifferences) {
    contentType = "diff";
  } else {
    contentType = "no-changes";
  }

  const html = formatters.html.format(props.diff.delta, props.diff.left);

  return (
    <JsonDiffView className={props.className}>
      {
        {
          diff: <div dangerouslySetInnerHTML={{ __html: html }} />,
          "no-changes": <NoChangesLabel>{"No changes were found"}</NoChangesLabel>,
        }[contentType]
      }
    </JsonDiffView>
  );
};
