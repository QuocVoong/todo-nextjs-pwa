import { command }     from '../../../utils/axios'

export const createBoard = ({ data }) => {
  return command({ data: {
      commandName: 'createBoard',
      ...data
    }});
};

export const deleteBoard = ({ data }) => {
  return command({ data: {
      commandName: 'deleteBoard',
      ...data
    }});
};
