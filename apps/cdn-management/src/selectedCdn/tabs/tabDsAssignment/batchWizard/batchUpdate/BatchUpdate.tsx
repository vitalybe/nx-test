import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { DsRuleEntity } from "../../_domain/dsRuleEntity";
import { MoonLoader } from "react-spinners";
import { CommonColors } from "@qwilt/common/styling/commonColors";
import { lighten } from "polished";
import { CopyToClipboardButton } from "@qwilt/common/components/copyToClipboardButton/CopyToClipboardButton";
import { updateRule } from "../../editorDsAssignment/EditorDsAssignment";
import _ from "lodash";
import { DsAssignmentFormData } from "../../_domain/dsAssignmentFormData";
import { useSelectedCdn } from "../../../../../_stores/selectedCdnStore";
import { DsAssignmentsProvider } from "../../_providers/dsAssignmentsProvider";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const BatchUpdateView = styled.div`
  flex: 1 1 auto;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

const ContentContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 15px;
`;

const ValidationHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const StatusImageContainer = styled.div`
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StaticRowsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 50px;
  padding-bottom: 15px;
`;

const PassedContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const ItemsStatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 50px;
  max-height: 300px;
  overflow-y: auto;
`;

const StatusRow = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
`;

const StatusImage = styled.img<{ size?: string }>`
  height: ${(props) => props.size ?? "12px"};
  width: ${(props) => props.size ?? "12px"};
`;

const StatusText = styled.span`
  margin-left: 10px;
`;

const BottomButton = styled.div`
  display: flex;
  margin-top: 1em;
  justify-content: flex-end;
`;

const Button = styled.button`
  width: 100px;
  padding: 0.5em 0;
  margin-left: 1em;
  border-radius: 5px;
  background: ${CommonColors.MATISSE};
  border: 0;
  color: ${CommonColors.MYSTIC_2};
  outline: 0;
  cursor: pointer;

  &:hover {
    background: ${lighten(0.1, CommonColors.MATISSE)};
  }

  &:active {
    background: ${lighten(0.2, CommonColors.MATISSE)};
  }

  &:disabled {
    background-color: ${CommonColors.SILVER_SAND};
    cursor: initial;
  }
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  rules: DsRuleEntity[];
  globalAssignments: DsAssignmentFormData | undefined;
  onClose: () => void;
  className?: string;
}

interface ItemStatus {
  dsRuleEntity: DsRuleEntity;
  succeeded: boolean;
  message?: string;
}

type State = "in progress" | "succeeded" | "failed";

//endregion [[ Props ]]

const successSvg = require("../../../../../images/success.svg");
const failedSvg = require("../../../../../images/failed.svg");

export const BatchUpdate = ({ globalAssignments, ...props }: Props) => {
  const cdn = useSelectedCdn();
  const totalRules = props.rules.length;
  const [succeededItems, setSucceededItems] = useState<ItemStatus[]>([]);
  const [failedItems, setFailedItems] = useState<ItemStatus[]>([]);

  const itemsStatus = useMemo(() => [...failedItems, ...succeededItems], [failedItems, succeededItems]);

  const updatedCount = succeededItems.length;

  const updateRules = useCallback(
    (rules: DsRuleEntity[]) => {
      if (globalAssignments) {
        rules.forEach(async (rule) => {
          await updateRule(
            globalAssignments,
            rule,
            () => {
              setSucceededItems((currentValue) => [
                ...currentValue,
                {
                  dsRuleEntity: rule,
                  succeeded: true,
                },
              ]);
            },
            (e: Error) => {
              setFailedItems((currentValue) => [
                ...currentValue,
                {
                  dsRuleEntity: rule,
                  succeeded: false,
                  message: e.message,
                },
              ]);
            }
          );
        });
      }
      DsAssignmentsProvider.instance.prepareQuery(cdn.id, cdn.name).invalidateWithChildren();
    },
    [cdn.id, cdn.name, globalAssignments]
  );

  useEffect(() => {
    updateRules(props.rules);
  }, [props.rules, updateRules]);

  const state: State = failedItems.length > 0 ? "failed" : updatedCount === totalRules ? "succeeded" : "in progress";

  const statusText = `Updating ${totalRules} item${totalRules > 1 ? "s" : ""}`;

  const errorsText = failedItems.flatMap((error) => error.message).join("; ");

  return (
    <BatchUpdateView className={props.className}>
      <ContentContainer>
        <ValidationHeader>
          <StatusImageContainer>
            {state === "in progress" ? (
              <MoonLoader size={20} />
            ) : (
              <StatusImage src={state === "succeeded" ? successSvg : failedSvg} size={"20px"} />
            )}
          </StatusImageContainer>
          <StatusText>{statusText}</StatusText>
        </ValidationHeader>
        <StaticRowsContainer>
          <PassedContainer>
            <StatusImage src={successSvg} />
            <StatusText>
              {updatedCount} item{updatedCount !== 1 ? "s" : ""} updated
            </StatusText>
          </PassedContainer>
          {failedItems.length > 0 && <CopyToClipboardButton title={"Copy Errors"} textToCopy={errorsText} />}
        </StaticRowsContainer>
        <ItemsStatusContainer>
          {_.orderBy(itemsStatus, ["succeeded", "dsRuleEntity.ruleType", "dsRuleEntity.name"]).map((item, i) => (
            <StatusRow key={i}>
              <StatusImage src={item.succeeded ? successSvg : failedSvg} />
              <StatusText>
                <b>
                  {item.dsRuleEntity.ruleType}: {item.dsRuleEntity.name}
                </b>
                {item.message ? " - " + item.message : ""}
              </StatusText>
            </StatusRow>
          ))}
        </ItemsStatusContainer>
      </ContentContainer>
      <BottomButton>
        <Button
          onClick={() => {
            const lastFailedItems = [...failedItems];
            setFailedItems([]);
            updateRules(lastFailedItems.flatMap((error) => error.dsRuleEntity));
          }}
          disabled={state === "in progress" || failedItems.length === 0}>
          Retry Failed
        </Button>
        <Button onClick={props.onClose} disabled={state === "in progress"}>
          Close
        </Button>
      </BottomButton>
    </BatchUpdateView>
  );
};
