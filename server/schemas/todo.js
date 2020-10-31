const mongoose   = require('mongoose');
const { Schema } = mongoose;

const TodoSchema = new Schema({
  title:        { type: String, required: true, unique: true, min: 1, max: 256 },
  board_id:     { type: mongoose.Schema.Types.ObjectId, required: true },
  created_utc:  { type: Number },
  modified_utc: { type: Number },
}, {
  versionKey: false,
});

module.exports = mongoose.model('Todo', TodoSchema);
