let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});

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

changeColor.onclick = function(element) {
  let color = element.target.value;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: 'document.body.style.backgroundColor = "' + color + '";'});
  });
};

var fileContent = 'sample text'; // As a sample, upload a text file.
var file = new Blob([fileContent], {type: 'text/plain'});
var metadata = {
    'name': 'sampleName', // Filename at Google Drive
    'mimeType': 'text/plain', // mimeType at Google Drive
};

var accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
var form = new FormData();
form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
form.append('file', file);

var xhr = new XMLHttpRequest();
xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
xhr.responseType = 'json';
xhr.onload = () => {
    alert(xhr.response.id); // Retrieve uploaded file ID.
};
xhr.send(form);