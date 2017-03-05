#!/usr/bin/env bash

set -e

ACTION=${1:-update}

ARGS="--template-body file://regservice.yaml --capabilities CAPABILITY_IAM"
if [ "${ACTION}" == "delete" ]; then
  ARGS=""
fi

aws cloudformation "${ACTION}-stack" --stack-name regsrv ${ARGS}
aws cloudformation wait "stack-${ACTION}-complete" --stack-name regsrv
