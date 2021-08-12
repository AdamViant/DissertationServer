var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuizSchema = new mongoose.Schema({
  quizId: {
    type: Number,
    required: true
  },
  quizName: {
    type: String,
    required: true
  },
  question1: {
    type: Object,
    required: true
  },
  question2: {
    type: Object,
    required: true
  },
  question3: {
    type: Object,
    required: true
  },
  question4: {
    type: Object,
    required: true
  },
  question5: {
    type: Object,
    required: true
  }
},{_id : false});

var Quiz = mongoose.model('Quiz', QuizSchema);
module.exports = Quiz;
