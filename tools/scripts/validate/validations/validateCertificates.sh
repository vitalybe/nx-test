#!/bin/bash
set -e

source tools/scripts/.env
source tools/scripts/_utils/utils.sh

CERTIFICATE_FOLDER=tools/scripts/validate/validations/certificates
export HOST=${HOST:-dev-localhost.cqloud.com}
export PORT=${PORT:-$DEVSERVER_PORT}
export NODE_PATH=./node_modules

export HTTPS=${HTTPS:-true}
export SSL_CRT_FILE=${CERTIFICATE_FOLDER}/dev-localhost.cqloud.com.pem
export SSL_KEY_FILE=${CERTIFICATE_FOLDER}/dev-localhost.cqloud.com-key.pem

if [[ "$HTTPS" = "true" && (! -f $SSL_CRT_FILE || ! -f $SSL_KEY_FILE) ]]; then
  echo "$(colorRed error) SSL certificates don't exist at: "
  echo -e "\t$SSL_CRT_FILE"
  echo -e "\t$SSL_KEY_FILE"
  COMMAND="(cd ${CERTIFICATE_FOLDER} && mkcert dev-localhost.cqloud.com)"
  echo ""
  echo "To create the certificate run the following command:"
  colorLYellow "$COMMAND\n"
  echo ""
  exit 1
fi
