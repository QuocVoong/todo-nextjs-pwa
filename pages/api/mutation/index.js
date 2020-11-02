import { command }     from '../../../utils/axios'

export const createBoard = async ({ formData }) => {
  const { data: result } = await command({ data: {
      commandName: 'createBoard',
      ...formData
    }});
  return result;
};

export const deleteBoard = async ({ formData }) => {
  const { data: result } = await command({ data: {
      commandName: 'deleteBoard',
      ...formData
    }});
  return result;
};

export const reorderBoard = async ({ formData }) => {
  const { data: result } = await command({ data: {
      commandName: 'reorderBoard',
      ...formData
    }});
  return result;
};

export const createTotoList = async ({ formData }) => {
  const { data: result } = await command({ data: {
      commandName: 'createTodoList',
      ...formData
    }});
  return result;
};

export const editTodoList = async ({ formData }) => {
  const { data: result } = await command({ data: {
      commandName: 'editTodoList',
      ...formData
    }});
  return result;
};

export const deleteTodoList = async ({ formData }) => {
  const { data: result } = await command({ data: {
      commandName: 'deleteTodoList',
      ...formData
    }});
  return result;
};

export const createCard = async ({ formData }) => {
  const { data: result } = await command({ data: {
      commandName: 'createCard',
      ...formData
    }});
  return result;
};

export const editCard = async ({ formData }) => {
  const { data: result } = await command({ data: {
      commandName: 'editCard',
      ...formData
    }});
  return result;
};

export const deleteCard = async ({ formData }) => {
  const { data: result } = await command({ data: {
      commandName: 'deleteCard',
      ...formData
    }});
  return result;
};

export const reorderList = async ({ formData }) => {
  const { data: result } = await command({ data: {
      commandName: 'reorderList',
      ...formData
    }});
  return result;
};

