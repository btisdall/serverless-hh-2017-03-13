'use strict';
console.log('Loading function');

const request = require('request');
const AWS = require('aws-sdk');
const sqs = new AWS.SQS();
const ec2 = new AWS.EC2();


function makeClaim(event, callback) {
  var instanceId = JSON.parse(JSON.parse(event.Body).Message).EC2InstanceId;
  console.log('HANDLE: %s, INSTANCE_ID: %s', event.ReceiptHandle, instanceId);

  ec2.describeInstances({InstanceIds:[instanceId]}, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    }
    else {
      var address = data.Reservations[0].Instances[0].PublicIpAddress;
      var claimUrl = 'http://' + address + '/v1/claim';
      console.log('ADDRESS: %s', claimUrl);

      var params = {
        form: {
          key: process.env.TOP_SECRET_KEY,
          instance_id: instanceId,
          registered: new Date().toISOString(),
        }
      };

      request.post(
        'http://' + address + '/v1/claim', params, function(err, resp, body) {
          if (err) {
            console.error(err);
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
    }
  });
}

exports.handler = (event, context, callback) => {
  makeClaim(event);
};
