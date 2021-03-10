const fs = require('fs');
const { google } = require("googleapis");

const keys = require('../keys');
const db = require('../models');

const createToken=()=>{
    //create toke and store it
}


const getDriveObj = async (userID) => {

  
  //use userID to get drive, or to get
  //if token exists 
  //const userToken = await db.auth.findAll({where: {id: userID}}, {raw: true});

  
  const TOKEN = `{"access_token":"ya29.a0AfH6SMDlE3iJ_tnviAS_douNWkz0TstIAskZ6E_XuiSEToOojJNYeXEStTKt1r-U9MOQ8WB9BoF4sO95jhz6pUHOAUKbIJw9ILX55Y-e-19n61C72OtNPgkQbe5yY1aAAtkUkDp45N2v3izkONjpE0d1Yjb0","refresh_token":"1//0fK8Az1bWCEWQCgYIARAAGA8SNwF-L9Irtoy9vEA0mD7xdffeCi3-XrF9bg7m7TqPzTvfwLDU8eoFSA7CIJjvXRitgeAjmbQjXik","scope":"https://www.googleapis.com/auth/drive","token_type":"Bearer","expiry_date":1615415402012}`;
  

  const oAuth2Client = new google.auth.OAuth2(
    keys.client_id, keys.client_secret, keys.redirect_uris[0]);

  //get access token from database
    console.log('***********************')
    console.log(TOKEN);
    oAuth2Client.setCredentials(JSON.parse(TOKEN));
       
    const drive = google.drive({
        version: 'v3',
        auth: oAuth2Client
    });

    drive.files.list({
      pageSize: 10,
      fields: 'nextPageToken, files(id, name)',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const files = res.data.files;
      if (files.length) {
        console.log('Files:');
        files.map((file) => {
          console.log(`${file.name} (${file.id})`);
        });
      } else {
        console.log('No files found.');
      }
    });
   
    
    return drive;

};

module.exports = getDriveObj;