import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { MoonLoader } from "react-spinners";
import { CommonColors } from "@qwilt/common/styling/commonColors";
import { lighten } from "polished";
import { CopyToClipboardButton } from "@qwilt/common/components/copyToClipboardButton/CopyToClipboardButton";
import _ from "lodash";
import { CacheEntityFormType } from "../_domain/cacheEntitySchema";
import { CdnsApi } from "@qwilt/common/backend/cdns";
import { CacheEntity } from "../../../../../_domain/cacheEntity";

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
  caches: CacheEntity[];
  cacheFromData: CacheEntityFormType | undefined;
  cdnId: string;
  onClose: () => void;
  onBack: () => void;
  className?: string;
}

interface ItemStatus {
  cache: CacheEntity;
  succeeded: boolean;
  message?: string;
}

type State = "in progress" | "succeeded" | "failed";

//endregion [[ Props ]]

const successSvg = require("../../../../../images/success.svg");
const failedSvg = require("../../../../../images/failed.svg");

export const BatchUpdateCaches = ({ cacheFromData, ...props }: Props) => {
  const totalCaches = props.caches.length;
  const enabledFields = useMemo(() => {
    if (cacheFromData) {
      return Object.keys(cacheFromData).map((key) => {
        // @ts-ignore
        if (!cacheFromData.disabledFields[key] && key !== "disabledFields") {
          return key;
        }
      });
    } else {
      return [];
    }
  }, [cacheFromData]);
  const [succeededItems, setSucceededItems] = useState<ItemStatus[]>([]);
  const [failedItems, setFailedItems] = useState<ItemStatus[]>([]);

  const itemsStatus = useMemo(() => [...failedItems, ...succeededItems], [failedItems, succeededItems]);

  const updatedCount = succeededItems.length;

  const updateRules = useCallback(
    (caches: CacheEntity[]) => {
      if (cacheFromData) {
        caches.forEach(async (cache) => {
          const newCache = new CacheEntity({
            ...cache,
          });
          enabledFields.forEach((field) => {
            if (field) {
              // @ts-ignore
              newCache[field] = cacheFromData[field];
            }
          });

          newCache.monitoringSegmentId =
            newCache.monitoringSegmentId === "" || newCache.monitoringSegmentId === "---"
              ? undefined
              : newCache.monitoringSegmentId;

          const editedCache = newCache.toEditApiType();
          try {
            await CdnsApi.instance.deliveryUnitsUpdate(props.cdnId, newCache.id, editedCache);
            setSucceededItems((currentValue) => [
              ...currentValue,
              {
                cache: cache,
                succeeded: true,
              },
            ]);
          } catch (e) {
            setFailedItems((currentValue) => [
              ...currentValue,
              {
                cache: cache,
                succeeded: false,
                message: e.message,
              },
            ]);
          }
        });
      }
    },
    [cacheFromData, enabledFields, props.cdnId]
  );

  useEffect(() => {
    updateRules(props.caches);
  }, [props.caches, updateRules]);

  const state: State = failedItems.length > 0 ? "failed" : updatedCount === totalCaches ? "succeeded" : "in progress";

  const statusText = `Updating ${totalCaches} item${totalCaches > 1 ? "s" : ""}`;

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
                <b>{item.cache.name}</b>
                {item.message ? " - " + item.message : ""}
              </StatusText>
            </StatusRow>
          ))}
        </ItemsStatusContainer>
      </ContentContainer>
      <BottomButton>
        <Button onClick={props.onBack}>{"< Back"}</Button>
        <Button
          onClick={() => {
            const lastFailedItems = [...failedItems];
            setFailedItems([]);
            updateRules(lastFailedItems.flatMap((error) => error.cache));
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
