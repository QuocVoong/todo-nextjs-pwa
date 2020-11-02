const queryController = require('./query')
const commandController = require('./command')

module.exports = (router) => {
  router.get('/query', queryController);
  router.post('/command', commandController);
};
