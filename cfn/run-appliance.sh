#!/usr/bin/env bash

set -eu

ACTION_RX="^(create|update|delete)$"
ACTION=$1
if ! [[ "${ACTION}" =~ ${ACTION_RX} ]]; then
  echo "ARG1 must match ${ACTION_RX}"
  exit 1
fi

ARGS=""
if [ "${ACTION}" != "delete" ]; then
  API_ID=$(aws cloudformation describe-stacks --stack-name regsrv | \
    jq '.Stacks[0].Outputs[]|select(.OutputKey=="ClaimApiId").OutputValue' -r \
  )
  ARGS="--template-body file://appliance.yaml --capabilities CAPABILITY_IAM --parameters"
  ARGS+=" ParameterKey=ClaimBaseUrl,ParameterValue=https://${API_ID}.execute-api.eu-west-1.amazonaws.com"
  ARGS+=" ParameterKey=ClaimUrl,ParameterValue=https://${API_ID}.execute-api.eu-west-1.amazonaws.com/v1/claim"
fi

aws cloudformation "${ACTION}-stack" --stack-name secapp ${ARGS}

aws cloudformation wait "stack-${ACTION}-complete" --stack-name secapp
