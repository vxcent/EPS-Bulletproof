// Default configuration

var privacyConfig = {
  "Core Identity" : {
    "Name": true,
    "Email": true,
    "Address": true,
    "Phone Number": true,
    "Photo Of You": true,
  }, 
  "Value-based Identity" : {
    "Date of Birth": true,
    "Bank Account Number": true,
    "Credit Card Number": true,
    "Driver's License": true,
    "Vehicle VIN": true,
    "IP Address": true,
  }, 
  "Extened Identity" : {
    "Location": true,
    "Social Meida Profile": true,
    "Employment History": true,
    "Health Details": true,
  }, 
}

chrome.storage.local.set({ "privacyConfig": privacyConfig }, function(){});

var test = chrome.runtime.getURL("web_list.csv")
chrome.storage.local.get(["blacklist"]).then((data) => {
  if (data.blacklist == undefined || data.blacklist.length == 0) {
    fetch(test).then(resp => {
      resp.text().then(web_list => {
        let ccpa_webs = web_list.split('\n')
        let blacklist = []
        ccpa_webs.forEach((web, _) => {
          let tokens = web.split(',')
          let host = tokens[0]
          let ccpa = tokens[1]
          if (ccpa == 0) {
            blacklist.push(host)
          }
        })
        chrome.storage.local.set({ "blacklist": blacklist }, function(){});
      })
    })
  } else {
    console.log("existed " + data.blacklist)
  }
})

// check compliance and send event
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo == undefined) {
    return
  }
  if (changeInfo.status == 'complete') {
    // Fetch the url of the page
    chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT}, tabs => {
      if (tabs != undefined && tabs.length > 0) {
        let url = tabs[0].url.replace("www.", "").slice(0, -1)
        // Check if the url is CCPA compliant
        chrome.storage.local.get(["blacklist"]).then((config) => {
          compliant = true
          if (config.blacklist != undefined && config.blacklist.includes(url)) {
            compliant = false
            chrome.tabs.sendMessage(tabs[0].id, { action: "CCPA Alert" }).catch(_ => {})
          }
          chrome.runtime.sendMessage({
            action: "CCPA State Update", 
            data: compliant
          }).catch(_ => {});
        });
      } else {
        console.log("url is not detected")
      }
    })
  }
})

// send fine-grained GPC request
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo == undefined) {
    return
  }
  if (changeInfo.status == 'complete') {
    chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT}, tabs => {
      if (tabs != undefined && tabs.length > 0) {
        let url = tabs[0].url
        chrome.storage.local.get(["privacyConfig"]).then((config) => {
          let host = getHost(url)
          let body = JSON.stringify(config.privacyConfig)
          fetch(host, {
            method: "POST",
            headers: {'Content-Type': 'application/json'}, 
            body: body
          }).then(res => {
            console.log("Request complete! response:", res);
          }).catch(err => {
            console.log("error " + err)
          });
        })
      }
    })
  }
})


function getHost(url) {
  urlParts = /^(?:\w+\:\/\/)?([^\/]+)([^\?]*)\??(.*)$/.exec(url);
  hostname = urlParts[1]; // www.example.com
  return "https://" + hostname + "/gpc"
}


