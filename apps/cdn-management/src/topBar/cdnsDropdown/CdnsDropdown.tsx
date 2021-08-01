import * as React from "react";
import { useMemo } from "react";
import styled, { css } from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { DropdownEntity } from "common/components/entitiesDropdown/_domain/dropdownEntity";
import { EntitiesDropdown } from "common/components/entitiesDropdown/EntitiesDropdown";
import { SelectionModeEnum } from "common/utils/hierarchyUtils";
import { Icons } from "common/styling/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Clickable } from "common/components/configuration/clickable/Clickable";
import { TextTooltip } from "common/components/textTooltip/TextTooltip";
import { ConfigurationStyles } from "common/components/configuration/_styles/configurationStyles";
import { CommonColors } from "common/styling/commonColors";
import { TooltipControlType, useTooltip } from "common/components/Tooltip";
import { CdnEntity } from "src/_domain/cdnEntity";
import { openConfirmModal, openQwiltModal } from "common/components/qwiltModal/QwiltModal";
import { CdnsApi } from "common/backend/cdns";
import { Notifier } from "common/utils/notifications/notifier";
import { useUrlState } from "common/utils/hooks/useUrlState";
import { ProjectUrlParams } from "src/_stores/projectUrlParams";
import { CdnEditor } from "src/topBar/cdnsDropdown/cdnEditor/CdnEditor";
import { useMutation, UseMutationResult, useQueryClient } from "react-query";
import { CdnsProvider } from "src/_providers/cdnsProvider";
import { CachesProvider } from "src/_providers/cachesProvider";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const CdnsDropdownView = styled.div``;

const customContentBasic = css`
  color: black;
  border: none;
  background-color: transparent;
  cursor: pointer;
  transition: 0.2s ease;
  padding-left: 0.3rem;

  &:hover {
    background-color: ${ConfigurationStyles.COLOR_BACKGROUND};
    box-shadow: ${ConfigurationStyles.SHADOW};
    color: black;
  }
`;

const customContentAnimation = css`
  box-shadow: ${ConfigurationStyles.SHADOW};
  color: ${CommonColors.ARAPAWA};

  &:not(:hover) {
    animation: blink 1s infinite alternate ease;
  }

  @keyframes blink {
    from {
      background-color: transparent;
    }

    to {
      background-color: ${CommonColors.MYSTIC_2};
    }
  }
`;

const MainTitle = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 18px;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 14px;
`;

const CustomHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
  width: fit-content;
`;

const AddButtonIcon = styled(FontAwesomeIcon)`
  margin-left: 0.3em;
`;

const ContentContainer = styled.div`
  min-width: 0;
`;

const RowContainer = styled.div`
  padding: 0.5rem 0;
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 0;
  overflow: hidden;
`;

const Icon = styled(FontAwesomeIcon)`
  margin-right: 0.3em;
`;

const Actions = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

const ActionButton = styled(Clickable)`
  margin-left: 0.5em;

  &:focus {
    outline: none;
  }
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  cdns: CdnEntity[];

  className?: string;
}

//endregion [[ Props ]]

export const CdnsDropdown = (props: Props) => {
  const tooltipControl: TooltipControlType = useTooltip();
  const [selectedCdnId, setSelectedCdnId] = useUrlState(ProjectUrlParams.selectedCdnId);
  const queryClient = useQueryClient();
  const deleteMutation = useMutation<void, Error, CdnEntity>(
    async (item) => {
      const caches = await CachesProvider.instance.prepareQuery(item.id).fetchQuery();
      if (caches.length > 0) {
        throw new Error(`Caches were found in CDN`);
      }

      await CdnsApi.instance.cdnDelete(item.id);
    },
    {
      onSuccess: () => {
        queryClient.removeQueries(CdnsProvider.instance.prepareQuery().key);
      },
      onError: (e) => Notifier.error("Delete failed: " + e.message, e),
    }
  );

  const isDropdownOpen = tooltipControl.isOpen;
  const hideDropdown = tooltipControl.hide;
  const items = getDropdownCdnEntities(props.cdns, selectedCdnId, hideDropdown, deleteMutation);

  const selectedEntity = useMemo(() => items.find((item) => item.selection === SelectionModeEnum.SELECTED), [items]);
  const customContentStyles = useMemo(
    () => (!!selectedEntity || isDropdownOpen ? customContentBasic : [customContentBasic, customContentAnimation]),
    [isDropdownOpen, selectedEntity]
  );

  const onSelectionChanged = (entity: DropdownEntity) => {
    const newSelectedCdn = props.cdns.find((cdn) => cdn.name === entity.label);
    if (newSelectedCdn) {
      setSelectedCdnId(newSelectedCdn.id);
    }
  };

  return (
    <CdnsDropdownView className={props.className}>
      <EntitiesDropdown
        items={items}
        tooltipControl={tooltipControl}
        componentThemeType={"light"}
        contentStyles={customContentStyles}
        dropdownSelectorRenderer={
          <ContentContainer>
            <MainTitle>
              {selectedEntity ? (
                <>
                  <Icon icon={Icons.CDN} />
                  {selectedEntity.label}
                </>
              ) : (
                <span>Select CDN</span>
              )}
            </MainTitle>
          </ContentContainer>
        }
        onSelectionChanged={(selectedItems) => onSelectionChanged(selectedItems[0])}
        selectionMode={"single"}
        isSearchable
        customHeader={
          <CustomHeaderContainer>
            <Clickable
              onClick={() => {
                hideDropdown();
                openQwiltModal((closeModalWithResult) => (
                  <CdnEditor editedItem={undefined} onClose={() => closeModalWithResult()} />
                ));
              }}>
              Add
              <AddButtonIcon icon={Icons.ADD} size={"sm"} />
            </Clickable>
          </CustomHeaderContainer>
        }
      />
    </CdnsDropdownView>
  );
};

function getDropdownCdnEntities(
  cdns: CdnEntity[],
  selectedCdnId: string | undefined,
  hideDropdown: () => void,
  deleteMutation: UseMutationResult<void, Error, CdnEntity>
): DropdownEntity[] {
  return cdns.map((cdn) => {
    return new DropdownEntity({
      id: cdn.name,
      label: cdn.name,
      selection: selectedCdnId === cdn.id ? SelectionModeEnum.SELECTED : SelectionModeEnum.NOT_SELECTED,
      rowRenderer: () => (
        <RowContainer>
          <Title>
            <Icon icon={Icons.CDN} />
            {cdn.name}
          </Title>
          <Actions>
            <TextTooltip content={"Edit"}>
              <ActionButton
                onClick={(event: React.MouseEvent<HTMLElement>) => {
                  event.stopPropagation();
                  hideDropdown();
                  openQwiltModal((closeModalWithResult) => (
                    <CdnEditor editedItem={cdn} onClose={() => closeModalWithResult()} />
                  ));
                }}>
                <FontAwesomeIcon icon={Icons.EDIT} size={"lg"} />
              </ActionButton>
            </TextTooltip>
            <ActionButton
              onClick={async (event: React.MouseEvent<HTMLElement>) => {
                event.stopPropagation();
                const toDelete = await openConfirmModal(
                  `Are you sure want to delete cdn '${cdn.name}'?`,
                  `Please confirm - ${cdn.name}`
                );

                if (toDelete) {
                  deleteMutation.mutate(cdn);
                }

                hideDropdown();
              }}>
              <FontAwesomeIcon icon={Icons.DELETE} size={"lg"} />
            </ActionButton>
          </Actions>
        </RowContainer>
      ),
    });
  });
}
