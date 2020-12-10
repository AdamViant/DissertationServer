//Import required Modules
var express = require("express");
var http = require("http");
var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var LocalStrategy = require("passport-local").Strategy;
var passportLocalMongoose = require("passport-local-mongoose");
var bcrypt = require('bcryptjs');
var flash = require('connect-flash');
var session = require('express-session');
var validateEmail = require('validate-email-node-js');
var { ensureAuthenticated } = require('./config/auth');

//Import Models & Schema's
var User = require("./models/User");
var Score = require("./models/Score");

//initialize App
var app = express();
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views');

//Passport config
require('./config/passport')(passport);

//DB Config
var  dbUrl = require('./config/keys.js').MongoURI;
mongoose.set('useFindAndModify', false);

//DB Connection
mongoose.promise = global.Promise;
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(console.log(`mongoDB connected to database "${dbUrl}"`))
  .catch(err => console.log(err));

//Express BodyParser
app.use(bodyParser.urlencoded({ extended: true }));

//Express session
app.use(session({
  secret: 'Bipolar Nightmare',
  resave: true,
  saveUninitialized: true
}));

//Passport session initialize
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global Messages Properties
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//EJS
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

// ==== Routes ====

//Login
app.get("/login", function (req, res) {
  res.render("login");
});

//Register
app.get("/register",function (req, res) {
  res.render("register")
});

//Index
app.get("/index", ensureAuthenticated, (req, res) =>
  res.render("index", {
    user: req.user
  })
);

//Profile
app.get("/profile", ensureAuthenticated, (req, res) =>
  res.render("profile", {
    user: req.user
  })
);

//Profile-Edit
app.get("/profileEdit", ensureAuthenticated, (req, res) =>
  res.render("profileedit", {
    user: req.user
  })
);

//Profile-Edit
app.get("/profileEditUndo", ensureAuthenticated, (req, res) =>
{
  req.flash('success_msg', 'No Changes where saved.')
  res.redirect("profile")
});

// == HTML Guides ==
app.get("/htmlbasics", ensureAuthenticated, (req, res) =>
  res.render("guides/html/basics", {
    user: req.user
  })
);

//HTML intro
app.get("/htmlintro", ensureAuthenticated, (req, res) =>
  res.render("guides/html/intro", {
    user: req.user
  })
);

//HTML Elements
app.get("/htmlelements", ensureAuthenticated, (req, res) =>
  res.render("guides/html/elements", {
    user: req.user
  })
);

// == CSS Guides ==
app.get("/cssbasics", ensureAuthenticated, (req, res) =>
  res.render("guides/css/basics", {
    user: req.user
  })
);

//CSS Intro
app.get("/cssintro", ensureAuthenticated, (req, res) =>
  res.render("guides/css/intro", {
    user: req.user
  })
);

//CSS Selectors
app.get("/cssselectors", ensureAuthenticated, (req, res) =>
  res.render("guides/css/selectors", {
    user: req.user
  })
);

//CSS Fonts
app.get("/cssfonts", ensureAuthenticated, (req, res) =>
  res.render("guides/css/fonts", {
    user: req.user
  })
);

// == Quizes ==

// HTML Quiz Landing
app.get("/htmlQuiz", ensureAuthenticated, (req, res) => {
  var currentUser = req.user.username;
  var currentQuiz = 1;
  var username;
  var result;
  var date;
  var message;
  var Leaders = new Array();

  //Find Users Score
  Score.findOne({quizId: currentQuiz, username: currentUser})
  .then(score => {
    if(score) {
      username = score.username;
      result = score.result;
      date = score.date;

      var userScore = new Score({
        username,
        result,
        date
      })
      message = "Reattempt Quiz"
    }else{
      var userScore = new Score()
        userScore.username = currentUser;
        userScore.result = "Not Attempted";
        message = "Attempt Quiz";
    }

    //Find top 10 scores
    Score.find({quizId: currentQuiz}).sort({result: 'desc'}).limit(10)
    .then(leaders => {
      leaders.forEach(function(score, i){
        var Style;
        if(i % 2 == 0)
        {
          style = "";
        }else{
          style = "-accent";
        }

        Leaders.push({username: score.username, result: score.result, style: style})
      });

      //Render page
      res.render("quizes/htmlquizlanding", {
        user: req.user,
        score: userScore,
        message: message,
        leaders: Leaders
      })
    })
  })
});

// HTML Quiz Run
app.get("/htmlQuizRun", ensureAuthenticated, (req, res) =>
  res.render("quizes/htmlquiz", {
    user: req.user
  })
);

// CSS Quiz Landing
app.get("/cssQuiz", ensureAuthenticated, (req, res) => {
  var currentUser = req.user.username;
  var currentQuiz = 2;
  var username;
  var result;
  var date;
  var message;
  var Leaders = new Array();

  //Find Users Score
  Score.findOne({quizId: currentQuiz, username: currentUser})
  .then(score => {
    if(score) {
      username = score.username;
      result = score.result;
      date = score.date;

      var userScore = new Score({
        username,
        result,
        date
      })
      message = "Reattempt Quiz";
    }else{
      var userScore = new Score()
      userScore.username = currentUser;
      userScore.result = "Not Attempted";
      message = "Attempt Quiz";
    }

    //Find top 10 scores
    Score.find({quizId: currentQuiz}).sort({result: 'desc'}).limit(10)
    .then(leaders => {
      leaders.forEach(function(score, i){
        var Style;
        if(i % 2 == 0)
        {
          style = "";
        }else{
          style = "-accent";
        }

        Leaders.push({username: score.username, result: score.result, style: style})
      });

        //Render page
      res.render("quizes/cssquizlanding", {
        user: req.user,
        score: userScore,
        message: message,
        leaders: Leaders
      })
    })
  })
});

// CSS Quiz Run
app.get("/cssQuizRun", ensureAuthenticated, (req, res) =>
  res.render("quizes/cssquiz", {
    user: req.user
  })
);


// ==== Functions ====

//User Signup
app.post("/register", function (req, res) {
  var { username, password, password2, email } = req.body;
  let errors = [];

  //Check for required fields
  if(!username || !email || !password || !password2) {
    errors.push({ msg: 'Please fill out all required fields.' });
  }

  //Check passwords match
  if(password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  //Check Password Length
  if (password.length < 8) {
    errors.push({ msg: 'Password should be atleast 8 characters in length' });
  }

  //Check if valid Email
  if (validateEmail.validate(email) !== true)
  {
    errors.push({ msg: 'Invalid Email Address'});
  }

  //Validation Check and Save
  if (errors.length > 0) {
    //Validation Failure
    res.render('register', {
      errors,
      username,
      password,
      password2,
      email
    });
  }else{
    //Validation Pass
    User.findOne({ username: username})
      .then(user => {
        if(user) {
          //Username is already registered
          errors.push({ msg: 'Username is already Registered'})
          res.render('register', {
            errors,
            username,
            password,
            password2,
            email
          });
        }else{
          var newUser = new User({
            username,
            password,
            email
          });

          //Hash Password
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            //Set password to hashed password
            newUser.password = hash;

            //Save user
            newUser.save()
            .then(user => {
              req.flash('success_msg', 'You are now registered, Proceed to log in.')
              res.redirect('/login');
            })
            .catch(err => console.log(err));
          }))
        }
      });
    }
});


//User Login
app.post("/login", (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/index',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});


//User Logout
app.get("/logout", (req, res,) => {
  req.logout();
  req.flash('success_msg', 'You are logged out.');
  res.redirect("/login");
});


//Change User Details
app.post("/update", function (req, res) {
  var { username, password, password2, email } = req.body;
  var existingUsername = req.user.username;
  let errors = [];

  //Check for required fields
  if(!username || !email || !password || !password2) {
    errors.push({ msg: 'Please fill out all required fields.' });
  }

  //Check passwords match
  if(password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  //Check Password Length
  if (password.length < 8) {
    errors.push({ msg: 'Password should be atleast 8 characters in length' });
  }

  //Check if valid Email
  if (validateEmail.validate(email) !== true)
  {
    errors.push({ msg: 'Invalid Email Address'});
  }

  //Validation Check and Save
  if (errors.length > 0) {
    //Validation Failure
    res.render('profileedit', {
      errors,
      username,
      password,
      password2,
      email,
      user: req.user
    });
  }else{
    //Validation Pass
      var newUser = new User({
        username,
        password,
        email
      });

      //Hash Password
      bcrypt.genSalt(10, (err, salt) =>
        bcrypt.hash(newUser.password, salt, (err, hash) => {
        if(err) throw err;
        //Set password to hashed password
        newUser.password = hash;

        //Save user
        User.findOneAndUpdate({username: existingUsername},{
          username: newUser.username,
          password: newUser.password,
          email: newUser.email
        })
        .then(user => {
          req.flash('success_msg', 'Changes Saved, Please Log In.')
          res.redirect('/login');
        })
        .catch(err => console.log(err));
    }))
  }
});

// Submit Quiz Score
app.post("/SubmitQuizScore", function (req, res) {
  var {selectedQuiz, score} = req.body;
  var existingUsername = req.user.username;
  var quizId = selectedQuiz;
  var username = existingUsername;
  var result = score;
  var date = new Date();

  Score.findOne({quizId: selectedQuiz, username: existingUsername})
  .then(score => {
    //if score already exists then update
    if(score) {
      //if new score is higher then update
      if(result > score.result){
        Score.findOneAndUpdate({quizId: selectedQuiz, username: existingUsername},{
          result: result,
          date: date
        })
        .then(score => {
          req.flash('success_msg', 'Submited your new Highscore.')
          if(selectedQuiz == 1){
            res.redirect('/htmlquiz')
          }else{
            if(selectedQuiz == 2){
              res.redirect('/cssquiz')
            }
          }
        })
        .catch(err => console.log(err));
      }else{
        req.flash('error_msg', 'New Score didnt beat existing Highscore.')
        if(selectedQuiz == 1){
          res.redirect('/htmlquiz')
        }else{
          if(selectedQuiz == 2){
            res.redirect('/cssquiz')
          }
        }
        //redirect and dont update
      }
    }else{
      //else create a new score
      var newScore = new Score()
      newScore.quizId = parseInt(quizId);
      newScore.username = username;
      newScore.result = result;
      newScore.date = date;

      newScore.save()
      .then(score => {
        req.flash('success_msg', 'Submited your results.')
        if(selectedQuiz == 1){
          res.redirect('/htmlquiz')
        }else{
          if(selectedQuiz == 2){
            res.redirect('/cssquiz')
          }
        }
      })
      .catch(err => console.log(err));
    }
  })
})


// ==== Sever Start and Port listen ====

var port = process.env.PORT || 9000;
app.listen(port, function () {
    console.log("Server has started!")
});
