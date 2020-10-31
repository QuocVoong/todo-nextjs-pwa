const { isEmpty, size, trim }                         = require('lodash');
const { OK, UNPROCESSABLE_ENTITY, BAD_REQUEST } = require('http-status-codes');
const boardSchema                               = require('../schemas/board');

const findBoards = async ({ find = {}, skip = 0, limit = 10, select, sort = { created: 1 } }) => {
  const innerSelect = isEmpty(select) ? { _id: 1 } : select;

  const [data, count] = await Promise.all([
    boardSchema.find(find).sort(sort).skip(skip).limit(limit).select(innerSelect),
    limit && boardSchema.find(find).countDocuments()
  ]);

  return {
    status: OK,
    result: {
      data,
      totalPages:  Math.ceil(count / limit) || 1,
      currentPage: Math.ceil(skip / limit) || 1,
    }
  };
};

const createBoard = async (model, ctx) => {
  const currentTime = Math.floor(Date.now() / 1000);
  try {
    const board = await boardSchema.create({
      title:   model.title,
      created: currentTime,
      latest:  currentTime
    });
    return {
      status: OK,
      result: [board]
    };
  } catch (error) {
    return {
      status: UNPROCESSABLE_ENTITY,
    };
  }
};

const deleteBoard = async (model, ctx) => {
  const { _id } = model;
  if (size(trim(_id)) === 0) {
    return {
      status: BAD_REQUEST,
      error:  {
        message: 'invalid id',
        model
      }
    };
  }
  try {
    const dbModel = await boardSchema.findById(_id);
    await boardSchema.deleteOne({ _id });
    return {
      status: OK,
    };
  } catch (error) {
    return {
      status: BAD_REQUEST,
      error:  serializeError(e)
    };
  }
};

module.exports = {
  findBoards,
  createBoard,
  deleteBoard
};
