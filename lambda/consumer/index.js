// Lifted from https://cloudonaut.io/integrate-sqs-and-lambda-serverless-architecture-for-asynchronous-workloads/

'use strict';
console.log('Loading function');
const AWS = require('aws-sdk');
const async = require('async');
const sqs = new AWS.SQS();
const lambda = new AWS.Lambda();

function receiveMessages(callback) {
  var params = {
    QueueUrl: process.env.QUEUE_URL,
    MaxNumberOfMessages: 10
  };
  sqs.receiveMessage(params, function(err, data) {
    if (err) {
      console.error(err, err.stack);
      callback(err);
    }
    else {
      callback(null, data.Messages);
    }
  });
}

function invokeWorkerLambda(task, callback) {
  var params = {
    FunctionName: process.env.WORKER_LAMBDA_NAME,
    InvocationType: 'Event',
    Payload: JSON.stringify(task)
  };
  lambda.invoke(params, function(err, data) {
    if (err) {
      console.error(err, err.stack);
      callback(err);
    }
    else {
      callback(null, data);
    }
  });
}

function handleSQSMessages(context, callback) {
  receiveMessages(function(err, messages) {
    if (messages && messages.length > 0) {
      var invocations = [];
      messages.forEach(function(message) {
        invocations.push(function(callback) {
          invokeWorkerLambda(message, callback);
        });
      });
      async.parallel(invocations, function(err) {
        if (err) {
          console.error(err, err.stack);
          callback(err);
        }
        else {
          if (context.getRemainingTimeInMillis() > 20000) {
            handleSQSMessages(context, callback);
          }
          else {
            callback(null, 'PAUSE');
          }
        }
      });
    }
    else {
      callback(null, 'DONE');
    }
  });
}

exports.handler = function(event, context, callback) {
  handleSQSMessages(context, callback);
};
