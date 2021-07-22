import { keyframes } from "styled-components";

export class CssAnimations {
  static SCALE_UP = keyframes`
    0% { transform: scale(0) }
    100% { transform: scale(1) }
  `;
  static GROW_WIDTH = keyframes`
    0% {width: 0}
    100% {}
  `;

  static GROW_FULL_WIDTH = keyframes`
    0% {width: 0}
    100% {width: 100%}
  `;

  static GROW_HEIGHT = keyframes`
    0% {height: 0}
    100% {}
  `;

  static SPIN = keyframes`
    0% {transform: rotate(0deg)}
    100% {transform: rotate(360deg)}
  `;

  static HALO = keyframes`
    0% {
      transform: scale(1);
      opacity: 0.8;
    }
    33% {
      transform: scale(3);
      opacity: 0.4;
    }
    100% {
      opacity: 0;
      transform: scale(4);
    }
  `;

  static OPACE_OUT = keyframes`
    0% {opacity: 1}
    100% {opacity: 0.8}
  `;

  static FADE_IN = keyframes`
    0% {opacity: 0}
    100% {opacity: 1}
  `;

  static SHINE = keyframes`
    0% {filter: brightness(1)}
    50% {filter: brightness(1.2)}
    100% {filter: brightness(1)}
  `;

  static FADE_SLIDE_IN = keyframes`
    0% {
      transform: translateX(-20px);
      opacity: 0;
    }
    50% {
      transform: translateX(0);
    }
    100% {
      opacity: 1;
    }
  `;

  static DROP_DOWN_APPEAR = keyframes`
    0% { transform: translateY(-100%); opacity: 0; }
  `;

  static FADE_SLIDE_DOWN = keyframes`
    0% {
      transform: translateY(-20px);
      opacity: 0;
    }
    50% {
      transform: translateY(0);
    }
    100% {
      opacity: 1;
    }
  `;

  static SLIDE_UP = keyframes`
    0% {
      opacity: 0;
    }
    100% {
      transform: translateY(0);
    }
  `;

  static SLIDE_DOWN = keyframes`
    0% {
      transform: translateY(-20px);
      opacity: 0;
    }
    50% {
      transform: translateY(0);
      opacity: 1;
    }
    100% {
    }
  `;
}
