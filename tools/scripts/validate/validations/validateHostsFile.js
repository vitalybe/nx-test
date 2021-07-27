"use strict";

const dns = require("dns");
const process = require("process");

const TARGET_HOSTNAME = "dev-localhost.qwilt.com";

if (process.platform !== "linux") {
  dns.lookup(TARGET_HOSTNAME, (error, addresses) => {
    if (error || addresses != "127.0.0.1") {
      console.log(`Error: Set your hosts file (on OSX /etc/hosts) to point "${TARGET_HOSTNAME}" to 127.0.0.1`);
      process.exit(1);
    }
  });
}
