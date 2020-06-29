// let changeColor = document.getElementById('changeColor');

// chrome.storage.sync.get('color', function(data) {
//   changeColor.style.backgroundColor = data.color;
//   changeColor.setAttribute('value', data.color);
// });

// chrome.identity.getAuthToken({
//   interactive: true
// }, function(token) {
//   if (chrome.runtime.lastError) {
//       alert(chrome.runtime.lastError.message);
//       return;
//   }
//   // var x = new XMLHttpRequest();
//   // x.open('GET', 'https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=' + token);
//   // x.onload = function() {
//   //     alert(x.response);
//   // };
//   // x.send();
//   var metadata = {
//     name: 'foo-bar.json',
//     mimeType: 'application/json',
//     parents: ['appDataFolder'],
//   };
//   var fileContent = {
//     foo: 'bar'
//   };
//   var file = new Blob([JSON.stringify(fileContent)], {type: 'application/json'});
//   var form = new FormData();
//   form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
//   form.append('file', file);

//   var xhr = new XMLHttpRequest();
//   xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');
//   xhr.setRequestHeader('Authorization', 'Bearer ' + token);
//   xhr.responseType = 'json';
//   xhr.onload = () => {
//       var fileId = xhr.response.id;
//       /* Do something with xhr.response */
//       console.log(xhr.response);
//       console.log(fileId);
//   };
//   xhr.send(form);
// });

// changeColor.onclick = function(element) {
//   let color = element.target.value;
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     chrome.tabs.executeScript(
//         tabs[0].id,
//         {code: 'document.body.style.backgroundColor = "' + color + '";'});
//   });
// };

// var fileContent = 'sample text'; // As a sample, upload a text file.
// var file = new Blob([fileContent], {type: 'text/plain'});
// var metadata = {
//     'name': 'sampleName', // Filename at Google Drive
//     'mimeType': 'text/plain', // mimeType at Google Drive
// };

// var accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
// var form = new FormData();
// form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
// form.append('file', file);

// var xhr = new XMLHttpRequest();
// xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
// xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
// xhr.responseType = 'json';
// xhr.onload = () => {
//     alert(xhr.response.id); // Retrieve uploaded file ID.
// };
// xhr.send(form);


chrome.identity.getAuthToken({interactive: true}, function(token) {
  console.log('got the token', token);
})

const API_KEY = 'AIzaSyAed5yuxCNrXlEFAqSoWwAQpE3Ng95Tzl8';
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4", "https://docs.googleapis.com/$discovery/rest?version=v1", "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SPREADSHEET_ID = '1jgrHb-aN2WjteuSuzfOQQ_vtMY728zwZzeHjjgbZMAY';
const SPREADSHEET_TAB_NAME = 'Sheet1';

function onGAPILoad() {
  console.log("function called");
  document.getElementById('get-doc-button').onclick = getDoc;
  document.getElementById('create-doc-button').onclick = createDoc;
  gapi.client.init({
    // Don't pass client nor scope as these will init auth2, which we don't want
    apiKey: API_KEY,
    discoveryDocs: DISCOVERY_DOCS,
  }).then(function () {    
    console.log('gapi initialized')
    console.log(gapi.client);
    chrome.identity.getAuthToken({interactive: true}, function(token) {
      gapi.auth.setToken({
        'access_token': token,
      });

      gapi.client.docs.documents.get({
        documentId: SPREADSHEET_ID,
      }).then(function(response) {
        let doc = response.result;
        let title = doc.title;
        console.log('Document ' + title + ' successfully found.');
        document.getElementById('output').innerHTML = title;
        // console.log(`Got ${response.result.values.length} rows back`)
      });
    })
  }, function(error) {
    console.log('error', error)
  });
}

function getDoc() {
  const docID = document.getElementById('docid').value;
  chrome.identity.getAuthToken({interactive: true}, function(token) {
    gapi.auth.setToken({
      'access_token': token,
    });

    gapi.client.docs.documents.get({
      documentId: docID,
    }).then(function(response) {
      let doc = response.result;
      let title = doc.title;
      console.log('Document ' + title + ' successfully found.');
      document.getElementById('output').innerHTML = title;
      // console.log(`Got ${response.result.values.length} rows back`)
    });
  })
}

function createDoc() {
  chrome.identity.getAuthToken({interactive: true}, function(token) {
    gapi.auth.setToken({
      'access_token': token,
    });

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    // jsonBody.title = 'Notes Template ' + today;
    // console.log(jsonBody);

    // gapi.client.request({
    //   path: 'https://docs.googleapis.com/v1/documents',
    //   method: 'POST',
    //   body: jsonBody, 
    // }).then(function(response) {
    //   let doc = response.result;
    //   let title = doc.title; 
    //   console.log('Created');
    //   console.log(doc);
    //   document.getElementById('output2').innerHTML = title;
    //   const newURL = "https://docs.google.com/document/d/" + doc.documentId;
    //   console.log(newURL);
    //   // chrome.tabs.create({ url: newURL });
    // })
    gapi.client.drive.files.copy({
      fileId: '1PaDD4GLSGAFlG3fzL8nHdaT_fn-HQyZ7bvtWnNkyWtg',
    }).then(function(response) {
      console.log(response);
    });
  })
}