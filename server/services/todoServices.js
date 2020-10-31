const { isEmpty, size, trim }                         = require('lodash');
const { OK, UNPROCESSABLE_ENTITY, BAD_REQUEST } = require('http-status-codes');
const todoSchema                               = require('../schemas/todo');

const findTodos = async ({ find = {}, skip = 0, limit = 10, select, sort = { created: 1 } }) => {
  const innerSelect = isEmpty(select) ? { _id: 1 } : select;

  const [data, count] = await Promise.all([
    todoSchema.find(find).sort(sort).skip(skip).limit(limit).select(innerSelect),
    limit && todoSchema.find(find).countDocuments()
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

const createTodo = async (model, ctx) => {
  if (size(trim(model.board_id)) === 0) {
    return {
      status: BAD_REQUEST,
      error:  {
        message: 'invalid board_id',
        model
      }
    };
  }
  const currentTime = Math.floor(Date.now() / 1000);
  try {
    const todo = await todoSchema.create({
      title:   model.title,
      board_id: model.board_id,
      created: currentTime,
      latest:  currentTime
    });
    return {
      status: OK,
      result: [todo]
    };
  } catch (error) {
    return {
      status: UNPROCESSABLE_ENTITY,
    };
  }
};

const deleteTodo = async (model, ctx) => {
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
    const dbModel = await todoSchema.findById(_id);
    await todoSchema.deleteOne({ _id });
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
  findTodos,
  createTodo,
  deleteTodo
};
