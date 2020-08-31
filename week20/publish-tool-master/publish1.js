const http = require('http');
const child_process = require('child_process')
var archiver = require('archiver');

const client_id = 'Iv1.5f77bd0e081f2e25';
const redirect_uri = 'http://localhost:8081/auth?id=123';
const state = 'ghj123'
const url = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(client_id)}&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=${encodeURIComponent('read:user')}&state=${encodeURIComponent(state)}`
child_process.exec(`start ${url}`)

let packageName = './package';

const server = http.createServer((request, res) => {
  console.log(request.url)
  console.log('publish!!!!!!!!!!!!!!')
  if (request.url.match(/^\/favicon.ico/)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
    return;
  }

  let token = request.url.match(/token=([^&]+)/)[1];
  console.log('token ' + token);

  const options = {
    host: 'localhost',
    port: 8081,
    path: '/?filename=package.zip',
    method: 'POST',
    headers: {
      "Content-Type": "application/octet-stream",
      "xToken": token,
    },
  };

  const archive = archiver('zip', {
    zlib: { level: 9 },
  });

  archive.directory(packageName, false);
  archive.finalize();

  const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  });

  archive.pipe(req);

  archive.on('end', () => {
    req.end();
    console.log('publish success!!!');
    req.end('publish success!!!');
    server.close();
  });

  req.on('error', e => {
    console.error(e.message);
  });
});
server.listen(8080)