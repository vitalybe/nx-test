import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/index";
import { CommonUrls } from "common/index";
import { UrlParameterTypeEnum } from "common/index";
import { QnDeploymentEntity } from "common/index";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const ReportItemView = styled.div`
  margin: 20px 20px 20px 20px;
  width: 240px;
  height: 270px;
  background-color: #ffffff;
  cursor: pointer;
  box-shadow: 0 0 15px 0 rgba(167, 197, 217, 0.2);
  &:hover {
    box-shadow: 0 0 35px 0 rgba(167, 197, 217, 0.4);
    position: relative;
    top: -5px;
  }
`;

const Description = styled.div`
  width: 142px;
  height: 32px;
  font-size: 12px;
  font-weight: 300;
  text-align: center;
  color: #888888;
  width: 100%;
  padding-left: 40px;
  padding-right: 40px;
`;

const Title = styled.div`
  height: 24px;

  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
  color: #002736;
  width: 100%;
`;

const Icon = styled.img`
  width: 128px;
  margin-top: 28px;
  margin-right: 56px;
  margin-left: 56px;
  margin-bottom: 28px;
  height: 128px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  color: #002736;
`;

const ItemContainer = styled.a`
  text-decoration: none;
`;

//endregion

export interface Props {
  header: string;
  subHeader: string;
  reportName: string;
  icon: string;
  className?: string;
  qnList: QnDeploymentEntity[];
}

export const ReportItem = React.memo(({ ...props }: Props) => {
  const imageName = props.icon + ".png";
  const pathToImagesContext = require.context("common/images/reports/", true);
  const iconPath = pathToImagesContext(`./${props.icon}/${imageName}`);

  const queryParams = new URLSearchParams();
  queryParams.set("redirectTo", props.reportName);

  const currentUrl = new URLSearchParams(location.search);
  const restrictQn = currentUrl.get(UrlParameterTypeEnum.restrictQn);
  const restrictNetwork = currentUrl.get(UrlParameterTypeEnum.restrictNetwork);
  const env = currentUrl.get(UrlParameterTypeEnum.env);

  if (restrictQn) {
    const restrictQnNames = props.qnList.filter((qn) => qn.uniqueName === restrictQn).flatMap((qn) => qn.name + "@");
    if (restrictQnNames.length > 0) {
      queryParams.set("devices", restrictQnNames.join());
    }
  }

  if (restrictNetwork) {
    queryParams.set("qnDeploymentContainedIn", restrictNetwork);
  }

  if (env) {
    queryParams.set("env", env);
  }

  const getLink = () => {
    return CommonUrls.nmaUrl + "?" + queryParams.toString();
  };

  return (
    <ReportItemView className={props.className}>
      <ItemContainer target={"_blank"} href={getLink()}>
        <Icon src={iconPath} />
        <Title>{props.header}</Title>
        <Description>{props.subHeader}</Description>
      </ItemContainer>
    </ReportItemView>
  );
});
