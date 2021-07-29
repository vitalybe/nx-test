import { createGlobalStyle } from "styled-components";

import "./css/normalize.css";
import "./avenir-font/stylesheet.css";
import "react-toastify/dist/ReactToastify.css";
import "focus-visible/dist/focus-visible.min.js";

import "./css/nprogress.css";
import "tippy.js/dist/tippy.css";
import "tippy.js/dist/themes/light.css";
import "./css/tippy-chart.css";
import "./css/tippy-light.css";
import "./css/tippy-error.css";
import "./css/tippy-ops-dashboard-dark.css";
// NOTE: Using index.css and not createGlobalStyle because bug in hot-reloading with global styles - https://github.com/styled-components/styled-components/issues/2074. Revert when bug is fixed.
import "./css/index.css";

export const GlobalStyle = createGlobalStyle``;
