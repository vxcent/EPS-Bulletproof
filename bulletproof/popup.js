// Copyright 2021 Google LLC
//
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

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
    "IP Address": false,
  }, 
  "Extened Identity" : {
    "Location": true,
    "Social Meida Profile": true,
    "Employment History": true,
    "Health Details": true,
  }, 
}

function dumpFineGrainedGPCConfiguration() {
  Object.keys(privacyConfig).forEach(function(category) {
    var column = $("<div class='col'><strong>" + category + "</strong></div>")
    config = privacyConfig[category]
    Object.keys(config).forEach(function(field) {
      var checkBoxTemplate = `
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" ${config[field] ? "checked" : ""}>
          <label class="form-check-label" for="flexCheckChecked">
            ${field}
          </label>
        </div>
      `
      column.append(checkBoxTemplate)
    })
    $("#gpcConfig").append(column)
  })
}

document.addEventListener('DOMContentLoaded', function () {
  dumpFineGrainedGPCConfiguration();
});

function handleCompliantUpdate(compliant) {
  if (compliant) {
    $("#ccpa-status").removeClass("bg-danger")
    $("#gpc-status").removeClass("bg-danger")
    $("#ccpa-status").addClass("bg-success")
    $("#gpc-status").addClass("bg-success")
    $("#ccpa-status").val("Compliant")
    $("#gpc-status").val("Compliant")
  } else {
    $("#ccpa-status").removeClass("bg-success")
    $("#gpc-status").removeClass("bg-success")
    $("#ccpa-status").addClass("bg-danger")
    $("#gpc-status").addClass("bg-danger")
    $("#ccpa-status").val("Not Compliant")
    $("#gpc-status").val("Not Compliant")
  }
}

window.onload = function() {
  //popup was opened, do what you want
  // Update states in popup page
  // Fetch the url of the page
  chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT}, tabs => {
    if (tabs.length > 0) {
      console.log("send CCPA state fetch message to content script")
      chrome.tabs.sendMessage(tabs[0].id, {action: "CCPA State Fetch"}, function(response) {
        console.log("Get CCPA result " + response.reply)
        handleCompliantUpdate(response.reply)
      })
    } else {
      console.log("url is not detected")
    }
  })
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request == undefined) {
    return
  }
  if (request.action === "CCPA State Update") {
    // CCPA alert dialog popup
    console.log("received update message")
    handleCompliantUpdate(request.data)
    sendResponse({reply: "ok"})
  }
});