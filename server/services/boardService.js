const { isEmpty } = require('lodash');
const { OK }      = require('http-status-codes');
const board       = require('../schemas/board');

const findBoards = async ({ find = {}, skip = 0, limit = 10, select, sort = { created: 1 } }) => {
  const innerSelect = isEmpty(select) ? { _id: 1 } : select;

  const [items, count] = await Promise.all([
    board.find(find).sort(sort).skip(skip).limit(limit).select(innerSelect),
    limit && board.find(find).countDocuments()
  ]);

  return {
    status: OK,
    data:   {
      items,
      totalPages:  Math.ceil(count / limit) || 1,
      currentPage: Math.ceil(skip / limit) || 1,
    }
  };
};

module.exports = {
  findBoards,
};
