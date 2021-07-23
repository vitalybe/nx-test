import { ProviderDataContainer } from "common/components/providerDataContainer/ProviderDataContainer";
import styled from "styled-components";

export const PANELS_CONTAINER_HEIGHT = "22rem";

export const Separator = styled.div`
  width: 1px;
  opacity: 0.1;
  border: solid 1px #979797;
`;

export const PanelsContainer = styled(ProviderDataContainer)<{ height: string | number }>`
  position: relative;
  display: grid;
  width: 100%;
  min-height: ${(props) => props.height};
  height: ${(props) => props.height};
  margin: ${(props) => (props.height !== PANELS_CONTAINER_HEIGHT ? 0 : "1.5rem")} 0;
  opacity: ${(props) => (props.height !== PANELS_CONTAINER_HEIGHT ? 0 : 1)};
  overflow: hidden;
  will-change: transform;
  transition: 400ms ease-in;
`;
