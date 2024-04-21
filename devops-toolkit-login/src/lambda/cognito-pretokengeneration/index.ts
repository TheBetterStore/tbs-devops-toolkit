import {Logger} from '../../infrastructure/logger';

exports.handler = (event, context, callback) => {
  Logger.info('Received event:', event);

  const moduleNames = [];
  const modules = moduleNames.map((name) => require(`./${name}`));

  for (let i = 0; i < modules.length; i += 1) {
    const {handler} = modules[i];
    handler(event, context, callback);
  }
  callback(null, event);
};
