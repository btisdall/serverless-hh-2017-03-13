'use strict';
console.log('Loading function');

const request = require('request');
const AWS = require('aws-sdk');
const sqs = new AWS.SQS();

exports.handler = (event, context, callback) => {
  var instanceId = JSON.parse(JSON.parse(event.Body).Message).EC2InstanceId;
  console.log('HANDLE: %s, INSTANCE_ID: %s', event.ReceiptHandle, instanceId);

  var params = {
    form: {
      key: new Date().toISOString(),
      instance_id: instanceId,
    }
  };

  request.post(
    process.env.CLAIM_URL, params, function(err, resp, body) {
      if (err) {
        console.error(err);
        callback({ msg: 'Something wrong went' });
      }
      else {
        console.log('code: %s', resp.statusCode);
        console.log('body: %s', body);
        params = {
          QueueUrl: process.env.QUEUE_URL,
          ReceiptHandle: event.ReceiptHandle,
        };
        sqs.deleteMessage(params, function(err, data) {
          if (err) {
            console.log(err, err.stack);
          }
          else {
            console.log(data);
          }
        });
      }
    }
  );
};
