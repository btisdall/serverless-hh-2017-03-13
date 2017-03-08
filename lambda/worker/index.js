'use strict';
console.log('Loading function');

const AWS = require('aws-sdk');
const request = require('request');

const postForm = () => {
  console.log('Calling %s ...', process.env.CLAIM_URL);
  
  const http_done = (err, resp, body) => {
    if (err) {
      console.error(err);
    }
    else {
      console.log('Code: %s', resp.statusCode);
      console.log('Body: %s', body);
    }
  };   
  
  request.post(
    process.env.CLAIM_URL,
    { form: { key: 'wibbs', instance_id: Math.random().toString() } },
    http_done
  );
};  

exports.handler = (event, context, callback) => {
  postForm();
};
