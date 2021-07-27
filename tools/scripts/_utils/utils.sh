RESTORE=`echo -en '\033[0m'`

# USAGE: ROOT=`gitRoot`
function gitRoot() {
  git rev-parse --show-toplevel
}

function currentProject() {
  if [[ "$ROOT" = "$PWD" ]]; then
    echo ""
  else
    basename ${PWD}
  fi
}

function utilParallel() {
  if ! which parallel > /dev/null; then
    colorRed "Parallel not installed, run: "
    colorLYellow "brew install parallel && parallel --citation"
    echo
    exit 1
  fi

  parallel "$@"
}

function sourcePrivateEnv() {
  ENV_LOCAL_FILE=~/frontend/.env.local
  if [[ ! -f $ENV_LOCAL_FILE ]]; then
    ENV_LOCAL_FILE=`gitRoot`/scripts/.env.local
    if [[ ! -f $ENV_LOCAL_FILE ]]; then
      colorGrey ".env.local doesn't exist. Creating a blank version... remember to assign your private values."
      echo "export JENKINS_AUTH=" >> $ENV_LOCAL_FILE
      echo "export GITLAB_TOKEN=" >> $ENV_LOCAL_FILE
      echo "export JIRA_USERNAME=" >> $ENV_LOCAL_FILE
      echo "export JIRA_PASSWORD=" >> $ENV_LOCAL_FILE
    fi
  fi

  >&2 colorGrey ".env.local found at: ${ENV_LOCAL_FILE}\n"
  source $ENV_LOCAL_FILE

  ERRORS=0
  if [[ "$JENKINS_AUTH" == "" ]]; then
    ERRORS=1
    echo "`colorRed "authentication not set"` Jenkins"
    echo "Get the token from: `colorLYellow "https://jenkins2-cq.eng.qwilt.com/me/configure"` under the `colorLYellow "API Token" section`"
    echo "`colorLYellow NOTE:` You need both a `colorLYellow USER_ID` and `colorLYellow API_TOKEN`"
    echo "Paste them in the following format: export JENKINS_AUTH=`colorLYellow USER_ID`:`colorLYellow API_TOKEN`"
    echo ""
  fi

  if [[ "$GITLAB_TOKEN" == "" ]]; then
    ERRORS=1
    echo "`colorRed "authentication not set"` GitLab"
    echo "Get the token from: `colorLYellow "https://gitlab.eng.qwilt.com/profile/personal_access_tokens"`"
    echo "Paste them in the following format: export GITLAB_TOKEN=`colorLYellow token`"
    echo ""
  fi

  if [[ "$JIRA_USERNAME" == "" || "$JIRA_PASSWORD" == "" ]]; then
    ERRORS=1
    echo "`colorRed "authentication not set"` JIRA"
    echo "Please fill your JIRA credentials that you use un the browser in `colorLYellow "http://jira.it.qwilt.com/"`"
    echo "Paste them in the following format: "
    echo "export JIRA_USERNAME=`colorLYellow username`"
    echo "export JIRA_PASSWORD=`colorLYellow password`"
    echo ""
  fi

  if [[ "$JIRA_INTEGRATION_USERNAME" == "" || "$JIRA_INTEGRATION_PASSWORD" == "" ]]; then
    ERRORS=1
    echo "`colorRed "authentication not set"` JIRA integration"
    echo "These credentials are required for creating versions in ARN."
    echo "Paste them in the following format: "
    echo "export JIRA_INTEGRATION_USERNAME=`colorLYellow username`"
    echo "export JIRA_INTEGRATION_PASSWORD=`colorLYellow password`"
    echo ""
  fi

  if [[ "$ERRORS" == "1" ]]; then
    ENV_LOCAL_FILE=`realpath $(gitRoot)/scripts/.env.local`
    echo "`colorRed "error"` private env file is lacking data. Please fill as instructed above in `colorLYellow "$ENV_LOCAL_FILE"`"

    exit 1
  fi

}

function colorRed() {
  echo -en '\033[00;31m'; echo -en $1;  echo -en $RESTORE;
}

function colorYellow() {
  echo -en '\033[00;33m'; echo -en $1;  echo -en $RESTORE;
}

function colorLYellow() {
  echo -en '\033[01;33m'; echo -en $1;  echo -en $RESTORE;
}

function colorWhite() {
  echo -en '\033[01;37m'; echo -en $1;  echo -en $RESTORE;
}

function colorGreen() {
  echo -en '\033[00;32m'; echo -en $1;  echo -en $RESTORE;
}

function colorCyan() {
  echo -en '\033[00;36m'; echo -en $1;  echo -en $RESTORE;
}

function colorGrey() {
  echo -en '\033[01;30m'; echo -en $1;  echo -en $RESTORE;
}
