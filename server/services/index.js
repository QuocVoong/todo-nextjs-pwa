const { findBoards, createBoard, deleteBoard } = require('./boardService')

module.exports = {
  command: {
    createBoard,
    deleteBoard
  },
  query: {
    findBoards
  }
}
