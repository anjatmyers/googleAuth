const { google } = require("googleapis");
const express = require('express');
const fs = require("fs");
const router = express.Router();
const TOKEN_PATH = "token.json";
const SCOPES = ["https://www.googleapis.com/auth/drive"];


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


function getNewToken(oAuth2Client) {
            
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
      });

      console.log("Authorize this app by visiting this url:", authUrl);

      res.json(authUrl)
      
    // res.redirect(authUrl)

    }


const getDriveObj = (userID) => {


    //use userID to get drive, or to get
    //if token exists 
    const TOKEN = `{"access_token":"ya29.a0AfH6SMDD3tdaYfPyta9bSSfPqjRHyi1mATC9KSaIulRupgtkKl2Do4dWOnFpixKec7GVkYlYPqYKd1-BRgQtxINOs7vtW-Bfha-bi9DwRQcCzV8-j3xEGEoJ0UOw4bCHd_vEkFPicVj4FwTDePPcM1H5X08c","refresh_token":"1//0fDkZ6Wdr3VO-CgYIARAAGA8SNwF-L9IrDJtjp2O0mFEF25MxybyWAoc98WmgnTToSjic73fcXGeS_uy5wGNUuD-CvRTFm0Rlcb8","scope":"https://www.googleapis.com/auth/drive","token_type":"Bearer","expiry_date":1615354324952}`
    
    const oAuth2Client = new google.auth.OAuth2(
        keys.client_id, keys.client_secret, keys.redirect_uris[0]);
    
    //get access token from database
        console.log(TOKEN);
        oAuth2Client.setCredentials(JSON.parse(TOKEN));
            
        const drive = google.drive({
            version: 'v3',
            auth: oAuth2Client
        });
    
        
        
        return drive;
    
    };






const oAuth = {
    getOAuth2Client,
    getNewToken
}

module.exports = oAuth;


