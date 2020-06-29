// chrome.identity.getAuthToken({interactive: true}, function(token) {
//   console.log('got the token', token);
// })

const API_KEY = 'AIzaSyAed5yuxCNrXlEFAqSoWwAQpE3Ng95Tzl8';
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4", "https://docs.googleapis.com/$discovery/rest?version=v1", "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

const CLIENT_ID = "1005120763196-qiv2jflnrg8or8c84q43rtv8cgcphgs7.apps.googleusercontent.com";
const SCOPES = [
      "https://www.googleapis.com/auth/userinfo.email", 
      "https://www.googleapis.com/auth/drive.appdata", 
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.metadata',
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/documents.readonly",
      "https://www.googleapis.com/auth/documents"
    ]

function onGAPILoad() {
  console.log("function called");
  document.getElementById('get-doc-button').onclick = getDoc;
  document.getElementById('create-doc-button').onclick = createDoc;
  document.getElementById('test-button').onclick = testing;
  document.getElementById('logout-button').onclick = logout;
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
    const jsonBody = {
      'title': 'QuickNotes ' + today,
    };
    // jsonBody.title = 'Notes Template ' + today;
    // console.log(jsonBody);

    gapi.client.request({
      path: 'https://docs.googleapis.com/v1/documents',
      method: 'POST',
      body: jsonBody, 
    }).then(function(response) {
      let doc = response.result;
      let title = doc.title; 
      console.log('Created');
      console.log(doc);
      const newURL = "https://docs.google.com/document/d/" + doc.documentId;
      console.log(newURL);
      // chrome.tabs.create({ url: newURL });
    })
      // gapi.client.drive.files.list({
      //     'pageSize': 10,
      //     'fields': "nextPageToken, files(id, name)"
      //   }).then(function(response) {
      //     console.log(response);
      //     })
    // gapi.client.drive.files.copy({
    //   fileId: '1PaDD4GLSGAFlG3fzL8nHdaT_fn-HQyZ7bvtWnNkyWtg',
    // }).then(function(response) {
    //   console.log(response);
    // });
  })
}

function testing() {
  chrome.identity.getAuthToken({interactive: true}, function(token) {
    gapi.auth.setToken({
      'access_token': token,
    });

    gapi.client.request({
      path: 'https://www.googleapis.com/drive/v3/files/fileId/copy',
      method: 'POST',
      params: {'fileId': '1XlcAy-vrleXBxJl5Qy_SxGUyTqcwdUIhyJI2BygpNEc'}
    }).then(function(response) {
      console.log(response);
    })
  })
    // gapi.client.request({
    //   path: 'https://www.googleapis.com/drive/v3/about',
    //   params: {'fields': '*'},
    // }).then(function(response) {
    //   console.log(response);
    //   console.log(response.result);
    // })
    // gapi.client.request({
    //   path: 'https://www.googleapis.com/drive/v3/files'
    // }).then(function(response) {
    //   console.log('Get Files');
    //   console.log(response);
    // })
}

function logout() {
  chrome.identity.launchWebAuthFlow(
    { 'url': 'https://accounts.google.com/logout' },
    function(tokenUrl) {
      console.log("logged out");
    }
}
