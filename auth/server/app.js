const express = require('express'); 
const app = express();
const passport = require('passport');
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "*");
    next();
  });
//   ^ this middleware will allow access for all CORS

app.use(passport.initialize());
app.use(require('./routes/authentications'));
app.use(require('./routes/googleauth'));


require('./authenticate');
app.get("/google", passport.authenticate('google', {scope: ['profile', 'email']}));

app.get('/google/callback', passport.authenticate('google', {failureRedirect: '/login'}), (req, res) =>{
  // res.redirect('/');
  res.send('Logged in!');
})



app.listen(3001, () => {
    console.log('listening on port 3001');
})


