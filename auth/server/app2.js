const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const credentials = require("./credentials.json");

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/documents.readonly'];
// READ ONLY ^^ look into how to write files as well
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Docs API.
  authorize(JSON.parse(content), printDocTitle);
});
// creds than come from json file 
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  }); //oAuth2Client = creds from credential file ....taking token and if it exists call oAuth2 and pass in json parse token
}//if token is not in db make getNewToken call 
//set up route for you endpoint and use query string param to grab the token

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Prints the title of a sample doc:
 * https://docs.google.com/document/d/195j9eDD3ccgjQRttHhJPymLJUCOUjs-jmwTrekvdjFE/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth 2.0 client.
 */
function printDocTitle(auth) {
  const docs = google.docs({version: 'v1', auth});
//   auth is the token, grab token from user in db then we can do any other api call 
// res = resuls from api call 
  docs.documents.get({
    documentId: '195j9eDD3ccgjQRttHhJPymLJUCOUjs-jmwTrekvdjFE',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    console.log(`The title of the document is: ${res.data.title}`);
  });
}
// if we stored auth tokem , we can have functions to get what you need



// async in front of listfiles 
// can access the drive or other thinks
// blogger.blogs.get() is the API call = docs.documents.get 
// look in samples folder
// oauth2client is an oauth token- got it by passing in info that you registered with - creates new instance 
// passes in the scopes of what you want 
// once thats done pass in instance type and scope
/** .gettoken is a method on the token passes in code (which equals what you recieve when you get from URL ) */ 
// route for redirect url and pull off the query strong param 
// app.get('/oauthcallback/)
// res.send(req.query.code)
// button = handle the scopes, set up token function
// generateAuthURL -  res.redirect to this URL 
// auth code is NOT a token yet 
// make call to setcredentials with teh auth code from URL to generate the actual token 
// oauth2client.gettoken passes back the actual token 
// store the TOKEN in the db 
// err first callback = first argument is always the error - it will fill in the error with early return  or the token 
// fs.write file - instead of writng to a file we will save it to the database 
// fs.writefile will be write to db
// JSON.sringify(token) serializing it but we don't have to do that bc its already an object 
// callback (oauth2client) dont have to the teh callback - points to printDocTitle function and passing in outh2client object 
// authorize, printDocTitle is the cb and executes at the end 

// refresh token - they expire: read into this 

// API key = auth 

// USAGE = drive.whateve.whatever 
// OPtions for what to do with the drive files:
// drive.files.list drive.files.create drive.files.delete 
// ignore how their doing it with a URL, use node object for API calls 
// use the metedata to know what things to make when we create a file
// drive.files.list.orderby/spaces/pageSize/feilds/etc 

// drive.files.create - gives a good example of upload in the samples upload.js
// 
// need req body and any metadata and a media where the body of the file is: could come from a textfeild 
// mime type could be HTML or anything else 
// 



// media uploads



// button from the front end calls to a 'googleauth' file like it does with passport. It will be a res.post bc the first function will need to pass back the AUth URL. Once on the front end the user will click okay and be redirected to the URL with the code. this code will then go back to the function which will generate the token which will be stored in the db 