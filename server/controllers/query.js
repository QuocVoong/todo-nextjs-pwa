const { get }       = require('lodash');
const { NOT_FOUND } = require('http-status-codes');

const { query } = require('../services');

module.exports = async (ctx) => {
  try {
    const { query: { queryName, params } } = ctx.request;
    const service                         = get(query, queryName);
    if (!service) {
      ctx.status = NOT_FOUND;
      ctx.body   = 'No service found';
      return;
    }

    const { status, result, error } = await service(JSON.parse(params) || {});
    ctx.status                      = status;
    ctx.body                        = { result, error };
  } catch (e) {
    // todo log error
    console.log('e: ', e);
  }
};
