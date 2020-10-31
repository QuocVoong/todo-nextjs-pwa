import { query }     from '../../../utils/axios'
import { PAGE_SIZE } from '../../../constants'

export const findBoards = async ({ page }) => {
  const { data } = await query({ data: {
      queryName: 'findBoards',
      params: {
        limit: PAGE_SIZE,
        skip:   Math.max((+page || 0) - 1, 0) * PAGE_SIZE,
        select: {
          title: 1
        }
      },
    }});
  return data;
};

export const findTodos = async ({ boardId, page }) => {
  const { data } = await query({ data: {
      queryName: 'findTodos',
      params: {
        find: {
          boardId
        },
        limit: PAGE_SIZE,
        skip:   Math.max((+page || 0) - 1, 0) * PAGE_SIZE,
        select: {
          title: 1,
          status: 1,
        }
      },
    }});
  return data;
};
