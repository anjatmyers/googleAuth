const express = require('express');
const router = express.Router();
const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const keys = require('../keys');
const db = require('../models');
const auth = require('../util/version2')
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const oAuth2Client = new google.auth.OAuth2(
  keys.client_id, keys.client_secret, keys.redirect_uris[0]);

router.get('/getAuthURL', (req, res) => {
  

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  //res.json({url: ${authUrl}})
  res.send(`<a href="${authUrl}">auth</a>`)
  
})

router.get('/oauth2Callback', (req, res) => {
    // res.send(req.query.code)
    let code = req.query.code;
    console.log(`code ${code}`);

    try{
          
        oAuth2Client.getToken(code, async (err, token) => {

            if (err) return console.error("Error retrieving access token", err);
              oAuth2Client.setCredentials(JSON.stringify(token));
              // Store the token to disk for later program executions

              console.log(JSON.stringify(token))

              console.log(token);
              let expiry_date = token.expiry_date.toString();

              let results = await db.auth.create({
                token: token.access_token,
                refresh_token: token.refresh_token,
                scope: token.scope,
                token_type: token.token_type,
                expiry_date : expiry_date
              })
            
            //my token
            //code 4/0AY0e-g43K8FI2AdNhcDboVYiJxuN_0f1Z1R0dapXwdiQ6wbS-e2d5yNEja36jc_2Qvgz8g
            //{"access_token":"ya29.a0AfH6SMDlE3iJ_tnviAS_douNWkz0TstIAskZ6E_XuiSEToOojJNYeXEStTKt1r-U9MOQ8WB9BoF4sO95jhz6pUHOAUKbIJw9ILX55Y-e-19n61C72OtNPgkQbe5yY1aAAtkUkDp45N2v3izkONjpE0d1Yjb0","refresh_token":"1//0fK8Az1bWCEWQCgYIARAAGA8SNwF-L9Irtoy9vEA0mD7xdffeCi3-XrF9bg7m7TqPzTvfwLDU8eoFSA7CIJjvXRitgeAjmbQjXik","scope":"https://www.googleapis.com/auth/drive","token_type":"Bearer","expiry_date":1615415402012}
            
            
            // res.json(token);
            res.send('successful')
        });

        
    }
    catch(error){
        console.log('error while trying to get user token')
        res.send('error')
    }
              
})


router.get('/files', async (req, res) => {
    
  try{

    const drive = await auth(8);
    
    const results = await drive.files.list({
      pageSize: 10,
      fields: 'nextPageToken, files(id, name)',
    }) 

    const files = results.data.files;
   
    let output = '';  //this was const instead of let :) 
    files.forEach(file =>{
      output += `${file.name} (${file.id}) <br />`
  })

    res.send(output)
  }
  catch(err){
    res.send('error occurred')
  }

})


module.exports = router;