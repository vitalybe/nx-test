import React, { createContext, ReactNode } from "react";
import { createGlobalStyle } from "styled-components";
import { observer } from "mobx-react-lite";
import { action, observable } from "mobx";
import _ from "lodash";

function getResponsiveFontSize(fontSize: number) {
  if (window.innerWidth < 800) {
    return fontSize * 0.6875;
  } else if (window.innerWidth < 1200) {
    return fontSize * 0.75;
  } else if (window.innerWidth < 1400) {
    return fontSize * 0.8125;
  } else if (window.innerWidth > 1920) {
    return fontSize * 1.125;
  } else if (window.innerWidth > 2200) {
    return fontSize * 1.25;
  } else {
    return fontSize;
  }
}
// can use the store on its own for calculations with observer components
// or access it from context using GlobalFontProvider
// you may initialise it with a new base _fontSize for a custom scale.
export class GlobalFontStore {
  private constructor(private _fontSize = 16) {
    window.addEventListener("resize", _.debounce(this.refreshGlobalFontSize, 100));
  }
  @observable fontSize = getResponsiveFontSize(this._fontSize);

  @action
  refreshGlobalFontSize = () => {
    this.fontSize = getResponsiveFontSize(this._fontSize);
  };

  pixelsToRem(px: number) {
    return px / this.fontSize;
  }

  remToPixels(rem: number) {
    return rem * this.fontSize;
  }

  private static _instance: GlobalFontStore | undefined;
  static get instance(): GlobalFontStore {
    if (!this._instance) {
      this._instance = new GlobalFontStore();
    }

    return this._instance;
  }
}

export const GlobalFontContext = createContext(GlobalFontStore.instance);

// This styled component can be used as standalone under <App> + using "rem" throughout app css values for global font responsiveness
// -use it when you don't mean to use the context of the store
// -font size prop is optional to make this value controlled.
export const ResponsiveGlobalFont = createGlobalStyle<{ fontSize?: number }>`
  :root {
    @media only screen and (max-width: 800px) {
      font-size: ${(props) => props.fontSize || 11}px;
    }
    @media only screen and (max-width: 1200px) {
      font-size: ${(props) => props.fontSize || 12}px;
    }
    @media only screen and (max-width: 1400px) {
      font-size: ${(props) => props.fontSize || 13}px;
    }
    @media only screen and (min-width: 1920px) {
      font-size: ${(props) => props.fontSize || 18}px;
    }
    @media only screen and (min-width: 2200px) {
      font-size: ${(props) => props.fontSize || 20}px;
    }
    font-size: ${(props) => props.fontSize || 16}px
  }
`;
// can use this as your app root component to make font size context available
// e.g. const App = styled(GlobalFontProvider)`...`;
export const GlobalFontProvider = observer((props: { className?: string; children?: ReactNode }) => {
  return (
    <div className={props.className}>
      <GlobalFontContext.Provider value={GlobalFontStore.instance}>
        <ResponsiveGlobalFont fontSize={GlobalFontStore.instance.fontSize} />
        {props.children}
      </GlobalFontContext.Provider>
    </div>
  );
});
