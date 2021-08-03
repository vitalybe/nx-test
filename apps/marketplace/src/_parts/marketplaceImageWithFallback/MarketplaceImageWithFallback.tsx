import * as React from "react";
import { loggerCreator } from "@qwilt/common/utils/logger";
import {
  ImageWithFallback,
  Props as ImageWithFallbackProps,
} from "@qwilt/common/components/imageWithFallback/ImageWithFallback";

const moduleLogger = loggerCreator("__filename");

// NOTE: Must repeat it twice
const pathToImages = "common/images/";
// @ts-ignore
const pathToImagesContext = require.context("@qwilt/common/images/", true);

export const MarketplaceImageWithFallback = ({ ...props }: ImageWithFallbackProps) => {
  // eslint-disable-next-line prefer-const
  let { imagePath: requestedPath, ...otherProps } = props;
  let imagePath = "";
  try {
    if (requestedPath) {
      if (!requestedPath.startsWith(pathToImages)) {
        throw new Error("image must start with " + pathToImages);
      }

      requestedPath = requestedPath.replace(pathToImages, "");
    }

    imagePath = pathToImagesContext(`./${requestedPath}`);
  } catch (e) {
    moduleLogger.warn("failed to load isp image for: " + requestedPath, e);
  }

  return <ImageWithFallback {...otherProps} imagePath={imagePath} className={props.className} />;
};
