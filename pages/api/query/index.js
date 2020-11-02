import { query }     from '../../../utils/axios';
import { PAGE_SIZE } from '../../../constants';

export const findBoards = async ({ page, find, select }) => {
  const { data } = await query({
    data: {
      queryName: 'findBoards',
      params:    {
        find,
        limit:  PAGE_SIZE,
        skip:   Math.max((+page || 0) - 1, 0) * PAGE_SIZE,
        select: select || { title: 1 }
      },
    }
  });
  return data;
};

export const findBoard = async ({ boardId, page, find }) => {
  const { data } = await query({
    data: {
      queryName: 'findBoards',
      params:    {
        find:   find || { _id: boardId },
        limit:  PAGE_SIZE,
        skip:   Math.max((+page || 0) - 1, 0) * PAGE_SIZE,
        select: {
          title:  1,
          status: 1,
          todo_list: 1,
        }
      },
    }
  });
  return data;
};


export const findTodos = async ({ boardId, page, find }) => {
  const { data } = await query({
    data: {
      queryName: 'findTodoList',
      params:    {
        find,
        limit:  PAGE_SIZE,
        skip:   Math.max((+page || 0) - 1, 0) * PAGE_SIZE,
        select: {
          title:  1,
          status: 1,
        }
      },
    }
  });
  return data;
};
