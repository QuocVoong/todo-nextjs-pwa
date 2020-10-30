const { get }                              = require('lodash');
const { NOT_FOUND, INTERNAL_SERVER_ERROR } = require('http-status-codes');

const { command } = require('../services');

module.exports = async (ctx) => {
  try {
    const { body }                     = ctx.request;
    const { commandName, ...restBody } = ctx.is('multipart') ? body : body;
    const service                      = get(command, commandName);
    if (!service) {
      ctx.status = NOT_FOUND;
      ctx.body   = 'No service found';
      return;
    }

    const { status, result, error } = await service(restBody || {}, ctx);
    ctx.status                      = status;
    ctx.body                        = { result, error };
  } catch (e) {
    // todo log error
    console.log('e: ', e);
    ctx.status = INTERNAL_SERVER_ERROR;
  }
};
