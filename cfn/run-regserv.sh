#!/usr/bin/env bash

set -eu

ACTION_RX="^(create|update|delete)$"
ACTION=$1
if ! [[ "${ACTION}" =~ ${ACTION_RX} ]]; then
  echo "ARG1 must match ${ACTION_RX}"
  exit 1
fi

ARGS="--template-body file://regservice.yaml --capabilities CAPABILITY_IAM"
if [ "${ACTION}" == "delete" ]; then
  ARGS=""
fi

aws cloudformation "${ACTION}-stack" --stack-name regsrv ${ARGS}
aws cloudformation wait "stack-${ACTION}-complete" --stack-name regsrv
