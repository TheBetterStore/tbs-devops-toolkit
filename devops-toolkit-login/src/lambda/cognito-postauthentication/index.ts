import {Logger} from '../../infrastructure/logger';

exports.handler = (event, context, callback) => {
  Logger.info('Received event:', event);
  /*
  this file will loop through all js modules which are uploaded to the lambda resource,
  provided that the file names (without extension) are included in the "MODULES" env variable.
  "MODULES" is a comma-delimmited string.
*/
  const moduleNames = [];
  const modules = moduleNames.map((name) => require(`./${name}`));

  for (let i = 0; i < modules.length; i += 1) {
    const {handler} = modules[i];
    handler(event, context, callback);
  }
  callback(null, event);
};
