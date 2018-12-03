var https = require('https');

function getAndPrintHTML () {

  var requestOptions = {
    host: 'sytantris.github.io',
    path: '/http-examples/step1.html'
  };

  https.get(requestOptions, function (response) {
    response.setEncoding('utf8');
    response.on('data', function (data) {
      var allData = data.toString();
      var buffData = Buffer.alloc(200, allData, 'utf8');
      // var allData = [];
      // for ( var i = 0; i < data.length; i++) {
        // var allData = Buffer.from(data[i]);
        // allData.push(JSON.parse(data[i]));
      // }
    console.log(`Chunk Received:  ${buffData}\n`);
  });

  response.on('end', function() {
    console.log('Response stream complete.');
  });
  });

}

getAndPrintHTML();
  // var allData = {};
  // for (chunk in requestOptions.path) {
  //   allData.chunk = requestOptions["path"];
  //   console.log(`Data chunks: ${allData["chunk"]}\n`);
  // }