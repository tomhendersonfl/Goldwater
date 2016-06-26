// This file contains functions that are used on multiple pages

// This function inserts HTML from the snippets folder into any page
//  To use this function:
//    1.  put the html snippet to be included into the app/snippets folder //    2.  add the attribute include-html="snippets/xxxxxxxx.html" to any element
//    3.  call the includeHTML function
//  Result = the html from the snippet file will be inserted immediately following the element with the include-html attribute
//  Note:  multiple snippets may be inserted into any page and nested snippets are also supported; the includeHTML function processes all snippets in one execution
function includeHTML() {
  var els, i, nodeCopy, fileName, xhttp
  els = document.getElementsByTagName("*");
  for (i = 0; i < els.length; i++) {
    if (els[i].getAttribute("include-html")) {
      nodeCopy = els[i].cloneNode(false);
      fileName = els[i].getAttribute("include-html");
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
          nodeCopy.removeAttribute("include-html");
          nodeCopy.innerHTML = xhttp.responseText;
          els[i].parentNode.replaceChild(nodeCopy, els[i]);
          includeHTML();
        }
      }
      xhttp.open("GET", fileName, true);
      xhttp.send();
      return;
    }
  }
}

// Request data for dashboard graphs and widgets
function requestData(dataUrl,callback) {
  var datahttp = new XMLHttpRequest();
  datahttp.onreadystatechange = function() {
    if (datahttp.readyState === 4 && datahttp.status === 200) {
      switch (callback) {
        case "dashboard" :
          addDataToDom(JSON.parse(datahttp.responseText))
          break
        case "utilities" :
          createGrid(JSON.parse(datahttp.responseText))
          break
        default :
          addDataToDom(JSON.parse(datahttp.responseText))
      }
    }
  }
  datahttp.open("GET", dataUrl, false)
  datahttp.send()
}
// Add graph and widget data to DOM
function addDataToDom(dataObject) {
  for (var key in dataObject) {
    switch (key.substr(0,3)) {
      case "cit" : // data is for a City dashboard
        document.getElementById("city_header").innerHTML = `${dataObject[key]} Current Achievement Rate`
        break
      case "reg" : // data is for a Region dashboard
        document.getElementById("region_header").innerHTML = `Total Region ${dataObject[key]} Conservation Savings`
        break
      case "pct" : // data is for a pie chart
        document.getElementById(key+"_2").setAttribute("data-percent", dataObject[key])
        document.getElementById(key).innerHTML = dataObject[key]
        break
      default : // no special processing needed
        document.getElementById(key).innerHTML = dataObject[key]
    }
  }
}
// Add data for progress-by-utility table
function createGrid(dataObject) {
  var el = document.getElementById("data-table-basic").innerHTML
  for (var key in dataObject) {
    switch (key) {
      case "headings" :
        el += "<thead><tr>"
        for (var heading in dataObject[key]) {
          el += `<th data-column-id="${heading}">${dataObject[key][heading]}</th>`
        }
        el += "</tr></thead>"
        break;
      case "utilities" :
        el += "<tbody>"
        for (var i = 0; i < dataObject[key].length; i++) {
          el += "<tr>"
          for (var columnData in dataObject[key][i]) {
            el += `<td>${dataObject[key][i][columnData]}</td>`
          }
          el += "</tr>"
        }
        el += "</tbody>"
        break;
      default :
        break;
    }
  }
  document.getElementById("data-table-basic").innerHTML = el
}
