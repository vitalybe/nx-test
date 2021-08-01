// This file is needed if we'd like to validate that the user can access the site without giving him all our JS/CSS code.
// The only file that should be loaded to unauthorized clients is the compiled version of this file and index.html
// validation.txt is used as a file by which we know whether access is granted

// @ts-ignore
import { CommonUrls } from "common/utils/commonUrls";

const validationText = require("./validation.txt");

function redirect() {
  const returnTo = encodeURIComponent(CommonUrls.addPersistentQueryParams(window.top.location.href));
  const loginUrl = CommonUrls.addPersistentQueryParams(CommonUrls.loginUrl);
  window.top.location.href = `${loginUrl}&returnTo=${returnTo}`;
}

async function validateAuthorized() {
  const searchParams = new URLSearchParams(location.search);
  if (location.hostname === "qc-services.cqloud.com" && !!searchParams.get("env")) {
    const newLocation = new URL(location.href.replace("qc-services.cqloud.com", "qc-services-dev.cqloud.com"));
    const newLocationSearchParams = new URLSearchParams(newLocation.search);

    const returnTo = newLocationSearchParams.get("returnTo");
    if (returnTo) {
      const isReturnToCqloudDev = returnTo.match(/https:\/\/\S+?-dev.cqloud.com/);
      if (!isReturnToCqloudDev) {
        newLocationSearchParams.set("returnTo", returnTo.replace(".cqloud.com", "-dev.cqloud.com"));
        newLocation.search = newLocationSearchParams.toString();
      }
    }
    document.body.innerHTML = `<div>Please use <b>qc-services-dev</b> to access non-production environments: 
                               <b><a href="${newLocation}">${newLocation.toString()}</a></b></div>`;
    return;
  }

  try {
    const text = await fetch(validationText, {
      method: "get",
      credentials: "include",
    }).then(response => {
      if (response.status !== 200) {
        redirect();
      }
      return response.text();
    });
    if (!text || text !== "authorized") {
      redirect();
    }
  } catch (e) {
    redirect();
  }
}

validateAuthorized();
