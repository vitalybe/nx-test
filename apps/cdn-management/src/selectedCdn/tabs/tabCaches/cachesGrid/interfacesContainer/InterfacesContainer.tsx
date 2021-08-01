import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { ConfigurationStyles } from "common/components/configuration/_styles/configurationStyles";
import { QwiltToggle } from "common/components/configuration/qwiltForm/qwiltToggle/QwiltToggle";
import { Constants } from "src/_utils/constants";
import { CacheEntity } from "src/_domain/cacheEntity";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const InterfacesContainerView = styled.div`
  padding: 0.5em;
`;

const Title = styled.div`
  margin-bottom: 5px;
`;

const Content = styled.div`
  max-height: 200px;
  overflow-y: auto;
  width: 100%;
  padding: 0.5em;
`;

const InterfaceContainer = styled.div`
  padding: 0.5em;
  border-radius: 5px;
  box-shadow: ${ConfigurationStyles.SHADOW};
  display: flex;
  flex-direction: column;
  height: fit-content;
  width: 100%;
  margin-bottom: 10px;
`;

const Field = styled.div`
  margin-right: 0.5em;
  margin-bottom: 3px;
  display: flex;
  align-items: center;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  cache: CacheEntity | undefined;
  className?: string;
}

//endregion [[ Props ]]

export const InterfacesContainer = (props: Props) => {
  const interfaces = props.cache?.interfaces ?? [];
  return (
    <InterfacesContainerView className={props.className}>
      <Title>
        <b>{props.cache?.name}</b> Interfaces
      </Title>
      <Content>
        {interfaces.map((duInterface, i) => {
          return (
            <InterfaceContainer key={i}>
              {duInterface.cacheInterface ? (
                <>
                  <Field>Name: {duInterface.cacheInterface.name}</Field>
                  <Field>
                    IPv4: {!!duInterface.cacheInterface.ipv4Address ? duInterface.cacheInterface.ipv4Address : "N/A"}
                  </Field>
                  <Field>
                    IPv6: {!!duInterface.cacheInterface.ipv6Address ? duInterface.cacheInterface.ipv6Address : "N/A"}
                  </Field>
                </>
              ) : (
                <Field>{Constants.CACHE_DELETED_INTERFACES}</Field>
              )}
              <Field>
                Attached:
                <QwiltToggle
                  disabled={true}
                  checked={duInterface.isEnabled}
                  onChange={() => {}}
                  label={""}
                  height={15}
                  width={30}
                />
              </Field>
              {duInterface.isEnabled && <Field>Routing Name: {duInterface.routingName}</Field>}
            </InterfaceContainer>
          );
        })}
      </Content>
    </InterfacesContainerView>
  );
};
