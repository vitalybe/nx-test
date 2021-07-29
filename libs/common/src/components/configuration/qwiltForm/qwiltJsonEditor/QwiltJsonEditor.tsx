import * as _ from "lodash";
import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled, { FlattenSimpleInterpolation } from "styled-components";
import { loggerCreator } from "common/utils/logger";
import JSONEditor, { JSONEditorOptions } from "jsoneditor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleDown, faAngleDoubleUp } from "@fortawesome/free-solid-svg-icons";
import { ConfigurationStyles } from "common/components/configuration/_styles/configurationStyles";
import { useEventCallback } from "common/utils/hooks/useEventCallback";
// @ts-ignore
import jsonlint from "jsonlint";
import "jsoneditor/dist/jsoneditor.min.css";
import { CommonColors } from "common/styling/commonColors";
import { Icons } from "common/styling/icons";
import Switch from "react-switch";

const moduleLogger = loggerCreator(__filename);
const MINIMIZED_HEIGHT = "36px";

//region [[ Styles ]]

const QwiltJsonEditorView = styled.div<{
  readonly: boolean;
  minimized: boolean;
  editorHeight: string;
  enableFullscreen: boolean;
}>`
  flex: 1 1 auto;
  display: flex;

  .jsoneditor-menu {
    display: none;
  }

  .jsoneditor-tree {
    background-color: ${(props) => (props.readonly ? "#dedede" : "#f7f7f7")};
  }

  .jsoneditor {
    border: none;
    height: ${(props) => (props.minimized ? 0 : props.enableFullscreen ? "100%" : props.editorHeight)};
    overflow: auto;
    min-height: ${(props) => (props.minimized ? 0 : "182px")};
  }

  .jsoneditor-outer.has-main-menu-bar {
    margin-top: 0;
    padding-top: 0;
  }
`;

const MinimizeBtn = styled.button`
  color: grey;
  background: transparent;
  border: none;
  flex: 1;

  outline: none;
  cursor: pointer;
`;

const TopBar = styled.div<{ minimized: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: grey;
  background-color: #f7f7f7;
  border-top: ${(props) => (props.minimized ? "none" : "1px solid #cad5d9")};
  padding: 8px;
`;

const RightToggles = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-content: center;
`;

const FullscreenContainer = styled.div`
  display: flex;
  align-content: center;
  justify-content: center;
  margin-left: 10px;
`;

const IconStyled = styled(FontAwesomeIcon)`
  margin: auto;
  cursor: pointer;
`;

const Container = styled.div<{ minimized: boolean; fullscreen: boolean; fullscreenStyle?: FlattenSimpleInterpolation }>`
  transition: 0.4s ease;
  display: flex;
  flex-direction: column;
  will-change: transform;
  ${(props) => (props.fullscreen ? props.fullscreenStyle ?? "" : "")};
  height: ${(props) => (props.minimized ? MINIMIZED_HEIGHT : props.fullscreen ? "unset" : "100%")};
`;

const SwitchToggle = styled.div`
  color: grey;
  display: flex;
  align-content: center;
  justify-content: center;
`;

const SwitchLabel = styled.label`
  margin-right: 5px;
  cursor: pointer;
  margin-top: 2px;
`;

const Label = styled.label<{ floatLabel: boolean }>`
  z-index: 1;
  ${ConfigurationStyles.STYLE_EDITOR_LABEL}
  ${(props) => props.floatLabel && ConfigurationStyles.STYLE_EDITOR_LABEL_FLOATING}
`;

const WhiteSpace = styled.div`
  flex: 1 1 auto;
`;

const Empty = styled.span<{}>`
  opacity: 0.4;
`;

const ErrorsFooter = styled.div`
  color: ${CommonColors.RADICAL_RED};
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  label?: string;
  disabled?: boolean;
  minimized?: boolean;
  canMinimize?: boolean;
  fullscreenStyle?: FlattenSimpleInterpolation;
  value: object | undefined;
  initialMode?: "text" | "form";
  showErrors?: boolean;

  onChange?: (jsonText: string, jsonObject: object | undefined, error?: string) => void;

  options?: JSONEditorOptions;
  className?: string;
}

//endregion [[ Props ]]

export const QwiltJsonEditor = (props: Props) => {
  const value: object | null = props.value ?? null;
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const jsonEditorRef = useRef<JSONEditor | null>(null);

  const upperLabel = useMemo(() => props.label ?? "JSON", [props.label]);

  const [isTextMode, setIsTextMode] = useState(props.initialMode === "text");

  const [isMinimized, setIsMinimized] = useState(
    props.minimized !== undefined ? props.minimized : props.canMinimize === true
  );

  const [isFullscreen, setIsFullscreen] = useState(false);

  const constantEditorHeight = useMemo(() => {
    if (editorContainerRef.current && isTextMode && !props.disabled) {
      return editorContainerRef.current.getBoundingClientRect().height.toString() + "px";
    } else {
      return "auto";
    }
  }, [isTextMode, props.disabled]);

  const { errorMessage, onChangeJSON, onChangeText } = useOnChangeHandler(props);

  useEffect(() => {
    // JsonEditor component wouldn't resize without this event being sent.
    // We probably wouldn't have this problem with the monaco editor, however.
    window.dispatchEvent(new Event("resize"));
  }, [isFullscreen]);

  const jsonEditorOptions = useMemo<JSONEditorOptions>(
    () => ({
      mode: props.disabled ? "view" : "form",
      search: false,
      statusBar: false,
      navigationBar: false,
      enableTransform: false,
      onChangeJSON: onChangeJSON,
      onChangeText: onChangeText,
      ...props.options,
    }),
    [onChangeJSON, onChangeText, props.disabled, props.options]
  );

  const toggleModeSwitch = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!props.disabled) {
        setIsTextMode(!isTextMode);
      }
    },
    [isTextMode, props.disabled]
  );

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFullscreen(!isFullscreen);
  };

  const toggleMinimize = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsMinimized(!isMinimized);
      if (isFullscreen) {
        setIsFullscreen(false);
      }
    },
    [isFullscreen, isMinimized]
  );

  //initialize instance & set Ref
  useEffect(() => {
    if (jsonEditorRef.current === null) {
      if (editorContainerRef.current !== null) {
        jsonEditorRef.current = new JSONEditor(editorContainerRef.current, jsonEditorOptions, value);
        // There seems to be a bug in jsonEditor in which empty objects, on update, give a different result than on initialization.
        // So we do a needless update here just to keep the JSON data in sync when initially looking the revision view or when changing
        // revisions.
        jsonEditorRef.current.update(value);
      }
    } else {
      try {
        const value1: string = JSON.stringify(jsonEditorRef.current.get());
        const value2: string = JSON.stringify(value);
        if (value1 !== value2) {
          jsonEditorRef.current.update(value);
        }
      } catch (e) {
        moduleLogger.warn("failed to parse a value");
      }
    }
  }, [jsonEditorOptions, value]);

  //update mode
  useEffect(() => {
    if (jsonEditorRef.current) {
      try {
        let mode: "view" | "code" | "form";
        if (props.disabled) {
          mode = "view";
        } else if (isTextMode && !isMinimized) {
          mode = "code";
        } else {
          mode = "form";
        }
        jsonEditorRef.current.setMode(mode);
      } catch (e) {
        moduleLogger.error("Failed to set initial mode", e);
      }
    }
  }, [isTextMode, isMinimized, props.disabled]);

  return (
    <Container
      minimized={isMinimized}
      fullscreen={isFullscreen}
      className={props.className}
      fullscreenStyle={props.fullscreenStyle}>
      <TopBar minimized={isMinimized} hidden={!props.canMinimize && props.disabled}>
        <WhiteSpace />
        {props.canMinimize ? (
          <MinimizeBtn onClick={toggleMinimize}>
            {value ? (
              <FontAwesomeIcon icon={isMinimized ? faAngleDoubleDown : faAngleDoubleUp} />
            ) : (
              <Empty>Empty</Empty>
            )}
          </MinimizeBtn>
        ) : (
          <WhiteSpace />
        )}
        {isMinimized || props.disabled ? (
          <WhiteSpace />
        ) : (
          <RightToggles>
            <SwitchToggle onClick={toggleModeSwitch}>
              <SwitchLabel>UI/JSON</SwitchLabel>
              <Switch
                onChange={() => null}
                checked={isTextMode}
                height={16}
                handleDiameter={10}
                width={25}
                uncheckedIcon={false}
                checkedIcon={false}
              />
            </SwitchToggle>
            {!!props.fullscreenStyle && (
              <FullscreenContainer onClick={toggleFullscreen}>
                <SwitchLabel>{isFullscreen ? "MIN" : "MAX"}</SwitchLabel>
                <IconStyled icon={isFullscreen ? Icons.COMPRESS : Icons.EXPAND} />
              </FullscreenContainer>
            )}
          </RightToggles>
        )}
      </TopBar>
      <Label floatLabel>{upperLabel}</Label>
      <QwiltJsonEditorView
        ref={editorContainerRef}
        readonly={props.disabled ? props.disabled : false}
        editorHeight={constantEditorHeight}
        minimized={isMinimized}
        enableFullscreen={!!props.fullscreenStyle}
      />
      {props.showErrors && <ErrorsFooter>{errorMessage}</ErrorsFooter>}
    </Container>
  );
};

function useOnChangeHandler(props: Props) {
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  // NOTE: The debounce prevents cases in which the cursor jumps after a JSON edit.
  // An example of such scenario:
  // Users select a value, e.g, in: { a: "abc" }, he selects "abc" and presses "a".
  // This triggers 2 changes:
  // 1) { a: "" }
  // 2) { a: "a" }
  // This first, intermediate change, isn't real and would cause the QwiltJsonEditor to think
  // that its props were changed, which would reload the data and move the cursor.
  // With a debounce, we only get the final value which is the same
  const debouncedOnChange = props.onChange && _.debounce(props.onChange, 100);

  const onChangeJSON = useEventCallback((jsonObject: object) => {
    props.options?.onChangeJSON?.(jsonObject);
    onChangeCallback(JSON.stringify(jsonObject) || "");
  });
  const onChangeText = useEventCallback((jsonString: string) => {
    props.options?.onChangeText?.(jsonString);
    onChangeCallback(jsonString);
  });

  function onChangeCallback(jsonText: string) {
    let jsonObject: object | undefined;
    let errorMessage: string | undefined;

    try {
      jsonObject = jsonText ? JSON.parse(jsonText) : null;
    } catch (e) {
      errorMessage = e.message;
      try {
        // jsonlint can provide much more information error messages
        jsonlint.parse(jsonText);
      } catch (e) {
        errorMessage = e.message;
      }
    }

    if (props.showErrors) {
      setErrorMessage(errorMessage);
    }

    if (debouncedOnChange) {
      debouncedOnChange(jsonText, jsonObject, errorMessage);
    }
  }

  return { onChangeJSON, onChangeText, errorMessage };
}
