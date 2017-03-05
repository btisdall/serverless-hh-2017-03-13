#!/usr/bin/env bash

set -e

ACTION_RX="^(create|update|delete)$"
ACTION=$1
if ! [[ "${ACTION}" =~ ${ACTION_RX} ]]; then
  echo "ARG1 must match ${ACTION_RX}"
  exit 1
fi

ARGS="--template-body file://appliance.yaml --capabilities CAPABILITY_IAM --parameters"
ARGS+=" ParameterKey=ServiceUrl,ParameterValue=https://69svcjgnnd.execute-api.eu-west-1.amazonaws.com/v1/claim"
if [ "${ACTION}" == "delete" ]; then
  ARGS=""
fi

aws cloudformation "${ACTION}-stack" --stack-name secapp ${ARGS}

aws cloudformation wait "stack-${ACTION}-complete" --stack-name secapp
