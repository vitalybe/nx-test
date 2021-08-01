import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { MissingAgreementLinkEntity } from "../../../../../_domain/missingAgreementLinkEntity";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkSquareAlt } from "@fortawesome/free-solid-svg-icons/faExternalLinkSquareAlt";
import { CommonUrls } from "@qwilt/common/utils/commonUrls";
import { ConfigurationStyles } from "@qwilt/common/components/configuration/_styles/configurationStyles";
import { Params as DeliveryAgreementsParams } from "@qwilt/common/urlParams/deliveryAgreementsManagementUrlParams";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const MissingAgreemenentErrorView = styled.div``;

const ExternalLink = styled.a`
  text-decoration: none;
  color: ${ConfigurationStyles.COLOR_CLICKABLE};
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  missingAgreementLink: MissingAgreementLinkEntity;

  className?: string;
}

//endregion [[ Props ]]

export const MissingAgreemenentError = (props: Props) => {
  const params = new URLSearchParams();
  params.set(DeliveryAgreementsParams.createMode, "true");
  params.set(DeliveryAgreementsParams.networkId, props.missingAgreementLink.networkId.toString());
  params.set(DeliveryAgreementsParams.dsMetadataId, props.missingAgreementLink.dsMetadataId.toString());

  return (
    <MissingAgreemenentErrorView className={props.className}>
      <p>
        Delivery Agreement is missing between <b>{props.missingAgreementLink.dsMetadataName}</b> and{" "}
        <b>{props.missingAgreementLink.networkName}</b>.
      </p>
      <p>
        <b>
          <ExternalLink
            href={CommonUrls.buildUrl(`/delivery-agreements-management?${params.toString()}`, false)}
            target={"_blank"}>
            Create Delivery Agreement <FontAwesomeIcon icon={faExternalLinkSquareAlt} />
          </ExternalLink>
        </b>
      </p>
    </MissingAgreemenentErrorView>
  );
};
