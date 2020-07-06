// chrome.runtime.onInstalled.addListener(function() {
//   chrome.storage.sync.set({color: '#3aa757'}, function() {
//     console.log('The color is green.');
//   });
//   chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
//     chrome.declarativeContent.onPageChanged.addRules([{
//       conditions: [new chrome.declarativeContent.PageStateMatcher({
//         pageUrl: {hostEquals: 'developer.chrome.com'},
//       })
//       ],
//           actions: [new chrome.declarativeContent.ShowPageAction()]
//     }]);
//   });
// })

chrome.identity.getAuthToken({interactive: true}, function(token) {
  console.log('got the token', token);
})

const API_KEY = 'AIzaSyAed5yuxCNrXlEFAqSoWwAQpE3Ng95Tzl8';
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4", "https://docs.googleapis.com/$discovery/rest?version=v1"];
const SPREADSHEET_ID = '1jgrHb-aN2WjteuSuzfOQQ_vtMY728zwZzeHjjgbZMAY';
const SPREADSHEET_TAB_NAME = 'Sheet1';

function onGAPILoad() {
  console.log("function called");
  gapi.client.init({
    // Don't pass client nor scope as these will init auth2, which we don't want
    apiKey: API_KEY,
    discoveryDocs: DISCOVERY_DOCS,
  }).then(function () {
    console.log('gapi initialized')
    console.log(gapi.client);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://kjwan-step-2020.appspot.com/data", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
          console.log('xhr response: '+ xhr.responseText);
      }
    }
    xhr.send();

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
        // console.log(`Got ${response.result.values.length} rows back`)
      });
    })
  }, function(error) {
    console.log('error', error)
  });
}

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
// console.log("sending");
// xhr.onload = () => {
//     console.log(xhr.response);
//     alert(xhr.response.id); // Retrieve uploaded file ID.
// };
// xhr.send(form);

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