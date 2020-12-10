var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ScoreSchema = new mongoose.Schema({
  quizId: {
    type: Number,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  result: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    require: true
  }
});

var Score = mongoose.model('Score', ScoreSchema);
module.exports = Score;
