var request = require('request');
var fs = require('fs');

request.get('https://sytantris.github.io/http-examples/future.jpg')
  .on('error', function (err) {
    throw err;
    console.log(`Error: ${err}`);
  })
  .on('response', function (response) {
    console.log(`Response Status Code: ${response.statusCode}\n Response Status Message: ${response.statusMessage}\n Content Type: ${response.headers['content-type']}`);
    if (response.statusCode === 200) {
      console.log('Downloading image...');
      console.log('Download complete.');
      }
  })

  .pipe(fs.createWriteStream('./future.jpg'));