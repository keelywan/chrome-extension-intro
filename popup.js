// chrome.identity.getAuthToken({interactive: true}, function(token) {
//   console.log('got the token', token);
// })
let loggedIn = false; 

const API_KEY = 'AIzaSyAed5yuxCNrXlEFAqSoWwAQpE3Ng95Tzl8';
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4", "https://docs.googleapis.com/$discovery/rest?version=v1", "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

const NOTES_TEMPLATE_ID = '1XlcAy-vrleXBxJl5Qy_SxGUyTqcwdUIhyJI2BygpNEc';

/** Initializes gapi and the button functions when script is loaded. */
function onGAPILoad() {
  console.log("function called");
  // document.getElementById('get-doc-button').onclick = getDoc;
  // document.getElementById('create-doc-button').onclick = createDoc;
  document.getElementById('generate-note-btn').onclick = testing;
  document.getElementById('logout-btn').onclick = logout;
  document.getElementById('doc-name-input').value = 'QuickNotes ' + getDate();
  gapi.client.init({
    // Don't pass client nor scope as these will init auth2, which we don't want
    apiKey: API_KEY,
    discoveryDocs: DISCOVERY_DOCS,
  }).then(function () {    
    console.log('gapi initialized')
    console.log(gapi.client);
    chrome.identity.getAuthToken({interactive: true}, function(token) {
      console.log(token);
      if (chrome.runtime.lastError) {
        // alert(chrome.runtime.lastError.message);
        return;
      }
      loggedIn = true;
      setLoginLogout();
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
    loggedIn = true;
    setLoginLogout();
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
    loggedIn = true;
    setLoginLogout();
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
  let loadingIcon = document.getElementById("loading");
  loadingIcon.style.display = 'flex';
  chrome.identity.getAuthToken({interactive: true}, function(token) {
    if (chrome.runtime.lastError) {
      alert("Sorry, you did not authorize access. We were unable to generate your quicknote.");
      loadingIcon.style.display = 'none';
      return;
    }
    loggedIn = true;
    setLoginLogout();
    gapi.auth.setToken({
      access_token: token,
    });
    let docName = document.getElementById('doc-name-input').value.trim();
    if(docName === "") {
      docName = 'QuickNotes ' + getDate();
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://8080-cacf7a03-5e11-4b90-94f2-e81659d32917.us-east1.cloudshell.dev/data", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        console.log("RESPONSE GOTTEN");
          console.log('xhr response: '+ xhr.responseText);
      }
    }
    xhr.send();

    // gapi.client.request({
    //   path: 'https://kjwan-step-2020.appspot.com/data', 
    //   method: 'POST',
    // }).then(function(response) {
    //   console.log(response);
    // })
    // gapi.client.request({
    //   path: 'https://www.googleapis.com/drive/v3/files/fileId/copy',
    //   method: 'POST',
    //   params: {fileId: NOTES_TEMPLATE_ID},
    //   body: {
    //     name: docName,
    //   }
    // }).then(function(response) {
    //   console.log(response);
    //   const newURL = "https://docs.google.com/document/d/" + response.result.id;
    //   console.log(newURL);
    //   loadingIcon.style.display = 'none';

    //   var updateObject = {
    //     documentId: response.result.id,
    //     resource: {
    //       requests: [{
    //         replaceAllText: {
    //           replaceText: "Cornell University",
    //           containsText: {
    //             text: "[UNIVERSITY]",
    //             matchCase: true
    //           }
    //         },
    //         replaceAllText: {
    //           replaceText: "CS4410",
    //           containsText: {
    //             text: "[COURSE_CODE]",
    //             matchCase: true
    //           }
    //         },
    //         replaceAllText: {
    //           replaceText: "Professor Alvisi",
    //           containsText: {
    //             text: "[PROFESSOR]",
    //             matchCase: true
    //           }
    //         }
    //       }],
    //     },
    //   };
    //   gapi.client.docs.documents.batchUpdate(updateObject)
    //   .then(function(res) { // Modified
    //     console.log(res);
    //   },function(err) {
    //     console.error(err);
    //   });
    //   // chrome.tabs.create({url: newURL });
    // })
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

function logout() {
  chrome.identity.getAuthToken({interactive: false}, function(token) {
    var url = 'https://accounts.google.com/o/oauth2/revoke?token=' + token;
    window.fetch(url);

    chrome.identity.removeCachedAuthToken({token: token}, function (){
      loggedIn = false;
      setLoginLogout();
    });
  })
}

function setLoginLogout() {
  console.log(loggedIn);
  if(loggedIn) {
    chrome.identity.getProfileUserInfo(function(userInfo) {
      document.getElementById('logout-btn').style.display = 'inline';
      document.getElementById('email').textContent = userInfo.email;
      // document.getElementById('generate-note-button').disabled = false;
    })
  } else {
    document.getElementById('logout-btn').style.display = 'none';
    document.getElementById('email').textContent = "";
    // document.getElementById('generate-note-button').disabled = true;
  }
  loggedIn = !loggedIn;
}
