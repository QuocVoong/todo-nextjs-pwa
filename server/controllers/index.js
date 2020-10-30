const queryController = require('./query')
const commandController = require('./command')

module.exports = (router) => {
  router.post('/query', queryController);
  router.post('/command', commandController);
};
