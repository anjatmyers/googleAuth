const fs = require('fs');
const { google } = require("googleapis");

const keys = require('../keys');
const db = require('../models');


const getDriveObj =  async(userID) => {

  const userToken = await db.auth.findAll({where: {userID: userID}}, {raw: true});
  let token = userToken[0].dataValues;
  
  const oAuth2Client = new google.auth.OAuth2(
    keys.client_id, keys.client_secret, keys.redirect_uris[0]);

    oAuth2Client.setCredentials({
      access_token: token.access_token,
      refresh_token: token.refresh_token,
      scope: token.scope,
      token_type: token.token_type,
      expiry_date : token.expiry_date

    });
       
    const drive = google.drive({
        version: 'v3',
        auth: oAuth2Client
    });

    return drive;

};

module.exports = getDriveObj;