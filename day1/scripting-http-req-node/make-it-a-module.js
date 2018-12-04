module.exports = function getHTML (options, callback) {

  var https = require('https');
  var allData;
  https.get(options, function (response) {
    response.setEncoding('utf8');
    response.on('data', function (data) {
    allData = data.toString();
    return callback (arguments);
    });

    response.on('end', function() {
      console.log('Response stream complete.');
    });
  });
  // return printHTML(allData);
};

