const http = require('http');
const fs = require('fs');
const path = require('path');

// Create a simple form data for testing with text files
function createFormData(oldPath, newPath) {
  const boundary = '----formdata-boundary-' + Date.now();
  const CRLF = '\r\n';
  
  const oldFile = fs.readFileSync(oldPath, 'utf-8');
  const newFile = fs.readFileSync(newPath, 'utf-8');
  
  let data = '';
  data += '--' + boundary + CRLF;
  data += 'Content-Disposition: form-data; name="oldDocument"; filename="old.txt"' + CRLF;
  data += 'Content-Type: text/plain' + CRLF + CRLF;
  data += oldFile + CRLF;
  
  data += '--' + boundary + CRLF;
  data += 'Content-Disposition: form-data; name="newDocument"; filename="new.txt"' + CRLF;
  data += 'Content-Type: text/plain' + CRLF + CRLF;
  data += newFile + CRLF;
  
  data += '--' + boundary + '--' + CRLF;
  
  return {
    data: Buffer.from(data),
    contentType: 'multipart/form-data; boundary=' + boundary
  };
}

const testDir = path.join(__dirname, 'test', 'data');
const oldFile = path.join(testDir, 'test-old.txt');
const newFile = path.join(testDir, 'test-new.txt');

const formData = createFormData(oldFile, newFile);

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

console.log('Testing document compare endpoint with text files...');

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
        if (response.comparison) {
          console.log('Changes count:', response.comparison.changes?.length || 0);
          console.log('Executive summary exists:', !!response.comparison.executiveSummary);
          console.log('Risk assessment exists:', !!response.comparison.riskAssessment);
        }
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