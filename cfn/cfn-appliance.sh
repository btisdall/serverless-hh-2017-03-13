#!/usr/bin/env bash

set -e

ACTION=${1:-update}

ARGS="--template-body file://appliance.yaml --capabilities CAPABILITY_IAM"
if [ "${ACTION}" == "delete" ]; then
  ARGS=""
fi

aws cloudformation "${ACTION}-stack" --stack-name secapp ${ARGS}
aws cloudformation wait "stack-${ACTION}-complete" --stack-name secapp
