/***
 * import material to build api call
 */
// import google api library
const {google} = require("googleapis");

// imoport Google drive module in google library
const drive = google.drive("v3");

// import private key 
const key = require("./private_key.json");

// import path "directories calls"
const path = require("path")

// import fs handle data in the file system
const fs = require("fs");


// make the request to retrieve authorization to work with Google Web service



// retieve jwt 
let jwToken = new google.auth.JWT(
    key.client_email,
    null,
    key.private_key,
    ["https://www.googleapis.com/auth/drive"],
    null
);

jwToken.authorize((authErr)=>{
    if(authErr){
        console.log("error: " + authErr)
        return;
    }
    else{
        console.log('Authorization successful')
    }


});


// make request to the drive web service 



// list file in specific folder

let folder = "1TN08P2l-u6GaMwgPPd4SYOaX3ZOPMZa-"

drive.files.list({

    auth: jwToken,
    pageSize: 10,
    q: "'" + folder + "' in parents and trashed=false",
    fields: `files(id, name)`,
}, (err, {data}) => {
    if(err) return console.log('The API returned an error: ' + err);
    let files = data.files;
    if(files.length){
        console.log('Files:');
        files.map((file) => {
            console.log(`${file.name} (${file.id})`);
        });
    } else {
        console.log('No files found.');
    }

});




// upload file in a specific folder

// let folderId = '1TN08P2l-u6GaMwgPPd4SYOaX3ZOPMZa-';

// let fileMetadata = {
//     'name': 'upload.txt',
//     parents: [folderId]
// };

// let media = {
//     mimeType: 'text/plain',
//     body: fs.createReadStream(path.join(__dirname, './upload.txt'))
// };
// drive.files.create({
//     auth: jwToken, 
//     resource: fileMetadata,
//     media: media,
//     fields: 'id'
// }, function (err, file){
//     if(err) {
//         console.error(err);
//     }else{
//         console.log('File Id: ', file.data.id);
//     }
// });







