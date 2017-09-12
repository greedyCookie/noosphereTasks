const http = require('http'),
	  fs = require('fs'),
	  path = require('path');


const hostname = 'localhost';
const port = '3000';


const server = http.createServer((req, res)=> {

  	const { method, url } = req;
  	let filePath = '';
  	console.log(req.headers);

  	var parsedUrl = getFileExtension(req.url);
  	console.log('parsedUrl(extension): ', parsedUrl);
	if(req.url == '/'){
	  	res.setHeader('Content-Type', 'text/html');
	  	filePath = path.join(__dirname, 'public/index.html');
	} else if(parsedUrl.lenght !=0){

		switch (parsedUrl) {
			case 'css':
				res.setHeader('Content-Type', 'text/css');
				break;
			case 'js':
				res.setHeader('Content-Type', 'text/javascript');
				break;
			case 'ico':
				res.setHeader('Content-Type', 'image/x-icon');
				break;
			case 'html':
				res.setHeader('Content-Type', 'text/plain');// you can look at html that being executed by jsut asking server to send u html
				break;
		}
		filePath = path.join(__dirname, 'public/', req.url);
	}


let readStream = fs.createReadStream(filePath);
		//console.log(readStream);

  	readStream.on('open', function () {
    // This just pipes the read stream to the response object (which goes to the client)
    res.statusCode = 200;
    readStream.pipe(res);
  });

  // This catches any errors that happen while creating the readable stream (usually invalid names)
  readStream.on('error', function(err) {
  	console.log('here',err);
  	if(err.code == 'ENOENT'){
  		res.statusCode = 404;
  		res.setHeader('Content-Type', 'text/html');
  		res.write('<h1>Error 404: file not found </h1>');

  	}
    res.end();

  });
	

});


server.on('error', (err) => {
  // This prints the error message and stack trace to `stderr`.
  console.error('here: ',err.stack);
});


server.listen(port, hostname, ()=>{

})

function getFileExtension (filename) {
	return filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename;
}

function fsCallback (err,data) {
	if(err) console.log('on callback!',err);
	this.res.write(err);
	console.log(data);

}