// chrome.identity.getAuthToken({interactive: true}, function(token) {
//   console.log('got the token', token);
// })

const API_KEY = 'AIzaSyAed5yuxCNrXlEFAqSoWwAQpE3Ng95Tzl8';
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4", "https://docs.googleapis.com/$discovery/rest?version=v1", "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

const NOTES_TEMPLATE_ID = '1XlcAy-vrleXBxJl5Qy_SxGUyTqcwdUIhyJI2BygpNEc';

/** Initializes gapi and the button functions when script is loaded. */
function onGAPILoad() {
  console.log("function called");
  document.getElementById('get-doc-button').onclick = getDoc;
  document.getElementById('create-doc-button').onclick = createDoc;
  document.getElementById('test-button').onclick = testing;
  gapi.client.init({
    // Don't pass client nor scope as these will init auth2, which we don't want
    apiKey: API_KEY,
    discoveryDocs: DISCOVERY_DOCS,
  }).then(function () {    
    console.log('gapi initialized')
    console.log(gapi.client);
    chrome.identity.getAuthToken({interactive: true}, function(token) {
      console.log(token);
      gapi.auth.setToken({
        access_token: token,
      });
    })
  }, function(error) {
    console.log('error', error)
  });
}

/** Returns the document with the given document ID. */
function getDoc() {
  const docID = document.getElementById('docid').value;
  chrome.identity.getAuthToken({interactive: true}, function(token) {
    gapi.auth.setToken({
      access_token: token,
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

/** Creates a new document named QuickNotes + 'date' then redirects to that page. */
function createDoc() {
  chrome.identity.getAuthToken({interactive: true}, function(token) {
    gapi.auth.setToken({
      access_token: token,
    });

    const date = getDate();
    const jsonBody = {
      title: 'QuickNotes ' + date,
    };

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
  })
}

/** Makes a copy of the notes template. */
function testing() {
  chrome.identity.getAuthToken({interactive: true}, function(token) {
    gapi.auth.setToken({
      access_token: token,
    });

    const date = getDate(); 
    gapi.client.request({
      path: 'https://www.googleapis.com/drive/v3/files/fileId/copy',
      method: 'POST',
      params: {fileId: NOTES_TEMPLATE_ID},
      body: {
        name: 'Quicknotes ' + date,
      }
    }).then(function(response) {
      console.log(response);
      const newURL = "https://docs.google.com/document/d/" + response.result.id;
      console.log(newURL);
      chrome.tabs.create({url: newURL });
    })
  })
}

/** Returns formatted string of today's date. */
function getDate() {
  let today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = today.getFullYear();

  return mm + '/' + dd + '/' + yyyy;
}
