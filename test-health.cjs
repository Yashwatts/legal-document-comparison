const http = require('http');

const options = {
  hostname: '127.0.0.1',
  port: 3002,
  path: '/api/health',
  method: 'GET',
  timeout: 5000
};

console.log('Testing health endpoint...');

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('✅ Success!');
    console.log('Status Code:', res.statusCode);
    console.log('Response:', data);
    process.exit(0);
  });
});

req.on('error', (err) => {
  console.log('❌ Connection Error:', err.message);
  process.exit(1);
});

req.on('timeout', () => {
  console.log('❌ Timeout: Server did not respond within 5 seconds');
  req.destroy();
  process.exit(1);
});

req.setTimeout(5000);
req.end();