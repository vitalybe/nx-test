import * as React from "react";
import { MutableRefObject, ReactChild, ReactElement, useEffect, useRef, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { loggerCreator } from "../../../../../utils/logger";
import { Notifier } from "../../../../../utils/notifications/notifier";
import { AlertIcon, DuplicateIcon } from "../../../../qcComponents/_styled/styledIcons";
import { AsyncQcButton } from "../../../../qcComponents/asyncQcButton/AsyncQcButton";
import { QcButton } from "../../../../qcComponents/_styled/qcButton/QcButton";
import { QcButtonThemes } from "../../../../qcComponents/_styled/qcButton/_themes";
import html2canvas from "html2canvas";
import jsPDF, { DocumentProperties } from "jspdf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFilePdf } from "@fortawesome/free-regular-svg-icons";
import { sleep } from "../../../../../utils/sleep";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]
const GlobalExportStyle = createGlobalStyle`
  :root {
    font-size: 16px !important;
  }
  .react-confirm-alert-overlay {
    background-color: white !important;
    opacity: 1 !important;
    animation: none !important;
  }
`;

const FontAwesomeIconStyled = styled(FontAwesomeIcon)`
  margin-right: 0.5rem;
  font-size: 1rem;
`;

export const InvisibleRenderDiv = styled.div`
  position: fixed;
  left: -1000vw;
  width: fit-content;
`;

const CancelButton = styled(QcButton)`
  padding: 0.75rem 1rem;
  height: 100%;
`;

const MessageContainer = styled.div``;
const IconContainer = styled.div`
  margin-right: 1.5rem;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const Controls = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-flow: column;
  grid-gap: 0.5rem;
  justify-items: flex-end;
  margin-top: auto;
`;

const ExportDialogView = styled.div`
  width: 30rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  // use children to render print element only when dialog is open - children override printRef
  children?: ReactChild;
  // can use external ref if you choose to render the print element outside/regardless of the dialog
  printRef?: MutableRefObject<HTMLElement | null>;
  xlsxExportCallback: () => void;
  closeFn: () => void;
  isPdfPages?: boolean;
  isPdfSave?: boolean;
  isPdfPreview?: boolean;
  hasData: boolean;
  pdfProperties?: DocumentProperties;
  className?: string;
}
type PageData = {
  image: string;
  format: [number, number]; // [width, height]
};

//endregion [[ Props ]]

export const ExportDialog = ({ closeFn, isPdfPages, ...props }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isError, setIsError] = useState(false);
  const toPDFComponentRef = useRef<HTMLElement | null>(null);

  const onPDFClick = async () => {
    if (isLoading) {
      return;
    }
    const element = toPDFComponentRef.current ?? props.printRef?.current;
    if (element && props.hasData) {
      setIsLoading(true);
      let pdf: jsPDF | undefined;
      try {
        const elements: Element[] = isPdfPages ? Array.from(element.children) : [element];
        const promises: Promise<PageData>[] = [];
        // create images for pages
        for (const element of elements) {
          promises.push(
            html2canvas(element as HTMLElement).then((canvas) => {
              return {
                image: canvas.toDataURL("image/jpeg"),
                format: [element.clientWidth, element.clientHeight],
              };
            })
          );
        }

        const pages: PageData[] = await Promise.all(promises);
        pdf = new jsPDF({ format: pages[0].format, orientation: "p", unit: "px" });
        // add images as pdf pages
        for (let i = 0; i < pages.length; i++) {
          const {
            image,
            format: [width, height],
          } = pages[i];
          // if its not the first page, we create one
          if (i > 0) {
            pdf.addPage([width, height]);
          }
          pdf.setPage(i + 1).addImage(image, "JPEG", 0, 0, width, height, `page_${i + 1}`, "FAST");
        }
      } catch (e) {
        setIsError(true);
        Notifier.modal("Failed to export PDF", e);
      } finally {
        setIsLoading(false);
        await sleep(1000);
        if (pdf) {
          pdf.setProperties(props.pdfProperties ?? {});
          if (props.isPdfPreview) {
            pdf.output("dataurlnewwindow");
          }
          if (props.isPdfSave) {
            pdf.save(props.pdfProperties?.title ?? "pdf-export");
          }
        }
      }
    }
  };

  const controlsTheme = QcButtonThemes.dialogConfirm;

  useEffect(() => {
    if (isFinished && !isError) {
      closeFn();
    }
  }, [isFinished, isError, closeFn]);

  return (
    <ExportDialogView className={props.className}>
      {props.hasData && props.children && (
        <InvisibleRenderDiv>{createChildWithReference(props.children, toPDFComponentRef)}</InvisibleRenderDiv>
      )}
      <Content>
        <IconContainer>{props.hasData ? <DuplicateIcon /> : <AlertIcon />}</IconContainer>
        <MessageContainer>
          {props.hasData ? "What kind of export do you want to produce?" : "No data for export"}
        </MessageContainer>
      </Content>
      <Controls>
        <CancelButton theme={controlsTheme} onClick={closeFn} disabled={isLoading}>
          {"Cancel"}
        </CancelButton>
        {props.hasData && (props.children || props.printRef?.current) && (
          <AsyncQcButton
            isHighlighted
            theme={controlsTheme}
            minLoadingProgress={25}
            isLoading={!isError && isLoading}
            finishFn={() => setIsFinished(true)}
            onClick={onPDFClick}>
            <FontAwesomeIconStyled icon={faFilePdf} />
            {".pdf"}
          </AsyncQcButton>
        )}
        {props.hasData && (
          <QcButton isHighlighted theme={controlsTheme} onClick={props.xlsxExportCallback}>
            <FontAwesomeIconStyled icon={faFileExcel} />
            {".xlsx"}
          </QcButton>
        )}
      </Controls>
      <GlobalExportStyle />
    </ExportDialogView>
  );
};

// this function allows us to pass a react child and use it as the pdf element we want to export
function createChildWithReference(child: ReactChild, ref: MutableRefObject<HTMLElement | null>) {
  const childElement = React.Children.toArray(child)[0] as ReactElement | undefined;
  return <>{childElement && React.cloneElement(childElement, { ...childElement.props, ref })}</>;
}
