#!/usr/bin/env bash
set -e

# Source - https://gist.github.com/elucify/c7ccfee9f13b42f11f81
VALIDATIONS=$(git rev-parse --show-toplevel)/tools/scripts/validate/validations
bash "$VALIDATIONS"/validateNodeModules.sh
bash "$VALIDATIONS"/validateCertificates.sh
node "$VALIDATIONS"/validateHostsFile.js
