const http = require('http');
const fs = require('fs');
const path = require('path');

// Create a simple form data for testing
function createFormData(oldPath, newPath) {
  const boundary = '----formdata-boundary-' + Date.now();
  const CRLF = '\r\n';
  
  const oldFile = fs.readFileSync(oldPath);
  const newFile = fs.readFileSync(newPath);
  
  let data = '';
  data += '--' + boundary + CRLF;
  data += 'Content-Disposition: form-data; name="oldDocument"; filename="old.pdf"' + CRLF;
  data += 'Content-Type: application/pdf' + CRLF + CRLF;
  data += oldFile.toString('binary') + CRLF;
  
  data += '--' + boundary + CRLF;
  data += 'Content-Disposition: form-data; name="newDocument"; filename="new.pdf"' + CRLF;
  data += 'Content-Type: application/pdf' + CRLF + CRLF;
  data += newFile.toString('binary') + CRLF;
  
  data += '--' + boundary + '--' + CRLF;
  
  return {
    data: Buffer.from(data, 'binary'),
    contentType: 'multipart/form-data; boundary=' + boundary
  };
}

const testDir = path.join(__dirname, 'test', 'data');
if (!fs.existsSync(testDir)) {
  console.log('❌ Test data directory not found');
  process.exit(1);
}

const pdfFile = path.join(testDir, '05-versions-space.pdf');
if (!fs.existsSync(pdfFile)) {
  console.log('❌ Test PDF file not found');
  process.exit(1);
}

const formData = createFormData(pdfFile, pdfFile);

const options = {
  hostname: '127.0.0.1',
  port: 3002,
  path: '/api/documents/compare',
  method: 'POST',
  headers: {
    'Content-Type': formData.contentType,
    'Content-Length': formData.data.length
  },
  timeout: 30000
};

console.log('Testing document compare endpoint...');

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('✅ Response received!');
    console.log('Status Code:', res.statusCode);
    console.log('Response length:', data.length);
    
    if (res.statusCode === 200) {
      try {
        const response = JSON.parse(data);
        console.log('✅ Valid JSON response');
        console.log('Comparison object keys:', Object.keys(response.comparison || {}));
      } catch (e) {
        console.log('❌ Invalid JSON response');
        console.log('First 500 chars:', data.substring(0, 500));
      }
    } else {
      console.log('❌ Error response:', data);
    }
    process.exit(0);
  });
});

req.on('error', (err) => {
  console.log('❌ Connection Error:', err.message);
  process.exit(1);
});

req.on('timeout', () => {
  console.log('❌ Timeout: Server did not respond within 30 seconds');
  req.destroy();
  process.exit(1);
});

req.setTimeout(30000);
req.write(formData.data);
req.end();