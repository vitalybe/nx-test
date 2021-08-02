import { createGlobalStyle } from "styled-components";

export class QwiltModalStyles {
  static readonly CONTAINER_ID_PREFIX = "react-confirm-alert";
  static readonly DIALOG_CLASS = "dialog-modal";
  static readonly DIALOG_SUPPRESS_SHRINK = "dialog-no-shrink";
  static readonly DIALOG_SUPPRESS_BLUR = "dialog-no-shrink";
  static readonly ACTIVE_CLASS = "active";
  static readonly OVERLAY_COMMON_CLASS = "react-confirm-alert-overlay";
}

export const GlobalModalStyles = createGlobalStyle`
  [id*=${QwiltModalStyles.CONTAINER_ID_PREFIX}]:not(.${QwiltModalStyles.ACTIVE_CLASS}) {
    .${QwiltModalStyles.DIALOG_CLASS}{
      &:not(.${QwiltModalStyles.DIALOG_SUPPRESS_SHRINK}) {
        transform: translate(0, -5%) scale(0.95);
      }
      &:not(.${QwiltModalStyles.DIALOG_SUPPRESS_BLUR}) {
        filter: blur(0.7px);
      }
    }
  }
`;
