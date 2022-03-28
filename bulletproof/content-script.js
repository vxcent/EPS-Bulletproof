let CCPA = true

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request == undefined) {
    return
  }
  if (request.action === "CCPA Alert") {
    // CCPA alert dialog popup
    CCPA = false
    console.log("extension popup alert")
    alert("CCPA Not Detected")
    sendResponse({reply: "ok"})
  } else if (request.action == "CCPA State Fetch") {
    console.log("CCPA state triggered")
    sendResponse({reply: CCPA})
  }
});
