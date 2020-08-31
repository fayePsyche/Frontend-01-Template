const http = require('http');
const querystring = require('querystring')
const fs = require('fs');
const child_process = require('child_process')

var archiver = require('archiver');

const postData = querystring.stringify({
  'content': 'Hello World!777777777'
});

let filename = 'ghj.jpeg'

const packagename = './package';
filename = `${packagename}.zip`

// fs.stat(`./img/${filename}`, (err, stat) => {
//   console.log(stat.size);
//   const options = {
//     host: 'localhost',
//     port: 8081,
//     method: 'POST',
//     path: `/?filename=${filename}`,
//     headers: {
//       // 'Content-Type': 'application/x-www-form-urlencoded',
//       'Content-Type': 'application/octet-stream',
//       // 'Content-Length': Buffer.byteLength(postData)
//       'Content-Length': stat.size,
//     }
//   };
  
//   const req = http.request(options, (res) => {
//     console.log(`STATUS: ${res.statusCode}`);
//     console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
//     // res.setEncoding('utf8');
//     // res.on('data', (chunk) => {
//     //   console.log(`BODY: ${chunk}`);
//     // });
//     // res.on('end', () => {
//     //   console.log('No more data in response.');
//     // });
//   });

//   const readStream = fs.createReadStream(`./img/${filename}`)

//   req.on('error', (e) => {
//     console.error(`problem with request: ${e.message}`);
//   });

//   readStream.pipe(req)
//   readStream.on('end', () => {
//     req.end();
//   })
// })


const options = {
  host: 'localhost',
  port: 8081,
  method: 'POST',
  path: `/?filename=${filename}`,
  headers: {
    // 'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Type': 'application/octet-stream',
    // 'Content-Length': Buffer.byteLength(postData)
    // 'Content-Length': stat.size,
  }
};

var archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level.
});
archive.directory(packagename, false);
archive.finalize();
const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
});

archive.pipe(req)
archive.on('end', () => {
  req.end();
  const client_id = 'Iv1.5f77bd0e081f2e25';
  const redirect_uri = 'http://localhost:8081/auth?id=123';
  const state = 'ghj123'
  const url = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(client_id)}&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=${encodeURIComponent('read:user')}&state=${encodeURIComponent(state)}`
  child_process.exec(`start ${url}`)
})
