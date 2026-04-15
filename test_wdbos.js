const https = require('https');
https.get('https://wdbos32941.com/?referralid=seo168', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log('Includes BRUNEI?', data.includes('BRUNEI'));
    console.log('Includes lottery?', data.includes('category=lottery'));
  });
}).on('error', err => {
  console.log('Error: ', err.message);
});
