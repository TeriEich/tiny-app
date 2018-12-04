var getHTML = require('../make-it-a-module');

var requestOptions = {
  host: 'sytantris.github.io',
  path: '/http-examples/step6/lowercase.html'
};


function printLowerCase (html) {
  var htmlToString = [];
  for (var i = 0; i < html.length; i++) {
    htmlToString.push(html[i]);
  }
  dataStr = htmlToString.toString();
  var dataLowerCase = dataStr.toLowerCase();
  console.log(dataLowerCase);
}

getHTML(requestOptions, printLowerCase);


//transforms the html string into lowercase
//and prints it to the console