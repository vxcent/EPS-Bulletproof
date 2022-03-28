const blacklist = [
  "https://www.google.com/"
]

chrome.storage.local.set({ "blacklist": blacklist }, function(){});

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo == undefined) {
    return
  }
  if (changeInfo.status == 'complete') {
    // Fetch the url of the page
    chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT}, tabs => {
      if (tabs != undefined && tabs.length > 0) {
        let url = tabs[0].url
        console.log("received " + url)
        // Check if the url is CCPA compliant
        chrome.storage.local.get(["blacklist"]).then((config) => {
          compliant = true
          if (config.blacklist.includes(url)) {
            compliant = false
            chrome.tabs.sendMessage(tabs[0].id, { action: "CCPA Alert" }, function(response) {
              console.log("alert window: " + response.reply)
              // TODO: Terminate websites
            })
          }
          chrome.runtime.sendMessage({
            action: "CCPA State Update", 
            data: compliant
          });
        });
      } else {
        console.log("url is not detected")
      }
    })
  }
})
