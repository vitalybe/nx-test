import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { ReportItem } from "src/reportsScreen/reportItem/ReportItem";
import { QnDeploymentEntity } from "common/domain/qwiltDeployment/qnDeploymentEntity";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const ReportsScreenView = styled.div`
  width: 100%;
`;

const Items = styled.div`
  height: auto;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding-left: 150px;
  padding-right: 150px;
`;

const Title = styled.div`
  margin-top: 100px;
  padding-left: 150px;
  padding-right: 150px;
  width: 100%;
  height: 100px;
  flex: 0 0 100%;
  font-size: 50px;
  font-weight: 700;
`;

//endregion

export interface Props {
  qnList: QnDeploymentEntity[];
  restrictedNetworkName?: string;
  className?: string;
}

export const ReportsScreen = React.memo(({ qnList, ...props }: Props) => {
  const title = "Reports" + (props.restrictedNetworkName ? " - " + props.restrictedNetworkName : "");
  return (
    <ReportsScreenView className={props.className}>
      <Title>{title}</Title>
      <Items>
        <ReportItem
          header={"Content"}
          subHeader={"How much content was delivered by the CP"}
          icon={"content"}
          reportName={"content"}
          qnList={qnList}
        />
        <ReportItem
          header={"Geo-View"}
          subHeader={"View performance data per location"}
          icon={"geo-view"}
          reportName={"geoMapping"}
          qnList={qnList}
        />
        <ReportItem
          header={"Bandwidth"}
          subHeader={"Amount of data that was transferred"}
          icon={"bandwidth"}
          reportName={"bandwidth"}
          qnList={qnList}
        />
        <ReportItem
          header={"QoE"}
          subHeader={"Quality performance by entities"}
          icon={"qo-e"}
          reportName={"qoe"}
          qnList={qnList}
        />
        <ReportItem
          header={"Utilization"}
          subHeader={"Information on the resources that we used"}
          icon={"utilization"}
          reportName={"sla"}
          qnList={qnList}
        />
        <ReportItem
          header={"Transactions"}
          subHeader={"Transactions broken down by resources"}
          icon={"transactions"}
          reportName={"transactions"}
          qnList={qnList}
        />
        <ReportItem
          header={"Summary"}
          subHeader={"Overall view of the network's performance"}
          icon={"summary"}
          reportName={"overview"}
          qnList={qnList}
        />
      </Items>
    </ReportsScreenView>
  );
});
