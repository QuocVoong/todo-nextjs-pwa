const { isEmpty, size, trim }                   = require('lodash');
const { OK, UNPROCESSABLE_ENTITY, BAD_REQUEST } = require('http-status-codes');
const boardSchema                               = require('../schemas/board');

const findBoards = async ({ find = {}, skip = 0, limit = 10, select, sort = { created: 1 } }) => {
  const innerSelect   = isEmpty(select) ? { _id: 1 } : select;
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
      error,
    };
  }
};

const deleteBoard = async (model, ctx) => {
  const { _id } = model;
  if (size(trim(_id)) === 0) {
    return {
      status: BAD_REQUEST,
      error:  {
        message: 'invalid request',
        model
      }
    };
  }
  try {
    await boardSchema.findOneAndDelete({ _id });
    return {
      status: OK,
    };
  } catch (error) {
    return {
      status: BAD_REQUEST,
      error,
    };
  }
};

const reorderBoard = async (model, ctx) => {
  const { source_id, source_index, list_id, destination_index } = model;

  try {
    const currentBoard = await boardSchema
      .findOneAndUpdate({ _id: source_id }, { $pull: { todo_list: { _id: list_id } } });
    const list         = currentBoard.todo_list[source_index];
    await boardSchema.updateOne(
      { _id: model.source_id },
      {
        $push: {
          todo_list: { $each: [list], $position: model.destination_index }
        }
      }
    );
    return {
      status: OK,
    };
  } catch (error) {
    console.log('error: ', error);
    return {
      status: UNPROCESSABLE_ENTITY,
      error,
    };
  }
};

const reorderList = async (model, ctx) => {
  const { card_id, source_id, destination_id, source_index, destination_index, board_id } = model;

  try {
    const currentBoard = await boardSchema
      .findOneAndUpdate({ _id: board_id, 'todo_list._id': source_id },
        { $pull: { 'todo_list.$.cards': { _id: card_id } } },
        { projection: { 'todo_list.$.cards': true } });

    const card = currentBoard.todo_list[0].cards[source_index];
    await boardSchema.updateOne(
      { _id: board_id, 'todo_list._id': destination_id },
      {
        $push: {
          'todo_list.$.cards': { $each: [card], $position: destination_index }
        }
      }
    );
    return {
      status: OK,
    };
  } catch (error) {
    console.log('error: ', error);
    return {
      status: UNPROCESSABLE_ENTITY,
      error,
    };
  }
};

const createTodoList = async (model, ctx) => {
  if (size(trim(model.board_id)) === 0) {
    return {
      status: BAD_REQUEST,
      error:  {
        message: 'invalid request',
        model
      }
    };
  }
  const currentTime = Math.floor(Date.now() / 1000);

  try {
    await boardSchema
      .updateOne({ _id: model.board_id }, {
        $push:   {
          todo_list: {
            title: model.title,
            cards: []
          }
        }, $set: { latest: currentTime }
      });

    return {
      status: OK,
    };
  } catch (error) {
    return {
      status: UNPROCESSABLE_ENTITY,
      error,
    };
  }
};

const editTodoList = async (model, ctx) => {
  const { list_id, list_title, board_id } = model;

  if (size(trim(board_id)) === 0 || size(trim(list_id)) === 0) {
    return {
      status: BAD_REQUEST,
      error:  {
        message: 'invalid request',
        model
      }
    };
  }

  try {
    await boardSchema
      .updateOne({ _id: board_id, 'todo_list._id': list_id }, { $set: { 'todo_list.$.title': list_title } });
    return {
      status: OK,
    };
  } catch (error) {
    return {
      status: BAD_REQUEST,
      error:  error
    };
  }
};

const deleteTodoList = async (model, ctx) => {
  const { list_id, board_id } = model;
  if (size(trim(board_id)) === 0 || size(trim(list_id)) === 0) {
    return {
      status: BAD_REQUEST,
      error:  {
        message: 'invalid id',
        model
      }
    };
  }
  const currentTime = Math.floor(Date.now() / 1000);
  try {
    await boardSchema
      .updateOne({ _id: board_id }, {
        $pull: { todo_list: { _id: list_id } }, $set: { latest: currentTime }
      });
    return {
      status: OK,
    };
  } catch (error) {
    return {
      status: BAD_REQUEST,
      error:  error
    };
  }
};

const createCard = async (model, ctx) => {
  if (size(trim(model.board_id)) === 0 || size(trim(model.list_id)) === 0) {
    return {
      status: BAD_REQUEST,
      error:  {
        message: 'invalid request',
        model
      }
    };
  }
  const currentTime = Math.floor(Date.now() / 1000);

  try {
    await boardSchema
      .updateOne({ _id: model.board_id, 'todo_list._id': model.list_id }, {
        $push:   {
          'todo_list.$.cards': { title: model.title }
        }, $set: { latest: currentTime }
      });

    return {
      status: OK,
    };
  } catch (error) {
    console.log('error: ', error);
    return {
      status: UNPROCESSABLE_ENTITY,
      error,
    };
  }
};

const editCard = async (model, ctx) => {
  const { card_title, card_index, list_id, board_id } = model;
  const title = `todo_list.$.cards.${card_index}.title`;
  try {
    await boardSchema
      .updateOne({ _id: board_id, 'todo_list._id': list_id }, { $set: { [title]: card_title } });

    return {
      status: OK,
    };
  } catch (error) {
    return {
      status: BAD_REQUEST,
      error:  error
    };
  }
};

const deleteCard = async (model, ctx) => {
  const { card_id, list_id, board_id } = model;
  try {
    await boardSchema
      .updateOne({ _id: board_id, 'todo_list._id': list_id }, { $pull: { 'todo_list.$.cards': { _id: card_id } } });

    return {
      status: OK,
    };
  } catch (error) {
    return {
      status: BAD_REQUEST,
      error:  error
    };
  }
};

module.exports = {
  findBoards,
  createBoard,
  deleteBoard,
  reorderBoard,
  reorderList,
  createTodoList,
  editTodoList,
  deleteTodoList,
  createCard,
  editCard,
  deleteCard,
};
