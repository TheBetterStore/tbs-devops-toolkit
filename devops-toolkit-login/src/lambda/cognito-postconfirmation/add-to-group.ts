/* eslint-disable-line */ const aws = require('aws-sdk');

exports.handler = async (event, context) => {
  console.log('post-confirmation.add-to-group has received event: ' + JSON.stringify(event));
  return {
    statusCode: 200,
    body: JSON.stringify(event),
  };
};
