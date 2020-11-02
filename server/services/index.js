const { findBoards, createBoard, deleteBoard, reorderBoard, reorderList, createTodoList, editTodoList, deleteTodoList, createCard, editCard, deleteCard } = require('./boardService');

module.exports = {
  command: {
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
  },
  query:   {
    findBoards,
  }
};
