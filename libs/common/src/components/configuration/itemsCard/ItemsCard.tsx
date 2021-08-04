import * as React from "react";
import { ReactNode, useCallback, useState } from "react";
import styled, { css } from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { SmallTitle } from "common/components/configuration/_styles/configurationCommon";
import { Icons } from "common/styling/icons";
import { ConfigurationStyles } from "common/components/configuration/_styles/configurationStyles";
import { Clickable } from "common/components/configuration/clickable/Clickable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { QwiltInput } from "common/components/configuration/qwiltForm/qwiltInput/QwiltInput";
import _ from "lodash";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const ItemsCardView = styled.div`
  display: flex;
  flex-direction: column;

  background: ${ConfigurationStyles.COLOR_BACKGROUND};
  box-shadow: ${ConfigurationStyles.SHADOW};
  font-size: 1em;
  // line height by default is below font-size
  line-height: 1.5em;
  border-radius: 5px;

  min-width: 0;
`;

const CONTAINER_PADDING = css`
  padding: 0.5em 0.5em;
`;

const TopPart = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 0.5rem;

  ${CONTAINER_PADDING};
  padding-bottom: 0;
`;

const AddButton = styled(Clickable)`
  font-size: 12px;
  text-transform: uppercase;
`;

const AddButtonIcon = styled(FontAwesomeIcon)`
  margin-left: 0.3em;
`;

export const ItemsCardContent = styled.div`
  ${(props: { scroll: boolean }) => css`
    flex: 1;
    ${CONTAINER_PADDING};

    display: flex;
    flex-direction: column;
    overflow: hidden;
    overflow-y: ${props.scroll ? "auto" : "hidden"};
    height: 100%;
  `};
`;

const BottomContainer = styled.div`
  ${CONTAINER_PADDING};

  border-top: 1px solid ${ConfigurationStyles.COLOR_BLUE_4};
  padding-top: 1em;
`;
const FilterInput = styled(QwiltInput)``;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  title: ReactNode;

  filter?: {
    onFilter: (filter: string) => void;
    filterValue: string;
    debounce?: number;
  };

  onAddButton?: () => void;
  customActionButton?: ReactNode;
  scroll?: boolean;

  children: ReactNode | ReactNode[];

  className?: string;
}

//endregion [[ Props ]]

export const ItemsCard = (props: Props) => {
  const [filter, setFilter] = useState<string>(props.filter?.filterValue ?? "");
  const debounceWait = props.filter?.debounce ?? 0;
  function onFilterChange(newFilter: string) {
    setFilter(newFilter);
    debounce(newFilter);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounce = useCallback(
    _.debounce((value: string) => {
      if (props.filter) {
        props.filter.onFilter(value);
      }
    }, debounceWait),
    []
  );

  return (
    <ItemsCardView className={props.className}>
      {(props.title || props.onAddButton) && (
        <TopPart>
          <SmallTitle>{props.title}</SmallTitle>
          {!props.customActionButton
            ? props.onAddButton && (
                <AddButton onClick={props.onAddButton}>
                  <span>Add</span>
                  <AddButtonIcon icon={Icons.ADD} />
                </AddButton>
              )
            : props.customActionButton}
        </TopPart>
      )}
      <ItemsCardContent scroll={props.scroll !== undefined ? props.scroll : true}>{props.children}</ItemsCardContent>
      {props.filter && (
        <BottomContainer>
          <FilterInput autoComplete={false} label={"Filter"} value={filter} onChange={onFilterChange} />
        </BottomContainer>
      )}
    </ItemsCardView>
  );
};
