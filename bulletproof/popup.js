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
