const express = require('express');
const router = express.Router();
const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const keys = require('../keys');
const db = require('../models');
const auth = require('../util/version2')
const SCOPES = ["https://www.googleapis.com/auth/drive"];
const passport = require('passport');
// this is our node passport middleware
require('../config/passAuth'); //imports all of passport auth stuff
let requireAuth = passport.authenticate('jwt', {session: false});
const oAuth2Client = new google.auth.OAuth2(
  keys.client_id, keys.client_secret, keys.redirect_uris[0]);


router.post('/getURL',  (req, res) => {
  
  //req.user.id
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });

  res.json(authUrl)
  
})

router.get('/oauth2Callback', (req, res) => {
  
  //req.user.id
    let code = req.query.code;
    
    console.log('code inside of callback', code);

    res.redirect(`http://localhost:3000/completeCallback/${encodeURIComponent(code)}`)

})


router.post('/completeAuth', requireAuth,(req, res) => {
  
  let code = decodeURIComponent(req.body.code);
  
  console.log("user id from jwt: ", req.user.id);
  console.log(`auth code ${code}`);
  try{
          
    oAuth2Client.getToken(code, async (err, token) => {

        if (err) return console.error("Error retrieving access token", err);
          oAuth2Client.setCredentials(JSON.stringify(token));
          // Store the token to disk for later program executions

          //console.log(JSON.stringify(token))

          //console.log(token);
          let expiry_date = token.expiry_date.toString();

          let results = await db.auth.create({
            token: token.access_token,
            userID: req.user.id,
            refresh_token: token.refresh_token,
            scope: token.scope,
            token_type: token.token_type,
            expiry_date : expiry_date
          })
        
        // res.json(token);
        res.send('successful')
    });

    
  }
  catch(error){
      console.log('error while trying to get user token', error)
      res.send('error')
  }
})

router.post('/files', requireAuth, async (req, res) => {
    
  let id = req.user.id
  try{

    const drive = await auth(id);
    
    const results = await drive.files.list({
      pageSize: 10,
      fields: 'nextPageToken, files(id, name)',
    }) 

    const files = results.data.files;
    
    let output = '';  //this was const instead of let :) 
    files.forEach(file =>{
      output += `${file.name} (${file.id}) <br />`
  })

    res.json({files})
  }
  catch(err){
    res.send('error occurred')
  }

})


module.exports = router;