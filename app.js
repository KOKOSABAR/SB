const STORAGE_KEY = 'pk_online_notes';
let notes = [];
let editingId = null;
let deleteId = null;
let useGoogleSheets = false;
let scriptUrl = '';

const SCRIPT_URL_KEY = 'pk_online_script_url';
const TOGEL_DATA_KEY = 'pk_online_togel_data';

// --- DATA ---
const DEFAULT_TOGEL_DATA = [
    { 
        nama: "HOKIDRAW", 
        betClose: "00:00:00", 
        result: "00:00:00", 
        linkResmi: "https://dlive.tv/u/HOKIDRAW", 
        linkAcuan: "https://hokidraw.com/live-draw.html", 
        logo: "https://cdn-icons-png.flaticon.com/512/3069/3069188.png" 
    }, 
    { 
        nama: "TOTO MACAU PAGI", 
        betClose: "00:00:01", 
        result: "00:15:00", 
        linkResmi: "https://kick.com/live-ttm4d", 
        linkAcuan: "-", 
        logo: "https://cdn.areabermain.club/assets/cdn/az2/2024/12/01/20241201/f70c3022131972b7a83d6a690e54284d/toto-macau-logo.png" 
    }, 
    { 
        nama: "HOKIDRAW", 
        betClose: "01:00:00", 
        result: "01:00:00", 
        linkResmi: "https://dlive.tv/u/HOKIDRAW", 
        linkAcuan: "https://hokidraw.com/live-draw.html", 
        logo: "https://cdn-icons-png.flaticon.com/512/3069/3069188.png" 
    }, 
    { 
        nama: "KENTUCKY MIDDAY", 
        betClose: "01:05:00", 
        result: "01:20:00", 
        linkResmi: "https://www.kylottery.com/apps/draw_games", 
        linkAcuan: "https://play.kylottery.com/en-us/playnow/pick4.html", 
        logo: "https://cdn.areabermain.club/assets/cdn/az4/2024/08/11/20240811/a5fafa0102d98ab3959ceb9bb1045729/kl-logo.png" 
    }, 
    { 
        nama: "FLORIDA MIDDAY", 
        betClose: "01:20:00", 
        result: "01:30:00", 
        linkResmi: "https://www.youtube.com/@floridalottery/videos", 
        linkAcuan: "-", 
        logo: "https://cdn.areabermain.club/assets/cdn/az4/2024/08/11/20240811/a3e564ccb04c2b751ad4fa88c06e39c1/1-removebg-preview.png" 
    }, 
    { 
        nama: "HUAHIN0100", 
        betClose: "00:30:00", 
        result: "01:00:00", 
        linkResmi: "https://huahinlottery.com/livedraw", 
        linkAcuan: "https://www.youtube.com/channel/UCRuZp9SemX0egu2LFGrkEjg", 
        logo: "https://huahinlottery.com/assets/img/logo.png" 
    }, 
    { 
        nama: "BANGKOK 0130", 
        betClose: "01:00:00", 
        result: "01:30:00", 
        linkResmi: "https://bangkokpoolstoday.com/liveDraw.html", 
        linkAcuan: "-", 
        logo: "https://bangkokpoolstoday.com/assets/img/bangkokpools_logo.png" 
    }, 
    { 
        nama: "HOKIDRAW", 
        betClose: "02:00:00", 
        result: "02:00:00", 
        linkResmi: "https://dlive.tv/u/HOKIDRAW", 
        linkAcuan: "https://hokidraw.com/live-draw.html", 
        logo: "https://cdn-icons-png.flaticon.com/512/3069/3069188.png" 
    }, 
    { 
        nama: "NEW YORK MIDDAY", 
        betClose: "02:15:00", 
        result: "02:25:00", 
        linkResmi: "https://nylottery.ny.gov/draw-game?game=win4", 
        linkAcuan: "-", 
        logo: "https://edit.nylottery.ny.gov/sites/default/files/logo-2179655b4229a219a9305b3f0e734bd0.png" 
    }, 
    { 
        nama: "NORTH CAROLINA DAY", 
        betClose: "02:45:00", 
        result: "03:00:00", 
        linkResmi: "https://www.wral.com/entertainment/lottery/", 
        linkAcuan: "https://www.wral.com/news/video/1075494/", 
        logo: "https://nclottery.com/Site/GFX/NCEL_Alt.svg" 
    }, 
    { 
        nama: "BRUNEI02", 
        betClose: "02:30:00", 
        result: "02:45:00", 
        linkResmi: "https://bruneipools.com/live-draw.html", 
        linkAcuan: "-", 
        logo: "https://bruneipools.com/assets/img/brunei-logo.png" 
    }, 
    { 
        nama: "HOKIDRAW", 
        betClose: "03:00:00", 
        result: "03:00:00", 
        linkResmi: "https://dlive.tv/u/HOKIDRAW", 
        linkAcuan: "https://hokidraw.com/live-draw.html", 
        logo: "https://cdn-icons-png.flaticon.com/512/3069/3069188.png" 
    }, 
    { 
        nama: "OREGON 03", 
        betClose: "03:50:00", 
        result: "04:00:00", 
        linkResmi: "https://www.oregonlottery.org/pick-4/winning-numbers/", 
        linkAcuan: "-", 
        logo: "https://cdn.areabermain.club/assets/cdn/az9/2024/11/26/20241126/0a72e6fa9a2d4ee4106678a8aeeab33624/favpng-oregon-lottery-video-lottery-terminal-game.png" 
    }, 
    { 
        nama: "HOKIDRAW", 
        betClose: "04:00:00", 
        result: "04:00:00", 
        linkResmi: "https://dlive.tv/u/HOKIDRAW", 
        linkAcuan: "https://hokidraw.com/live-draw.html", 
        logo: "https://cdn-icons-png.flaticon.com/512/3069/3069188.png" 
    }, 
    { 
        nama: "HOKIDRAW", 
        betClose: "05:00:00", 
        result: "05:00:00", 
        linkResmi: "https://dlive.tv/u/HOKIDRAW", 
        linkAcuan: "https://hokidraw.com/live-draw.html", 
        logo: "https://cdn-icons-png.flaticon.com/512/3069/3069188.png" 
    }, 
    { 
        nama: "HOKIDRAW", 
        betClose: "06:00:00", 
        result: "06:00:00", 
        linkResmi: "https://dlive.tv/u/HOKIDRAW", 
        linkAcuan: "https://hokidraw.com/live-draw.html", 
        logo: "https://cdn-icons-png.flaticon.com/512/3069/3069188.png" 
    }, 
    { 
        nama: "OREGON 06", 
        betClose: "06:50:00", 
        result: "07:00:00", 
        linkResmi: "https://www.oregonlottery.org/pick-4/winning-numbers/", 
        linkAcuan: "-", 
        logo: "https://cdn.areabermain.club/assets/cdn/az9/2024/11/26/20241126/0a72e6fa9a2d4ee4106678a8aeeab33624/favpng-oregon-lottery-video-lottery-terminal-game.png" 
    }, 
    { 
        nama: "HOKIDRAW", 
        betClose: "07:00:00", 
        result: "07:00:00", 
        linkResmi: "https://dlive.tv/u/HOKIDRAW", 
        linkAcuan: "https://hokidraw.com/live-draw.html", 
        logo: "https://cdn-icons-png.flaticon.com/512/3069/3069188.png" 
    }, 
    { 
        nama: "HOKIDRAW", 
        betClose: "08:00:00", 
        result: "08:00:00", 
        linkResmi: "https://dlive.tv/u/HOKIDRAW", 
        linkAcuan: "https://hokidraw.com/live-draw.html", 
        logo: "https://cdn-icons-png.flaticon.com/512/3069/3069188.png" 
    }, 
    { 
        nama: "HOKIDRAW", 
        betClose: "09:00:00", 
        result: "09:00:00", 
        linkResmi: "https://dlive.tv/u/HOKIDRAW", 
        linkAcuan: "https://hokidraw.com/live-draw.html", 
        logo: "https://cdn-icons-png.flaticon.com/512/3069/3069188.png" 
    }, 
    { 
        nama: "CALIFORNIA", 
        betClose: "09:25:00", 
        result: "09:30:00", 
        linkResmi: "http://www.calottery.com/play/draw-games/daily-4", 
        linkAcuan: "-", 
        logo: "https://cdn.areabermain.club/assets/cdn/az4/2024/08/11/20240811/7c3b7b0affd7880d2dddf918ba2ac258/calottlogo.png" 
    }, 
    { 
        nama: "FLORIDA EVENING", 
        betClose: "09:35:00", 
        result: "09:45:00", 
        linkResmi: "https://www.youtube.com/@floridalottery/videos", 
        linkAcuan: "https://floridalottery.com/where-to-play", 
        logo: "https://cdn.areabermain.club/assets/cdn/az4/2024/08/11/20240811/a3e564ccb04c2b751ad4fa88c06e39c1/1-removebg-preview.png" 
    }, 
    { 
        nama: "OREGON 09", 
        betClose: "09:50:00", 
        result: "10:00:00", 
        linkResmi: "https://www.oregonlottery.org/pick-4/winning-numbers/", 
        linkAcuan: "-", 
        logo: "https://cdn.areabermain.club/assets/cdn/az9/2024/11/26/20241126/0a72e6fa9a2d4ee4106678a8aeeab33624/favpng-oregon-lottery-video-lottery-terminal-game.png" 
    }, 
    { 
        nama: "HOKIDRAW", 
        betClose: "10:00:00", 
        result: "10:00:00", 
        linkResmi: "https://dlive.tv/u/HOKIDRAW", 
        linkAcuan: "https://hokidraw.com/live-draw.html", 
        logo: "https://cdn-icons-png.flaticon.com/512/3069/3069188.png" 
    }, 
    { 
        nama: "BANGKOK 0930", 
        betClose: "09:00:00", 
        result: "09:30:00", 
        linkResmi: "https://bangkokpoolstoday.com/liveDraw.html", 
        linkAcuan: "-", 
        logo: "https://bangkokpoolstoday.com/assets/img/bangkokpools_logo.png" 
    }, 
    { 
        nama: "NEW YORK EVENING", 
        betClose: "10:25:00", 
        result: "10:35:00", 
        linkResmi: "https://nylottery.ny.gov/draw-game?game=win4", 
        linkAcuan: "-", 
        logo: "https://edit.nylottery.ny.gov/sites/default/files/logo-2179655b4229a219a9305b3f0e734bd0.png" 
    }, 
    { 
        nama: "KENTUCKY EVENING", 
        betClose: "10:45:00", 
        result: "11:00:00", 
        linkResmi: "https://www.kylottery.com/apps/draw_games/pick4/index.html", 
        linkAcuan: "https://play.kylottery.com/en-us/playnow/pick4.html", 
        logo: "https://cdn.areabermain.club/assets/cdn/az4/2024/08/11/20240811/a5fafa0102d98ab3959ceb9bb1045729/kl-logo.png" 
    }, 
    { 
        nama: "TOTO CAMBODIA LIVE", 
        betClose: "10:45:00", 
        result: "11:00:00", 
        linkResmi: "https://www.youtube.com/@TotoCambodiaOfficial", 
        linkAcuan: "https://totocambodialive.com/live-draw.html", 
        logo: "https://cdn.areabermain.club/assets/cdn/az4/2024/08/11/20240811/f07d4e2a6517ef1cea9e2a897e4abb98/cambodia-draw.png" 
    }, 
    { 
        nama: "HOKIDRAW", 
        betClose: "11:00:00", 
        result: "11:00:00", 
        linkResmi: "https://dlive.tv/u/HOKIDRAW", 
        linkAcuan: "https://hokidraw.com/live-draw.html", 
        logo: "https://cdn-icons-png.flaticon.com/512/3069/3069188.png" 
    }, 
    { 
        nama: "CAROLINA EVENING", 
        betClose: "11:17:00", 
        result: "11:22:00", 
        linkResmi: "https://www.wral.com/entertainment/lottery/", 
        linkAcuan: "https://www.wral.com/news/video/1075494/", 
        logo: "https://nclottery.com/Site/GFX/NCEL_Alt.svg" 
    }, 
    { 
        nama: "CHELSEA11", 
        betClose: "11:00:00", 
        result: "11:15:00", 
        linkResmi: "https://chelseapools.co.uk/", 
        linkAcuan: "-", 
        logo: "https://chelseapools.co.uk/assets/img/chelseaPools_logo.png" 
    }, 
    { 
        nama: "HOKIDRAW", 
        betClose: "12:00:00", 
        result: "12:00:00", 
        linkResmi: "https://dlive.tv/u/HOKIDRAW", 
        linkAcuan: "https://hokidraw.com/live-draw.html", 
        logo: "https://cdn-icons-png.flaticon.com/512/3069/3069188.png" 
    }, 
    { 
        nama: "BULLSEYE", 
        betClose: "12:00:00", 
        result: "12:15:00", 
        linkResmi: "https://mylotto.co.nz/results/bullseye", 
        linkAcuan: "-", 
        logo: "https://cdn.areabermain.club/assets/cdn/az4/2024/08/11/20240811/f07d4e2a6517ef1cea9e2a897e4abb98/nz-bullseye.png" 
    }, 
    { 
        nama: "POIPET12", 
        betClose: "12:15:00", 
        result: "12:30:00", 
        linkResmi: "https://www.youtube.com/channel/UCASg7YGGNAJ9saOZVeqVVuw", 
        linkAcuan: "https://poipetlottery.com/liveresult", 
        logo: "https://poipetpools.com/assets/img/poipet_logo.png" 
    }, 
    { 
        nama: "HOKIDRAW", 
        betClose: "13:00:00", 
        result: "13:00:00", 
        linkResmi: "https://dlive.tv/u/HOKIDRAW", 
        linkAcuan: "https://hokidraw.com/live-draw.html", 
        logo: "https://cdn-icons-png.flaticon.com/512/3069/3069188.png" 
    }, 
    { 
        nama: "OREGON 12", 
        betClose: "12:50:00", 
        result: "13:00:00", 
        linkResmi: "https://www.oregonlottery.org/pick-4/winning-numbers/", 
        linkAcuan: "-", 
        logo: "https://cdn.areabermain.club/assets/cdn/az9/2024/11/26/20241126/0a72e6fa9a2d4ee4106678a8aeeab33624/favpng-oregon-lottery-video-lottery-terminal-game.png" 
    }, 
    { 
        nama: "TOTO MACAU SIANG", 
        betClose: "13:00:00", 
        result: "13:15:00", 
        linkResmi: "https://kick.com/live-ttm4d", 
        linkAcuan: "-", 
        logo: "https://cdn.areabermain.club/assets/cdn/az2/2024/12/01/20241201/f70c3022131972b7a83d6a690e54284d/toto-macau-logo.png" 
    }, 
    { 
        nama: "SYDNEY LOTTO", 
        betClose: "13:25:00", 
        result: "13:50:00", 
        linkResmi: "https://www.youtube.com/@SYDNEYLOTTOOFFICIAL1", 
        linkAcuan: "https://lottosydney.fun/", 
        logo: "https://sydneypoolstoday.com/assets/img/sydneypoolstoday.png" 
    }, 
    { 
        nama: "HOKIDRAW", 
        betClose: "14:00:00", 
        result: "14:00:00", 
        linkResmi: "https://dlive.tv/u/HOKIDRAW", 
        linkAcuan: "https://hokidraw.com/live-draw.html", 
        logo: "https://cdn-icons-png.flaticon.com/512/3069/3069188.png" 
    }, 
    { 
        nama: "BRUNEI14", 
        betClose: "14:30:00", 
        result: "14:45:00", 
        linkResmi: "https://bruneipools.com/live-draw.html", 
        linkAcuan: "-", 
        logo: "https://bruneipools.com/assets/img/brunei-logo.png" 
    }, 
    { 
        nama: "HOKIDRAW", 
        betClose: "15:00:00", 
        result: "15:00:00", 
        linkResmi: "https://dlive.tv/u/HOKIDRAW", 
        linkAcuan: "https://hokidraw.com/live-draw.html", 
        logo: "https://cdn-icons-png.flaticon.com/512/3069/3069188.png" 
    }, 
    { 
        nama: "CHELSEA15", 
        betClose: "15:00:00", 
        result: "15:15:00", 
        linkResmi: "https://chelseapools.co.uk/", 
        linkAcuan: "-", 
        logo: "https://chelseapools.co.uk/assets/img/chelseaPools_logo.png" 
    }, 
    { 
        nama: "POIPET15", 
        betClose: "15:15:00", 
        result: "15:30:00", 
        linkResmi: "https://www.youtube.com/channel/UCASg7YGGNAJ9saOZVeqVVuw", 
        linkAcuan: "https://poipetlottery.com/liveresult", 
        logo: "https://poipetpools.com/assets/img/poipet_logo.png" 
    }, 
    { 
        nama: "TOTOMALI1530", 
        betClose: "15:15:00", 
        result: "15:30:00", 
        linkResmi: "https://www.youtube.com/@TotoMaliLive", 
        linkAcuan: "https://totomali.com/live-draw.html", 
        logo: "https://cdn-icons-png.flaticon.com/512/3069/3069188.png" 
    }, 
    { 
        nama: "HOKIDRAW", 
        betClose: "16:00:00", 
        result: "16:00:00", 
        linkResmi: "https://dlive.tv/u/HOKIDRAW", 
        linkAcuan: "https://hokidraw.com/live-draw.html", 
        logo: "https://cdn-icons-png.flaticon.com/512/3069/3069188.png" 
    }, 
    { 
        nama: "TOTO MACAU SORE", 
        betClose: "16:00:00", 
        result: "16:15:00", 
        linkResmi: "https://kick.com/live-ttm4d", 
        linkAcuan: "-", 
        logo: "https://cdn.areabermain.club/assets/cdn/az2/2024/12/01/20241201/f70c3022131972b7a83d6a690e54284d/toto-macau-logo.png" 
    }, 
    { 
        nama: "HUAHIN1630", 
        betClose: "16:00:00", 
        result: "16:30:00", 
        linkResmi: "https://huahinlottery.com/", 
        linkAcuan: "https://www.youtube.com/channel/UCRuZp9SemX0egu2LFGrkEjg", 
        logo: "https://huahinlottery.com/assets/img/logo.png" 
    }, 
    { 
        nama: "HOKIDRAW", 
        betClose: "17:00:00", 
        result: "17:00:00", 
        linkResmi: "https://dlive.tv/u/HOKIDRAW", 
        linkAcuan: "https://hokidraw.com/live-draw.html", 
        logo: "https://cdn-icons-png.flaticon.com/512/3069/3069188.png" 
    }, 
    { 
        nama: "KING KONG4D SORE", 
        betClose: "17:00:00", 
        result: "17:15:00", 
        linkResmi: "https://kingkongpools.com/", 
        linkAcuan: "-", 
        logo: "https://cdn.areabermain.club/assets/cdn/az9/2024/11/26/20241126/d1f18e378e4a422b41ffe8d03065ce7d/logo-7.png" 
    }, 
    { 
        nama: "SINGAPORE", 
        betClose: "17:30:00", 
        result: "17:45:00", 
        linkResmi: "http://www.singaporepools.com.sg", 
        linkAcuan: "-", 
        logo: "https://cdn.areabermain.club/assets/cdn/az9/2024/11/26/20241126/651f502072e9d29074094a4066928e35/sgpools.png" 
    }, 
    { 
        nama: "HOKIDRAW", 
        betClose: "18:00:00", 
        result: "18:00:00", 
        linkResmi: "https://dlive.tv/u/HOKIDRAW", 
        linkAcuan: "https://hokidraw.com/live-draw.html", 
        logo: "https://cdn-icons-png.flaticon.com/512/3069/3069188.png" 
    }, 
    { 
        nama: "MAGNUM4D", 
        betClose: "18:10:00", 
        result: "18:40:00", 
        linkResmi: "https://www.magnum4d.my/en/", 
        linkAcuan: "-", 
        logo: "https://cdn.areabermain.club/assets/cdn/az4/2024/08/11/20240811/8889f1c5fc738b5148145100c08a0ebc/439-4390693-magnum-pengeluaran-magnum-4d-hari-clipart-removebg-preview.png" 
    }, 
    { 
        nama: "HOKIDRAW", 
        betClose: "19:00:00", 
        result: "19:00:00", 
        linkResmi: "https://dlive.tv/u/HOKIDRAW", 
        linkAcuan: "https://hokidraw.com/live-draw.html", 
        logo: "https://cdn-icons-png.flaticon.com/512/3069/3069188.png" 
    }, 
    { 
        nama: "TOTO MACAU MALAM 1", 
        betClose: "19:00:00", 
        result: "19:15:00", 
        linkResmi: "https://kick.com/live-ttm4d", 
        linkAcuan: "-", 
        logo: "https://cdn.areabermain.club/assets/cdn/az2/2024/12/01/20241201/f70c3022131972b7a83d6a690e54284d/toto-macau-logo.png" 
    }, 
    { 
        nama: "CHELSEA19", 
        betClose: "19:00:00", 
        result: "19:15:00", 
        linkResmi: "https://chelseapools.co.uk/", 
        linkAcuan: "-", 
        logo: "https://chelseapools.co.uk/assets/img/chelseaPools_logo.png" 
    }, 
    { 
        nama: "POIPET19", 
        betClose: "19:30:00", 
        result: "19:45:00", 
        linkResmi: "https://www.youtube.com/channel/UCASg7YGGNAJ9saOZVeqVVuw", 
        linkAcuan: "https://poipetlottery.com/liveresult", 
        logo: "https://poipetpools.com/assets/img/poipet_logo.png" 
    }, 
    { 
        nama: "HOKIDRAW", 
        betClose: "20:00:00", 
        result: "20:00:00", 
        linkResmi: "https://dlive.tv/u/HOKIDRAW", 
        linkAcuan: "https://hokidraw.com/live-draw.html", 
        logo: "https://cdn-icons-png.flaticon.com/512/3069/3069188.png" 
    }, 
    { 
        nama: "PCSO", 
        betClose: "19:50:00", 
        result: "20:10:00", 
        linkResmi: "https://www.pcso.gov.ph/LiveStreaming.aspx", 
        linkAcuan: "https://www.youtube.com/watch?v=POvsGpYUeHg", 
        logo: "https://pcso.gov.ph/Images/Logos/PCSO_Logo.png" 
    }, 
    { 
        nama: "TOTOMALI2030", 
        betClose: "20:15:00", 
        result: "20:30:00", 
        linkResmi: "https://www.youtube.com/@TotoMaliLive", 
        linkAcuan: "https://totomali.com/live-draw.html", 
        logo: "https://cdn-icons-png.flaticon.com/512/3069/3069188.png" 
    }, 
    { 
        nama: "HOKIDRAW", 
        betClose: "21:00:00", 
        result: "21:00:00", 
        linkResmi: "https://dlive.tv/u/HOKIDRAW", 
        linkAcuan: "https://hokidraw.com/live-draw.html", 
        logo: "https://cdn-icons-png.flaticon.com/512/3069/3069188.png" 
    }, 
    { 
        nama: "HUAHIN2100", 
        betClose: "20:30:00", 
        result: "21:00:00", 
        linkResmi: "https://huahinlottery.com/", 
        linkAcuan: "https://www.youtube.com/channel/UCRuZp9SemX0egu2LFGrkEjg", 
        logo: "https://huahinlottery.com/assets/img/logo.png" 
    }, 
    { 
        nama: "CHELSEA21", 
        betClose: "21:00:00", 
        result: "21:15:00", 
        linkResmi: "https://chelseapools.co.uk/", 
        linkAcuan: "-", 
        logo: "https://chelseapools.co.uk/assets/img/chelseaPools_logo.png" 
    }, 
    { 
        nama: "NEVADA", 
        betClose: "21:15:00", 
        result: "21:30:00", 
        linkResmi: "https://www.nevadalottery.us", 
        linkAcuan: "-", 
        logo: "https://www.nevadalottery.us/images/logo.gif" 
    }, 
    { 
        nama: "BRUNEI21", 
        betClose: "21:30:00", 
        result: "21:45:00", 
        linkResmi: "https://bruneipools.com/live-draw.html", 
        linkAcuan: "-", 
        logo: "https://bruneipools.com/assets/img/brunei-logo.png" 
    }, 
    { 
        nama: "HOKIDRAW", 
        betClose: "22:00:00", 
        result: "22:00:00", 
        linkResmi: "https://dlive.tv/u/HOKIDRAW", 
        linkAcuan: "https://hokidraw.com/live-draw.html", 
        logo: "https://cdn-icons-png.flaticon.com/512/3069/3069188.png" 
    }, 
    { 
        nama: "TOTO MACAU MALAM 2", 
        betClose: "22:00:00", 
        result: "22:15:00", 
        linkResmi: "https://kick.com/live-ttm4d", 
        linkAcuan: "-", 
        logo: "https://cdn.areabermain.club/assets/cdn/az2/2024/12/01/20241201/f70c3022131972b7a83d6a690e54284d/toto-macau-logo.png" 
    }, 
    { 
        nama: "POIPET22", 
        betClose: "22:30:00", 
        result: "22:45:00", 
        linkResmi: "https://www.youtube.com/channel/UCASg7YGGNAJ9saOZVeqVVuw", 
        linkAcuan: "https://poipetlottery.com/liveresult", 
        logo: "https://poipetpools.com/assets/img/poipet_logo.png" 
    }, 
    { 
        nama: "HONGKONG LOTTO", 
        betClose: "22:35:00", 
        result: "23:00:00", 
        linkResmi: "https://kick.com/hongkong-lotto-official", 
        linkAcuan: "-", 
        logo: "https://cdn.areabermain.club/assets/cdn/az2/2024/12/01/20241201/a95376101165db91cfcd742f66dd8564/hklott.png" 
    }, 
    { 
        nama: "TOTO MACAU MALAM 3", 
        betClose: "22:00:00", 
        result: "22:15:00", 
        linkResmi: "https://kick.com/live-ttm4d", 
        linkAcuan: "-", 
        logo: "https://cdn.areabermain.club/assets/cdn/az2/2024/12/01/20241201/f70c3022131972b7a83d6a690e54284d/toto-macau-logo.png" 
    }, 
    { 
        nama: "KING KONG4D MALAM", 
        betClose: "23:30:00", 
        result: "23:45:00", 
        linkResmi: "https://kick.com/king-kong-pools", 
        linkAcuan: "-", 
        logo: "https://cdn.areabermain.club/assets/cdn/az9/2024/11/26/20241126/d1f18e378e4a422b41ffe8d03065ce7d/logo-7.png" 
    }, 
    { 
        nama: "TOTOMALI2330", 
        betClose: "23:15:00", 
        result: "23:30:00", 
        linkResmi: "https://www.youtube.com/@TotoMaliLive", 
        linkAcuan: "https://totomali.com/live-draw.html", 
        logo: "https://cdn-icons-png.flaticon.com/512/3069/3069188.png" 
    }, 
    { 
        nama: "HOKIDRAW", 
        betClose: "23:15:00", 
        result: "23:30:00", 
        linkResmi: "https://dlive.tv/u/HOKIDRAW", 
        linkAcuan: "https://hokidraw.com/live-draw.html", 
        logo: "https://cdn-icons-png.flaticon.com/512/3069/3069188.png" 
    } 
];

let tickerData = [];

// --- UTILITIES ---

function generateId() {
    return 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function loadNotes() {
    const storedNotes = localStorage.getItem(STORAGE_KEY);
    if (storedNotes) {
        try {
            notes = JSON.parse(storedNotes);
        } catch (e) {
            notes = [];
        }
    }

    const storedTogel = localStorage.getItem(TOGEL_DATA_KEY);
    if (storedTogel) {
        try {
            tickerData = JSON.parse(storedTogel);
        } catch (e) {
            tickerData = JSON.parse(JSON.stringify(DEFAULT_TOGEL_DATA));
        }
    } else {
        tickerData = JSON.parse(JSON.stringify(DEFAULT_TOGEL_DATA));
        saveTogelData();
    }
}

function saveTogelData() {
    localStorage.setItem(TOGEL_DATA_KEY, JSON.stringify(tickerData));
}

const PASARAN_KEY = 'pk_online_pasaran';
const SAYIR_KEY = 'pk_online_sayir';
const PREDICTION_RESULTS_KEY = 'pk_online_prediction_results';

const SLOT_GAMES_DATA = [
    {
        "nama": "Geisha's Revenge",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/fa5afd06bfa086a71e72d55632a9cfb8.webp?v=pg1",
        "playUrl": "https://m.eajzzxhro.com/1702123/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_01"
    },
    {
        "nama": "Pinata Wins",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/2d7430bbfd85f8689b3aa2a27cfb0e53.webp?v=pg2",
        "playUrl": "https://m.eajzzxhro.com/1492288/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_02"
    },
    {
        "nama": "Gemstones Gold",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/1c433748f2dcfcc14126b80d0015141a.webp?v=pg3",
        "playUrl": "https://m.eajzzxhro.com/1671262/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_03"
    },
    {
        "nama": "Wild Ape #3258",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/440810aea0ffe9d05b15196182049b35.webp?v=pg4",
        "playUrl": "https://m.eajzzxhro.com/1508783/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_04"
    },
    {
        "nama": "Mafia Mayhem",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/1a1f123372e75d81e45343d2b1508948.webp?v=pg5",
        "playUrl": "https://m.eajzzxhro.com/1580541/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_05"
    },
    {
        "nama": "Fortune Tiger",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/3a7a35e5d52aaf408aaa5336cbee1b48.webp?v=pg6",
        "playUrl": "https://m.eajzzxhro.com/126/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_06"
    },
    {
        "nama": "Wild Bounty Showdown",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/a27f7b629697af8fd4be95698b405e49.webp?v=pg7",
        "playUrl": "https://m.eajzzxhro.com/135/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_07"
    },
    {
        "nama": "Fortune Rabbit",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/ef63ce13ecbe9ceccecd8140859ec7d5.webp?v=pg8",
        "playUrl": "https://m.eajzzxhro.com/1543462/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_08"
    },
    {
        "nama": "Mahjong Ways",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/531e9d0cd776c15906ce761bb56f90ae.webp?v=pg9",
        "playUrl": "https://m.eajzzxhro.com/65/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_09"
    },
    {
        "nama": "Fortune Dragon",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/2d9955268b1034226ab09ed77ef67fc6.webp?v=pg10",
        "playUrl": "https://m.eajzzxhro.com/1695365/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_10"
    },
    {
        "nama": "Lucky Neko",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/9a43da1342aca190cb05be8886f44821.webp?v=pg11",
        "playUrl": "https://m.eajzzxhro.com/89/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_11"
    },
    {
        "nama": "Treasures of Aztec",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/4f46cf3e93773b86e63cb3999bb366fa.webp?v=pg12",
        "playUrl": "https://m.eajzzxhro.com/87/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_12"
    },
    {
        "nama": "Wild Bandito",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/9c9f5f5160abe569deada38af4f5fc7c.webp?v=pg13",
        "playUrl": "https://m.eajzzxhro.com/104/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_13"
    },
    {
        "nama": "Ways of the Qilin",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/9bccabd723a324e8f88ea3f0325245f5.webp?v=pg14",
        "playUrl": "https://m.eajzzxhro.com/106/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_14"
    },
    {
        "nama": "Caishen Wins",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/6ac3269ae9328a104eea7562418fafa6.webp?v=pg15",
        "playUrl": "https://m.eajzzxhro.com/71/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_15"
    },
    {
        "nama": "Dreams of Macau",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/13519d43b2de5424614ac1e5e37b5ef5.webp?v=pg16",
        "playUrl": "https://m.eajzzxhro.com/79/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_16"
    },
    {
        "nama": "The Great Icescape",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/5b4e1f2a80f4c1ac2b62bcb74a565688.webp?v=pg17",
        "playUrl": "https://m.eajzzxhro.com/53/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_17"
    },
    {
        "nama": "Mahjong Ways 2",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/f24e33352829cf3475df062f42e059ef.webp?v=pg18",
        "playUrl": "https://m.eajzzxhro.com/74/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_18"
    },
    {
        "nama": "Cocktail Nights",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/3060d3a4314a67fd312e932c897b940a.webp?v=pg19",
        "playUrl": "https://m.eajzzxhro.com/117/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_19"
    },
    {
        "nama": "Ganesha Fortune",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/943ea34742cefba5aa67d4e72264b6b9.webp?v=pg20",
        "playUrl": "https://m.eajzzxhro.com/75/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_20"
    },
    {
        "nama": "Dragon Hatch",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/73c181500a52871929efe9be4b98dfb0.webp?v=pg21",
        "playUrl": "https://m.eajzzxhro.com/57/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_21"
    },
    {
        "nama": "Prosperity Fortune Tree",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/0989779cd07aa7fbdfdce8d893c4b64d.webp?v=pg22",
        "playUrl": "https://m.eajzzxhro.com/1312883/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_22"
    },
    {
        "nama": "Lucky Piggy",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/90691f4b84fbced3753d3d3c5092010c.webp?v=pg23",
        "playUrl": "https://m.eajzzxhro.com/130/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_23"
    },
    {
        "nama": "Jurassic Kingdom",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/111d09f5be0857cedfc6153af84d19df.webp?v=pg24",
        "playUrl": "https://m.eajzzxhro.com/110/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_24"
    },
    {
        "nama": "Speed Winner",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/1966a166ebb84f3a22f1271ce1c24198.webp?v=pg25",
        "playUrl": "https://m.eajzzxhro.com/127/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_25"
    },
    {
        "nama": "Leprechaun Riches",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/464b31bc90ef06a17f23ea525dca296c.webp?v=pg26",
        "playUrl": "https://m.eajzzxhro.com/60/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_26"
    },
    {
        "nama": "Queen of Bounty",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/5339279e897b8fa3048b4cae6002676e.webp?v=pg27",
        "playUrl": "https://m.eajzzxhro.com/84/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_27"
    },
    {
        "nama": "Supermarket Spree",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/790d3f7262afcc39f977e1af1fea0c5e.webp?v=pg28",
        "playUrl": "https://m.eajzzxhro.com/115/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_28"
    },
    {
        "nama": "Thai River Wonders",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/5a1695f86bf931e91a07d1b722366802.webp?v=pg29",
        "playUrl": "https://m.eajzzxhro.com/92/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_29"
    },
    {
        "nama": "Fortune Ox",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/6d922bafdfb1c5d9ccfde6233dcd1895.webp?v=pg30",
        "playUrl": "https://m.eajzzxhro.com/98/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_30"
    },
    {
        "nama": "Legend of Perseus",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/74b569a22e0aeb9d163ee4e929add9c8.webp?v=pg31",
        "playUrl": "https://m.eajzzxhro.com/128/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_31"
    },
    {
        "nama": "Wild Coaster",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/0ed3e2548af7c3f198076f74eb67941c.webp?v=pg32",
        "playUrl": "https://m.eajzzxhro.com/132/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_32"
    },
    {
        "nama": "Garuda Gems",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/3fc30b8e9006a88ef25062cfa4f62cf4.webp?v=pg33",
        "playUrl": "https://m.eajzzxhro.com/122/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_33"
    },
    {
        "nama": "Alchemy Gold",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/2642986ac17c6ef526ff64e6de0ba923.webp?v=pg34",
        "playUrl": "https://m.eajzzxhro.com/1368367/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_34"
    },
    {
        "nama": "Candy Bonanza",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/075e6d03d8d46dd3eb39cc43a87c6bef.webp?v=pg35",
        "playUrl": "https://m.eajzzxhro.com/100/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_35"
    },
    {
        "nama": "Spirited Wonders",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/227c9ce72fd1ced1819e603d4257c243.webp?v=pg36",
        "playUrl": "https://m.eajzzxhro.com/119/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_36"
    },
    {
        "nama": "Butterfly Blossom",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/364c482cb87a4858238900c6ff3fa27d.webp?v=pg37",
        "playUrl": "https://m.eajzzxhro.com/125/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_37"
    },
    {
        "nama": "The Queen's Banquet",
        "provider": "PG SOFT",
        "tanggal": "PG SOFT",
        "logo": "https://kemendiknew.pages.dev/images/eb39aa13a8c4481ed8c773623591a837.webp?v=pg38",
        "playUrl": "https://m.eajzzxhro.com/120/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=en&btt=2&or=21novodx%3Dzveuuscmj%3Dxjh&__hv=2fMEQCICuqoNGFMML4fGBdQE%2BkWN6hW4%2FfORGq%2Fnk1ZEMnawwmAiAxGYxJjOCWQZyBSVILpJeMljpfcPHLJNuUZN5itlB12A%3D%3D&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&source=amp_safe_38"
    },
    {
        "nama": "Dragon Tiger Fortunes",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/cbf3d998fef5edbde12ff26b95b0145c.webp?v=p1",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vswayshuffpbh&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_01"
    },
    {
        "nama": "Sugar Rush Super Scatter",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/4f625f116ff914b398d6a98dad047d08.webp?v=p1",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs10fdwhorses&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_01"
    },
    {
        "nama": "Fortune of Olympus",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/14aaf8e912a234ee841984546d80bcbd.webp?v=p1",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs20olympgcl&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_01"
    },
    {
        "nama": "Wisdom of Athena 1000 Xmas",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/d0d8073c39cee1f4441fa726056bb7fb.webp?v=p1",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs20procountxm&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_01"
    },
    {
        "nama": "Big Bass Splash 1000",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/c3fdcde0ae94ab51b4a1f9fb3da7c1ec.webp?v=p1",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs10bbsplashx&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_01"
    },
    {
        "nama": "Gates of Pyroth",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/aea074dbcc81208ca32cc7fe30ea0b0b.webp?v=p2",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs20shmnarise&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_02"
    },
    {
        "nama": "Lava Balls",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/b46153cfe899648474b71bdaf13cbcfa.webp?v=p3",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vswayslavabls&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_03"
    },
    {
        "nama": "Wild Wild Riches Returns",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/43c34c9190cafdeb75e21e7f1b15a2b6.webp?v=p4",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vswayswwrichr&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_04"
    },
    {
        "nama": "Oracle of Gold",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/5dd884921e8e35b28925f688bfe6c29e.webp?v=p5",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs20oragold&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_05"
    },
    {
        "nama": "Pandemic Rising",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/192787f0e33c19a9cd0eca1f5ff435ce.webp?v=p6",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs40pdmrsg&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_06"
    },
    {
        "nama": "Frightening Frankie",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/120283964f6839a9ee7b602f234430e2.webp?v=p7",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs20frankie&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_07"
    },
    {
        "nama": "Bingo Mania",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/0676f990055665d938449652bbb24d10.webp?v=p8",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs30bingomania&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_08"
    },
    {
        "nama": "Gates of Olympus Xmas 1000",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/9c8b117109adba89b06c159434c2f9db.webp?v=p9",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs20olympxmas&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_09"
    },
    {
        "nama": "Zeus vs Typhon",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/3c307b2654e21a1d0a7606dcb01f0378.webp?v=p10",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vswaysreelbtl&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_10"
    },
    {
        "nama": "Santa’s Slay",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/39e70fff12811a6956a2f93a8728a85a.webp?v=p11",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs10santasl&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_11"
    },
    {
        "nama": "Super Gummy Strike",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/4210ac0069de292f91f2978bf74a32f5.webp?v=p12",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs5supergummy&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_12"
    },
    {
        "nama": "Starlight Archer 1000",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/46cc618c68dd2ba16576543c04d5ff5e.webp?v=p13",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs20stararx&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_13"
    },
    {
        "nama": "Starlight Princess Super Scatter",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/b289bcd54748e0cdfdae37dba5663a3e.webp?v=p14",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs20starprss&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_14"
    },
    {
        "nama": "Wild West Gold Blazing Bounty",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/4f10439f9eafd545fb3f4358b019aab7.webp?v=p15",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs20wwgcluster&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_15"
    },
    {
        "nama": "Gates of Gatot Kaca Super Scatter",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/c661bc975c3baed65dd9c26ecc64e456.webp?v=p16",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs20olgatssc&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_16"
    },
    {
        "nama": "Gates of Olympus 1000",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/6d39308186b2c0ede30a49d0c486e911.webp?v=p17",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs20olympx&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_17"
    },
    {
        "nama": "Sweet Rush Bonanza",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/77c28568e6f642ce8ae240719d3f4e2b.webp?v=p18",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs20swrbon&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_18"
    },
    {
        "nama": "Sweet Bonanza Super Scatter",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/4d0bee6b7bdc8bdce588ae234d1c6272.webp?v=p19",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs20swbonsup&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_19"
    },
    {
        "nama": "Gates of Olympus Super Scatter",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/12aba443526306c47646afa82d84ba46.webp?v=p20",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs20olympgold&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_20"
    },
    {
        "nama": "Gates of Olympus",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/4d5007c76503d49d8ef3f96d3cf4a01c.webp?v=p21",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs20olympgate&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_21"
    },
    {
        "nama": "Mahjong Wins 3 Black Scatter",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/b918217637bd8887a37f2f0221bf4609.webp?v=p22",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vswaysmahwblck&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_22"
    },
    {
        "nama": "Starlight Princess 1000",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/220106934a3dcdf7fc45d13bf8c3cbe5.webp?v=p23",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs20starlightx&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_23"
    },
    {
        "nama": "Fortune Ace Super Scatter",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/91859275d164cae40d45cdbc0de9bf75.webp?v=p24",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vswaysfortsup&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_24"
    },
    {
        "nama": "Sweet Bonanza 1000",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/68585ca56ca4bd96989c71fce118b8b6.webp?v=p25",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs20fruitswx&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_25"
    },
    {
        "nama": "Mahjong wins 2",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/eb0608f4ba7bebd39e1cfbf0cbac104a.webp?v=p26",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vswaysmahwin2&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_26"
    },
    {
        "nama": "Starlight Princess",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/c957cd96f3779941ca5755ad5a3e9af0.webp?v=p27",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs20starlight&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_27"
    },
    {
        "nama": "Gates of Gatot Kaca 1000",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/7f15c55590fe6e9f020081f140226bba.webp?v=p28",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs20gatotx&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_28"
    },
    {
        "nama": "Sweet Bonanza",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/cf7fdad8713f88703071adaf9a189b74.webp?v=p29",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs20fruitsw&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_29"
    },
    {
        "nama": "Sugar Rush 1000",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/56200a76037dde7e0576d54b43ef82d0.webp?v=p30",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs20sugarrushx&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_30"
    },
    {
        "nama": "Wisdom of Athena 1000",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/bdf82e6b017c2d90f2a5cdbdbab583ad.webp?v=p31",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs20procountx&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_31"
    },
    {
        "nama": "Mahjong Wins Gong Xi Fa Cai",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/09dcce598d653014b6a599e80d86f2b1.webp?v=p32",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vswaysmahwgong&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_32"
    },
    {
        "nama": "Aztec Gems",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/918889cc5282e428ad803caa4777d984.webp?v=p33",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs5aztecgems&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_33"
    },
    {
        "nama": "Rujak Bonanza",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/cea09fbc68fd92bc64d258ad776191bf.webp?v=p34",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs20rujakbnz&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_34"
    },
    {
        "nama": "Chests of Cai Shen 2",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/0ba8642ef1a28049bd2cae9cc616807a.webp?v=p35",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs25caishen2&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_35"
    },
    {
        "nama": "Wrath of Nezha",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/bfbe32a9653ba5d125fcbe24e7ff36f5.webp?v=p36",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs40wrathnez&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_36"
    },
    {
        "nama": "Mermaid’s Treasure Trove",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/d61ab77483017bca6226a4d9d13a379c.webp?v=p37",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs20mmdtres&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_37"
    },
    {
        "nama": "Pyramid Bonanza",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/d1e6169535b7765a6e34d3c5de7cdada.webp?v=p38",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs20pbonanza&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_38"
    },
    {
        "nama": "Bonanza Gold",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/8da7683040ef0a27e9a10ce77bb38185.webp?v=p39",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs20bonzgold&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_39"
    },
    {
        "nama": "Candy Village",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/27ab494c255215f76ea9c35a641ad085.webp?v=p40",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs20candvil&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_40"
    },
    {
        "nama": "Fruit Party",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/84e5d2c5f0b1ffe4aab714d42530ca63.webp?v=p41",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs20fruitparty&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_41"
    },
    {
        "nama": "The Dog House Megaways",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/d6e3f98c82e5fc7fe8148169a3fe1cd4.webp?v=p42",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vswaysdogs&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_42"
    },
    {
        "nama": "Release the Kraken",
        "provider": "Pragmatic Play",
        "tanggal": "Pragmatic Play",
        "logo": "https://kemendiknew.pages.dev/images/68de4da213704776d1ed6df63746c80e.webp?v=p43",
        "playUrl": "https://d3pvfi6m7bxu71.cloudfront.net/gs2c/openGame.do?gameSymbol=vs20kraken&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=ID&cur=IDR&ref=v_secure_43"
    }
];

let predictionInitialized = false;

const pasarans = [
    "TOTOMACAU PAGI", "KENTUCKY MIDDAY", "FLORIDA MIDDAY", "HUAHIN 0100",
    "NEWYORK MIDDAY", "BANGKOK 0130", "CAROLINA DAY", "BRUNEI 02",
    "OREGON03", "OREGON06", "CALIFORNIA", "FLORIDA EVENING",
    "OREGON09", "NEWYORK EVENING", "BANGKOK 0930", "KENTUCKY EVENING",
    "CAROLINA EVENING", "TOTO CAMBODIA", "CHELSEA 11",
    "OREGON12", "POIPET 12", "BULLSEYE", "TOTOMACAU SIANG",
    "SYDNEY", "BRUNEI 14", "CHELSEA 15", "HOKI DRAW",
    "POIPET 15", "TOTOMACAU SORE", "HUAHIN 1630", "KING KONG POOLS SORE",
    "SINGAPORE", "MAGNUM4D", "CHELSEA 19", "TOTOMACAU MALAM I",
    "POIPET 19", "PCSO", "HUAHIN 2100", "CHELSEA 21",
    "NEVADA", "BRUNEI 21", "TOTOMACAU MALAM II", "POIPET 22",
    "HONGKONG", "TOTOMACAU MALAM III", "KING KONG POOLS MALAM"
];

const marketLogos = {
    "BANGKOK 0130": "https://bangkokpoolstoday.com/assets/img/bangkokpools_logo.png",
    "BANGKOK 0930": "https://bangkokpoolstoday.com/assets/img/bangkokpools_logo.png",
    "KING KONG POOLS SORE": "https://cdn.areabermain.club/assets/cdn/az9/2024/11/26/20241126/d1f18e378e4a422b41ffe8d03065ce7d/logo-7.png",
    "KING KONG POOLS MALAM": "https://cdn.areabermain.club/assets/cdn/az9/2024/11/26/20241126/d1f18e378e4a422b41ffe8d03065ce7d/logo-7.png",
    "BRUNEI 02": "https://bruneipools.com/assets/img/brunei-logo.png",
    "BRUNEI 14": "https://bruneipools.com/assets/img/brunei-logo.png",
    "BRUNEI 21": "https://bruneipools.com/assets/img/brunei-logo.png",
    "BULLSEYE": "https://cdn.areabermain.club/assets/cdn/az4/2024/08/11/20240811/f07d4e2a6517ef1cea9e2a897e4abb98/nz-bullseye.png",
    "CALIFORNIA": "https://cdn.areabermain.club/assets/cdn/az4/2024/08/11/20240811/7c3b7b0affd7880d2dddf918ba2ac258/calottlogo.png",
    "CAROLINA DAY": "https://nclottery.com/Site/GFX/NCEL_Alt.svg",
    "CAROLINA EVENING": "https://nclottery.com/Site/GFX/NCEL_Alt.svg",
    "CHELSEA 11": "https://chelseapools.co.uk/assets/img/chelseaPools_logo.png",
    "CHELSEA 15": "https://chelseapools.co.uk/assets/img/chelseaPools_logo.png",
    "CHELSEA 19": "https://chelseapools.co.uk/assets/img/chelseaPools_logo.png",
    "CHELSEA 21": "https://chelseapools.co.uk/assets/img/chelseaPools_logo.png",
    "FLORIDA EVENING": "https://cdn.areabermain.club/assets/cdn/az4/2024/08/11/20240811/a3e564ccb04c2b751ad4fa88c06e39c1/1-removebg-preview.png",
    "FLORIDA MIDDAY": "https://cdn.areabermain.club/assets/cdn/az4/2024/08/11/20240811/a3e564ccb04c2b751ad4fa88c06e39c1/1-removebg-preview.png",
    "HONGKONG": "https://cdn.areabermain.club/assets/cdn/az2/2024/12/01/20241201/a95376101165db91cfcd742f66dd8564/hklott.png",
    "HUAHIN 0100": "https://huahinlottery.com/assets/img/logo.png",
    "HUAHIN 1630": "https://huahinlottery.com/assets/img/logo.png",
    "HUAHIN 2100": "https://huahinlottery.com/assets/img/logo.png",
    "KENTUCKY EVENING": "https://cdn.areabermain.club/assets/cdn/az4/2024/08/11/20240811/a5fafa0102d98ab3959ceb9bb1045729/kl-logo.png",
    "KENTUCKY MIDDAY": "https://cdn.areabermain.club/assets/cdn/az4/2024/08/11/20240811/a5fafa0102d98ab3959ceb9bb1045729/kl-logo.png",
    "MAGNUM4D": "https://cdn.areabermain.club/assets/cdn/az4/2024/08/11/20240811/8889f1c5fc738b5148145100c08a0ebc/439-4390693-magnum-pengeluaran-magnum-4d-hari-clipart-removebg-preview.png",
    "NEVADA": "https://www.nevadalottery.us/images/logo.gif",
    "NEWYORK EVENING": "https://edit.nylottery.ny.gov/sites/default/files/logo-2179655b4229a219a9305b3f0e734bd0.png",
    "NEWYORK MIDDAY": "https://edit.nylottery.ny.gov/sites/default/files/logo-2179655b4229a219a9305b3f0e734bd0.png",
    "OREGON03": "https://cdn.areabermain.club/assets/cdn/az9/2024/11/26/20241126/0a72e6fa9a2d4ee4106678a8aeeab33624/favpng-oregon-lottery-video-lottery-terminal-game.png",
    "OREGON06": "https://cdn.areabermain.club/assets/cdn/az9/2024/11/26/20241126/0a72e6fa9a2d4ee4106678a8aeeab33624/favpng-oregon-lottery-video-lottery-terminal-game.png",
    "OREGON09": "https://cdn.areabermain.club/assets/cdn/az9/2024/11/26/20241126/0a72e6fa9a2d4ee4106678a8aeeab33624/favpng-oregon-lottery-video-lottery-terminal-game.png",
    "OREGON12": "https://cdn.areabermain.club/assets/cdn/az9/2024/11/26/20241126/0a72e6fa9a2d4ee4106678a8aeeab33624/favpng-oregon-lottery-video-lottery-terminal-game.png",
    "PCSO": "https://pcso.gov.ph/Images/Logos/PCSO_Logo.png",
    "POIPET 12": "https://poipetpools.com/assets/img/poipet_logo.png",
    "POIPET 15": "https://poipetpools.com/assets/img/poipet_logo.png",
    "POIPET 19": "https://poipetpools.com/assets/img/poipet_logo.png",
    "POIPET 22": "https://poipetpools.com/assets/img/poipet_logo.png",
    "SINGAPORE": "https://cdn.areabermain.club/assets/cdn/az9/2024/11/26/20241126/651f502072e9d29074094a4066928e35/sgpools.png",
    "SYDNEY": "https://sydneypoolstoday.com/assets/img/sydneypoolstoday.png",
    "TOTO CAMBODIA": "https://cdn.areabermain.club/assets/cdn/az4/2024/08/11/20240811/f07d4e2a6517ef1cea9e2a897e4abb98/cambodia-draw.png",
    "TOTOMACAU PAGI": "https://cdn.areabermain.club/assets/cdn/az2/2024/12/01/20241201/f70c3022131972b7a83d6a690e54284d/toto-macau-logo.png",
    "TOTOMACAU SIANG": "https://cdn.areabermain.club/assets/cdn/az2/2024/12/01/20241201/f70c3022131972b7a83d6a690e54284d/toto-macau-logo.png",
    "TOTOMACAU SORE": "https://cdn.areabermain.club/assets/cdn/az2/2024/12/01/20241201/f70c3022131972b7a83d6a690e54284d/toto-macau-logo.png",
    "TOTOMACAU MALAM I": "https://cdn.areabermain.club/assets/cdn/az2/2024/12/01/20241201/f70c3022131972b7a83d6a690e54284d/toto-macau-logo.png",
    "TOTOMACAU MALAM II": "https://cdn.areabermain.club/assets/cdn/az2/2024/12/01/20241201/f70c3022131972b7a83d6a690e54284d/toto-macau-logo.png",
    "TOTOMACAU MALAM III": "https://cdn.areabermain.club/assets/cdn/az2/2024/12/01/20241201/f70c3022131972b7a83d6a690e54284d/toto-macau-logo.png",
};

const syairList = [
    "Naga tidur di lautan biru. Waspadai angka kembar 33.",
    "Ayam jago berkokok di pagi hari. Cari pasangan 4 dan 9.",
    "Bunga mawar merah mekar di malam hari. Hati-hati dengan angka besar.",
    "Lima jari menunjuk ke langit. Jangan lupakan angka 50/51.",
    "Keberuntungan datang dari arah timur. Angka 8 adalah kunci.",
    "Angka berlari, hati berdebar, dalam keramaian, kita menanti keberuntungan."
];

function getPasaranFromStorage() {
    const stored = localStorage.getItem(PASARAN_KEY);
    return stored ? JSON.parse(stored) : [];
}

function savePasaranToStorage(pasarans) {
    localStorage.setItem(PASARAN_KEY, JSON.stringify(pasarans));
}

function getSayirFromStorage() {
    const stored = localStorage.getItem(SAYIR_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveSayirToStorage(sayirs) {
    localStorage.setItem(SAYIR_KEY, JSON.stringify(sayirs));
}

function getPredictionResultsFromStorage() {
    const stored = localStorage.getItem(PREDICTION_RESULTS_KEY);
    return stored ? JSON.parse(stored) : {};
}

function savePredictionResultToStorage(results) {
    localStorage.setItem(PREDICTION_RESULTS_KEY, JSON.stringify(results));
}

function generateRandomPrediction(pasaran) {
    const randomDigits = (n) => Array.from({length: n}, () => Math.floor(Math.random() * 10)).join('');
    const randomSet = (n, count) => Array.from({length: count}, () => randomDigits(n)).join(' / ');
    
    return {
        pasaran: pasaran,
        tanggal: new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        bbfs: Array.from({length: 7}, () => Math.floor(Math.random() * 10)).join(''),
        angkaIkut: Array.from({length: 5}, () => Math.floor(Math.random() * 10)).join(''),
        d4: randomSet(4, 5),
        d3: randomSet(3, 4),
        d2: randomSet(2, 10),
        colokBebas: `${Math.floor(Math.random() * 10)} / ${Math.floor(Math.random() * 10)}`,
        colokMacau: `${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)} / ${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)} / ${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`,
        twin: `${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)} / ${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`,
        syair: syairList[Math.floor(Math.random() * syairList.length)],
        timestamp: new Date().toISOString()
    };
}

function generatePrediction(pasaran, index) {
    const prediction = generateRandomPrediction(pasaran);
    const results = getPredictionResultsFromStorage();
    results[pasaran] = prediction;
    savePredictionResultToStorage(results);
    return prediction;
}

function renderPredictionSection() {
    const container = document.getElementById('predictionContainer');
    if (!container) return;

    const allPasarans = [...pasarans, ...getPasaranFromStorage()];
    const allSayirs = getSayirFromStorage();
    const predictionResults = getPredictionResultsFromStorage();

    let html = `
        <div class="prediction-header">
            <h2>SISTEM PREDIKSI TOGEL</h2>
            <p class="prediction-subtitle">Analisa pasaran dan generate angka prediksi</p>
        </div>
        <div class="prediction-controls">
            <button class="btn btn-primary" onclick="window.generateAllPredictions()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>
                Generate Semua Prediksi
            </button>
        </div>
    `;

    html += `<div class="prediction-grid">`;
    allPasarans.forEach((pasaran, idx) => {
        const logo = marketLogos[pasaran] || 'https://cdn-icons-png.flaticon.com/512/3069/3069188.png';
        const pred = predictionResults[pasaran];
        const isGenerated = !!pred;
        
        html += `
            <div class="prediction-card ${isGenerated ? 'generated' : ''}" id="pred-card-${idx}">
                <div class="prediction-card-header">
                    <img src="${logo}" alt="${pasaran}" class="prediction-logo" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3069/3069188.png'">
                    <h3>${pasaran}</h3>
                </div>
                <div class="prediction-status">
                    <span class="status-dot ${isGenerated ? 'active' : ''}"></span>
                    <span class="status-text">${isGenerated ? 'Data Tersedia' : 'Belum Ada Data'}</span>
                </div>
                <div class="prediction-actions">
                    <button class="btn btn-primary btn-small" onclick="window.generateSinglePrediction('${pasaran}', ${idx})">Generate</button>
                    <button class="btn btn-secondary btn-small" onclick="window.openManualInputModal('${pasaran}', ${idx})">Input Manual</button>
                    <button class="btn btn-accent btn-small ${isGenerated ? '' : 'disabled'}" onclick="${isGenerated ? `window.viewDetailedPrediction('${pasaran}')` : ''}">Lihat Hasil</button>
                </div>
            </div>
        `;
    });
    html += `</div>`;

    if (allSayirs.length > 0) {
        html += `
            <div class="syair-section">
                <h3>Syair Terupdate</h3>
                <div class="syair-list">
        `;
        allSayirs.forEach((sayir, idx) => {
            html += `
                <div class="syair-item">
                    <p>${sayir.text}</p>
                    <small>${new Date(sayir.timestamp).toLocaleDateString('id-ID')}</small>
                </div>
            `;
        });
        html += `</div></div>`;
    }

    container.innerHTML = html;
}

function openManualInputModal(pasaran, index) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'manualInputModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Input Angka: ${pasaran}</h2>
                <button class="modal-close" onclick="window.closeManualInputModal()">&times;</button>
            </div>
            <form onsubmit="window.saveManualPrediction(event, '${pasaran}', ${index})">
                <div class="form-group">
                    <label>Masukkan 1-9 Angka</label>
                    <input type="text" id="manual_seed" required placeholder="Contoh: 89942" 
                           pattern="[0-9]{1,9}" title="Masukkan 1 sampai 9 angka saja">
                    <p class="input-help">Sistem akan men-generate data lengkap berdasarkan angka ini.</p>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="window.closeManualInputModal()">Batal</button>
                    <button type="submit" class="btn btn-primary">Generate & Simpan</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
}

function closeManualInputModal() {
    const modal = document.getElementById('manualInputModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

function generatePredictionFromSeed(pasaran, seed) {
    const digits = seed.split('');
    const getRandDigit = () => digits[Math.floor(Math.random() * digits.length)];
    const getRandSet = (len, count) => {
        return Array.from({length: count}, () => {
            return Array.from({length: len}, () => getRandDigit()).join('');
        }).join(' / ');
    };

    return {
        pasaran: pasaran,
        tanggal: new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        bbfs: seed,
        angkaIkut: Array.from({length: Math.min(5, digits.length + 2)}, () => getRandDigit()).join(''),
        d4: getRandSet(4, 5),
        d3: getRandSet(3, 4),
        d2: getRandSet(2, 10),
        colokBebas: `${getRandDigit()} / ${getRandDigit()}`,
        colokMacau: `${getRandDigit()}${getRandDigit()} / ${getRandDigit()}${getRandDigit()} / ${getRandDigit()}${getRandDigit()}`,
        twin: `${getRandDigit()}${getRandDigit()} / ${getRandDigit()}${getRandDigit()}`,
        syair: syairList[Math.floor(Math.random() * syairList.length)],
        timestamp: new Date().toISOString()
    };
}

function saveManualPrediction(event, pasaran, index) {
    event.preventDefault();
    const seed = document.getElementById('manual_seed').value.trim();
    
    if (!seed || !/^\d+$/.test(seed)) {
        showToast('Masukkan angka yang valid!', 'error');
        return;
    }

    const data = generatePredictionFromSeed(pasaran, seed);
    
    const results = getPredictionResultsFromStorage();
    results[pasaran] = data;
    savePredictionResultToStorage(results);
    
    closeManualInputModal();
    renderPredictionSection();
    showToast(`Prediksi ${pasaran} berhasil di-generate dari angka ${seed}!`, 'success');
}

function viewDetailedPrediction(pasaran) {
    const results = getPredictionResultsFromStorage();
    const data = results[pasaran];
    if (!data) return;
    
    const logo = marketLogos[pasaran] || 'https://cdn-icons-png.flaticon.com/512/3069/3069188.png';
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay prediction-detail-overlay';
    modal.id = 'predictionDetailModal';
    modal.innerHTML = `
        <div class="prediction-detail-container">
            <button class="modal-close" onclick="window.closePredictionDetail()">&times;</button>
            
            <div class="detail-header">
                <div class="market-logo-circle">
                    <img src="${logo}" alt="${pasaran}" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3069/3069188.png'">
                </div>
                <h1>${pasaran}</h1>
            </div>

            <div class="date-badge">
                📅 ${data.tanggal}
            </div>

            <div class="detail-grid">
                <div class="detail-box">
                    <span class="box-label">TANGGAL</span>
                    <span class="box-value">${data.tanggal}</span>
                </div>
                <div class="detail-box highlight">
                    <span class="box-label">BBFS KUAT</span>
                    <span class="box-value accent">${data.bbfs || '-'}</span>
                </div>
                <div class="detail-box highlight">
                    <span class="box-label">ANGKA IKUT</span>
                    <span class="box-value accent">${data.angkaIkut || '-'}</span>
                </div>
                <div class="detail-box">
                    <span class="box-label">4D (BB)</span>
                    <span class="box-value">${data.d4 || '-'}</span>
                </div>
                <div class="detail-box">
                    <span class="box-label">3D (BB)</span>
                    <span class="box-value">${data.d3 || '-'}</span>
                </div>
                <div class="detail-box">
                    <span class="box-label">2D (BB)</span>
                    <span class="box-value">${data.d2 || '-'}</span>
                </div>
                <div class="detail-box">
                    <span class="box-label">COLOK BEBAS</span>
                    <span class="box-value">${data.colokBebas || '-'}</span>
                </div>
                <div class="detail-box">
                    <span class="box-label">COLOK MACAU</span>
                    <span class="box-value">${data.colokMacau || '-'}</span>
                </div>
                <div class="detail-box">
                    <span class="box-label">TWIN</span>
                    <span class="box-value">${data.twin || '-'}</span>
                </div>
            </div>

            <div class="detail-syair">
                <span class="syair-label">SYAIR</span>
                <p class="syair-content">${data.syair || '-'}</p>
            </div>

            <div class="detail-footer-actions">
                <button class="btn btn-primary btn-copy-all" onclick="window.copyDetailedPrediction('${pasaran}')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    Salin Semua
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
}

function copyDetailedPrediction(pasaran) {
    const results = getPredictionResultsFromStorage();
    const data = results[pasaran];
    if (!data) return;

    const text = `
✨ PREDIKSI ${pasaran} ✨
📅 ${data.tanggal}

━━━━━━━━━━━━━━━━━━━━━━
🎯 BBFS KUAT: ${data.bbfs || '-'}
🎯 ANGKA IKUT: ${data.angkaIkut || '-'}
━━━━━━━━━━━━━━━━━━━━━━
🎰 4D (BB): ${data.d4 || '-'}
🎰 3D (BB): ${data.d3 || '-'}
🎰 2D (BB): ${data.d2 || '-'}
━━━━━━━━━━━━━━━━━━━━━━
🎯 COLOK BEBAS: ${data.colokBebas || '-'}
🎯 COLOK MACAU: ${data.colokMacau || '-'}
🎯 TWIN: ${data.twin || '-'}
━━━━━━━━━━━━━━━━━━━━━━
📜 SYAIR: 
"${data.syair || '-'}"
━━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
        showToast('Semua prediksi berhasil disalin!', 'success');
    }).catch(err => {
        console.error('Gagal menyalin:', err);
        showToast('Gagal menyalin ke clipboard', 'error');
    });
}

function closePredictionDetail() {
    const modal = document.getElementById('predictionDetailModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

function generateSinglePrediction(pasaran, index) {
    const prediction = generatePrediction(pasaran, index);
    renderPredictionSection();
    showToast(`Prediksi ${pasaran} berhasil digenerate!`, 'success');
}

function generateAllPredictions() {
    const allPasarans = [...pasarans, ...getPasaranFromStorage()];
    allPasarans.forEach((pasaran, idx) => {
        generatePrediction(pasaran, idx);
    });
    renderPredictionSection();
    showToast('Semua prediksi berhasil digenerate!', 'success');
}

window.generateSinglePrediction = generateSinglePrediction;
window.generateAllPredictions = generateAllPredictions;
window.openManualInputModal = openManualInputModal;
window.closeManualInputModal = closeManualInputModal;
window.saveManualPrediction = saveManualPrediction;
window.viewDetailedPrediction = viewDetailedPrediction;
window.copyDetailedPrediction = copyDetailedPrediction;
window.closePredictionDetail = closePredictionDetail;

function switchSection(sectionId) {
    const sections = document.querySelectorAll('.app-section');
    const navItems = document.querySelectorAll('.nav-item');
    const headerTitle = document.querySelector('.header-title .subtitle');
    const btnAddTop = document.querySelector('.btn-add-top');

    sections.forEach(s => s.style.display = 'none');
    navItems.forEach(n => n.classList.remove('active'));

    const activeSection = document.getElementById(`section${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}`);
    if (activeSection) activeSection.style.display = 'block';

    navItems.forEach(n => {
        if (n.getAttribute('onclick') && n.getAttribute('onclick').includes(sectionId)) {
            n.classList.add('active');
        }
    });

    if (sectionId === 'notes') {
        if (headerTitle) headerTitle.textContent = 'NOTEPAD';
        if (btnAddTop) btnAddTop.style.display = 'flex';
        renderNotes();
    } else if (sectionId === 'togel') {
        if (headerTitle) headerTitle.textContent = 'Jadwal Togel';
        if (btnAddTop) btnAddTop.style.display = 'none';
        renderTogelList();
    } else if (sectionId === 'prediksi') {
        if (headerTitle) headerTitle.textContent = 'Prediksi Togel';
        if (btnAddTop) btnAddTop.style.display = 'none';
        renderPredictionSection();
    } else if (sectionId === 'slot') {
        if (headerTitle) headerTitle.textContent = 'Games Slot';
        if (btnAddTop) btnAddTop.style.display = 'none';
        renderSlotGames();
    } else if (sectionId === 'panduan') {
        if (headerTitle) headerTitle.textContent = 'Panduan Bermain Togel';
        if (btnAddTop) btnAddTop.style.display = 'none';
        renderGuides();
    } else if (sectionId === 'liveDraw') {
        if (headerTitle) headerTitle.textContent = 'Live Draw Pasaran';
        if (btnAddTop) btnAddTop.style.display = 'none';
    } else if (sectionId === 'slotPlayer') {
        if (headerTitle) headerTitle.textContent = 'Main Slot Game';
        if (btnAddTop) btnAddTop.style.display = 'none';
    } else if (sectionId === 'prizeCalc') {
        if (headerTitle) headerTitle.textContent = 'PERHITUNGAN HADIAH TOGEL';
        if (btnAddTop) btnAddTop.style.display = 'none';
    } else if (sectionId === 'hasilResult') {
        if (headerTitle) headerTitle.textContent = 'HASIL RESULT TOGEL';
        if (btnAddTop) btnAddTop.style.display = 'none';
        loadLotteryData();
    }

    if (window.innerWidth <= 1024) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && sidebar.classList.contains('active')) {
            window.toggleSidebar();
        }
    }
}

function getPasaranStatus(pasaran) {
    const now = new Date();
    const currentTime = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    const [bh, bm, bs] = pasaran.betClose.split(':').map(Number);
    const betCloseSeconds = bh * 3600 + bm * 60 + bs;

    const [rh, rm, rs] = pasaran.result.split(':').map(Number);
    const resultSeconds = rh * 3600 + rm * 60 + rs;

    if (currentTime >= resultSeconds) {
        return 'result';
    } else if (currentTime >= betCloseSeconds) {
        return 'bet_close';
    } else {
        return 'open';
    }
}

function renderTogelList() {
    const container = document.getElementById('togelContainer');
    if (!container) return;

    const searchInput = document.getElementById('togelSearchInput');
    const statusFilter = document.getElementById('togelStatusFilter');

    const searchQuery = searchInput ? searchInput.value.toLowerCase() : '';
    const statusValue = statusFilter ? statusFilter.value : 'all';

    let filteredData = tickerData;

    if (searchQuery) {
        filteredData = filteredData.filter(pasaran => 
            pasaran.nama.toLowerCase().includes(searchQuery)
        );
    }

    if (statusValue !== 'all') {
        filteredData = filteredData.filter(pasaran => {
            const status = getPasaranStatus(pasaran);
            return status === statusValue;
        });
    }

    container.innerHTML = filteredData.map((pasaran, index) => {
        const status = getPasaranStatus(pasaran);
        const statusClass = `status-${status}`;
        const statusLabel = status === 'open' ? 'OPEN' : status === 'bet_close' ? 'BET CLOSE' : 'RESULT';
        
        return `
        <div class="togel-card ${statusClass}">
            <div class="togel-card-header">
                <div class="pasaran-info">
                    <img src="${pasaran.logo}" alt="${pasaran.nama}" class="pasaran-logo" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3069/3069188.png'">
                    <span class="pasaran-nama">${pasaran.nama}</span>
                </div>
                <div class="pasaran-status ${statusClass}">${statusLabel}</div>
                <button class="btn btn-icon edit" onclick="window.openTogelSettings(${index})" title="Edit Jadwal">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 20h9"/>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                    </svg>
                </button>
            </div>
            <div class="togel-card-body">
                <div class="time-row">
                    <div class="time-item">
                        <span class="time-label">Tutup</span>
                        <span class="time-value">${pasaran.betClose}</span>
                    </div>
                    <div class="time-item">
                        <span class="time-label">Result</span>
                        <span class="time-value">${pasaran.result}</span>
                    </div>
                </div>
                <div class="link-row">
                    <button onclick="window.openLiveDraw('${pasaran.nama}', '${pasaran.linkResmi}')" class="link-item resmi">Live Resmi</button>
                    ${pasaran.linkAcuan !== '-' ? `<button onclick="window.openLiveDraw('${pasaran.nama}', '${pasaran.linkAcuan}')" class="link-item acuan">Link Acuan</button>` : ''}
                </div>
            </div>
        </div>
    `}).join('');
}

let editingTogelIndex = null;

function openTogelSettings(index) {
    editingTogelIndex = index;
    const pasaran = tickerData[index];
    
    const overlay = document.getElementById('togelSettingsOverlay');
    const title = document.getElementById('togelSettingsTitle');
    const nameInput = document.getElementById('togelPasaranName');
    const betCloseInput = document.getElementById('togelBetClose');
    const resultInput = document.getElementById('togelResult');
    const linkResmiInput = document.getElementById('togelLinkResmi');
    const linkAcuanInput = document.getElementById('togelLinkAcuan');

    if (title) title.textContent = `Pengaturan ${pasaran.nama}`;
    if (nameInput) nameInput.value = pasaran.nama;
    if (betCloseInput) betCloseInput.value = pasaran.betClose;
    if (resultInput) resultInput.value = pasaran.result;
    if (linkResmiInput) linkResmiInput.value = pasaran.linkResmi || '';
    if (linkAcuanInput) linkAcuanInput.value = pasaran.linkAcuan || '';

    if (overlay) overlay.classList.add('active');
}

function closeTogelSettings() {
    const overlay = document.getElementById('togelSettingsOverlay');
    if (overlay) overlay.classList.remove('active');
    editingTogelIndex = null;
}

function saveTogelSettings(event) {
    if (event) event.preventDefault();
    
    if (editingTogelIndex === null) return;

    const betClose = document.getElementById('togelBetClose').value;
    const result = document.getElementById('togelResult').value;
    const linkResmi = document.getElementById('togelLinkResmi').value;
    const linkAcuan = document.getElementById('togelLinkAcuan').value;

    tickerData[editingTogelIndex].betClose = betClose;
    tickerData[editingTogelIndex].result = result;
    tickerData[editingTogelIndex].linkResmi = linkResmi;
    tickerData[editingTogelIndex].linkAcuan = linkAcuan;

    saveTogelData();
    syncTogelToGoogleSheets();
    renderTogelList();
    closeTogelSettings();
    showToast('Jadwal pasaran berhasil diperbarui!', 'success');
}

async function syncTogelToGoogleSheets() {
    if (!useGoogleSheets || !scriptUrl) return;

    try {
        const result = await fetchFromGoogleSheets('saveTogelData', { data: tickerData }, 'POST');
        if (result && result.error) {
            console.error('Sync Togel Error:', result.error);
        }
    } catch (error) {
        console.error('Sync Togel Error:', error);
    }
}

async function fetchTogelFromGoogleSheets() {
    if (!useGoogleSheets || !scriptUrl) return null;

    try {
        const result = await fetchFromGoogleSheets('getTogelData');
        if (result && Array.isArray(result)) {
            return result;
        }
        return null;
    } catch (error) {
        console.error('Fetch Togel Error:', error);
        return null;
    }
}

// --- SISTEM PANDUAN BERMAIN TOGEL ---
const guides = [
    "Cara Bet 4D 3D 2D", "Cara Bet Bb", "Cara Bet Bbfs (Bb Campuran)",
    "Cara Bet Angka Tarung", "Cara Bet Fast 4D", "Cara Bet 4D, 3D, 2D Easy",
    "Cara Bet 3D", "Cara Bet 2D Belakang", "Cara Bet 2D Depan",
    "Cara Bet 2D Tengah", "Cara Bet Colok Bebas", "Cara Bet Colok Bebas 2D",
    "Cara Bet Colok Naga", "Cara Bermain Dan Pengertian Colok Jitu",
    "Cara Bermain Tengah Tepi", "Cara Bermain Togel Menu Bet [Dasar]",
    "Cara Bermain Dan Bet Togel 50-50", "Cara Betting Shio",
    "Seputaran Pengertian Dan Cara Bermain Silang Homo",
    "Seputaran Pengertian Dan Cara Bermain Kembang Kempis",
    "Seputaran Pengertian Dan Cara Bermain Kombinasi"
];

const guideImages = {
    "Cara Bet 4D 3D 2D": "https://i.imgur.com/sAT9he1.png",
    "Cara Bet Bb": "https://i.imgur.com/4uosxH1.png",
    "Cara Bet Bbfs (Bb Campuran)": "https://i.imgur.com/fzw0OQl.png",
    "Cara Bet Angka Tarung": "https://i.imgur.com/uctIKzf.png",
    "Cara Bet Fast 4D": "https://i.imgur.com/Q50jW4e.png",
    "Cara Bet 4D, 3D, 2D Easy": "https://i.imgur.com/XHfBtfL.png",
    "Cara Bet 3D": "https://i.imgur.com/uJFQarG.png",
    "Cara Bet 2D Belakang": "https://i.imgur.com/7gyU5lO.png",
    "Cara Bet 2D Depan": "https://i.imgur.com/Wh9LLZH.png",
    "Cara Bet 2D Tengah": "https://i.imgur.com/3HjkZCu.png",
    "Cara Bet Colok Bebas": "https://i.imgur.com/a4NHaIk.png",
    "Cara Bet Colok Bebas 2D": "https://i.imgur.com/qtxc3tv.png",
    "Cara Bet Colok Naga": "https://i.imgur.com/JNCWCqu.png",
    "Cara Bermain Dan Pengertian Colok Jitu": "https://i.imgur.com/n39qLYT.png",
    "Cara Bermain Tengah Tepi": "https://i.imgur.com/E54ZOyy.png",
    "Cara Bermain Togel Menu Bet [Dasar]": "https://i.imgur.com/gBLLJlh.png",
    "Cara Bermain Dan Bet Togel 50-50": "https://i.imgur.com/fT8OwHk.png",
    "Cara Betting Shio": "https://i.imgur.com/XUmmNBE.png",
    "Seputaran Pengertian Dan Cara Bermain Silang Homo": "https://i.imgur.com/jW3gHDi.png",
    "Seputaran Pengertian Dan Cara Bermain Kembang Kempis": "https://i.imgur.com/1ZG3LGW.png",
    "Seputaran Pengertian Dan Cara Bermain Kombinasi": "https://i.imgur.com/p6wPJon.png"
};

function renderGuides() {
    const container = document.getElementById('guideContainer');
    if (!container) return;

    container.innerHTML = guides.map((title, index) => `
        <div class="guide-card" onclick="window.openGuideModal('${title}')">
            <div class="guide-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
            </div>
            <span class="guide-card-title">${title}</span>
            <div class="guide-card-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                </svg>
            </div>
        </div>
    `).join('');
}

// --- LOTTERY RESULTS SYSTEM ---
let lotteryData = [];

async function loadLotteryData() {
    try {
        const script = document.createElement('script');
        script.src = 'lottery_data.js?ts=' + new Date().getTime();
        script.onload = () => {
            if (window.LOTTERY_DATA) {
                lotteryData = window.LOTTERY_DATA;
                renderLotteryResults();
            } else {
                console.error('Failed to load lottery data from window object');
            }
        };
        script.onerror = () => {
            console.error('Failed to load lottery_data.js script');
        };
        document.body.appendChild(script);
    } catch (e) {
        console.error('Error loading lottery data', e);
    }
}

function renderLotteryResults() {
    const container = document.getElementById('lotteryContainer');
    if (!container) return;

    if (lotteryData.length === 0) {
        container.innerHTML = `<p style="color:var(--text-muted); padding: 20px;">Tidak ada data result pasaran. Pastikan script scraper telah dijalankan.</p>`;
        return;
    }

    container.innerHTML = lotteryData.map(lot => {
        return `
            <div class="slot-card" style="border-color: #ff7e00;">
                <div class="slot-image-wrapper" style="aspect-ratio: 1/1;">
                    <img src="${lot.image || 'https://via.placeholder.com/200'}" alt="${lot.market}" class="slot-image" onerror="this.src='data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\\\'http://www.w3.org/2000/svg\\\' width=\\\'200\\\' height=\\\'200\\\' viewBox=\\\'0 0 200 200\\\'%3E%3Crect width=\\\'100%25\\\' height=\\\'100%25\\\' fill=\\\'%23333\\\'/%3E%3C/svg%3E'">
                </div>
                <div class="slot-info" style="background: linear-gradient(180deg, rgba(80,30,0,0.8) 0%, rgba(20,10,0,0.9) 100%);">
                    <h3 class="slot-name" style="color: #ffaa00; text-shadow: 0 0 5px rgba(255, 170, 0, 0.5);">${lot.market}</h3>
                    <p style="font-size: 10px; color: #fff; margin: 4px 0;">PERIODE: ${lot.period}</p>
                    <p style="font-size: 11px; font-weight: bold; color: #00ffaa; margin: 4px 0;">${lot.countdown}</p>
                    <p style="font-size: 14px; font-weight: 800; font-family: monospace; color: #fff; letter-spacing: 2px;">${lot.result}</p>
                </div>
            </div>
        `;
    }).join('');
}

let currentSlotCategory = 'Semua';

function filterSlotCategory(category) {
    currentSlotCategory = category;
    
    // Update button styles
    const buttons = document.querySelectorAll('.btn-category');
    buttons.forEach(btn => {
        if (btn.innerText === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    renderSlotGames();
}

function renderSlotGames() {
    const container = document.getElementById('slotContainer');
    if (!container) return;

    const searchInput = document.getElementById('slotSearchInput');
    const searchQuery = searchInput ? searchInput.value.toLowerCase() : '';

    let filteredData = SLOT_GAMES_DATA.filter(game => {
        const matchesSearch = game.nama.toLowerCase().includes(searchQuery) ||
                            game.provider.toLowerCase().includes(searchQuery);
        const matchesCategory = currentSlotCategory === 'Semua' || game.tanggal === currentSlotCategory;
        return matchesSearch && matchesCategory;
    });

    if (filteredData.length === 0) {
        container.innerHTML = `
            <div class="no-results" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; text-align: center;">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    <line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
                <p style="margin-top: 15px; color: var(--text-secondary);">Tidak ada game slot yang cocok dengan pencarian atau kategori ini.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredData.map(game => {
        return `
                <div class="slot-card" onclick="window.openSlotGame('${game.nama.replace(/'/g, "\\'")}', '${game.playUrl}')" style="cursor: pointer;">
                    <div class="slot-image-wrapper">
                        <img src="${game.logo}" alt="${game.nama}" class="slot-image" referrerpolicy="no-referrer"
                             onerror="this.onerror=null;this.src='data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\\\'http://www.w3.org/2000/svg\\\' width=\\\'165\\\' height=\\\'220\\\' viewBox=\\\'0 0 165 220\\\'%3E%3Crect width=\\\'100%25\\\' height=\\\'100%25\\\' fill=\\\'%23002d2d\\\'/%3E%3Ctext x=\\\'50%25\\\' y=\\\'50%25\\\' font-family=\\\'monospace\\\' font-size=\\\'14\\\' fill=\\\'%2300ffaa\\\' text-anchor=\\\'middle\\\' dominant-baseline=\\\'middle\\\'%3ESLOT GAME%3C/text%3E%3C/svg%3E';">
                    </div>
                    <div class="slot-info">
                        <h3 class="slot-name">${game.nama}</h3>
                    </div>
                </div>
            `;
    }).join('');
}

let currentGuideZoom = 1;
let isPanning = false;
let startX, startY, scrollLeft, scrollTop;

function openGuideModal(title) {
    const overlay = document.getElementById('guideModalOverlay');
    const modalTitle = document.getElementById('guideModalTitle');
    const modalImage = document.getElementById('guideModalImage');
    const loader = document.getElementById('guideImageLoader');
    const container = document.getElementById('guideImageContainer');
    
    if (overlay && modalTitle && modalImage) {
        modalTitle.textContent = title;
        resetGuideZoom();
        
        // Reset state
        if (loader) loader.style.display = 'flex';
        modalImage.style.display = 'none';
        
        modalImage.onload = () => {
            if (loader) loader.style.display = 'none';
            modalImage.style.display = 'block';
        };
        
        modalImage.onerror = () => {
            if (loader) {
                loader.textContent = 'Gagal memuat gambar. Silakan coba lagi.';
                loader.style.color = '#ff0055';
            }
        };

        modalImage.src = guideImages[title] || '';
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Setup Panning
        if (container) {
            container.onmousedown = (e) => {
                if (currentGuideZoom <= 1) return;
                isPanning = true;
                container.classList.add('panning');
                startX = e.pageX - container.offsetLeft;
                startY = e.pageY - container.offsetTop;
                scrollLeft = container.scrollLeft;
                scrollTop = container.scrollTop;
            };

            container.onmouseleave = () => {
                isPanning = false;
                container.classList.remove('panning');
            };

            container.onmouseup = () => {
                isPanning = false;
                container.classList.remove('panning');
            };

            container.onmousemove = (e) => {
                if (!isPanning) return;
                e.preventDefault();
                const x = e.pageX - container.offsetLeft;
                const y = e.pageY - container.offsetTop;
                const walkX = (x - startX) * 2;
                const walkY = (y - startY) * 2;
                container.scrollLeft = scrollLeft - walkX;
                container.scrollTop = scrollTop - walkY;
            };
        }
    }
}

function changeGuideZoom(delta) {
    const modalImage = document.getElementById('guideModalImage');
    const container = document.getElementById('guideImageContainer');
    if (!modalImage) return;

    currentGuideZoom += delta;
    if (currentGuideZoom < 0.5) currentGuideZoom = 0.5;
    if (currentGuideZoom > 3) currentGuideZoom = 3;

    modalImage.style.transform = `scale(${currentGuideZoom})`;
    
    if (currentGuideZoom > 1) {
        container.style.cursor = 'grab';
        container.style.overflow = 'auto';
    } else {
        container.style.cursor = 'default';
        container.style.overflow = 'hidden';
        container.scrollLeft = 0;
        container.scrollTop = 0;
    }
}

function resetGuideZoom() {
    currentGuideZoom = 1;
    const modalImage = document.getElementById('guideModalImage');
    const container = document.getElementById('guideImageContainer');
    if (modalImage) modalImage.style.transform = 'scale(1)';
    if (container) {
        container.style.cursor = 'default';
        container.style.overflow = 'hidden';
        container.scrollLeft = 0;
        container.scrollTop = 0;
    }
}

function closeGuideModal() {
    const overlay = document.getElementById('guideModalOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        resetGuideZoom();
    }
}

function openLiveDraw(nama, url) {
    if (!url || url === '-') {
        showToast('Link tidak tersedia', 'error');
        return;
    }

    const frame = document.getElementById('liveDrawFrame');
    const title = document.getElementById('liveDrawTitle');
    const urlText = document.getElementById('liveDrawUrl');

    if (frame && title && urlText) {
        title.textContent = `Live Draw: ${nama}`;
        urlText.textContent = url;
        frame.src = url;
        switchSection('liveDraw');
    }
}

function openSlotGame(nama, url) {
    const frame = document.getElementById('slotPlayerFrame');
    const title = document.getElementById('slotPlayerTitle');
    const desc = document.getElementById('slotPlayerDesc');
    
    if (frame && title && desc) {
        title.textContent = nama;
        desc.textContent = `Memuat game ${nama}...`;
        frame.src = url;
        switchSection('slotPlayer');
        
        frame.onload = () => {
            desc.textContent = "Selamat bermain!";
        };
    }
}

window.switchSection = switchSection;
window.openTogelSettings = openTogelSettings;
window.closeTogelSettings = closeTogelSettings;
window.saveTogelSettings = saveTogelSettings;
window.openGuideModal = openGuideModal;
window.closeGuideModal = closeGuideModal;
window.changeGuideZoom = changeGuideZoom;
window.resetGuideZoom = resetGuideZoom;
window.openLiveDraw = openLiveDraw;
window.openSlotGame = openSlotGame;
window.filterSlotCategory = filterSlotCategory;


function calculatePrize(type) {
    const input = document.getElementById(`input${type}`);
    const bayarEl = document.getElementById(`bayar${type}`);
    const menangEl = document.getElementById(`menang${type}`);
    
    if (!input || !bayarEl || !menangEl) return;
    
    const bet = parseFloat(input.value) || 0;
    let diskon = 0;
    let hadiah = 0;
    
    switch(type) {
        case '5D': diskon = 0.38; hadiah = 50000; break;
        case '4D': diskon = 0.20; hadiah = 7000; break;
        case '3D': diskon = 0.20; hadiah = 750; break;
        case '2D': diskon = 0.20; hadiah = 75; break;
        case 'Full5D': diskon = 0; hadiah = 88000; break;
        case 'Full4D': diskon = 0; hadiah = 10000; break;
        case 'Full3D': diskon = 0; hadiah = 1000; break;
        case 'Full2D': diskon = 0; hadiah = 100; break;
        case 'Tepat5D': diskon = 0; hadiah = 50000; break;
        case 'BB5D': diskon = 0; hadiah = 350; break;
        case 'Tepat4D': diskon = 0; hadiah = 5000; break;
        case 'BB4D': diskon = 0; hadiah = 180; break;
        case 'Tepat3D': diskon = 0; hadiah = 500; break;
        case 'BB3D': diskon = 0; hadiah = 75; break;
        case 'Tepat2D': diskon = 0; hadiah = 80; break;
        case 'BB2D': diskon = 0; hadiah = 15; break;
    }
    
    const bayar = bet * (1 - diskon);
    const menang = bet * hadiah;
    
    bayarEl.textContent = Math.round(bayar).toLocaleString('id-ID');
    menangEl.textContent = Math.round(menang).toLocaleString('id-ID');
}

function resetPrize(type) {
    const input = document.getElementById(`input${type}`);
    const bayarEl = document.getElementById(`bayar${type}`);
    const menangEl = document.getElementById(`menang${type}`);
    
    if (input) input.value = 1000;
    if (bayarEl) bayarEl.textContent = '0';
    if (menangEl) menangEl.textContent = '0';
}

window.calculatePrize = calculatePrize;
window.resetPrize = resetPrize;

function switchPrizeCategory(category) {
    const containers = document.querySelectorAll('.prize-container');
    const buttons = document.querySelectorAll('.btn-category');
    
    containers.forEach(c => c.style.display = 'none');
    buttons.forEach(b => b.classList.remove('active'));
    
    const targetContainer = document.getElementById(`prizeContainer${category.charAt(0).toUpperCase() + category.slice(1)}`);
    const targetButton = document.getElementById(`btnCat${category}`);
    
    if (targetContainer) targetContainer.style.display = 'block';
    if (targetButton) targetButton.classList.add('active');
}

window.switchPrizeCategory = switchPrizeCategory;

function saveNotes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    updateStats();
}

function updateStats() {
    const count = Array.isArray(notes) ? notes.length : 0;
    const totalNotesEl = document.getElementById('totalNotes');
    if (totalNotesEl) totalNotesEl.textContent = count;
}

function formatDate(isoString) {
    if (!isoString) return '-';
    try {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return '-';
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}/${month}/${year} - ${hours}:${minutes}`;
    } catch (e) {
        return '-';
    }
}

function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function fetchFromGoogleSheets(action, data = {}, method = 'GET') {
    if (!scriptUrl) return null;

    let options = {
        method: method,
        mode: 'cors',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8'
        }
    };

    let url = scriptUrl;

    if (method === 'GET') {
        const queryParams = new URLSearchParams({ action, ...data });
        url = `${scriptUrl}?${queryParams.toString()}`;
    } else {
        options.body = JSON.stringify({ action, ...data });
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error('Network response was not ok');
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch (e) {
            return { error: 'Invalid JSON response', text: text };
        }
    } catch (error) {
        console.error('Google Sheets API Error:', error);
        return { error: error.message };
    }
}

async function syncFromGoogleSheets() {
    if (!useGoogleSheets || !scriptUrl) return;

    const result = await fetchFromGoogleSheets('getAll');
    if (result && Array.isArray(result)) {
        notes = result;
        saveNotes();
        renderNotes();
    } else {
        console.error('Sync error:', result ? result.error : 'Unknown error');
    }
}

function renderNotes(filterText = '') {
    const container = document.getElementById('notesContainer');
    const emptyState = document.getElementById('emptyState');
    const noResults = document.getElementById('noResults');

    if (!container) return;

    let filtered = notes;

    if (filterText && filterText.trim() !== '') {
        const query = filterText.toLowerCase();
        filtered = notes.filter(note => {
            return note.judul && note.judul.toLowerCase().includes(query);
        });
    }

    if (!notes || notes.length === 0) {
        container.innerHTML = '';
        container.style.display = 'none';
        if (emptyState) emptyState.style.display = 'flex';
        if (noResults) noResults.style.display = 'none';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    if (filtered.length === 0) {
        container.innerHTML = '';
        container.style.display = 'none';
        if (noResults) noResults.style.display = 'flex';
        return;
    }

    if (noResults) noResults.style.display = 'none';
    container.style.display = 'grid';

    container.innerHTML = filtered.map((note, index) => {
        const noteId = note.id || `note_${index}`;
        return `
        <div class="note-card" data-id="${noteId}">
            <div class="note-header">
                <span class="note-judul">${escapeHtml(note.judul || 'Tanpa Judul')}</span>
            </div>
            <p class="note-isi">${escapeHtml(note.isi) || 'Tidak ada isi'}</p>
            <div class="note-meta">${formatDate(note.createdAt || note.updatedAt)}</div>
            <div class="note-actions">
                <button class="btn btn-icon copy" onclick="window.copyNote('${noteId}')" title="Salin">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                </button>
                <button class="btn btn-icon edit" onclick="window.editNote('${noteId}')" title="Edit">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                </button>
                <button class="btn btn-icon delete" onclick="window.confirmDelete('${noteId}')" title="Hapus">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                </button>
            </div>
        </div>
    `}).join('');
}

function openModal(noteId = null) {
    editingId = noteId;
    const overlay = document.getElementById('modalOverlay');
    const title = document.getElementById('modalTitle');
    const judulInput = document.getElementById('noteJudul');
    const isiInput = document.getElementById('noteIsi');
    const judulError = document.getElementById('judulError');

    if (judulError) judulError.textContent = '';
    if (judulInput) {
        judulInput.classList.remove('error');
        judulInput.value = '';
    }
    if (isiInput) isiInput.value = '';

    if (noteId) {
        const note = notes.find(n => n.id === noteId);
        if (note) {
            if (title) title.textContent = 'Edit Note';
            if (judulInput) judulInput.value = note.judul || '';
            if (isiInput) isiInput.value = note.isi || '';
        }
    } else {
        if (title) title.textContent = 'Tambah Note Baru';
    }

    if (overlay) overlay.classList.add('active');
    if (judulInput) setTimeout(() => judulInput.focus(), 100);
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.classList.remove('active');
    editingId = null;
    const form = document.getElementById('noteForm');
    if (form) form.reset();
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const judulInput = document.getElementById('noteJudul');
    const isiInput = document.getElementById('noteIsi');
    const judulError = document.getElementById('judulError');

    const judul = judulInput ? judulInput.value.trim() : '';
    const isi = isiInput ? isiInput.value.trim() : '';

    if (!judul) {
        if (judulError) judulError.textContent = 'Judul wajib diisi!';
        if (judulInput) {
            judulInput.classList.add('error');
            judulInput.focus();
        }
        return;
    }

    const btnSave = document.getElementById('btnSave');
    if (btnSave) btnSave.disabled = true;

    try {
        if (editingId) {
            if (useGoogleSheets && scriptUrl) {
                const result = await fetchFromGoogleSheets('update', { id: editingId, judul, isi });
                if (result && result.error) throw new Error(result.error);
                await syncFromGoogleSheets();
            } else {
                const index = notes.findIndex(n => n.id === editingId);
                if (index !== -1) {
                    notes[index].judul = judul;
                    notes[index].isi = isi;
                    notes[index].updatedAt = new Date().toISOString();
                }
            }
            showToast('Note berhasil diperbarui!', 'success');
        } else {
            if (useGoogleSheets && scriptUrl) {
                const result = await fetchFromGoogleSheets('add', { judul, isi });
                if (result && result.error) throw new Error(result.error);
                await syncFromGoogleSheets();
            } else {
                const newNote = {
                    id: generateId(),
                    judul: judul,
                    isi: isi,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                notes.unshift(newNote);
            }
            showToast('Note baru berhasil ditambahkan!', 'success');
        }

        saveNotes();
        renderNotes();
        closeModal();
    } catch (error) {
        showToast('Gagal menyimpan note: ' + error.message, 'error');
    } finally {
        if (btnSave) btnSave.disabled = false;
    }
}

function editNote(id) {
    const note = notes.find(n => n.id === id);
    if (note) {
        openModal(id);
    } else {
        showToast('Note tidak ditemukan', 'error');
    }
}

function confirmDelete(id) {
    const note = notes.find(n => n.id === id);
    if (!note) {
        showToast('Note tidak ditemukan', 'error');
        return;
    }

    deleteId = id;
    const overlay = document.getElementById('confirmOverlay');
    const message = document.getElementById('confirmMessage');

    if (message) message.textContent = `Apakah Anda yakin ingin menghapus note "${truncateText(note.judul || 'Tanpa Judul', 30)}"?`;
    if (overlay) overlay.classList.add('active');
}

async function executeDelete() {
    if (!deleteId) return;

    const btnConfirm = document.getElementById('btnConfirmDelete');
    if (btnConfirm) btnConfirm.disabled = true;

    try {
        if (useGoogleSheets && scriptUrl) {
            const result = await fetchFromGoogleSheets('delete', { id: deleteId });
            if (result && result.error) throw new Error(result.error);
            await syncFromGoogleSheets();
        } else {
            notes = notes.filter(n => n.id !== deleteId);
        }

        saveNotes();
        renderNotes();
        closeConfirmDialog();
        showToast('Note berhasil dihapus!', 'success');
    } catch (error) {
        showToast('Gagal menghapus note: ' + error.message, 'error');
    } finally {
        if (btnConfirm) btnConfirm.disabled = false;
    }
}

function closeConfirmDialog() {
    const overlay = document.getElementById('confirmOverlay');
    if (overlay) overlay.classList.remove('active');
    deleteId = null;
}

function handleOverlayClick(event) {
    if (event.target.classList.contains('modal-overlay')) {
        closeModal();
    }
}

function copyNote(id) {
    const note = notes.find(n => n.id === id);
    if (note) {
        const text = `JUDUL: ${note.judul}\nISI: ${note.isi}`;
        navigator.clipboard.writeText(text).then(() => {
            showToast('Note berhasil disalin!', 'success');
        }).catch(err => {
            console.error('Gagal menyalin:', err);
            showToast('Gagal menyalin note', 'error');
        });
    }
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const iconSvg = type === 'success'
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';

    toast.innerHTML = `
        <span class="toast-icon">${iconSvg}</span>
        <span class="toast-message">${escapeHtml(message)}</span>
        <div class="toast-progress"></div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function exportToCSV() {
    if (!notes || notes.length === 0) {
        showToast('Tidak ada note untuk di-export.', 'error');
        return;
    }

    const sheetName = 'SB';
    let csvContent = '\uFEFF';
    csvContent += `JUDUL,ISI\n`;

    notes.forEach(note => {
        const judul = `"${(note.judul || '').replace(/"/g, '""')}"`;
        const isi = `"${(note.isi || '').replace(/"/g, '""')}"`;
        csvContent += `${judul},${isi}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const filename = `${sheetName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;

    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    URL.revokeObjectURL(link.href);
    showToast(`Berhasil export ${notes.length} note ke CSV!`, 'success');
}

function openSettingsModal() {
    const existing = document.getElementById('settingsOverlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.id = 'settingsOverlay';
    overlay.onclick = (e) => {
        if (e.target.id === 'settingsOverlay') {
            closeSettingsModal();
        }
    };

    overlay.innerHTML = `
        <div class="modal" style="max-width: 450px;">
            <div class="modal-header">
                <h2>Pengaturan Koneksi</h2>
                <button class="btn-close" onclick="window.closeSettingsModal()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
            <form id="settingsForm" onsubmit="window.saveSettings(event)">
                <div class="form-group">
                    <label for="scriptUrlInput">Google Apps Script Web App URL</label>
                    <input type="url" id="scriptUrlInput" placeholder="https://script.google.com/macros/s/..." value="${scriptUrl || ''}">
                    <small style="color: var(--text-muted); display: block; margin-top: 6px;">
                        Kosongkan untuk menggunakan LocalStorage saja
                    </small>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="window.closeSettingsModal()">Batal</button>
                    <button type="submit" class="btn btn-primary">Simpan</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(overlay);
}

function closeSettingsModal() {
    const overlay = document.getElementById('settingsOverlay');
    if (overlay) overlay.remove();
}

function saveSettings(event) {
    if (event) event.preventDefault();

    const urlInput = document.getElementById('scriptUrlInput');
    if (urlInput) {
        scriptUrl = urlInput.value.trim();
        localStorage.setItem(SCRIPT_URL_KEY, scriptUrl);
        useGoogleSheets = !!scriptUrl;
    }

    closeSettingsModal();
    showToast('Pengaturan berhasil disimpan!', 'success');

    if (useGoogleSheets && scriptUrl) {
        console.log('Connecting to Google Sheets:', scriptUrl);
        syncFromGoogleSheets();
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) {
            overlay.classList.toggle('active');
        }
    }
}

function init() {
    console.log('Initializing SB Dashboard...');
    loadNotes();
    scriptUrl = localStorage.getItem(SCRIPT_URL_KEY) || '';
    useGoogleSheets = !!scriptUrl;

    switchSection('notes');
    updateStats();

    const btnExport = document.getElementById('btnExport');
    if (btnExport) btnExport.addEventListener('click', exportToCSV);

    const btnConfirmDelete = document.getElementById('btnConfirmDelete');
    if (btnConfirmDelete) btnConfirmDelete.addEventListener('click', executeDelete);

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderNotes(e.target.value);
        });
    }

    const noteForm = document.getElementById('noteForm');
    if (noteForm) {
        noteForm.addEventListener('submit', handleFormSubmit);
    }

    const togelSearchInput = document.getElementById('togelSearchInput');
    if (togelSearchInput) {
        togelSearchInput.addEventListener('input', () => {
            renderTogelList();
        });
    }

    const slotSearchInput = document.getElementById('slotSearchInput');
    if (slotSearchInput) {
        slotSearchInput.addEventListener('input', () => {
            renderSlotGames();
        });
    }

    const statusFilter = document.getElementById('togelStatusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', () => {
            renderTogelList();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            if (window.closeConfirmDialog) window.closeConfirmDialog();
            closeSettingsModal();
            const sidebar = document.getElementById('sidebar');
            if (sidebar.classList.contains('active')) toggleSidebar();
        }
        if (e.key === 'n' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            openModal();
        }
    });

    if (useGoogleSheets && scriptUrl) {
        console.log('Connecting to Google Sheets:', scriptUrl);
        syncFromGoogleSheets();
    }
}

window.copyNote = copyNote;
window.editNote = editNote;
window.confirmDelete = confirmDelete;
window.openModal = openModal;
window.closeModal = closeModal;
window.handleOverlayClick = handleOverlayClick;
window.closeSettingsModal = closeSettingsModal;
window.saveSettings = saveSettings;
window.openSettingsModal = openSettingsModal;
window.closeConfirmDialog = closeConfirmDialog;
window.toggleSidebar = toggleSidebar;
window.exportToCSV = exportToCSV;

document.addEventListener('DOMContentLoaded', init);
