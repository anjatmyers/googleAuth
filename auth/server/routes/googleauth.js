const express = require('express');
const router = express.Router();
const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const credentials = require('../credentials.json');
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
let oAuth2Client = {}

router.get('/googleAuth', (req, res) => {
    // res.send(req.query.code)
    let code = req.query.code;
    
    try{

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });
          
          oAuth2Client.getToken(code, async (err, token) => {
              if (err) return console.error("Error retrieving access token", err);
              oAuth2Client.setCredentials(JSON.stringify(token));
              // Store the token to disk for later program executions
            //   console.log(token.access_token, token.refresh_token, token.scope, token.token_type)
            console.log(JSON.stringify(token))
            //   let storedToken = await db.auth.create({
            //       id: 26,
            //       token: JSON.stringify(token),
                
            //   })

            let userToken = await db.auth.findAll({where: {id: 26}}, {raw: true})
            console.log("refresh-token", userToken)

            // {"access_token":"ya29.a0AfH6SMBxFammR06SGy8kethjZHyBbikcoXF2OyEitf0ee06CULYnRJNQgkVV8ZxGKYG7Jin42r_UuRR_LV3o2Wt2BGjAWdj7BfnYWXEbZ3ZohxAYEYCJ3szrrHwhrlSlk3zPLLQJDTnDYA3hCp09jdxvdUMC","refresh_token":"1//0171KMmm4O1umCgYIARAAGAESNwF-L9Ir7oJYQbAnXGLfH_YoZTH0yRHq_nWkvB0NYGDc8wn_r_PS6vbYMgIJpmUwGRahxAxLfKs","scope":"https://www.googleapis.com/auth/drive","token_type":"Bearer","expiry_date":1615408491463}

            // {"access_token": 'ya29.a0AfH6SMBypHY4h4u8kKQXd-TCERIslIDfgF_ujevn7UKvoqz-MtKA564blK7ExMBdPckXA2W5zl4bL14D7_1TAuznrQ9m12DU0iL1T4mFwS0OaN0fDhSr_Tf8INRg6WySgLKt6AxPvYuwSxOI6KHD3OW2xfIB',"refresh_token":'1//01fArdfqFNB-FCgYIARAAGAESNwF-L9IrFDfwzwcfRFueJfJUVPT8z6wFfTMPoIPPmq-D6nB4vCqtsV8OL7fXqXUKJaKgw6o8BRs',"scope": 'https://www.googleapis.com/auth/drive',"token_type": 'Bearer',"expiry_date": 1615406670791}

            // console.log(drive.listFiles(userToken[0].dataValues.token));
            

            // drive.listFiles();

            
            res.json(token);
            });

        
    }
    catch(error){
        console.log('error while trying to get user token')
    }
              

})


router.get('/files', async (req, res) => {
    
    let drive = auth(26);
    console.log(drive)
    let results = await drive.files.list({pageSize: 10, fields: 'nextPageToken, files(id, name)'})
    console.log("RESULTS*******", results)
    const files = results.data.files;
    const output = '';
    files.forEach((file) => {
        output += `${file.name} (${file.id}) <br/>`

    })

    res.send(output)

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