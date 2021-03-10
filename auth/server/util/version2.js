const fs = require('fs');
const { google } = require("googleapis");
const keys = require('./config');
const db = require('../models');

const createToken=()=>{
    //create toke and store it
}


const getDriveObj = async (userID) => {

  
  //use userID to get drive, or to get
  //if token exists 
  const userToken = await db.auth.findAll({where: {id: userID}}, {raw: true});
//   const TOKEN = "1//01jY34zsWA5hHCgYIARAAGAESNwF-L9Irgoj7irdMJqno2IX4tVJDvlBEoUbb09l5qZXAlFHhFBe1CPkXPx0tu-2vVTGOoP7H1wc"
  const TOKEN = JSON.stringify(userToken[0].dataValues.token)
  

  const oAuth2Client = new google.auth.OAuth2(
    keys.client_id, keys.client_secret, keys.redirect_uris[0]);

  //get access token from database
    console.log('***********************')
    console.log(TOKEN);
    oAuth2Client.setCredentials(TOKEN);
       
    const drive = google.drive({
        version: 'v3',
        auth: oAuth2Client
    });
   
    
    return drive;

};

module.exports = getDriveObj;