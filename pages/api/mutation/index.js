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
