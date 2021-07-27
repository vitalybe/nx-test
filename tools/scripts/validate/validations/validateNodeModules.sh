#!/usr/bin/env bash
ROOT=$(git rev-parse --show-toplevel)
source "${ROOT}"/tools/scripts/_utils/utils.sh

echo -e "$(colorCyan "[qc-services]") Verifying node_modules integrity... \c"
if pushd "${ROOT}" > /dev/null 2>&1 && yarn check --integrity > /dev/null 2>&1; then
  colorGreen "Succeeded\n"
else
  colorGreen "Succeeded\n"
  echo "$(colorYellow Note) - node_modules is out-of-date. Running: $(colorYellow "pushd ${ROOT} && yarn && popd")"
  pushd "${ROOT}" && yarn && popd
fi
