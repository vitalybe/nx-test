import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { ConfigurationStyles } from "common/components/configuration/_styles/configurationStyles";
import { SmallTitle } from "common/components/configuration/_styles/configurationCommon";
import _ from "lodash";
import { BatchPreviewCaches } from "src/selectedCdn/tabs/tabCaches/batchWizardCaches/batchPreviewCaches/BatchPreviewCaches";
import { CachesGridEntity } from "src/selectedCdn/tabs/tabCaches/_domain/cachesGridEntity";
import { CacheEntityFormType } from "src/selectedCdn/tabs/tabCaches/batchWizardCaches/_domain/cacheEntitySchema";
import { BatchFormCaches } from "src/selectedCdn/tabs/tabCaches/batchWizardCaches/batchFormCaches/BatchFormCaches";
import { BatchUpdateCaches } from "src/selectedCdn/tabs/tabCaches/batchWizardCaches/batchUpdateCaches/BatchUpdateCaches";
import { Utils } from "common/utils/utils";
import { CacheGroupEntity } from "src/_domain/cacheGroupEntity";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const BatchWizardView = styled.div<{ padding?: boolean }>`
  padding: ${(props) => (props.padding ? "20px" : "0px")};
  position: relative;
  display: flex;
  min-width: 50vw;
  max-width: 80vw;
  min-height: 50vh;
  background: ${ConfigurationStyles.COLOR_BACKGROUND};
  box-shadow: ${ConfigurationStyles.SHADOW};
`;

const Title = styled(SmallTitle)`
  width: fit-content;
  margin-bottom: 0.5em;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  selectedEntities: CachesGridEntity[];
  cacheGroups: CacheGroupEntity[];

  cdnId: string;
  onCancel: () => void;
  onDone: () => void;
  className?: string;
}

//endregion [[ Props ]]

type StepType = "preview" | "form" | "update";

interface StepData {
  step: StepType;
  data?: CacheEntityFormType | undefined;
}

export const BatchWizardCaches = (props: Props) => {
  const [stepData, setStepData] = useState<StepData>({ step: "preview", data: undefined });
  const isFormStep = stepData.step === "form";

  const caches = props.selectedEntities.flatMap((entity) => entity.cache).filter(Utils.isTruthy);

  const onUpdateStep = (cachesFormData: CacheEntityFormType) => {
    setStepData({
      step: "update",
      data: cachesFormData,
    });
  };

  return (
    <BatchWizardView className={props.className} padding={!isFormStep}>
      {!isFormStep && (
        <TitleContainer>
          <Title>Batch Editor - {_.upperFirst(stepData.step)}</Title>
        </TitleContainer>
      )}
      {
        {
          preview: (
            <BatchPreviewCaches
              caches={caches}
              selectedEntities={props.selectedEntities}
              onCancel={props.onCancel}
              onNext={() => setStepData({ step: "form" })}
            />
          ),
          form: (
            <BatchFormCaches
              caches={caches}
              cacheGroups={props.cacheGroups}
              cdnId={props.cdnId}
              onCancel={props.onCancel}
              onBack={() => setStepData({ step: "preview", data: undefined })}
              onNext={onUpdateStep}
            />
          ),
          update: (
            <BatchUpdateCaches
              caches={caches}
              cacheFromData={stepData.data}
              cdnId={props.cdnId}
              onClose={props.onDone}
              onBack={() => setStepData({ step: "form" })}
            />
          ),
        }[stepData.step]
      }
    </BatchWizardView>
  );
};
