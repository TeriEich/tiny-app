var getHTML = require('../make-it-a-module');

var requestOptions = {
  host: 'sytantris.github.io',
  path: '/http-examples/step6/uppercase.html'
};


function printUpperCase (html) {
  var htmlToString = [];
  for (var i = 0; i < html.length; i++) {
    htmlToString.push(html[i]);
  }
  dataStr = htmlToString.toString();
  var dataUpperCase = dataStr.toUpperCase();
  console.log(dataUpperCase);
}

getHTML(requestOptions, printUpperCase);


//transforms the html string into ALL CAPS
//and prints it to the console
