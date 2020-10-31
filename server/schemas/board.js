const mongoose   = require('mongoose');
const { Schema } = mongoose;

const BoardSchema = new Schema({
  title:         { type: String, required: true, unique: true, min: 1, max: 256 },
  created_utc:  { type: Number },
  modified_utc: { type: Number },
}, {
  versionKey: false,
});

module.exports = mongoose.model('Board', BoardSchema);
