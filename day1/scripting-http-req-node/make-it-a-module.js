module.exports = function getHTML (options, callback) {

  var https = require('https');

  https.get(options, function (response) {
    response.setEncoding('utf8');
    response.on('data', function (data) {
      var allData = data.toString();
      return printHTML(allData);
    });

    response.on('end', function() {
      console.log('Response stream complete.');
    });
  });
};

function printHTML (html) {
  console.log(html);
}