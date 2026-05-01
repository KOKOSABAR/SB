const https = require('https');
const fs = require('fs');

https.get('https://wap.kemendikbudristek.com/mobile.html?=version-911', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const matches = [...data.matchAll(/<div class="game-card">[\s\S]*?<a href="(.*?)"[\s\S]*?<amp-img src="(.*?)"[\s\S]*?<span class="game-title">(.*?)<\/span>/g)];
        const result = matches.map(m => ({
            nama: m[3].trim(),
            provider: 'Pragmatic Play',
            tanggal: 'Populer',
            logo: m[2],
            playUrl: m[1]
        }));
        
        console.log('Found:', result.length);
        fs.writeFileSync('scraped.json', JSON.stringify(result, null, 4));
    });
});
