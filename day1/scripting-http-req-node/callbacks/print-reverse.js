var getHTML = require('../make-it-a-module');

var requestOptions = {
  host: 'sytantris.github.io',
  path: '/http-examples/step6/reverse.html'
};


function printReverse (html) {
  var htmlToString = [];
  for (var i = 0; i < html.length; i++) {
    htmlToString.push(html[i]);
  }
  var dataStr = htmlToString.toString();
  var dataReverse = dataStr.split("").reverse().join("");
  console.log(dataReverse);
}

getHTML(requestOptions, printReverse);


//reverses the html string
//and then prints it to the console
