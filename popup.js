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
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4", "https://docs.googleapis.com/$discovery/rest?version=v1"];
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
let jsonBody = 
{
  "title": "Notes Template",
  "body": {
    "content": [
      {
        "endIndex": 1,
        "sectionBreak": {
          "sectionStyle": {
            "columnSeparatorStyle": "NONE",
            "contentDirection": "LEFT_TO_RIGHT",
            "sectionType": "CONTINUOUS"
          }
        }
      },
      {
        "startIndex": 1,
        "endIndex": 8,
        "paragraph": {
          "elements": [
            {
              "startIndex": 1,
              "endIndex": 8,
              "textRun": {
                "content": "Title:\n",
                "textStyle": {
                  "bold": true,
                  "weightedFontFamily": {
                    "fontFamily": "Google Sans",
                    "weight": 400
                  }
                }
              }
            }
          ],
          "paragraphStyle": {
            "namedStyleType": "NORMAL_TEXT",
            "direction": "LEFT_TO_RIGHT"
          }
        }
      },
      {
        "startIndex": 8,
        "endIndex": 21,
        "paragraph": {
          "elements": [
            {
              "startIndex": 8,
              "endIndex": 21,
              "textRun": {
                "content": "University: \n",
                "textStyle": {
                  "bold": true,
                  "weightedFontFamily": {
                    "fontFamily": "Google Sans",
                    "weight": 400
                  }
                }
              }
            }
          ],
          "paragraphStyle": {
            "namedStyleType": "NORMAL_TEXT",
            "direction": "LEFT_TO_RIGHT"
          }
        }
      },
      {
        "startIndex": 21,
        "endIndex": 35,
        "paragraph": {
          "elements": [
            {
              "startIndex": 21,
              "endIndex": 35,
              "textRun": {
                "content": "Course Code: \n",
                "textStyle": {
                  "bold": true,
                  "weightedFontFamily": {
                    "fontFamily": "Google Sans",
                    "weight": 400
                  }
                }
              }
            }
          ],
          "paragraphStyle": {
            "namedStyleType": "NORMAL_TEXT",
            "direction": "LEFT_TO_RIGHT"
          }
        }
      },
      {
        "startIndex": 35,
        "endIndex": 47,
        "paragraph": {
          "elements": [
            {
              "startIndex": 35,
              "endIndex": 47,
              "textRun": {
                "content": "Professor: \n",
                "textStyle": {
                  "bold": true,
                  "weightedFontFamily": {
                    "fontFamily": "Google Sans",
                    "weight": 400
                  }
                }
              }
            }
          ],
          "paragraphStyle": {
            "namedStyleType": "NORMAL_TEXT",
            "direction": "LEFT_TO_RIGHT"
          }
        }
      },
      {
        "startIndex": 47,
        "endIndex": 54,
        "paragraph": {
          "elements": [
            {
              "startIndex": 47,
              "endIndex": 54,
              "textRun": {
                "content": "Date: \n",
                "textStyle": {
                  "bold": true,
                  "weightedFontFamily": {
                    "fontFamily": "Google Sans",
                    "weight": 400
                  }
                }
              }
            }
          ],
          "paragraphStyle": {
            "namedStyleType": "NORMAL_TEXT",
            "direction": "LEFT_TO_RIGHT"
          }
        }
      },
      {
        "startIndex": 54,
        "endIndex": 71,
        "paragraph": {
          "elements": [
            {
              "startIndex": 54,
              "endIndex": 71,
              "textRun": {
                "content": "Topics: \u000bTl;dr: \n",
                "textStyle": {
                  "bold": true,
                  "weightedFontFamily": {
                    "fontFamily": "Google Sans",
                    "weight": 400
                  }
                }
              }
            }
          ],
          "paragraphStyle": {
            "namedStyleType": "NORMAL_TEXT",
            "direction": "LEFT_TO_RIGHT"
          }
        }
      }
    ]
  },
  "documentStyle": {
    "background": {
      "color": {}
    },
    "pageNumberStart": 1,
    "marginTop": {
      "magnitude": 72,
      "unit": "PT"
    },
    "marginBottom": {
      "magnitude": 72,
      "unit": "PT"
    },
    "marginRight": {
      "magnitude": 72,
      "unit": "PT"
    },
    "marginLeft": {
      "magnitude": 72,
      "unit": "PT"
    },
    "pageSize": {
      "height": {
        "magnitude": 792,
        "unit": "PT"
      },
      "width": {
        "magnitude": 612,
        "unit": "PT"
      }
    },
    "marginHeader": {
      "magnitude": 36,
      "unit": "PT"
    },
    "marginFooter": {
      "magnitude": 36,
      "unit": "PT"
    },
    "useCustomHeaderFooterMargins": true
  },
  "namedStyles": {
    "styles": [
      {
        "namedStyleType": "NORMAL_TEXT",
        "textStyle": {
          "bold": false,
          "italic": false,
          "underline": false,
          "strikethrough": false,
          "smallCaps": false,
          "backgroundColor": {},
          "foregroundColor": {
            "color": {
              "rgbColor": {}
            }
          },
          "fontSize": {
            "magnitude": 11,
            "unit": "PT"
          },
          "weightedFontFamily": {
            "fontFamily": "Arial",
            "weight": 400
          },
          "baselineOffset": "NONE"
        },
        "paragraphStyle": {
          "namedStyleType": "NORMAL_TEXT",
          "alignment": "START",
          "lineSpacing": 115,
          "direction": "LEFT_TO_RIGHT",
          "spacingMode": "COLLAPSE_LISTS",
          "spaceAbove": {
            "unit": "PT"
          },
          "spaceBelow": {
            "unit": "PT"
          },
          "borderBetween": {
            "color": {},
            "width": {
              "unit": "PT"
            },
            "padding": {
              "unit": "PT"
            },
            "dashStyle": "SOLID"
          },
          "borderTop": {
            "color": {},
            "width": {
              "unit": "PT"
            },
            "padding": {
              "unit": "PT"
            },
            "dashStyle": "SOLID"
          },
          "borderBottom": {
            "color": {},
            "width": {
              "unit": "PT"
            },
            "padding": {
              "unit": "PT"
            },
            "dashStyle": "SOLID"
          },
          "borderLeft": {
            "color": {},
            "width": {
              "unit": "PT"
            },
            "padding": {
              "unit": "PT"
            },
            "dashStyle": "SOLID"
          },
          "borderRight": {
            "color": {},
            "width": {
              "unit": "PT"
            },
            "padding": {
              "unit": "PT"
            },
            "dashStyle": "SOLID"
          },
          "indentFirstLine": {
            "unit": "PT"
          },
          "indentStart": {
            "unit": "PT"
          },
          "indentEnd": {
            "unit": "PT"
          },
          "keepLinesTogether": false,
          "keepWithNext": false,
          "avoidWidowAndOrphan": true,
          "shading": {
            "backgroundColor": {}
          }
        }
      },
      {
        "namedStyleType": "HEADING_1",
        "textStyle": {
          "fontSize": {
            "magnitude": 20,
            "unit": "PT"
          }
        },
        "paragraphStyle": {
          "namedStyleType": "NORMAL_TEXT",
          "direction": "LEFT_TO_RIGHT",
          "spaceAbove": {
            "magnitude": 20,
            "unit": "PT"
          },
          "spaceBelow": {
            "magnitude": 6,
            "unit": "PT"
          },
          "keepLinesTogether": true,
          "keepWithNext": true
        }
      },
      {
        "namedStyleType": "HEADING_2",
        "textStyle": {
          "bold": false,
          "fontSize": {
            "magnitude": 16,
            "unit": "PT"
          }
        },
        "paragraphStyle": {
          "namedStyleType": "NORMAL_TEXT",
          "direction": "LEFT_TO_RIGHT",
          "spaceAbove": {
            "magnitude": 18,
            "unit": "PT"
          },
          "spaceBelow": {
            "magnitude": 6,
            "unit": "PT"
          },
          "keepLinesTogether": true,
          "keepWithNext": true
        }
      },
      {
        "namedStyleType": "HEADING_3",
        "textStyle": {
          "bold": false,
          "foregroundColor": {
            "color": {
              "rgbColor": {
                "red": 0.2627451,
                "green": 0.2627451,
                "blue": 0.2627451
              }
            }
          },
          "fontSize": {
            "magnitude": 14,
            "unit": "PT"
          }
        },
        "paragraphStyle": {
          "namedStyleType": "NORMAL_TEXT",
          "direction": "LEFT_TO_RIGHT",
          "spaceAbove": {
            "magnitude": 16,
            "unit": "PT"
          },
          "spaceBelow": {
            "magnitude": 4,
            "unit": "PT"
          },
          "keepLinesTogether": true,
          "keepWithNext": true
        }
      },
      {
        "namedStyleType": "HEADING_4",
        "textStyle": {
          "foregroundColor": {
            "color": {
              "rgbColor": {
                "red": 0.4,
                "green": 0.4,
                "blue": 0.4
              }
            }
          },
          "fontSize": {
            "magnitude": 12,
            "unit": "PT"
          }
        },
        "paragraphStyle": {
          "namedStyleType": "NORMAL_TEXT",
          "direction": "LEFT_TO_RIGHT",
          "spaceAbove": {
            "magnitude": 14,
            "unit": "PT"
          },
          "spaceBelow": {
            "magnitude": 4,
            "unit": "PT"
          },
          "keepLinesTogether": true,
          "keepWithNext": true
        }
      },
      {
        "namedStyleType": "HEADING_5",
        "textStyle": {
          "foregroundColor": {
            "color": {
              "rgbColor": {
                "red": 0.4,
                "green": 0.4,
                "blue": 0.4
              }
            }
          },
          "fontSize": {
            "magnitude": 11,
            "unit": "PT"
          }
        },
        "paragraphStyle": {
          "namedStyleType": "NORMAL_TEXT",
          "direction": "LEFT_TO_RIGHT",
          "spaceAbove": {
            "magnitude": 12,
            "unit": "PT"
          },
          "spaceBelow": {
            "magnitude": 4,
            "unit": "PT"
          },
          "keepLinesTogether": true,
          "keepWithNext": true
        }
      },
      {
        "namedStyleType": "HEADING_6",
        "textStyle": {
          "italic": true,
          "foregroundColor": {
            "color": {
              "rgbColor": {
                "red": 0.4,
                "green": 0.4,
                "blue": 0.4
              }
            }
          },
          "fontSize": {
            "magnitude": 11,
            "unit": "PT"
          }
        },
        "paragraphStyle": {
          "namedStyleType": "NORMAL_TEXT",
          "direction": "LEFT_TO_RIGHT",
          "spaceAbove": {
            "magnitude": 12,
            "unit": "PT"
          },
          "spaceBelow": {
            "magnitude": 4,
            "unit": "PT"
          },
          "keepLinesTogether": true,
          "keepWithNext": true
        }
      },
      {
        "namedStyleType": "TITLE",
        "textStyle": {
          "fontSize": {
            "magnitude": 26,
            "unit": "PT"
          }
        },
        "paragraphStyle": {
          "namedStyleType": "NORMAL_TEXT",
          "direction": "LEFT_TO_RIGHT",
          "spaceAbove": {
            "unit": "PT"
          },
          "spaceBelow": {
            "magnitude": 3,
            "unit": "PT"
          },
          "keepLinesTogether": true,
          "keepWithNext": true
        }
      },
      {
        "namedStyleType": "SUBTITLE",
        "textStyle": {
          "italic": false,
          "foregroundColor": {
            "color": {
              "rgbColor": {
                "red": 0.4,
                "green": 0.4,
                "blue": 0.4
              }
            }
          },
          "fontSize": {
            "magnitude": 15,
            "unit": "PT"
          },
          "weightedFontFamily": {
            "fontFamily": "Arial",
            "weight": 400
          }
        },
        "paragraphStyle": {
          "namedStyleType": "NORMAL_TEXT",
          "direction": "LEFT_TO_RIGHT",
          "spaceAbove": {
            "unit": "PT"
          },
          "spaceBelow": {
            "magnitude": 16,
            "unit": "PT"
          },
          "keepLinesTogether": true,
          "keepWithNext": true
        }
      }
    ]
  },
}; 

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
  jsonBody.title = 'Notes Template ' + today;

    gapi.client.request({
      path: 'https://docs.googleapis.com/v1/documents',
      method: 'POST',
      body: jsonBody, 
    }).then(function(response) {
      let doc = response.result;
      let title = doc.title; 
      console.log('Created ' + doc);
      document.getElementById('output2').innerHTML = title;
    })
  })
}