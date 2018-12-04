var https = require('https');

function getAndPrintHTML (options) {

//.get vs .request
  https.get(options, function (response) {
    // console.log('error: ', error);
    // console.log('statusCode: ', response && response.statusCode);
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

var requestOptions = {
  host: 'sytantris.github.io',
  path: '/http-examples/step3.html'
};

getAndPrintHTML(requestOptions);