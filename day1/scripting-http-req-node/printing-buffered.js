function getAndPrintHTML () {

  var https = require('https');

  var requestOptions = {
    host: 'sytantris.github.io',
    path: '/http-examples/step1.html'
  };

  https.get(requestOptions, function (response) {
    response.setEncoding('utf8');
    response.on('data', function (data) {
      var allData = data.toString();
      console.log(`Chunk Received:  ${allData}\n`);
    });

    response.on('end', function() {
      console.log('Response stream complete.');
    });
  });
}

getAndPrintHTML();