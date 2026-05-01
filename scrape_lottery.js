const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    console.log('Membuka browser untuk menarik data Hasil Pasaran dari WDBOS...');
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
        
        console.log('Menuju URL...');
        await page.goto('https://wdbos32941.com/?referralid=seo168#/index?category=lottery', { waitUntil: 'networkidle2' });
        
        // Memastikan modal awal di-close jika ada
        try {
            await page.click('.close-btn, .dialog-close, .modal-close');
        } catch(e) {}
        
        console.log('Menunggu daftar pasaran dimuat...');
        await page.waitForTimeout(3000); // Tunggu ekstra untuk render VueJS SPA
        
        const results = await page.evaluate(() => {
            let items = [];
            let boxes = document.querySelectorAll('.lottery-item-box, .game-item-box'); 
            
            // Jika tidak dapat, cari secara rekursif element background box
            if(boxes.length === 0) boxes = document.querySelectorAll('li, .item');

            boxes.forEach(box => {
                let textContent = box.innerText;
                if(!textContent) return;
                
                // Parsing sederhana berdasarkan struktur
                let lines = textContent.split('\n').filter(l => l.trim().length > 0);
                if(lines.length < 3) return;
                
                let market = lines[0]; // Baris pertama biasanya nama pasaran
                let period = lines.find(l => l.toLowerCase().includes('periode')) || '';
                let result = lines[lines.length - 1]; // Line terakhir biasanya result angka
                
                // Cari gambar
                let img = box.querySelector('img') ? box.querySelector('img').src : '';

                items.push({
                    market: market.trim(),
                    period: period.replace(/periode:/i, '').trim(),
                    countdown: "Live Result Terkini",
                    result: result.trim(),
                    image: img
                });
            });
            return items;
        });

        // Filter valid data saja
        const validResults = results.filter(r => r.market && r.period);

        console.log(`Extract selesai. Mendapat ${validResults.length} data pasaran.`);
        const scriptContent = `window.LOTTERY_DATA = ${JSON.stringify(validResults, null, 2)};`;
        fs.writeFileSync('lottery_data.js', scriptContent);
        console.log('✅ File lottery_data.js berhasil diperbarui!');
        
        await browser.close();
    } catch (error) {
        console.error('❌ Gagal mengambil data:', error.message);
    }
})();
