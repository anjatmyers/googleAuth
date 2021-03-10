const express = require('express');
const router = express.Router();
const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
// const credentials = require('../credentials.json');
const keys = require('../keys');
const drive = require('../util/googleDrive');
// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/drive"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";
const db = require('../models');
const auth = require('../util/version2')
const oAuth = require("../util/oAuth2Client");
// const { getNewToken } = require('../util/oAuth2Client');
const oAuth2Client = new google.auth.OAuth2(
  keys.client_id, keys.client_secret, keys.redirect_uris[0]);

router.get('/oauth2Callback', (req, res) => {
    // res.send(req.query.code)
    let code = req.query.code;
    console.log(`code ${code}`);
    try{

       
          
          oAuth2Client.getToken(code, async (err, token) => {
              if (err) return console.error("Error retrieving access token", err);
              oAuth2Client.setCredentials(JSON.stringify(token));
              // Store the token to disk for later program executions
            //   console.log(token.access_token, token.refresh_token, token.scope, token.token_type)
            console.log(JSON.stringify(token))
            
            //my token
            //code 4/0AY0e-g43K8FI2AdNhcDboVYiJxuN_0f1Z1R0dapXwdiQ6wbS-e2d5yNEja36jc_2Qvgz8g
              //{"access_token":"ya29.a0AfH6SMDlE3iJ_tnviAS_douNWkz0TstIAskZ6E_XuiSEToOojJNYeXEStTKt1r-U9MOQ8WB9BoF4sO95jhz6pUHOAUKbIJw9ILX55Y-e-19n61C72OtNPgkQbe5yY1aAAtkUkDp45N2v3izkONjpE0d1Yjb0","refresh_token":"1//0fK8Az1bWCEWQCgYIARAAGA8SNwF-L9Irtoy9vEA0mD7xdffeCi3-XrF9bg7m7TqPzTvfwLDU8eoFSA7CIJjvXRitgeAjmbQjXik","scope":"https://www.googleapis.com/auth/drive","token_type":"Bearer","expiry_date":1615415402012}
            

            
            res.json(token);
            });

        
    }
    catch(error){
        console.log('error while trying to get user token')
    }
              

})

router.get('/start', (req, res) => {

  const SCOPES = ['https://www.googleapis.com/auth/drive'];
  
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  //res.json({url: ${authUrl}})
  res.send(`<a href="${authUrl}">auth</a>`)
  
})

router.get('/files', async (req, res) => {
    
  try{
    let drive = await auth(26);
    console.log(drive)
    let results = await drive.files.list({pageSize: 10, fields: 'nextPageToken, files(id, name)'})
    console.log("RESULTS*******", results)
    const files = results.data.files;
    const output = '';
    files.forEach((file) => {
        output += `${file.name} (${file.id}) <br/>`

    })

    res.send(output)
  }
  catch(err){
    res.send('error occurred')
  }

})


router.post('/getURL', (req, res) => {
    

    try{


        const getOAuth2Client = () => {
    

            fs.readFile("credentials.json", (err, content) => {
                if (err) return console.log("Error loading client secret file:", err);
                // Authorize a client with credentials, then call the Google Docs API.
                authorize(JSON.parse(content));
              });
             
              function authorize(credentials, callback) {
                const { client_secret, client_id, redirect_uris } = credentials.web;
                oAuth2Client = new google.auth.OAuth2(
                  client_id,
                  client_secret,
                  redirect_uris[0]
                );
                console.log(oAuth2Client)
                // Check if we have previously stored a token.
                fs.readFile(TOKEN_PATH, (err, token) => {
                  if (err) return getNewToken(oAuth2Client, callback);
                  oAuth2Client.setCredentials(JSON.parse(token));
                  callback(oAuth2Client);
                });
              }
        
        }

        getOAuth2Client();
        
          function getNewToken(oAuth2Client) {
            
            const authUrl = oAuth2Client.generateAuthUrl({
                access_type: "offline",
                scope: SCOPES,
              });
    
              console.log("Authorize this app by visiting this url:", authUrl);

              res.json(authUrl)
              
            // res.redirect(authUrl)
          }

    }
    catch(error){
        console.log('unable to make URL')
    }

})



module.exports = router;