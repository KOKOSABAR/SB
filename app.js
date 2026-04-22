const STORAGE_KEY = 'pk_online_notes';
let notes = [];
let editingId = null;
let deleteId = null;
let useGoogleSheets = true;
const SCRIPT_URL_KEY = 'pk_online_script_url';
let scriptUrl = localStorage.getItem(SCRIPT_URL_KEY) || 'https://script.google.com/macros/s/AKfycbw2pGpYeusit_AWc_bzNhNUmWjJ1dZSl_M8TZOLhrrGaG6SvBGTQaTLpmYt81X6zCAS/exec';
const FOLDER_ID_KEY = 'pk_online_folder_id';
const TOGEL_DATA_KEY = 'pk_online_togel_data';
const GALLERY_DATA_KEY = 'pk_online_gallery_data';
const THEME_KEY = 'pk_online_theme';

const THEMES = [
    { id: 'after-eight', name: 'After Eight', color: '#00ffaa' },
    { id: 'gx-classic', name: 'GX Classic', color: '#ff0033' },
    { id: 'ultraviolet', name: 'Ultraviolet', color: '#9900ff' },
    { id: 'sub-zero', name: 'Sub Zero', color: '#0066ff' },
    { id: 'frutti-di-mare', name: 'Frutti Di Mare', color: '#ff4d00' },
    { id: 'purple-haze', name: 'Purple Haze', color: '#ccff00' },
    { id: 'vaporwave', name: 'Vaporwave', color: '#00ffff' },
    { id: 'rose-quartz', name: 'Rose Quartz', color: '#ff6699' },
    { id: 'hackerman', name: 'Hackerman', color: '#00ff00' },
    { id: 'lambda', name: 'Lambda', color: '#ff9900' },
    { id: 'pay-to-win', name: 'Pay-To-Win', color: '#ffd700' },
    { id: 'white-wolf', name: 'White Wolf', color: '#ffffff' }
];

function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'after-eight';
    document.body.setAttribute('data-theme', savedTheme);
}

function switchTheme(themeId) {
    document.body.setAttribute('data-theme', themeId);
    localStorage.setItem(THEME_KEY, themeId);

    // Update active state in UI if settings modal is open
    document.querySelectorAll('.theme-card').forEach(card => {
        card.classList.toggle('active', card.getAttribute('data-id') === themeId);
    });
}

window.initTheme = initTheme;
window.switchTheme = switchTheme;

initTheme();

const DEFAULT_FOLDER_ID = '1CLolADOa94s8tKp9r1mG19YhYNBDHnku';
let driveFolderId = localStorage.getItem(FOLDER_ID_KEY) || DEFAULT_FOLDER_ID;

// --- INITIAL GALLERY DATA ---
const INITIAL_GALLERY = [
    { id: '1sLJ3LF5L_b0CSlP9j1Iwa9gb0UHShIe3', type: 'drive' },
    { id: '1-Mgj2crJs7eF0A8SQp7v4DAWtFPYMIQD', type: 'drive' },
    { id: '1kxEiwQ9KLHmmFTqlER2m0luArtqR9EwE', type: 'drive' },
    { id: '1ls5AnGrTfE-_vnWTux84xVHOOr-fhrWY', type: 'drive' },
    { id: '1nvSdjuvBakVLPG7M39weDvE-1LV8Ga9N', type: 'drive' },
    { id: '1X3n4FCpGCoHbCwOKsQc_qU6esQ5YOkVE', type: 'drive' },
    { id: '1PxdcJ2U_U5OhUuSUrd2TV1CtMIp4pZtd', type: 'drive' },
    { id: '18GXMhi4NkkZ7auIxcPVD_D98ERFZJdXY', type: 'drive' },
    { id: '1KJNpBIWn_d5rl08BldpF2kmv7Yjy5gtR', type: 'drive' },
    { id: '1fcGphPPMhYIR5wFUhVJnpAugE-xaMnOP', type: 'drive' },
    { id: '1H6-LpiCg5HUA7uWM0QjPOoCVGHNsRjs9', type: 'drive' },
    { id: '1PswGbA9fMotdcCXpM1E1ICBSs7cRvh36', type: 'drive' },
    { id: '11FbAoZ-P596iCg53qWbwd29KOgPuSb6K', type: 'drive' },
    { id: '1k98s9Vsr8EGBWd_iOqlze9Lu1nMzYxrh', type: 'drive' },
    { id: '1ERxcDkuiNmoWzOmmQQIwE9PlhOET2yiV', type: 'drive' }
];

let galleryData = [];

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
    const randomDigits = (n) => Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join('');
    const randomSet = (n, count) => Array.from({ length: count }, () => randomDigits(n)).join(' / ');

    return {
        pasaran: pasaran,
        tanggal: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        bbfs: Array.from({ length: 7 }, () => Math.floor(Math.random() * 10)).join(''),
        angkaIkut: Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join(''),
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
                    <small>${new Date(sayir.timestamp).toLocaleDateString('en-US')}</small>
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
        return Array.from({ length: count }, () => {
            return Array.from({ length: len }, () => getRandDigit()).join('');
        }).join(' / ');
    };

    return {
        pasaran: pasaran,
        tanggal: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        bbfs: seed,
        angkaIkut: Array.from({ length: Math.min(5, digits.length + 2) }, () => getRandDigit()).join(''),
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
PREDIKSI ${pasaran.toUpperCase()} 
${data.tanggal}

BBFS KUAT: ${data.bbfs || '-'}
ANGKA IKUT: ${data.angkaIkut || '-'}

4D (BB): ${data.d4 || '-'}
3D (BB): ${data.d3 || '-'}
2D (BB): ${data.d2 || '-'}

COLOK BEBAS: ${data.colokBebas || '-'}
COLOK MACAU: ${data.colokMacau || '-'}
TWIN: ${data.twin || '-'}

SYAIR: 
"${data.syair || '-'}"
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
let lotteryRefreshInterval = null;
let sportsbookRefreshInterval = null;
let gamesData = [];

async function fetchDaftarGames() {
    if (!useGoogleSheets || !scriptUrl) {
        showToast('Mode Offline: Tidak dapat mengambil data games.', 'warning');
        return;
    }

    try {
        const result = await fetchFromGoogleSheets('getDaftarGames');
        if (result && Array.isArray(result)) {
            gamesData = result;
            console.log('Games Data Loaded:', gamesData.length);
        } else if (result && result.error) {
            showToast(result.error, 'error');
        }
    } catch (error) {
        console.error('Fetch Games Error:', error);
    }
}

function filterGamesMassal() {
    const textArea = document.getElementById('gameSearchTextArea');
    const resultsContainer = document.getElementById('gameSearchResults');
    const resultsBody = document.getElementById('gameResultsBody');
    
    if (!textArea || !resultsContainer || !resultsBody) return;

    const input = textArea.value.trim();
    if (!input) {
        resultsBody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-muted); padding: 40px;">Data games akan muncul di sini...</td></tr>`;
        return;
    }

    const searchTerms = input.split('\n').map(t => t.trim().toLowerCase()).filter(t => t);
    const results = [];

    searchTerms.forEach(term => {
        const found = gamesData.filter(game => 
            game.nama.toLowerCase().includes(term) || 
            term.includes(game.nama.toLowerCase())
        );
        if (found.length > 0) {
            results.push(...found);
        }
    });

    // Remove duplicates
    const uniqueResults = results.filter((v, i, a) => a.findIndex(t => (t.nama === v.nama && t.provider === v.provider)) === i);

    if (uniqueResults.length > 0) {
        resultsBody.innerHTML = uniqueResults.map(game => `
            <tr>
                <td><span class="status-badge safe" style="font-size: 10px;">${game.kategori}</span></td>
                <td style="color: var(--accent); font-weight: bold;">${game.provider}</td>
                <td style="color: #fff;">${game.nama}</td>
            </tr>
        `).join('');
    } else {
        resultsBody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-muted); padding: 40px;">Tidak ada data yang cocok ditemukan.</td></tr>`;
    }
}

window.filterGamesMassal = filterGamesMassal;

function switchSection(sectionId) {
    localStorage.setItem('activeSection', sectionId);
    const sections = document.querySelectorAll('.app-section');
    const navItems = document.querySelectorAll('.nav-item');
    const headerTitle = document.querySelector('.header-title .subtitle');
    const btnAddTop = document.getElementById('btnAddTop');

    // Reset Intervals
    if (lotteryRefreshInterval) {
        clearInterval(lotteryRefreshInterval);
        lotteryRefreshInterval = null;
    }
    if (sportsbookRefreshInterval) {
        clearInterval(sportsbookRefreshInterval);
        sportsbookRefreshInterval = null;
    }

    sections.forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active');
    });

    const activeSection = document.getElementById('section' + sectionId.charAt(0).toUpperCase() + sectionId.slice(1));
    if (activeSection) {
        activeSection.style.display = 'block';
        setTimeout(() => activeSection.classList.add('active'), 10);
    }

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('onclick').includes(`'${sectionId}'`)) {
            item.classList.add('active');
        }
    });

    if (sectionId === 'notes') {
        if (headerTitle) headerTitle.textContent = 'Data Catatan Pribadi';
        if (btnAddTop) btnAddTop.style.display = 'flex';
        renderNotes();
    } else if (sectionId === 'cekRekening') {
        if (headerTitle) headerTitle.textContent = 'VERIFIKASI DATA REKENING';
        if (btnAddTop) btnAddTop.style.display = 'none';
    } else if (sectionId === 'inventaris') {
        if (headerTitle) headerTitle.textContent = 'DATA INVENTARIS HP WDBOS';
        if (btnAddTop) btnAddTop.style.display = 'none';
        renderInventarisTable();
    } else if (sectionId === 'kesalahan') {
        if (headerTitle) headerTitle.textContent = 'DATA KESALAHAN STAFF';
        if (btnAddTop) btnAddTop.style.display = 'none';
        renderKesalahanTable();
    } else if (sectionId === 'backupKesalahan') {
        if (headerTitle) headerTitle.textContent = 'BACKUP KESALAHAN LC';
        if (btnAddTop) btnAddTop.style.display = 'none';

        // Default date to today if empty
        const dateInput = document.getElementById('backupKesalahanDateInput');
        if (dateInput && !dateInput.value) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }

        renderBackupKesalahanTable();
    } else if (sectionId === 'izinKeluar') {
        if (headerTitle) headerTitle.textContent = 'Data Izin Keluar';
        if (btnAddTop) btnAddTop.style.display = 'none';
        renderIzinKeluarTable();
    } else if (sectionId === 'togel') {
        if (headerTitle) headerTitle.textContent = 'Jadwal Togel';
        if (btnAddTop) btnAddTop.style.display = 'none';
        renderTogelList();
    } else if (sectionId === 'prediksi') {
        if (headerTitle) headerTitle.textContent = 'Prediksi Togel';
        if (btnAddTop) btnAddTop.style.display = 'none';
        renderPredictionSection();
    } else if (sectionId === 'daftarGames') {
        if (headerTitle) headerTitle.textContent = 'DAFTAR GAMES WDBOS';
        if (btnAddTop) btnAddTop.style.display = 'none';
        fetchDaftarGames();
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
        if (headerTitle) headerTitle.textContent = 'PERHITUNGAN HADIAH TOGEL (DEBUG)';
        if (btnAddTop) btnAddTop.style.display = 'none';
        setTimeout(() => {
            if (typeof window.switchPrizeCategory === 'function') {
                window.switchPrizeCategory('diskon');
            }
        }, 50);
    } else if (sectionId === 'contohPrize') {
        if (headerTitle) headerTitle.textContent = 'CONTOH PERHITUNGAN HADIAH';
        if (btnAddTop) btnAddTop.style.display = 'none';
        window.updateContohPrizeTable();
    } else if (sectionId === 'hasilResult') {
        if (headerTitle) headerTitle.textContent = 'HASIL RESULT TOGEL';
        if (btnAddTop) btnAddTop.style.display = 'none';
        loadLotteryData();
        // Aktifkan Auto Refresh (Setiap 60 Detik)
        lotteryRefreshInterval = setInterval(loadLotteryData, 60000);
    } else if (sectionId === 'wdManual') {
        if (headerTitle) headerTitle.textContent = 'MANUAL WITHDRAW CORE';
        if (btnAddTop) btnAddTop.style.display = 'none';
    } else if (sectionId === 'wdPower') {
        if (headerTitle) headerTitle.textContent = 'POWER WITHDRAW CORE';
        if (btnAddTop) btnAddTop.style.display = 'none';
    } else if (sectionId === 'depoKlikBca') {
        if (headerTitle) headerTitle.textContent = 'DEPO KLIK BCA CORE';
        if (btnAddTop) btnAddTop.style.display = 'none';
    } else if (sectionId === 'depoMybca') {
        if (headerTitle) headerTitle.textContent = 'DEPO MYBCA CORE';
        if (btnAddTop) btnAddTop.style.display = 'none';
    } else if (sectionId === 'buySpinCalc') {
        if (headerTitle) headerTitle.textContent = 'KALKULATOR BUY & FREE SPIN';
        if (btnAddTop) btnAddTop.style.display = 'none';
        window.updateSlotCalc();
    } else if (sectionId === 'gallery') {
        if (headerTitle) headerTitle.textContent = 'GALERY';
        if (btnAddTop) btnAddTop.style.display = 'none';
        renderGallery();
    } else if (sectionId === 'extensions') {
        if (headerTitle) headerTitle.textContent = 'EXTENSIONS';
        if (btnAddTop) btnAddTop.style.display = 'none';
        renderExtensions();
    } else if (sectionId === 'sportsbook') {
        if (headerTitle) headerTitle.textContent = 'SPORTSBOOK RESULTS';
        if (btnAddTop) btnAddTop.style.display = 'none';

        // Inisialisasi Filter Tanggal
        const dateSelect = document.getElementById('sbDateSelect');
        if (dateSelect && dateSelect.options.length === 0) {
            const today = new Date();
            for (let i = 0; i < 7; i++) {
                const d = new Date();
                d.setDate(today.getDate() - i);
                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const year = d.getFullYear();
                const val = `${year}-${month}-${day}`;
                const label = i === 0 ? 'Today' : (i === 1 ? 'Yesterday' : `${day}/${month}/${year}`);
                const opt = new Option(val, val); // Value must be YYYY-MM-DD for ibet288
                opt.text = label;
                dateSelect.add(opt);
            }
        }

        // Global function untuk tombol Yesterday/Today
        window.setSbDateOffset = function (offset) {
            if (dateSelect) {
                dateSelect.selectedIndex = offset;
                renderSportsbookTable(true);
            }
        };

        // Tambahkan Listener agar League terupdate otomatis saat Sport ganti
        const sportSelect = document.getElementById('sbSportSelect');
        if (sportSelect && !sportSelect.dataset.listener) {
            sportSelect.dataset.listener = 'true';
            sportSelect.addEventListener('change', () => renderSportsbookTable(true));
        }
        if (dateSelect && !dateSelect.dataset.listener) {
            dateSelect.dataset.listener = 'true';
            dateSelect.addEventListener('change', () => renderSportsbookTable(true));
        }

        renderSportsbookTable();
        // Aktifkan Auto Refresh (Setiap 60 Detik)
        sportsbookRefreshInterval = setInterval(renderSportsbookTable, 60000);
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
    const container = document.getElementById('lotteryContainer');
    if (!container) return;

    if (lotteryData.length === 0) {
        container.innerHTML = `
            <div class="sync-loader">
                <div class="loader-spinner"></div>
                <p>Sinkronisasi Data Realtime...</p>
            </div>
        `;
    }

    try {
        console.log('🔄 Memulai Sinkronisasi Realtime WDBOS...');
        const data = await fetchFromGoogleSheets('scrapeWdbos');

        if (data && Array.isArray(data)) {
            lotteryData = data;
            renderLotteryResults();
            console.log('✅ Sinkronisasi Realtime Berhasil.');
        } else {
            console.error('GAS Error/Invalid Data:', data ? data.error : 'No data');
            if (lotteryData.length === 0) loadLocalLotteryData();
        }
    } catch (error) {
        console.error('Koneksi ke Google Script Gagal:', error);
        if (lotteryData.length === 0) loadLocalLotteryData();
    }
}

function loadLocalLotteryData() {
    const oldScript = document.getElementById('lotteryDataScript');
    if (oldScript) oldScript.remove();
    const script = document.createElement('script');
    script.id = 'lotteryDataScript';
    script.src = 'lottery_data.js';
    script.onload = () => {
        if (window.LOTTERY_DATA) {
            lotteryData = window.LOTTERY_DATA;
            renderLotteryResults();
        }
    };
    document.body.appendChild(script);
}

function renderLotteryResults() {
    const container = document.getElementById('lotteryContainer');
    if (!container) return;

    if (lotteryData.length === 0) {
        container.innerHTML = `<p style="color:var(--text-muted); padding: 20px;">Tidak ada data result pasaran. Pastikan script scraper telah dijalankan.</p>`;
        return;
    }

    const borderColors = ['cyan', 'orange', 'magenta', 'gold', 'blue', 'green', 'red'];

    container.innerHTML = lotteryData.map((lot, index) => {
        if (!lot || !lot.market) return '';
        const normalizedMarket = lot.market.toUpperCase().replace(/\s+/g, ' ').trim();

        // Helper untuk memuat gambar (Standardisasi ke Server Aset Resmi & Bypass Hotlink)
        const getProxiedUrl = (path) => {
            if (!path) return '';

            let cleanPath = path;
            // Jika path adalah URL absolut ke mirror lain, arahkan ke domain aset pusat agar stabil
            if (path.includes('/assets/LOTTERY-Web/')) {
                cleanPath = '/assets/LOTTERY-Web/' + path.split('/assets/LOTTERY-Web/')[1];
            }

            // Perbaikan path: Pola WDBOS seringkali membutuhkan sub-folder /bg/ atau /icon/
            if (cleanPath.endsWith('/bg.png') && !cleanPath.includes('/bg/bg.png')) {
                cleanPath = cleanPath.replace('/bg.png', '/bg/bg.png');
            }
            if (cleanPath.endsWith('/icon.png') && !cleanPath.includes('/icon/icon.png')) {
                cleanPath = cleanPath.replace('/icon.png', '/icon/icon.png');
            }

            // Gunakan domain aset resmi yang terverifikasi (png-res.png999.com)
            const baseUrl = 'https://png-res.png999.com';
            const fullUrl = cleanPath.startsWith('http') ?
                cleanPath.replace(/https?:\/\/[^\/]+/, baseUrl) :
                baseUrl + (cleanPath.startsWith('/') ? '' : '/') + cleanPath;

            // Gunakan Weserv Proxy untuk memotong proteksi blokir gambar (Hotlink)
            return `https://images.weserv.nl/?url=${encodeURIComponent(fullUrl)}`;
        };

        const logo = getProxiedUrl(lot.image) || 'https://cdn-icons-png.flaticon.com/512/3069/3069188.png';

        // Prediksi banner dari logo (Pola WDBOS: icon/icon.png -> bg/bg.png)
        let bannerPath = lot.banner;
        if (!bannerPath && lot.image && lot.image.includes('icon/icon.png')) {
            bannerPath = lot.image.replace('icon/icon.png', 'bg/bg.png');
        }

        const fallbackBanner = '/assets/images/lottery/bg-default.jpg';
        const banner = bannerPath ? getProxiedUrl(bannerPath) : getProxiedUrl(fallbackBanner);

        const resultValue = lot.result || '----';
        const isLong = resultValue.length > 10;
        const colorClass = borderColors[index % borderColors.length];

        const isLive = (lot.countdown && lot.countdown.includes('00:00:00')) || normalizedMarket.includes('LIVE');
        const showStream = normalizedMarket.includes('CAMBODIA') || normalizedMarket.includes('SYDNEY') || normalizedMarket.includes('HONGKONG');

        return `
            <div class="tr-wrapper">
                <div class="togel-result-card tr-border-${colorClass}" style="background-image: url('${banner}');">
                    <div class="tr-overlay"></div>
                    
                    ${isLive ? '<div class="tr-live-badge">LIVE</div>' : ''}

                    <div class="tr-header">
                        <div class="tr-market-name-top">${lot.market}</div>
                        <div class="tr-badge-logo">
                            <img src="${logo}" alt="logo" referrerpolicy="no-referrer">
                        </div>
                    </div>

                    <div class="tr-middle">
                        ${showStream ? `<button class="tr-stream-btn">Watch live Stream</button>` : ''}
                        <div class="tr-period">PERIODE: ${lot.period}</div>
                    </div>

                    <div class="tr-bottom-glass">
                        <div class="tr-countdown">${lot.countdown}</div>
                        <div class="tr-result-box">
                             <span class="tr-result-value ${isLong ? 'long' : ''}">${resultValue}</span>
                        </div>
                    </div>
                </div>
                <div class="tr-footer-bar">${lot.market}</div>
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

function openGuideModal(title) {
    const overlay = document.getElementById('guideModalOverlay');
    const modalTitle = document.getElementById('guideModalTitle');
    const modalImage = document.getElementById('guideModalImage');
    const loader = document.getElementById('guideImageLoader');

    if (overlay && modalTitle && modalImage) {
        modalTitle.textContent = title;

        if (loader) loader.style.display = 'flex';
        modalImage.style.display = 'none';

        modalImage.onload = () => {
            if (loader) loader.style.display = 'none';
            modalImage.style.display = 'block';
        };

        modalImage.src = guideImages[title] || '';
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeGuideModal() {
    const overlay = document.getElementById('guideModalOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
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
window.openLiveDraw = openLiveDraw;
window.openSlotGame = openSlotGame;
window.filterSlotCategory = filterSlotCategory;


function calculatePrize(type) {
    const input = document.getElementById(`input${type}`);
    const bayarEl = document.getElementById(`bayar${type}`);
    const menangEl = document.getElementById(`menang${type}`);
    const totalEl = document.getElementById(`total${type}`);

    if (!input || !bayarEl || !menangEl) return;

    const bet = parseFloat(input.value) || 0;
    let diskon = 0;
    let hadiah = 0;
    let kei = 0;

    switch (type) {
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
        case 'Prize1_1': diskon = 0; hadiah = 6500; break;
        case 'Prize1_2': diskon = 0; hadiah = 650; break;
        case 'Prize1_3': diskon = 0; hadiah = 70; break;
        case 'Prize2_1': diskon = 0; hadiah = 2100; break;
        case 'Prize2_2': diskon = 0; hadiah = 210; break;
        case 'Prize2_3': diskon = 0; hadiah = 20; break;
        case 'Prize3_1': diskon = 0; hadiah = 1100; break;
        case 'Prize3_2': diskon = 0; hadiah = 110; break;
        case 'Prize3_2': diskon = 0; hadiah = 110; break;
        case 'Prize3_3': diskon = 0; hadiah = 8; break;

        // LAINNYA
        case 'ColokBebas': diskon = 0.06; hadiah = 1.5; break;
        case 'ColokBebas2D2': diskon = 0.10; hadiah = 7; break;
        case 'ColokBebas2D3': diskon = 0.10; hadiah = 11; break;
        case 'ColokBebas2D4': diskon = 0.10; hadiah = 18; break;
        case 'ColokBebas2D5': diskon = 0.10; hadiah = 200; break;
        case 'ColokNaga3': diskon = 0.10; hadiah = 23; break;
        case 'ColokNaga4': diskon = 0.10; hadiah = 35; break;
        case 'ColokNaga5': diskon = 0.10; hadiah = 125; break;
        case 'ColokJitu': diskon = 0.06; hadiah = 8; break;
        case 'TengahTepi': diskon = 0.02; kei = -0.02; hadiah = 1; break;
        case 'DasarGenapKecil': diskon = 0.02; kei = 0.10; hadiah = 1; break;
        case 'DasarGanjilBesar': diskon = 0.02; kei = -0.25; hadiah = 1; break;
        case 'FiftyFifty': diskon = 0.02; kei = -0.02; hadiah = 1; break;
        case 'Shio': diskon = 0.05; hadiah = 9.5; break;
        case 'SilangHomo': diskon = 0.02; kei = -0.02; hadiah = 1; break;
        case 'KembangKempis': diskon = 0.02; kei = -0.03; hadiah = 1; break;
        case 'Kombinasi': diskon = 0.08; hadiah = 2.6; break;
    }

    const bayar = bet * (1 - kei) * (1 - diskon);
    const menang = bet * hadiah;

    bayarEl.textContent = Math.round(bayar).toLocaleString('en-US');
    menangEl.textContent = Math.round(menang).toLocaleString('en-US');

    if (totalEl) {
        totalEl.textContent = Math.round(bayar + menang).toLocaleString('en-US');
    }
}

function resetPrize(type) {
    const input = document.getElementById(`input${type}`);
    const bayarEl = document.getElementById(`bayar${type}`);
    const menangEl = document.getElementById(`menang${type}`);
    const totalEl = document.getElementById(`total${type}`);

    if (input) input.value = 1000;
    if (bayarEl) bayarEl.textContent = '0';
    if (menangEl) menangEl.textContent = '0';
    if (totalEl) totalEl.textContent = '0';
}

window.calculatePrize = calculatePrize;
window.resetPrize = resetPrize;

function switchPrizeCategory(category) {
    const containers = document.querySelectorAll('.prize-container');
    const buttons = document.querySelectorAll('.btn-category');

    // Debug logging
    const log = (msg) => {
        const debug = document.getElementById('debugLog');
        if (debug) debug.innerHTML += `\n[PRIZE] ${msg}`;
        console.log(`[PRIZE] ${msg}`);
    };

    log(`Switching to category: ${category}`);
    log(`Total containers found: ${containers.length}`);

    containers.forEach(c => c.style.display = 'none');
    buttons.forEach(b => b.classList.remove('active'));

    const targetId = `prizeContainer${category.charAt(0).toUpperCase() + category.slice(1)}`;
    const targetContainer = document.getElementById(targetId);
    const targetButton = document.getElementById(`btnCat${category}`);

    if (targetContainer) {
        targetContainer.style.display = 'block';
        log(`Container ${targetId} shown.`);
    } else {
        log(`ERROR: Container ${targetId} NOT FOUND.`);
    }

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

function indonesianDateLong(isoString) {
    if (!isoString) return '-';
    try {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return isoString; // Jika bukan ISO, return as is
        const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    } catch (e) {
        return isoString;
    }
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
        const queryParams = new URLSearchParams({ action, ...data, _t: Date.now() });
        const separator = scriptUrl.includes('?') ? '&' : '?';
        url = `${scriptUrl}${separator}${queryParams.toString()}`;
    } else {
        options.body = JSON.stringify({ action, ...data });
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
        const text = await response.text();
        try {
            const json = JSON.parse(text);
            if (json.error) console.warn('GAS Server Error:', json.error);
            return json;
        } catch (e) {
            console.error('JSON Parse Error. Server sent:', text.substring(0, 200));
            return { error: 'Format data dari server tidak valid (Bukan JSON)' };
        }
    } catch (error) {
        console.error('Fetch Error:', error);

        // Fallback to JSONP for GET requests if fetch fails (Common for GAS CORS issues)
        if (method === 'GET') {
            return new Promise((resolve) => {
                const callbackName = 'gas_cb_' + Date.now();
                window[callbackName] = (res) => {
                    delete window[callbackName];
                    const scriptTag = document.getElementById(callbackName);
                    if (scriptTag) scriptTag.remove();
                    resolve(res);
                };
                const script = document.createElement('script');
                script.id = callbackName;
                const separator = scriptUrl.includes('?') ? '&' : '?';
                const params = new URLSearchParams({ ...data, action, callback: callbackName }).toString();
                script.src = `${scriptUrl}${separator}${params}`;
                script.onerror = () => {
                    resolve({
                        error: 'Koneksi Gagal (JSONP). Pastikan Script di-Deploy sebagai "Web App" dengan akses "Anyone".'
                    });
                };
                document.body.appendChild(script);

                // Timeout for JSONP
                setTimeout(() => {
                    if (window[callbackName]) {
                        delete window[callbackName];
                        resolve({ error: 'Koneksi Timeout. Periksa koneksi internet atau status Script.' });
                    }
                }, 15000);
            });
        }

        return { error: 'Gagal menghubungi server: ' + error.message };
    }
}


async function syncFromGoogleSheets() {
    if (!useGoogleSheets || !scriptUrl) return;

    try {
        const result = await fetchFromGoogleSheets('getAll');
        if (result && !result.error) {
            if (Array.isArray(result)) {
                notes = result;
                saveNotes();
                renderNotes();
                updateConnectionStatus(true);
            }
        } else if (result && result.error) {
            console.error('Sync error:', result.error);
            updateConnectionStatus(false, result.error);
        }
    } catch (e) {
        updateConnectionStatus(false, e.message);
    }
}

async function testGASConnection() {
    const statusText = document.getElementById('connStatusText');
    const statusDot = document.getElementById('connStatusDot');
    const log = document.getElementById('debugLog');

    if (statusText) statusText.textContent = 'Testing...';
    if (statusDot) statusDot.className = 'status-dot warning';
    if (log) log.innerHTML = `[${new Date().toLocaleTimeString()}] Memulai tes koneksi...\n` + log.innerHTML;

    try {
        const result = await fetchFromGoogleSheets('testConnection');
        if (result && result.status === 'success') {
            showToast('Koneksi Backend Berhasil!', 'success');
            updateConnectionStatus(true);

            if (log) {
                log.innerHTML = `[${new Date().toLocaleTimeString()}] TERHUBUNG: ${result.spreadsheet}\n` +
                    `[${new Date().toLocaleTimeString()}] ID: ${result.id}\n` +
                    `-------------------\n` + log.innerHTML;
            }
        } else {
            const errMsg = result && result.error ? result.error : 'Respon Server Tidak Valid';
            showToast(errMsg, 'error');
            updateConnectionStatus(false, errMsg);
            if (log) log.innerHTML = `[${new Date().toLocaleTimeString()}] ERROR: ${errMsg}\n` + log.innerHTML;
        }
    } catch (e) {
        const msg = 'Kesalahan Jaringan: ' + e.message;
        showToast(msg, 'error');
        updateConnectionStatus(false, msg);
        if (log) log.innerHTML = `[${new Date().toLocaleTimeString()}] FATAL: ${msg}\n` + log.innerHTML;
    }
}

// Helper to open script in new tab for direct testing
window.openScriptDiagnostic = function () {
    if (scriptUrl) {
        window.open(scriptUrl, '_blank');
        showToast('Membuka URL Script... Jika muncul error Google, periksa izin Deploy.', 'info');
    } else {
        showToast('URL Script belum diatur!', 'error');
    }
};

function updateConnectionStatus(isOk, errorMsg = '') {
    const statusText = document.getElementById('connStatusText');
    const statusDot = document.getElementById('connStatusDot');

    if (isOk) {
        if (statusText) statusText.textContent = 'Online';
        if (statusDot) statusDot.className = 'status-dot active';
    } else {
        if (statusText) statusText.textContent = 'Offline';
        if (statusDot) statusDot.className = 'status-dot error';
        if (errorMsg) console.warn('GAS Connection Problem:', errorMsg);
    }
}

async function preloadDashboardData(force = false) {
    if (!useGoogleSheets || !scriptUrl) {
        if (force) showToast('Aktifkan Google Sheets di Pengaturan dahulu', 'info');
        return;
    }

    if (force) showToast('Sinkronisasi Data Dashboard...', 'loading', 0);

    try {
        // Run syncs in parallel
        await Promise.all([
            syncFromGoogleSheets(),
            renderInventarisTable(),
            renderKesalahanTable(),
            renderBackupKesalahanTable(),
            renderIzinKeluarTable()
        ]);

        if (force) showToast('Dashboard Berhasil Diperbarui!', 'success');
    } catch (e) {
        console.error('Preload Error:', e);
        if (force) showToast('Beberapa data gagal dimuat: ' + e.message, 'error');
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
        <div class="note-card" data-id="${noteId}" ondblclick="window.expandNote('${noteId}')" title="Double klik untuk memperbesar desain luxury">
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
    editingId = null;
    const overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.classList.remove('active');
}

window.expandNote = function (noteId) {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;

    const overlay = document.getElementById('viewNoteOverlay');
    const title = document.getElementById('viewNoteTitle');
    const content = document.getElementById('viewNoteContent');
    const time = document.getElementById('viewNoteTime');
    const copyBtn = document.getElementById('viewNoteCopyBtn');

    if (title) title.textContent = note.judul || 'Tanpa Judul';
    if (content) content.textContent = note.isi || '';
    if (time) time.textContent = formatDate(note.createdAt || note.updatedAt);

    if (copyBtn) {
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(note.isi || '').then(() => {
                if (typeof showToast === 'function') showToast("Isi note berhasil disalin!", "success");
            });
        };
    }

    if (overlay) overlay.classList.add('active');
};

window.closeViewNote = function () {
    const overlay = document.getElementById('viewNoteOverlay');
    if (overlay) overlay.classList.remove('active');
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
                const result = await fetchFromGoogleSheets('update', { id: editingId, judul, isi }, 'POST');
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
                const result = await fetchFromGoogleSheets('add', { judul, isi }, 'POST');
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

function showToast(message, type = 'success', duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    // Bersihkan notifikasi lama dengan tipe yang sama agar tidak menumpuk
    if (type === 'loading' || type === 'success') {
        const oldToasts = container.querySelectorAll('.toast');
        oldToasts.forEach(t => {
            t.classList.add('toast-out');
            setTimeout(() => t.remove(), 400);
        });
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>',
        error: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
        info: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="8"/></svg>',
        warning: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12" y2="17"/></svg>',
        loading: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="spin-icon"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>'
    };

    const iconSvg = icons[type] || icons.info;

    toast.innerHTML = `
        <div class="toast-icon">${iconSvg}</div>
        <div class="toast-message">${message.toUpperCase()}</div>
        <div class="toast-progress" style="animation-duration: ${duration > 0 ? duration : 15000}ms"></div>
    `;

    container.appendChild(toast);

    // Pengaman: Jika durasi 0 (loading), set maksimal 15 detik agar tidak nyangkut selamanya
    const finalDuration = duration > 0 ? duration : 15000;

    setTimeout(() => {
        toast.classList.add('toast-out');
        setTimeout(() => {
            if (toast.parentNode === container) toast.remove();
        }, 400);
    }, finalDuration);
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

    const currentTheme = localStorage.getItem(THEME_KEY) || 'after-eight';
    const themesHTML = THEMES.map(theme => `
        <div class="theme-card ${theme.id === currentTheme ? 'active' : ''}" 
             data-id="${theme.id}" 
             onclick="window.switchTheme('${theme.id}')">
            <div class="theme-preview" style="background: linear-gradient(135deg, #0a0a0a 0%, ${theme.color}22 100%);">
                <div class="dots">
                    <div class="dot" style="background: ${theme.color}; box-shadow: 0 0 5px ${theme.color}88;"></div>
                    <div class="dot" style="background: ${theme.color}; opacity: 0.7;"></div>
                    <div class="dot" style="background: ${theme.color}; opacity: 0.4;"></div>
                </div>
                <div class="theme-check"></div>
            </div>
            <div class="theme-name">${theme.name}</div>
        </div>
    `).join('');

    overlay.innerHTML = `
        <div class="modal" style="max-width: 450px;">
            <div class="modal-header">
                <h2>Pengaturan Dashboard</h2>
                <button class="btn-close" onclick="window.closeSettingsModal()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
            <form id="settingsForm" onsubmit="window.saveSettings(event)">
                <div class="form-group">
                    <label for="scriptUrlInput">GAS Web App URL</label>
                    <input type="url" id="scriptUrlInput" placeholder="https://..." value="${scriptUrl || ''}">
                </div>

                <div class="form-group" style="margin-top: 15px;">
                    <label for="folderIdInput">Drive Folder ID (Gallery/Background)</label>
                    <input type="text" id="folderIdInput" placeholder="Enter Folder ID..." value="${driveFolderId || ''}">
                    <p style="font-size: 10px; color: var(--text-muted); margin-top: 5px;">ID ini menentukan folder penyimpanan di Google Drive.</p>
                </div>

                <div class="max-divider" style="margin: 20px 0;"></div>

                <div class="form-group">
                    <label>Dashboard Background</label>
                    <div style="margin-top: 10px; display: flex; flex-direction: column; gap: 8px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px; padding: 10px; background: rgba(0,255,170,0.05); border-radius: 8px; border: 1px solid rgba(0,255,170,0.1);">
                            <input type="checkbox" id="disableBgToggle" style="width: 18px; height: 18px; cursor: pointer;" 
                                   ${localStorage.getItem('disable_bg') === 'true' ? 'checked' : ''}
                                   onchange="window.toggleBgMode(this.checked)">
                            <label for="disableBgToggle" style="margin: 0; cursor: pointer; font-size: 12px; color: var(--primary);">TANPA BACKGROUND (MODE GELAP MURNI)</label>
                        </div>

                        <input type="url" id="bgUrlManualInput" placeholder="Direct Image URL (Optional)" 
                               style="font-size: 11px;" onchange="window.updateDashboardBackground(this.value)">
                        
                        <div id="bgPreview" style="width: 100%; height: 60px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-dark) center/cover; display: none; align-items: center; justify-content: center; font-size: 10px; color: var(--text-muted);">
                            PREVIEW
                        </div>

                        <div style="display: flex; gap: 10px; align-items: center;">
                            <div style="height: 1px; flex: 1; background: rgba(0,255,170,0.1);"></div>
                            <span style="font-size: 10px; color: var(--text-muted);">ATAU UPLOAD</span>
                            <div style="height: 1px; flex: 1; background: rgba(0,255,170,0.1);"></div>
                        </div>

                        <div style="display: flex; gap: 10px;">
                            <input type="file" id="bgUploadInput" style="display: none;" accept="image/*" onchange="window.handleBackgroundUpload(this)">
                            <button type="button" class="btn btn-secondary" style="flex: 1; font-size: 11px;" 
                                    onclick="document.getElementById('bgUploadInput').click()">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 5px;">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                                </svg>
                                UPLOAD FILE
                            </button>
                            <button type="button" class="btn btn-icon delete" style="width: 40px; height: 40px;" onclick="window.updateDashboardBackground('')" title="Reset Background">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="theme-section">
                    <label>Dashboard Themes</label>
                    <div class="theme-grid">
                        ${themesHTML}
                    </div>
                </div>

                <div class="form-actions" style="margin-top: 30px; display: flex; flex-direction: column; gap: 10px;">
                    <button type="button" id="fixPermissionBtn" class="btn btn-accent" style="display: none; width: 100%; font-size: 11px; padding: 10px;" 
                            onclick="window.open(scriptUrl + '?action=authorize', '_blank')">
                        PERBAIKI IZIN GOOGLE (Klik & Allow)
                    </button>
                    <div style="display: flex; gap: 10px; width: 100%;">
                        <button type="button" class="btn btn-secondary" style="flex: 1;" onclick="window.closeSettingsModal()">Batal</button>
                        <button type="submit" class="btn btn-primary" style="flex: 1;">Simpan (URL)</button>
                    </div>
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
    const folderInput = document.getElementById('folderIdInput');

    if (urlInput) {
        scriptUrl = urlInput.value.trim();
        localStorage.setItem(SCRIPT_URL_KEY, scriptUrl);
        useGoogleSheets = !!scriptUrl;
    }

    if (folderInput) {
        driveFolderId = folderInput.value.trim() || DEFAULT_FOLDER_ID;
        localStorage.setItem(FOLDER_ID_KEY, driveFolderId);
    }

    closeSettingsModal();
    showToast('Pengaturan berhasil disimpan!', 'success');

    if (useGoogleSheets && scriptUrl) {
        console.log('Connecting to Google Sheets:', scriptUrl);
        preloadDashboardData(true);
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

    // Apply background mode
    const isBgDisabled = localStorage.getItem('disable_bg') === 'true';
    if (isBgDisabled) {
        document.body.classList.add('no-bg-mode');
    }

    loadBackground(); // Load persisted background

    // FORCE UPDATE: Migrate old unauthorized URL to new authorized one
    const OLD_SCRIPT_URL_1 = 'https://script.google.com/macros/s/AKfycbyRTnpTClBx8tjngwk6FoB0SKT0dSGev7NS1tInV_9CYIf_UrHGA6QrSP4xG6nVPcSoaw/exec';
    const OLD_SCRIPT_URL_2 = 'https://script.google.com/macros/s/AKfycbwUCs3WKo-O2KspiExnWx5kQIBXhDD9CiqT8_1r93QFTIE963YTMJ3gnfQWAcutnTRQZA/exec';
    const OLD_SCRIPT_URL_3 = 'https://script.google.com/macros/s/AKfycbxvMsS40m0T8-GLkFE3Cw76cpkOJv_O_XhTOLLWn3Z1qRdzUrpw9T8XmD_e_JnHOy60/exec';
    const CURRENT_URL = 'https://script.google.com/macros/s/AKfycbw2pGpYeusit_AWc_bzNhNUmWjJ1dZSl_M8TZOLhrrGaG6SvBGTQaTLpmYt81X6zCAS/exec';

    let storedUrl = localStorage.getItem(SCRIPT_URL_KEY);
    if (!storedUrl || storedUrl === OLD_SCRIPT_URL_1 || storedUrl === OLD_SCRIPT_URL_2 || storedUrl === OLD_SCRIPT_URL_3) {
        localStorage.setItem(SCRIPT_URL_KEY, CURRENT_URL);
        storedUrl = CURRENT_URL;
    }

    if (storedUrl) scriptUrl = storedUrl;
    useGoogleSheets = !!scriptUrl;

    const savedSection = localStorage.getItem('activeSection') || 'notes';
    switchSection(savedSection);
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
        preloadDashboardData();
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
window.testGASConnection = testGASConnection;
window.preloadDashboardData = preloadDashboardData;

window.toggleBgMode = function (enabled) {
    if (enabled) {
        document.body.classList.add('no-bg-mode');
        localStorage.setItem('disable_bg', 'true');
    } else {
        document.body.classList.remove('no-bg-mode');
        localStorage.setItem('disable_bg', 'false');
    }
};

window.toggleMistakeLedger = function () {
    const cards = document.getElementById('mistakeDetailedCards');
    const btn = document.getElementById('btnToggleMistakeLedger');
    if (!cards || !btn) return;

    if (cards.style.display === 'none') {
        cards.style.display = 'grid';
        btn.textContent = 'SEMBUNYIKAN DETAIL';
        localStorage.setItem('mistake_ledger_visible', 'true');
    } else {
        cards.style.display = 'none';
        btn.textContent = 'TAMPILKAN DETAIL';
        localStorage.setItem('mistake_ledger_visible', 'false');
    }
};

window.toggleMistakeDetails = function (id, btn) {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.style.display === 'none') {
        el.style.display = 'flex';
        if (btn) btn.innerHTML = 'SEMBUNYIKAN KESALAHAN';
    } else {
        el.style.display = 'none';
        if (btn) btn.innerHTML = 'LIHAT KESALAHAN';
    }
};

window.handleBackgroundUpload = async function (input) {
    if (!input.files || !input.files[0]) return;
    if (!useGoogleSheets || !scriptUrl) {
        showToast('Aktifkan script URL terlebih dahulu', 'error');
        return;
    }

    const file = input.files[0];

    showToast('Mengompres Gambar...', 'loading', 0);

    try {
        const compressedBase64 = await compressImage(file, 1200, 0.7); // Resize to max 1200px, 70% quality
        showToast('Mengupload Baground...', 'loading', 0);

        const uploadRes = await fetchFromGoogleSheets('uploadImage', {
            base64: compressedBase64.split(',')[1],
            filename: 'bg_' + Date.now() + '.jpg',
            folderId: driveFolderId
        }, 'POST');

        if (uploadRes && uploadRes.url) {
            // Convert to a more reliable proxy URL if it's a Drive link
            let finalUrl = uploadRes.url;
            if (finalUrl.includes('drive.google.com')) {
                const fileIdMatch = finalUrl.match(/id=([^&]+)/);
                if (fileIdMatch) {
                    finalUrl = `https://lh3.googleusercontent.com/u/0/d/${fileIdMatch[1]}`;
                }
            }

            console.log("Upload success, updating background URL:", finalUrl);
            await window.updateDashboardBackground(finalUrl);
            showToast('Background berhasil diperbarui!', 'success');
        } else {
            console.error("Upload failed:", uploadRes);
            const errorMsg = uploadRes?.error || 'Gagal upload gambar (Server Error)';
            showToast(errorMsg, 'error');

            if (errorMsg.toLowerCase().includes('permission') || errorMsg.toLowerCase().includes('drive')) {
                const btn = document.getElementById('fixPermissionBtn');
                if (btn) btn.style.display = 'block';
            }
        }
    } catch (err) {
        console.error("Upload error:", err);
        showToast('Error: ' + err.message, 'error');
    }
};

async function compressImage(file, maxWidth, quality) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = (err) => reject(new Error('Gagal memuat gambar untuk kompresi'));
        };
        reader.onerror = (err) => reject(new Error('Gagal membaca file'));
    });
}

window.updateDashboardBackground = async function (url) {
    const previewEl = document.getElementById('bgPreview');

    // 1. Update UI Immediately with FORCE
    if (url) {
        let finalUrl = url;
        // Ensure direct image link
        if (finalUrl.includes('drive.google.com/uc')) {
            const id = new URL(finalUrl).searchParams.get('id');
            finalUrl = `https://lh3.googleusercontent.com/u/0/d/${id}`;
        }

        const bgValue = `linear-gradient(rgba(0, 15, 15, 0.7), rgba(0, 15, 15, 0.7)), url('${finalUrl}'), radial-gradient(circle at 20% 30%, rgba(0, 255, 170, 0.05) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(0, 229, 255, 0.05) 0%, transparent 40%)`;

        document.body.style.setProperty('background-image', bgValue, 'important');
        document.body.style.setProperty('background-size', 'cover, cover, auto, auto', 'important');
        document.body.style.setProperty('background-attachment', 'fixed', 'important');

        if (previewEl) {
            previewEl.style.display = 'flex';
            previewEl.style.backgroundImage = `url('${finalUrl}')`;
        }
    } else {
        document.body.style.backgroundImage = '';
        if (previewEl) previewEl.style.display = 'none';
    }

    // 2. Persist to Cloud
    if (useGoogleSheets && scriptUrl) {
        try {
            await fetchFromGoogleSheets('updateBackground', { url: url || "" }, 'POST');
        } catch (e) {
            console.error('Failed to persist background:', e);
        }
    }
};

async function loadBackground() {
    if (useGoogleSheets && scriptUrl) {
        try {
            const res = await fetchFromGoogleSheets('getBackground');
            if (res && res.url) {
                await window.updateDashboardBackground(res.url);
            }
        } catch (e) {
            console.log('Using default background');
        }
    }
}

document.addEventListener('DOMContentLoaded', init);

// --- WD MANUAL LOGIC ---
let extractedWdData = [];

function extractWdData(silent = false) {
    const input = document.getElementById('wdInput');
    if (!input || !input.value.trim()) {
        if (!silent) showToast('Please paste some data first', 'error');
        return;
    }

    const rawText = input.value;

    let wdData = [];

    const lines = rawText.trim().split(/\r?\n/);
    let currentBlock = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/^\d+\s+\S+/.test(line.trim()) && lines[i + 1] && lines[i + 1].includes("Withdraw")) {
            if (currentBlock.length > 0) {
                processBlock(currentBlock, wdData);
            }
            currentBlock = [line];
        } else {
            currentBlock.push(line);
        }
    }

    if (currentBlock.length > 0) {
        processBlock(currentBlock, wdData);
    }

    function processBlock(linesBlock, wdDataArray) {
        if (linesBlock.length < 2) return;

        let username = "USER";
        let amount = "0";
        let bank = "BANK";
        let accNum = "0";
        let fullName = "NAMA";

        const firstLineParts = linesBlock[0].trim().split(/\s+/);
        if (firstLineParts.length >= 2) {
            username = firstLineParts[firstLineParts.length - 1];
        } else if (firstLineParts.length === 1 && !/^\d+$/.test(firstLineParts[0])) {
            username = firstLineParts[0];
        }

        const fullBlockStr = linesBlock.join('\n');

        const wdMatch = fullBlockStr.match(/Withdraw\s+[\d\-]+\s+[\d:]+\s+([\d,]+)/i);
        if (wdMatch) amount = wdMatch[1];

        const toMatch = fullBlockStr.match(/To\s*:\s*([^,]+),\s*(\d+),\s*(.*?)(?=\s*-?\s*Auto|$|\n)/i);
        if (toMatch) {
            bank = toMatch[1].trim();
            accNum = toMatch[2].trim();
            fullName = toMatch[3].replace(/-\s*$/, '').trim();
        } else {
            const fallbackAcc = fullBlockStr.match(/\b(\d{10,16})\b/);
            if (fallbackAcc) accNum = fallbackAcc[1];

            const fallbackAmt = fullBlockStr.match(/Withdraw.*?([\d,]{4,})/i) || fullBlockStr.match(/([\d\.,]{4,})/);
            if (fallbackAmt) amount = fallbackAmt[1];
        }

        if (bank !== "BANK" || accNum !== "0" || amount !== "0") {
            wdDataArray.push({ bank, accNum, username, fullName, amount });
        }
    }

    if (wdData.length > 0) {
        extractedWdData = wdData;
        renderWdResults();
        if (!silent) showToast(`Successfully extracted ${wdData.length} records!`, 'success');
    } else {
        if (!silent) showToast('No valid withdrawal data found', 'warning');
    }
}

function renderWdResults() {
    const tableBody = document.getElementById('wdTableBody');
    const countEl = document.getElementById('wdCount');

    if (!tableBody || !countEl) return;

    countEl.textContent = extractedWdData.length;

    if (extractedWdData.length === 0) {
        tableBody.innerHTML = `
            <tr id="wdEmptyPlaceholder">
                <td colspan="5" style="text-align: center; padding: 40px; color: rgba(0, 255, 204, 0.4); font-size: 14px; font-weight: 600; font-family: 'Orbitron', sans-serif;">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 15px; opacity: 0.5; display: block; margin-left: auto; margin-right: auto;"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
                    BELUM ADA DATA DIEKSTRAK
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = extractedWdData.map((wd, index) => `
        <tr class="${index % 2 === 0 ? 'alt-blue' : 'alt-red'}">
            <td><span class="wd-bank-badge">${wd.bank}</span></td>
            <td><code style="color:var(--accent)">${wd.accNum}</code></td>
            <td>${wd.username}</td>
            <td style="font-weight:600">${wd.fullName}</td>
            <td><span class="wd-amount-val">${wd.amount}</span></td>
        </tr>
    `).join('');
}

function resetWdData() {
    const input = document.getElementById('wdInput');
    if (input) input.value = '';

    extractedWdData = [];
    renderWdResults();
    showToast('Data cleared', 'info');
}

function copyWdToSheet() {
    if (extractedWdData.length === 0) return;
    const rows = extractedWdData.map(wd =>
        `${wd.bank}\t${wd.accNum}\t${wd.username}\t${wd.fullName}\t${wd.amount.replace(/,/g, '')}`
    ).join('\r\n');

    navigator.clipboard.writeText(rows).then(() => {
        showToast('Data copied to clipboard', 'success');
    });
}

function downloadWdCSV() {
    if (extractedWdData.length === 0) return;
    const header = "BANK,NOMOR REKENING,USERNAME,NAMA LENGKAP,NOMINAL\n";
    const csvRows = extractedWdData.map(wd =>
        `"${wd.bank}","${wd.accNum}","${wd.username}","${wd.fullName}","${wd.amount.replace(/,/g, '')}"`
    ).join('\n');
    const blob = new Blob([header + csvRows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `WD_EXPORT_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    showToast('CSV file downloaded', 'success');
}

// Global exposure
window.extractDepoBca = extractDepoBca;
window.resetDepoBca = resetDepoBca;
window.copyDepoBcaToSheet = copyDepoBcaToSheet;

// --- DEPO MYBCA LOGIC ---
let extractedDepoMybcaData = [];

function extractDepoMybca(silent = false) {
    const input = document.getElementById('depoMybcaInput');
    if (!input || !input.value.trim()) {
        if (!silent) showToast('Please paste some data first', 'error');
        return;
    }

    const rawLines = input.value.trim().split(/\r?\n/);
    const lines = rawLines.map(l => l.trim()).filter(l => l !== '');
    let bcaData = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Check for Tab format: Desc [TAB] IDR Amount [TAB] IDR Balance
        if (line.includes('\t')) {
            const parts = line.split('\t');
            if (parts.length >= 2) {
                let descRaw = parts[0];
                let amountRaw = parts[1];

                let type = descRaw.includes(' CR ') || descRaw.includes('CR -') ? "MASUK" :
                    (descRaw.includes(' DB ') || descRaw.includes('DB -') ? "KELUAR" : "MASUK");

                // Clean amount: "IDR 2,000,000.00" -> "2,000,000.00"
                let amount = amountRaw.replace(/IDR\s*/i, '').trim();

                // Clean description
                let cleanDesc = descRaw;

                // 1. Remove prefixes
                cleanDesc = cleanDesc.replace(/^(?:BI-FAST|TRSF E-BANKING|TRSF)\s+(?:CR|DB)\s+-\s+/i, '');

                // 2. Remove "TRANSFER DR 002 " or "TRANSFER KE 123 "
                cleanDesc = cleanDesc.replace(/^TRANSFER\s+(?:DR|KE)\s+(?:\d{3}\s+)?/i, '');

                // 3. Remove complex reference codes like "1104/FTSCY/WS95031 400000.00 "
                cleanDesc = cleanDesc.replace(/\d{4}\/[A-Z0-9-]+\/[A-Z0-9-]+\s+\d+\.\d{2}\s*/i, '');

                // 4. Remove date/serial codes like "04/11 ZN8U1 "
                cleanDesc = cleanDesc.replace(/\d{2}\/\d{2}\s+[A-Z0-9]{5}\s*/i, '');

                // 5. Extract name from TRFDN format
                if (cleanDesc.includes('TRFDN-')) {
                    const trfdn = cleanDesc.match(/TRFDN-(.*?)(?:\s+ESPAY|\s+DEBIT|\s*$)/i);
                    if (trfdn) cleanDesc = trfdn[1];
                }

                // 6. Final cleanup: Remove IDR, BCA, MyBCA, dates, and extra spaces
                cleanDesc = cleanDesc.replace(/\b(?:MyBCA|BCA|IDR|PEND)\b/ig, '');
                cleanDesc = cleanDesc.replace(/\s+/g, ' ').trim();

                if (amount && /^[\d,]+\.\d{2}$/.test(amount)) {
                    bcaData.push({ type, desc: cleanDesc, amount });
                    continue;
                }
            }
        }

        // Fallback for multi-line block format (same as KlikBCA)
        if (line === "DB" || line === "CR") {
            if (i >= 1 && /^[\d,]+\.\d{2}$/.test(lines[i - 1])) {
                let type = line === "CR" ? "MASUK" : "KELUAR";
                let amount = lines[i - 1];
                let descLine = "";

                if (i >= 2) {
                    descLine = lines[i - 2];
                    if ((descLine === "0000" || /^\d+$/.test(descLine)) && i >= 3) {
                        descLine = lines[i - 3];
                    }
                }

                let cleanDesc = descLine;
                const trfMatch = descLine.match(/(?:TRANSFER KE|TRANSFER DR|TRSF E-BANKING DB|TRSF E-BANKING CR)\s+(?:\d+\s+)?(.*)/i);
                if (trfMatch) cleanDesc = trfMatch[1];

                cleanDesc = cleanDesc.replace(/TANGGAL\s*:\s*\d{2}\/\d{2}\s*/i, '');
                cleanDesc = cleanDesc.replace(/\b(?:MyBCA|BCA)\b/ig, '').trim();
                if (!cleanDesc) cleanDesc = "TANPA KETERANGAN";

                bcaData.push({ type, desc: cleanDesc, amount });
            }
        }
    }

    if (bcaData.length > 0) {
        extractedDepoMybcaData = bcaData;
        renderDepoMybcaResults();
        if (!silent) showToast(`Successfully extracted ${bcaData.length} records!`, 'success');
    } else {
        if (!silent) showToast('No valid MyBCA data found', 'warning');
    }
}

function renderDepoMybcaResults() {
    const tableBody = document.getElementById('depoMybcaTableBody');
    const countEl = document.getElementById('depoMybcaCount');
    if (!tableBody || !countEl) return;

    countEl.textContent = extractedDepoMybcaData.length;

    if (extractedDepoMybcaData.length === 0) {
        tableBody.innerHTML = `
            <tr id="depoMybcaEmptyPlaceholder">
                <td colspan="2" style="text-align: center; padding: 40px; color: rgba(0, 255, 204, 0.4); font-size: 14px; font-weight: 600; font-family: 'Orbitron', sans-serif;">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 15px; opacity: 0.5; display: block; margin-left: auto; margin-right: auto;"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
                    BELUM ADA DATA DIEKSTRAK
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = extractedDepoMybcaData.map((bca, index) => {
        const cleanAmount = bca.amount.replace(/\.00$/, '');
        // For MyBCA focus on Dana Masuk, we show the amount here if it's MASUK
        let displayAmount = bca.type === 'MASUK' ? cleanAmount : '-';
        return `
            <tr class="${index % 2 === 0 ? 'alt-blue' : 'alt-red'}">
                <td style="font-weight:600; text-align: left;">${bca.desc}</td>
                <td style="text-align: center;">
                    <span class="wd-bank-badge" style="background:rgba(0, 200, 83, 0.2); color:#00e676; border-color: rgba(0, 200, 83, 0.4);">${displayAmount}</span>
                </td>
            </tr>
        `;
    }).join('');
}

function resetDepoMybca() {
    const input = document.getElementById('depoMybcaInput');
    if (input) input.value = '';
    extractedDepoMybcaData = [];
    renderDepoMybcaResults();
    showToast('Data cleared', 'info');
}

function copyDepoMybcaToSheet() {
    if (extractedDepoMybcaData.length === 0) return;
    const rows = extractedDepoMybcaData.map(bca => {
        let cleanAmount = bca.amount.replace(/,/g, '').replace(/\.00$/, '');
        // Only value if MASUK, else empty
        let val = bca.type === 'MASUK' ? cleanAmount : '';
        return `${bca.desc}\t${val}`;
    }).join('\r\n');
    navigator.clipboard.writeText(rows).then(() => {
        showToast('Data copied to clipboard', 'success');
    });
}

window.extractDepoMybca = extractDepoMybca;
window.resetDepoMybca = resetDepoMybca;
window.copyDepoMybcaToSheet = copyDepoMybcaToSheet;
window.downloadWdCSV = downloadWdCSV;

// --- WD POWER LOGIC ---
let extractedWdPowerData = [];

function extractWdPowerData(silent = false) {
    const input = document.getElementById('wdPowerInput');
    if (!input || !input.value.trim()) {
        if (!silent) showToast('Please paste some data first', 'error');
        return;
    }

    const lines = input.value.trim().split(/\r?\n/);
    let wdData = [];

    lines.forEach(line => {
        if (!line.trim()) return;
        const match = line.match(/^(.+?)\s+(\d{10,16})\s+(.+?)\s+([\d,\.]+)\s+\S+\s+(.+)$/);

        let bank = "BANK", accNum = "0", username = "USER", fullName = "NAMA", amount = "0";

        if (match) {
            username = match[1].trim();
            accNum = match[2].trim();
            fullName = match[3].trim();
            amount = match[4].trim().replace(/\.00$/, '');
            bank = match[5].trim().toUpperCase();
        } else {
            // simpler fallback for tabs
            const parts = line.split(/\t+/);
            if (parts.length >= 6) {
                username = parts[0].trim();
                accNum = parts[1].trim();
                fullName = parts[2].trim();
                amount = parts[3].trim().replace(/\.00$/, '');
                bank = parts[5].trim().toUpperCase();
            }
        }

        if (accNum !== "0") wdData.push({ bank, accNum, username, fullName, amount });
    });

    if (wdData.length > 0) {
        extractedWdPowerData = wdData;
        renderWdPowerResults();
        if (!silent) showToast(`Successfully extracted ${wdData.length} records!`, 'success');
    } else {
        if (!silent) showToast('No valid power withdrawal data found', 'warning');
    }
}

function renderWdPowerResults() {
    const tableBody = document.getElementById('wdPowerTableBody');
    const countEl = document.getElementById('wdPowerCount');

    if (!tableBody || !countEl) return;

    countEl.textContent = extractedWdPowerData.length;

    if (extractedWdPowerData.length === 0) {
        tableBody.innerHTML = `
            <tr id="wdPowerEmptyPlaceholder">
                <td colspan="5" style="text-align: center; padding: 40px; color: rgba(0, 255, 204, 0.4); font-size: 14px; font-weight: 600; font-family: 'Orbitron', sans-serif;">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 15px; opacity: 0.5; display: block; margin-left: auto; margin-right: auto;"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
                    BELUM ADA DATA DIEKSTRAK
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = extractedWdPowerData.map((wd, index) => `
        <tr class="${index % 2 === 0 ? 'alt-blue' : 'alt-red'}">
            <td><span class="wd-bank-badge">${wd.bank}</span></td>
            <td><code style="color:var(--accent)">${wd.accNum}</code></td>
            <td>${wd.username}</td>
            <td style="font-weight:600">${wd.fullName}</td>
            <td><span class="wd-amount-val">${wd.amount}</span></td>
        </tr>
    `).join('');
}

function resetWdPowerData() {
    const input = document.getElementById('wdPowerInput');
    if (input) input.value = '';

    extractedWdPowerData = [];
    renderWdPowerResults();
    showToast('Data cleared', 'info');
}

function copyWdPowerToSheet() {
    if (extractedWdPowerData.length === 0) return;
    const rows = extractedWdPowerData.map(wd =>
        `${wd.bank}\t${wd.accNum}\t${wd.username}\t${wd.fullName}\t${wd.amount.replace(/,/g, '')}`
    ).join('\r\n');

    navigator.clipboard.writeText(rows).then(() => {
        showToast('Data copied to clipboard', 'success');
    });
}

window.extractWdPowerData = extractWdPowerData;
window.resetWdPowerData = resetWdPowerData;
window.copyWdPowerToSheet = copyWdPowerToSheet;

// --- DEPO KLIK BCA LOGIC ---
let extractedDepoBcaData = [];

function extractDepoBca(silent = false) {
    const input = document.getElementById('depoBcaInput');
    if (!input || !input.value.trim()) {
        if (!silent) showToast('Please paste some data first', 'error');
        return;
    }

    const rawLines = input.value.trim().split(/\r?\n/);
    // remove completely empty lines so consecutive lines are meaningful
    const lines = rawLines.map(l => l.trim()).filter(l => l !== '');
    let bcaData = [];

    // Scan backwards from DB or CR line to find amount and description safely
    for (let i = 0; i < lines.length; i++) {
        if (lines[i] === "DB" || lines[i] === "CR") {
            // Check if prior line is an exact amount e.g. "40,000,000.00"
            if (i >= 1 && /^[\d,]+\.\d{2}$/.test(lines[i - 1])) {
                let type = lines[i] === "CR" ? "MASUK" : "KELUAR";
                let amount = lines[i - 1];
                let descLine = "";

                // Description should be before the amount (or before the 0000 reference)
                if (i >= 2) {
                    descLine = lines[i - 2];
                    if ((descLine === "0000" || /^\d+$/.test(descLine)) && i >= 3) {
                        descLine = lines[i - 3];
                    }
                }

                // Cleanup description
                let cleanDesc = descLine;
                const trfMatch = descLine.match(/(?:TRANSFER KE|TRANSFER DR|TRSF E-BANKING DB|TRSF E-BANKING CR)\s+(?:\d+\s+)?(.*)/i);
                if (trfMatch) {
                    cleanDesc = trfMatch[1];
                }
                // generic cleanups
                cleanDesc = cleanDesc.replace(/TANGGAL\s*:\s*\d{2}\/\d{2}\s*/i, '');
                cleanDesc = cleanDesc.replace(/\b(?:MyBCA|BCA)\b/ig, '').trim();

                if (!cleanDesc) cleanDesc = "TANPA KETERANGAN";

                bcaData.push({ type, desc: cleanDesc, amount });
            }
        }
    }

    if (bcaData.length > 0) {
        extractedDepoBcaData = bcaData;
        renderDepoBcaResults();
        if (!silent) showToast(`Successfully extracted ${bcaData.length} records!`, 'success');
    } else {
        if (!silent) showToast('No valid BCA mutation data found', 'warning');
    }
}

function renderDepoBcaResults() {
    const tableBody = document.getElementById('depoBcaTableBody');
    const countEl = document.getElementById('depoBcaCount');

    if (!tableBody || !countEl) return;

    countEl.textContent = extractedDepoBcaData.length;

    if (extractedDepoBcaData.length === 0) {
        tableBody.innerHTML = `
            <tr id="depoBcaEmptyPlaceholder">
                <td colspan="3" style="text-align: center; padding: 40px; color: rgba(0, 255, 204, 0.4); font-size: 14px; font-weight: 600; font-family: 'Orbitron', sans-serif;">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 15px; opacity: 0.5; display: block; margin-left: auto; margin-right: auto;"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
                    BELUM ADA DATA DIEKSTRAK
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = extractedDepoBcaData.map((bca, index) => {
        const cleanAmount = bca.amount.replace(/\.00$/, '');
        let masukCol = '-';
        let keluarCol = '-';
        if (bca.type === 'MASUK') {
            masukCol = `<span class="wd-bank-badge" style="background:rgba(0, 200, 83, 0.2); color:#00e676; border-color: rgba(0, 200, 83, 0.4);">${cleanAmount}</span>`;
        } else if (bca.type === 'KELUAR') {
            keluarCol = `<span class="wd-bank-badge" style="background:rgba(255, 61, 113, 0.2); color:#ff3d71; border-color: rgba(255, 61, 113, 0.4);">${cleanAmount}</span>`;
        }
        return `
            <tr class="${index % 2 === 0 ? 'alt-blue' : 'alt-red'}">
                <td style="font-weight:600; text-align: left;">${bca.desc}</td>
                <td style="text-align: center;">${masukCol}</td>
                <td style="text-align: center;">${keluarCol}</td>
            </tr>
        `;
    }).join('');
}

function resetDepoBca() {
    const input = document.getElementById('depoBcaInput');
    if (input) input.value = '';

    extractedDepoBcaData = [];
    renderDepoBcaResults();
    showToast('Data cleared', 'info');
}

function copyDepoBcaToSheet() {
    if (extractedDepoBcaData.length === 0) return;
    const rows = extractedDepoBcaData.map(bca => {
        let cleanAmount = bca.amount.replace(/,/g, '').replace(/\.00$/, '');
        let masukVal = bca.type === 'MASUK' ? cleanAmount : '';
        let keluarVal = bca.type === 'KELUAR' ? cleanAmount : '';
        return `${bca.desc}\t${masukVal}\t${keluarVal}`;
    }).join('\r\n');

    navigator.clipboard.writeText(rows).then(() => {
        showToast('Data copied to clipboard', 'success');
    });
}

// --- BUY SPIN CALCULATOR LOGIC ---
let currentSlotMult = 100;

function setSlotMult(mult, btn) {
    currentSlotMult = mult;

    // Update active UI
    const buttons = document.querySelectorAll('.btn-mult');
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    updateSlotCalc();
}

function updateSlotCalc() {
    const betInput = document.getElementById('calcBet');
    if (!betInput) return;

    const bet = parseFloat(betInput.value) || 0;
    const cost = bet * currentSlotMult;

    // Formatting IDR
    const fmt = (num) => new Intl.NumberFormat('en-US').format(num);

    const resBuyCost = document.getElementById('resBuyCost');
    const resWin2x = document.getElementById('resWin2x');
    const resWin5x = document.getElementById('resWin5x');
    const resBreakEven = document.getElementById('resBreakEven');

    if (resBuyCost) resBuyCost.textContent = fmt(cost);
    if (resWin2x) resWin2x.textContent = fmt(cost * 2);
    if (resWin5x) resWin5x.textContent = fmt(cost * 5);
    if (resBreakEven) resBreakEven.textContent = fmt(cost);
}

function rekapSpinLog(silent = false) {
    const input = document.getElementById('spinLogInput');
    if (!input || !input.value.trim()) {
        if (!silent) showToast('Please paste log data first', 'error');
        return;
    }

    const lines = input.value.split(/\r?\n/).map(l => l.trim());
    let total = 0;

    for (let i = 0; i < lines.length; i++) {
        // Find "Free Spin" line
        if (lines[i].toLowerCase().includes('free spin:')) {
            // Check the next line for IDR
            if (i + 1 < lines.length && lines[i + 1].toUpperCase().startsWith('IDR')) {
                const valStr = lines[i + 1].replace(/IDR\s*/i, '').replace(/\./g, '').replace(/,/g, '.');
                const val = parseFloat(valStr) || 0;
                total += val;
            }
        }
    }

    // Multiply by 1000 and format
    const finalTotal = total * 1000;
    const fmt = new Intl.NumberFormat('en-US').format(finalTotal);

    const resultEl = document.getElementById('spinTotalResult');
    if (resultEl) {
        resultEl.textContent = fmt;
        if (!silent) showToast('Total kemenangan berhasil dihitung!', 'success');
    }
}

function updateFinalClaim() {
    const winInput = document.getElementById('manualWinInput');
    const awardInput = document.getElementById('manualAwardInput');
    const alreadyClaimedInput = document.getElementById('alreadyClaimedInput');

    const displayManualWin = document.getElementById('totalManualWin');
    const displayManualAward = document.getElementById('totalManualAward');
    const displayNetWin = document.getElementById('netWinResult');
    const displayQuota = document.getElementById('remainingQuotaResult');
    const warningEl = document.getElementById('claimLimitWarning');
    const autoTotalEl = document.getElementById('spinTotalResult');

    if (!winInput || !awardInput || !alreadyClaimedInput || !displayNetWin) return;

    // Helper to sum numbers from multi-line text
    const sumFromText = (text) => {
        if (!text) return 0;
        const lines = text.split(/[\n\r\s\t]+/).filter(l => l.trim() !== '');
        return lines.reduce((acc, curr) => {
            const val = parseFloat(curr.replace(/\./g, '').replace(/,/g, ''));
            return acc + (isNaN(val) ? 0 : val);
        }, 0);
    };

    let totalWin = sumFromText(winInput.value);
    let totalAward = sumFromText(awardInput.value);
    let totalAlreadyClaimed = sumFromText(alreadyClaimedInput.value);

    const netWin = totalWin - totalAward;
    const initialMaxLimit = 400000;
    const remainingQuota = initialMaxLimit - totalAlreadyClaimed;

    // Formatting IDR
    const fmt = (num) => new Intl.NumberFormat('en-US').format(num);

    // Update UI
    if (displayManualWin) displayManualWin.textContent = fmt(totalWin);
    if (displayManualAward) displayManualAward.textContent = fmt(totalAward);
    displayNetWin.textContent = fmt(netWin);

    // Explicit Remaining Quota (This shows the 125,600 result you expect)
    if (displayQuota) displayQuota.textContent = fmt(Math.max(0, remainingQuota));

    // Warning visibility (show if Net Win exceeds quota OR quota is already negative)
    if ((netWin > 0 && netWin > remainingQuota) || remainingQuota <= 0) {
        if (warningEl.style.display === 'none') {
            showToast('⚠️ Limit klaim harian terlampaui!', 'warning');
        }
        warningEl.style.display = 'block';
    } else {
        warningEl.style.display = 'none';
    }
}

window.rekapSpinLog = rekapSpinLog;
window.updateFinalClaim = updateFinalClaim;
window.setSlotMult = setSlotMult;
window.updateSlotCalc = updateSlotCalc;
window.clearTextarea = function (id) {
    const el = document.getElementById(id);
    if (el) {
        el.value = '';
        updateFinalClaim();
        if (id === 'spinLogInput') {
            const resultEl = document.getElementById('spinTotalResult');
            if (resultEl) resultEl.textContent = '0';
        }
    }
};

// --- GALLERY MANAGEMENT FUNCTIONS ---
function loadGalleryData() {
    const stored = localStorage.getItem(GALLERY_DATA_KEY);
    galleryData = stored ? JSON.parse(stored) : INITIAL_GALLERY;
}

function saveGalleryData() {
    localStorage.setItem(GALLERY_DATA_KEY, JSON.stringify(galleryData));
}

async function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    if (useGoogleSheets && scriptUrl) {
        try {
            const result = await fetchFromGoogleSheets('listFiles', {
                folderId: driveFolderId,
                type: 'gallery'
            });
            if (result && Array.isArray(result)) {
                if (result.length === 0) {
                    grid.innerHTML = '<p style="color: #fff; grid-column: 1/-1; text-align: center;">Gallery kosong.</p>';
                    return;
                }
                grid.innerHTML = result.map((item, index) => {
                    const thumbUrl = `https://drive.google.com/thumbnail?id=${item.id}&sz=w800`;
                    const fullUrl = `https://drive.google.com/uc?id=${item.id}`;

                    return `
                        <div class="gallery-item" ondblclick="window.openGalleryLightbox('${fullUrl}', '${item.id}', 'drive')">
                            <img src="${thumbUrl}" alt="${item.name}">
                            <div class="gallery-actions-overlay">
                                <button class="btn-gallery-action download" onclick="window.downloadGalleryImage('${fullUrl}', 'drive')" title="Unduh">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                </button>
                                <button class="btn-gallery-action delete" onclick="window.deleteGalleryImageFromDrive('${item.id}')" title="Hapus">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');
            } else {
                const errorMsg = (result && result.error) ? result.error : 'Gagal memuat gallery.';
                grid.innerHTML = `<p style="color: #fff; grid-column: 1/-1; text-align: center;">Eror: ${errorMsg}</p>`;
            }
        } catch (error) {
            console.error('Gallery Fetch Error:', error);
            grid.innerHTML = `<p style="color: #fff; grid-column: 1/-1; text-align: center;">Eror: ${error.message}</p>`;
        }
    } else {
        // Fallback to old local/hardcoded logic if no script
        grid.innerHTML = galleryData.map((item, index) => {
            const thumbUrl = item.type === 'drive'
                ? `https://drive.google.com/thumbnail?id=${item.id}&sz=w800`
                : item.url;
            const fullUrl = item.type === 'drive'
                ? `https://drive.google.com/uc?id=${item.id}`
                : item.url;

            return `
                <div class="gallery-item" ondblclick="window.openGalleryLightbox('${fullUrl}', '${item.id}', '${item.type}')">
                    <img src="${thumbUrl}" alt="Gallery Image">
                    <div class="gallery-actions-overlay">
                        <button class="btn-gallery-action download" onclick="window.downloadGalleryImage('${fullUrl}', '${item.type}')" title="Unduh">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        </button>
                        <button class="btn-gallery-action delete" onclick="window.deleteGalleryImage(${index})" title="Hapus">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
}

window.deleteGalleryImageFromDrive = async function (fileId) {
    if (confirm('Yakin ingin menghapus foto ini dari Drive?')) {
        try {
            const result = await fetchFromGoogleSheets('deleteFile', { fileId: fileId }, 'POST');
            if (result && !result.error) {
                showToast('Foto berhasil dihapus!', 'success');
                renderGallery();
            } else {
                throw new Error(result.error || 'Gagal menghapus');
            }
        } catch (error) {
            showToast('Error: ' + error.message, 'error');
        }
    }
};

window.handleGalleryUpload = async function (input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];

        showToast('Mengompres Foto...', 'loading', 0);

        try {
            const compressedBase64 = await compressImage(file, 1600, 0.8);
            const base64Data = compressedBase64.split(',')[1];
            const filename = file.name; // Extracting filename from the file object
            const folderId = driveFolderId;

            if (useGoogleSheets && scriptUrl) {
                showToast('Menghubungkan ke Drive...', 'loading', 0);
                try {
                    const result = await fetchFromGoogleSheets('uploadImage', {
                        base64: base64Data,
                        filename: filename,
                        folderId: folderId
                    }, 'POST');

                    if (result && result.id) {
                        galleryData.unshift({
                            id: result.id,
                            type: 'drive'
                        });
                        saveGalleryData();
                        renderGallery();
                        showToast('⚡ SYSTEM: IMAGE SECURELY UPLOADED TO NEURAL CLOUD', 'success');
                    } else {
                        const errorMsg = result?.error || 'Server menolak koneksi Drive';
                        throw new Error(errorMsg);
                    }
                } catch (error) {
                    console.error('Upload Error:', error);
                    const isAuthError = error.message.toLowerCase().includes('permission') ||
                        error.message.toLowerCase().includes('drive error') ||
                        error.message.toLowerCase().includes('izin');

                    let errMsg = 'DRIVE ERROR: ' + error.message.toUpperCase();

                    showToast(errMsg, 'error', 7000);

                    if (isAuthError) {
                        const btn = document.getElementById('fixPermissionBtn');
                        if (btn) btn.style.display = 'block';
                    }

                    // Fallback to local storage
                    console.warn('Falling back to local storage due to Drive error');
                    galleryData.unshift({
                        url: compressedBase64,
                        type: 'local',
                        id: Date.now().toString()
                    });
                    saveGalleryData();
                    renderGallery();
                }
            } else {
                // No Script URL, save locally
                galleryData.unshift({
                    url: compressedBase64,
                    type: 'local',
                    id: Date.now().toString()
                });
                saveGalleryData();
                renderGallery();
            }
        } catch (error) {
            console.error('Compression/Setup Error:', error);
            showToast('Gagal memproses gambar: ' + error.message, 'error');
        }
    }
};

window.deleteGalleryImage = function (index) {
    if (confirm('Hapus foto ini dari gallery?')) {
        galleryData.splice(index, 1);
        saveGalleryData();
        renderGallery();
        showToast('Foto dihapus', 'info');
    }
};

window.openGalleryLightbox = function (url, id, type) {
    const lightbox = document.getElementById('galleryLightbox');
    const img = document.getElementById('lightboxImage');
    const dlBtn = document.getElementById('lightboxDownload');

    if (lightbox && img) {
        // Use high-resolution thumbnail for Drive images to avoid broken links/virus scan blocks
        const viewUrl = type === 'drive'
            ? `https://drive.google.com/thumbnail?id=${id}&sz=w1600`
            : url;

        img.src = viewUrl;
        lightbox.classList.add('active');

        dlBtn.onclick = () => window.downloadGalleryImage(url, type);
    }
};

window.closeGalleryLightbox = function () {
    const lightbox = document.getElementById('galleryLightbox');
    if (lightbox) lightbox.classList.remove('active');
};

window.downloadGalleryImage = function (url, type) {
    if (type === 'drive') {
        const id = url.split('id=')[1];
        window.open(`https://drive.google.com/uc?export=download&id=${id}`, '_blank');
    } else {
        const link = document.createElement('a');
        link.href = url;
        link.download = `gallery_image_${Date.now()}.png`;
        link.click();
    }
};

// Initialize Gallery on load
loadGalleryData();

// --- EXTENSIONS MANAGEMENT FUNCTIONS ---
async function renderExtensions() {
    const grid = document.getElementById('extensionGrid');
    if (!grid) return;

    if (useGoogleSheets && scriptUrl) {
        try {
            const result = await fetchFromGoogleSheets('listFiles', {
                folderId: '1QaWxbEajWCL2BBTAQLiFLERCpUEg7TTV',
                type: 'extensions'
            });
            if (result && Array.isArray(result)) {
                if (result.length === 0) {
                    grid.innerHTML = '<p style="color: #fff; grid-column: 1/-1; text-align: center;">Folder kosong.</p>';
                    return;
                }
                grid.innerHTML = result.map((file, index) => {
                    return `
                        <div class="extension-item">
                            <span class="file-label">FILE</span>
                            <div class="file-info">
                                <span class="file-name" title="${file.name}">${file.name}</span>
                                <span class="file-meta">${file.size || '0 MB'} | No Desc</span>
                            </div>
                            <div class="extension-item-actions">
                                <button class="btn-mini-action" onclick="window.downloadExtension('${file.id}')" title="Unduh">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                </button>
                                <button class="btn-mini-action" onclick="window.deleteExtension('${file.id}')" title="Hapus">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');
            } else {
                const errorMsg = (result && result.error) ? result.error : 'Gagal memuat file dari Drive.';
                grid.innerHTML = `<p style="color: #fff; grid-column: 1/-1; text-align: center;">Eror: ${errorMsg}</p>`;
            }
        } catch (error) {
            console.error('List Files Error:', error);
            grid.innerHTML = '<p style="color: #fff; grid-column: 1/-1; text-align: center;">Eror: ' + error.message + '</p>';
        }
    } else {
        grid.innerHTML = '<p style="color: #fff; grid-column: 1/-1; text-align: center;">Koneksi Google Apps Script tidak aktif.</p>';
    }
}

window.handleExtensionUpload = async function (input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();

        showToast('Mengunggah ke Cloud...', 'loading', 5000);

        reader.onload = async function (e) {
            const base64Data = e.target.result.split(',')[1];
            const folderId = '1QaWxbEajWCL2BBTAQLiFLERCpUEg7TTV'; // Folder ID Extensions

            if (useGoogleSheets && scriptUrl) {
                try {
                    const result = await fetchFromGoogleSheets('uploadImage', {
                        base64: base64Data,
                        filename: file.name,
                        folderId: folderId
                    }, 'POST');

                    if (result && result.id) {
                        showToast('💠 EXTENSION DEPLOYED: FILE SYNCED TO CLOUD STORAGE', 'success');
                        renderExtensions();
                    } else {
                        throw new Error(result.error || 'Server menolak file ini.');
                    }
                } catch (error) {
                    let errMsg = 'Gagal upload: ' + error.message;
                    if (error.message.includes('Network')) errMsg = 'Gagal: Cek koneksi internet Anda!';
                    showToast(errMsg, 'error');
                }
            } else {
                showToast('Akses ditolak: Script URL tidak valid atau belum terpasang.', 'error');
            }
        };
        reader.readAsDataURL(file);
    }
};

window.downloadExtension = function (fileId) {
    window.open(`https://drive.google.com/uc?export=download&id=${fileId}`, '_blank');
};

window.deleteExtension = async function (fileId) {
    if (confirm('Yakin ingin menghapus file ini dari Drive?')) {
        if (useGoogleSheets && scriptUrl) {
            try {
                const result = await fetchFromGoogleSheets('deleteFile', { fileId: fileId }, 'POST');
                if (result && !result.error) {
                    showToast('File berhasil dihapus dari Drive', 'success');
                    renderExtensions();
                } else {
                    throw new Error(result.error || 'Gagal menghapus');
                }
            } catch (error) {
                showToast('Error: ' + error.message, 'error');
            }
        }
    }
};




// ==========================================
// KALKULATOR MIX PARLAY LOGIC
// ==========================================
let parlayLegs = [
    { id: Date.now(), title: '', odds: 1.85, status: 'win' },
    { id: Date.now() + 1, title: '', odds: 1.95, status: 'win' },
    { id: Date.now() + 2, title: '', odds: 1.75, status: 'win' }
];

window.addParlayLeg = function () {
    parlayLegs.push({
        id: Date.now(),
        title: '',
        odds: 1.80,
        status: 'win'
    });
    renderParlayLegs();
    updateParlayResult();
};

window.removeParlayLeg = function (id) {
    if (parlayLegs.length <= 1) {
        showToast('Minimal harus ada 1 match!', 'warning');
        return;
    }
    parlayLegs = parlayLegs.filter(leg => leg.id !== id);
    renderParlayLegs();
    updateParlayResult();
};

window.setLegStatus = function (id, status) {
    const leg = parlayLegs.find(l => l.id === id);
    if (leg) {
        leg.status = status;
        renderParlayLegs();
        updateParlayResult();
    }
};

window.updateLegOdds = function (id, val) {
    const leg = parlayLegs.find(l => l.id === id);
    if (leg) {
        leg.odds = parseFloat(val) || 0;
        updateParlayResult();
    }
};

window.updateLegTitle = function (id, val) {
    const leg = parlayLegs.find(l => l.id === id);
    if (leg) leg.title = val;
};

window.renderParlayLegs = function () {
    const container = document.getElementById('parlayLegsContainer');
    if (!container) return;

    let headerHtml = `
        <div class="parlay-legs-header">
            <div class="parlay-header-label" style="text-align:center;">#</div>
            <div class="parlay-header-label">MATCH / SELECTION</div>
            <div class="parlay-header-label">ODDS</div>
            <div class="parlay-header-label" style="text-align:center;">MATCH RESULT</div>
            <div class="parlay-header-label"></div>
        </div>
    `;

    container.innerHTML = headerHtml + parlayLegs.map((leg, index) => {
        const statuses = [
            { id: 'win', label: 'WIN', class: 'win' },
            { id: 'win-half', label: 'W 1/2', class: 'win-half' },
            { id: 'draw', label: 'DRAW', class: 'draw' },
            { id: 'lose-half', label: 'L 1/2', class: 'lose-half' },
            { id: 'lose', label: 'LOSE', class: 'lose' }
        ];

        return `
        <div class="parlay-leg-row" style="animation: slideIn 0.4s ease-out ${index * 0.05}s both;">
            <div class="leg-number">${index + 1}</div>
            <div class="cyber-input-wrapper">
                <input type="text" class="wd-input mini" placeholder="Team/Match Name..." value="${leg.title}" oninput="window.updateLegTitle(${leg.id}, this.value)">
                <div class="cyber-line"></div>
            </div>
            <div class="cyber-input-wrapper">
                <input type="number" step="0.01" class="wd-input mini highlight-green" placeholder="Odds" value="${leg.odds}" oninput="window.updateLegOdds(${leg.id}, this.value)">
                <div class="cyber-line"></div>
            </div>
            <div class="leg-status-group">
                ${statuses.map(s => `
                    <button class="btn-status ${s.class} ${leg.status === s.id ? 'active' : ''}" 
                            onclick="window.setLegStatus(${leg.id}, '${s.id}')">
                        ${s.label}
                    </button>
                `).join('')}
            </div>
            <button class="btn-remove-leg" onclick="window.removeParlayLeg(${leg.id})" title="Hapus Leg">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
            </button>
        </div>
    `}).join('');
};

window.updateParlayResult = function () {
    const stakeInput = document.getElementById('parlayStakeInput');
    const totalOddsEl = document.getElementById('parlayTotalOdds');
    const payoutEl = document.getElementById('parlayPayout');
    const profitEl = document.getElementById('parlayNetProfit');

    if (!stakeInput) return;

    let stakeInputVal = stakeInput.value.replace(/,/g, '');
    let stake = parseFloat(stakeInputVal) || 0;
    let totalMultiplier = 1;
    let parlayLost = false;

    parlayLegs.forEach(leg => {
        if (parlayLost) return;

        const odds = leg.odds;
        switch (leg.status) {
            case 'win':
                totalMultiplier *= odds;
                break;
            case 'win-half':
                totalMultiplier *= ((odds - 1) / 2) + 1;
                break;
            case 'draw':
                totalMultiplier *= 1;
                break;
            case 'lose-half':
                totalMultiplier *= 0.5;
                break;
            case 'lose':
                totalMultiplier = 0;
                parlayLost = true;
                break;
        }
    });

    const payout = stake * totalMultiplier;
    const netProfit = payout - stake;

    const fmt = (num) => new Intl.NumberFormat('id-ID').format(Math.floor(num));

    if (totalOddsEl) totalOddsEl.textContent = totalMultiplier.toFixed(3);
    if (payoutEl) payoutEl.textContent = fmt(payout);
    if (profitEl) {
        profitEl.textContent = (parlayLost || netProfit <= 0) ? fmt(0) : fmt(netProfit);
        profitEl.className = (netProfit > 0 && !parlayLost) ? 'parlay-res-val success' : 'parlay-res-val error';
    }
};

window.resetParlay = function () {
    parlayLegs = [
        { id: Date.now(), title: '', odds: 1.80, status: 'win' },
        { id: Date.now() + 1, title: '', odds: 1.80, status: 'win' },
        { id: Date.now() + 2, title: '', odds: 1.80, status: 'win' }
    ];
    renderParlayLegs();
    updateParlayResult();
};

// CSS initializations
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (typeof renderParlayLegs === 'function') {
            renderParlayLegs();
            updateParlayResult();
        }
    }, 1000);
});

// ==========================================
// CEK DATA REKENING LOGIC
// ==========================================
window.processCekRekening = async function () {
    const input = document.getElementById('rekeningRawInput');
    if (!input || !input.value.trim()) {
        showToast('Teks kosong! Paste data rekening terlebih dahulu.', 'warning');
        return;
    }

    const lines = input.value.split('\n').filter(l => l.trim());
    const accountsToCheck = lines.map(line => parseRekeningRaw(line)).filter(a => a !== null);

    if (accountsToCheck.length === 0) {
        showToast('Format data tidak valid. Pastikan ada Nomor Rekening!', 'error');
        return;
    }

    document.getElementById('cekTotalCount').textContent = accountsToCheck.length;
    document.getElementById('cekSafeCount').textContent = '0';
    document.getElementById('cekDupCount').textContent = '0';
    document.getElementById('cekResultsBody').innerHTML = '<tr><td colspan="4" style="text-align:center;">Sedang memproses... <div class="spin-icon inline"></div></td></tr>';

    if (!useGoogleSheets || !scriptUrl) {
        showToast('Koneksi Google Sheets tidak aktif. Silakan hubungkan di Pengaturan.', 'error');
        return;
    }

    try {
        showToast(`Memeriksa ${accountsToCheck.length} data ke server...`, 'loading', 0);

        // Action name for GAS: checkAccountsBatch
        const response = await fetchFromGoogleSheets('checkAccountsBatch', {
            accounts: accountsToCheck.map(a => a.number)
        }, 'POST');

        if (response && response.results) {
            renderCekRekeningResults(accountsToCheck, response.results);
            showToast('Verifikasi selesai!', 'success');
        } else {
            throw new Error(response.error || 'Server tidak merespon hasil yang valid');
        }
    } catch (error) {
        console.error('Cek Rekening Error:', error);
        showToast('Gagal memproses data: ' + error.message, 'error');
        document.getElementById('cekResultsBody').innerHTML = `<tr><td colspan="4" class="error">Gagal: ${error.message}</td></tr>`;
    }
};

function parseRekeningRaw(line) {
    const cleanLine = line.trim();
    if (!cleanLine) return null;

    // Find sequences of digits, potentially separated by common delimiters like - or .
    // We look for segments that contain at least 5 digits in total.
    const potentialNumbers = cleanLine.match(/[\d\-\.]{5,}/g);
    if (!potentialNumbers) return null;

    // Find the match that contains the most digits (likely the account number)
    let bestMatchRaw = "";
    let number = "";
    let maxDigits = 0;

    potentialNumbers.forEach(m => {
        const digits = m.replace(/\D/g, '');
        if (digits.length > maxDigits) {
            maxDigits = digits.length;
            bestMatchRaw = m;
            number = digits;
        }
    });

    if (maxDigits < 5) return null;

    // Extract Bank: usually the first word
    const parts = cleanLine.split(/\s+/);
    let bank = parts[0].toUpperCase();

    // If the first word is the number itself, default bank to 'BANK'
    if (bank === bestMatchRaw || bank === number) {
        bank = "BANK";
    }

    // Extract Name: remove bank and the raw number segment from the line
    let name = cleanLine;
    // Remove the bank part if it's not the number
    if (bank !== "BANK") {
        const firstWordPattern = new RegExp('^' + parts[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        name = name.replace(firstWordPattern, '');
    } else if (parts[0] === bestMatchRaw) {
        // If the first word was the number, remove it
        name = name.replace(parts[0], '');
    }

    // Remove the raw number segment (with its delimiters)
    name = name.replace(bestMatchRaw, '');

    name = name.trim().replace(/^[\s\-\:\.\/]+|[\s\-\:\.\/]+$/g, ''); // Clean leading/trailing symbols
    if (!name) name = 'PELANGGAN';

    return { bank, name, number };
}

function renderCekRekeningResults(originalAccounts, results) {
    const body = document.getElementById('cekResultsBody');
    if (!body) return;

    let safeCount = 0;
    let dupCount = 0;

    body.innerHTML = '';

    // Urutkan: Duplikat (ketemu di sheet) diletakkan paling atas
    const sortedAccounts = [...originalAccounts].sort((a, b) => {
        const foundA = results ? results.some(r => r.accountNumber.toString() === a.number.toString() && r.found) : false;
        const foundB = results ? results.some(r => r.accountNumber.toString() === b.number.toString() && r.found) : false;
        return (foundA === foundB) ? 0 : foundA ? -1 : 1;
    });

    sortedAccounts.forEach(acc => {
        const check = results ? results.find(r => r.accountNumber.toString() === acc.number.toString()) : null;
        const isFound = check && check.found;
        const details = isFound ? check.details : null;

        if (isFound) dupCount++;
        else safeCount++;

        const tr = document.createElement('tr');
        tr.className = isFound ? 'row-duplicate' : 'row-safe';

        // Pilih data: Jika ketemu di sheet, pakai data sheet. Jika tidak, pakai data input.
        const resStatus = isFound ? `❗ ${details.status} (${details.sheet})` : 'x TIDAK ADA';
        const resBank = isFound ? details.bank : acc.bank;
        const resName = isFound ? details.name : acc.name;
        const resNumber = isFound ? details.number : acc.number;

        tr.innerHTML = `
            <td>
                <span class="status-badge ${isFound ? 'dup' : 'not-found'}">
                    ${resStatus}
                </span>
            </td>
            <td>${resBank}</td>
            <td>${resName}</td>
            <td style="display: flex; justify-content: space-between; align-items: center; padding-right: 15px;">
                <span style="font-family: Arial, sans-serif; letter-spacing: 1px;">${resNumber}</span>
                <button class="btn-mini-action" onclick="window.copyText('${resNumber}')" title="Salin Nomor" style="width: 28px; height: 28px;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                </button>
            </td>
        `;
        body.appendChild(tr);
    });

    const totalElem = document.getElementById('cekTotalCount');
    const safeElem = document.getElementById('cekSafeCount');
    const dupElem = document.getElementById('cekDupCount');

    if (totalElem) totalElem.textContent = originalAccounts.length;
    if (safeElem) safeElem.textContent = safeCount;
    if (dupElem) dupElem.textContent = dupCount;

    const copyAllBtn = document.getElementById('btnCopyAllCek');
    if (copyAllBtn) {
        copyAllBtn.style.display = originalAccounts.length > 0 ? 'flex' : 'none';
    }
}

window.copyAllCekRekening = function () {
    const table = document.getElementById('cekResultsTable');
    if (!table) return;

    const rows = table.querySelectorAll('tbody tr.row-duplicate');
    let text = [];

    rows.forEach(row => {
        const cols = row.querySelectorAll('td');
        if (cols.length >= 4) {
            let status = cols[0].innerText.trim();
            // Bersihkan info di dalam kurung (nama sheet)
            status = status.replace(/\s*\(.*?\)/g, '');

            const bank = cols[1].innerText.trim();
            const name = cols[2].innerText.trim();
            const number = cols[3].innerText.trim();

            // Format: STATUS | BANK NAMA NOMOR
            text.push(`${status} | ${bank}  ${name}  ${number}`);
        }
    });

    if (text.length > 0) {
        window.copyText(text.join('\n'));
    } else {
        if (typeof showToast === 'function') showToast("Tidak ada data duplikat untuk disalin", "info");
    }
};

// Add CSS for the status badges and row colors
const cekRekeningStyles = `
    .row-safe { background: rgba(0, 255, 136, 0.03); }
    .row-duplicate { border-left: 4px solid #ff3e3e !important; background: rgba(255, 62, 62, 0.08); }
    .status-badge { padding: 4px 10px; border-radius: 4px; font-size: 10px; font-weight: 800; display: inline-block; }
    .status-badge.safe { background: rgba(0, 255, 136, 0.2); color: #00ff88; border: 1px solid rgba(0, 255, 136, 0.3); }
    .status-badge.not-found { background: rgba(255, 62, 62, 0.9); color: #fff; border: 1px solid #ff3e3e; box-shadow: 0 0 10px rgba(255, 62, 62, 0.2); }
    .status-badge.dup { background: rgba(0, 255, 136, 0.9); color: #000; font-weight: 900; border: 1px solid #00ff88; box-shadow: 0 0 15px rgba(0, 255, 170, 0.4); }
    .cyber-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    .cyber-table th { text-align: left; padding: 15px; color: var(--primary); font-size: 11px; border-bottom: 2px solid rgba(0, 255, 170, 0.2); text-transform: uppercase; letter-spacing: 1px; }
    .cyber-table td { padding: 15px; font-size: 13px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #fff; }
    .stat-item { background: rgba(255, 255, 255, 0.03); padding: 10px 20px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05); }
    .spin-icon.inline { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.1); border-top-color: var(--primary); border-radius: 50%; animation: orbital-rotate 0.8s linear infinite; vertical-align: middle; margin-left: 10px; }
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = cekRekeningStyles;
document.head.appendChild(styleSheet);

async function renderInventarisTable() {
    const body = document.getElementById('inventarisBody');
    const searchInput = document.getElementById('inventarisSearchInput');
    if (!body) return;

    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const searchLines = query.split(/\n+/).map(s => s.trim()).filter(s => s !== '');

    body.innerHTML = '<tr><td colspan="7" style="text-align:center;">Memuat data...</td></tr>';

    try {
        const result = await fetchFromGoogleSheets('getInventaris');
        if (result && Array.isArray(result)) {
            // Filter: Abaikan baris kosong atau baris "Coming Soon"
            const validData = result.filter(row => row[1] && row[1].toString().trim() !== "" && row[1].toString().toLowerCase() !== "coming soon");

            // Filter berdasarkan pencarian
            let filteredResults = validData;
            if (searchLines.length > 0) {
                filteredResults = validData.filter(row => {
                    return searchLines.some(line => {
                        const isNumeric = /^\d+$/.test(line);

                        if (isNumeric) {
                            // Jika input adalah ANGKA MURNI, harus cocok PERSIS dengan kolom NO (index 0)
                            // Ini agar saat cari "5", tidak muncul "15", "25", atau data lain yang mengandung angka 5
                            return row[0] && row[0].toString().trim() === line;
                        } else {
                            // Jika input adalah TEKS, baru lakukan pencarian global (mengandung teks)
                            const lineMatch = row.join(' ').toLowerCase();
                            return lineMatch.includes(line);
                        }
                    });
                });
            }

            if (filteredResults.length === 0) {
                body.innerHTML = '<tr><td colspan="7" style="text-align:center;">Data tidak ditemukan.</td></tr>';
                return;
            }

            body.innerHTML = filteredResults.map(row => `
                <tr>
                    <td style="color: var(--primary); font-weight: 800; text-align: center;">${row[0] || ''}</td>
                    <td style="text-align: center;">${row[1] || '-'}</td>
                    <td style="background: rgba(0, 255, 170, 0.05); font-weight: 800; text-align: center;">${row[2] || '-'}</td>
                    <td style="text-align: center;">${row[3] || '-'}</td>
                    <td style="text-align: center;">${row[4] || '-'}</td>
                    <td style="text-align: center;">${row[5] || '-'}</td>
                    <td style="text-align: center;">${row[6] || '-'}</td>
                </tr>
            `).join('');
        } else {
            const errorMsg = result && result.error ? result.error : 'Data Kosong atau Gagal Memuat.';
            body.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#ff4d4d; padding: 40px;">${errorMsg}</td></tr>`;
        }
    } catch (e) {
        body.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#ff4d4d; padding: 40px;">Eror Koneksi: ${e.message}</td></tr>`;
    }
}

async function renderKesalahanTable() {
    const body = document.getElementById('kesalahanBody');
    const searchInput = document.getElementById('kesalahanSearchInput');
    const summaryFrame = document.getElementById('mistakeSummaryFrame');
    const summaryList = document.getElementById('mistakeStaffList');

    if (!body) return;

    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    body.innerHTML = '<tr><td colspan="10" style="text-align:center;">Memuat data...</td></tr>';

    try {
        const result = await fetchFromGoogleSheets('getKesalahan');
        if (result && Array.isArray(result)) {
            // Berdasarkan Sheet Kesalahan: index 0=NO, index 1=NAMA STAFF, index 2=NO PASPOR, index 3=JABATAN, 
            // index 4=WD, 5=DEPO, 6=SALAH PROSES, 7=SALAH SCATTER, 8=TELAT <, 9=TELAT >, 10=TOTAL

            // Skip baris kosong, baris "Coming Soon", dan baris HEADER ASLI dari sheet
            let filtered = result.filter(row => {
                const name = row[1] ? row[1].toString().trim().toLowerCase() : "";
                const passport = row[2] ? row[2].toString().trim().toLowerCase() : "";

                // Jangan tampilkan jika: kosong, kata "coming soon", atau jika ini adalah Header (teks NAMA STAFF / NO PASPOR)
                return name !== "" &&
                    name !== "coming soon" &&
                    name !== "nama staff" &&
                    passport !== "no paspor";
            });

            if (query) {
                filtered = filtered.filter(row => row[1].toString().toLowerCase().includes(query));
            }

            // Generate Summary Staff berulah
            const berulah = filtered.filter(row => {
                const total = parseInt(row[10]) || 0;
                return total > 0;
            });

            const ledgerArea = document.getElementById('mistakeLedgerArea');
            const ledgerList = document.getElementById('mistakeDetailedCards');

            if (ledgerArea && ledgerList) {
                if (berulah.length > 0) {
                    ledgerArea.style.display = 'block';

                    // Apply saved visibility state
                    const isVisible = localStorage.getItem('mistake_ledger_visible') !== 'false';
                    const btn = document.getElementById('btnToggleMistakeLedger');
                    if (isVisible) {
                        ledgerList.style.display = 'grid';
                        if (btn) btn.textContent = 'SEMBUNYIKAN DETAIL';
                    } else {
                        ledgerList.style.display = 'none';
                        if (btn) btn.textContent = 'TAMPILKAN DETAIL';
                    }

                    ledgerList.innerHTML = berulah.map((row, idx) => {
                        const listId = `mistakeList_${idx}`;
                        return `
                            <div class="calc-card luxury-card" style="margin-bottom: 0; padding: 20px; border: 1px solid rgba(255, 77, 77, 0.2); background: rgba(0,0,0,0.3); display: flex; flex-direction: column; gap: 15px;">
                                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                    <div>
                                        <div style="font-family: 'Orbitron'; font-size: 14px; color: var(--danger); font-weight: 800; letter-spacing: 1px;">${row[1].toString().toUpperCase()}</div>
                                        <div style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">${row[3] || 'STAFF'} - ${row[2] || '-'}</div>
                                    </div>
                                    <div style="background: var(--danger); color: #000; padding: 4px 10px; border-radius: 4px; font-weight: 900; font-size: 12px;">SCORE: ${row[10]}</div>
                                </div>

                                <button class="btn btn-secondary" onclick="window.toggleMistakeDetails('${listId}', this)" style="width: 100%; height: 35px; font-size: 10px; font-weight: 800; border-color: var(--danger); color: var(--danger);">
                                    LIHAT KESALAHAN
                                </button>

                                <div id="${listId}" style="display: none; flex-direction: column; gap: 8px; background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; border: 1px solid rgba(255, 77, 77, 0.1);">
                                    <div style="display: flex; justify-content: space-between; align-items: center; font-family: Arial, sans-serif; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 4px;">
                                        <span style="color: var(--text-muted); font-weight: 800; letter-spacing: 1px;">MISTAKE WD</span>
                                        <span style="color: var(--danger); font-weight: 900;">= ${row[4] || 0}</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; align-items: center; font-family: Arial, sans-serif; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 4px;">
                                        <span style="color: var(--text-muted); font-weight: 800; letter-spacing: 1px;">MISTAKE DEPO</span>
                                        <span style="color: var(--danger); font-weight: 900;">= ${row[5] || 0}</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; align-items: center; font-family: Arial, sans-serif; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 4px;">
                                        <span style="color: var(--text-muted); font-weight: 800; letter-spacing: 1px;">SALAH PROSES (FS/BS)</span>
                                        <span style="color: var(--danger); font-weight: 900;">= ${row[6] || 0}</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; align-items: center; font-family: Arial, sans-serif; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 4px;">
                                        <span style="color: var(--text-muted); font-weight: 800; letter-spacing: 1px;">SALAH SCATTER</span>
                                        <span style="color: #ff4d4d; font-weight: 900;">= ${row[7] || 0}</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; align-items: center; font-family: Arial, sans-serif; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 4px;">
                                        <span style="color: rgba(255,255,255,0.4); font-weight: 800; letter-spacing: 1px;">TELAT BAWAH SOP</span>
                                        <span style="color: #ffaa00; font-weight: 900;">= ${row[8] || 0}</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; align-items: center; font-family: Arial, sans-serif; font-size: 13px;">
                                        <span style="color: rgba(255,255,255,0.4); font-weight: 800; letter-spacing: 1px;">TELAT ATAS SOP</span>
                                        <span style="color: #ffaa00; font-weight: 900;">= ${row[9] || 0}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('');
                } else {
                    ledgerArea.style.display = 'none';
                }
            }

            body.innerHTML = filtered.map(row => {
                const total = parseInt(row[10]) || 0;
                const rowStyle = total > 0 ? 'background: rgba(255, 77, 77, 0.05); border-left: 2px solid #ff4d4d;' : '';
                const errorStyle = (val) => (parseInt(val) > 0 ? 'color: #ff4d4d; font-weight: 800;' : 'opacity: 0.3;');

                return `
                    <tr style="${rowStyle}">
                        <td style="color: var(--primary); font-weight: 800; text-align: center;">${row[0] || ''}</td>
                        <td style="font-weight: 700; color: ${total > 0 ? '#ff4d4d' : '#00ffa2'}; text-align: center;">${row[1] || '-'}</td>
                        <td style="text-align: center;">${row[2] || '-'}</td>
                        <td style="text-align: center;">${row[3] || '-'}</td>
                        <td style="${errorStyle(row[4])} text-align: center;">${row[4] || '0'}</td>
                        <td style="${errorStyle(row[5])} text-align: center;">${row[5] || '0'}</td>
                        <td style="${errorStyle(row[6])} text-align: center;">${row[6] || '0'}</td>
                        <td style="${errorStyle(row[7])} text-align: center;">${row[7] || '0'}</td>
                        <td style="${errorStyle(row[8])} text-align: center;">${row[8] || '0'}</td>
                        <td style="${errorStyle(row[9])} text-align: center;">${row[9] || '0'}</td>
                        <td style="background: rgba(0, 255, 170, 0.1); font-weight: 900; color: var(--primary); text-align: center;">${row[10] || '0'}</td>
                    </tr>
                `;
            }).join('');
        } else {
            const errorMsg = result && result.error ? result.error : 'Data Kosong atau Gagal Memuat.';
            body.innerHTML = `<tr><td colspan="10" style="text-align:center; color:#ff4d4d; padding: 40px;">${errorMsg}</td></tr>`;
        }
    } catch (e) {
        body.innerHTML = `<tr><td colspan="10" style="text-align:center; color:#ff4d4d; padding: 40px;">Eror Koneksi: ${e.message}</td></tr>`;
    }
}

async function renderBackupKesalahanTable() {
    const body = document.getElementById('backupKesalahanBody');
    const searchInput = document.getElementById('backupKesalahanSearchInput');
    const dateInput = document.getElementById('backupKesalahanDateInput');

    if (!body) return;

    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const selectedDateRaw = dateInput ? dateInput.value : '';

    // Convert YYYY-MM-DD to "14 Apr 2026"
    const formatDateForSheet = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    };

    const filterDate = formatDateForSheet(selectedDateRaw);

    body.innerHTML = '<tr><td colspan="6" style="text-align:center;">Memuat data backup...</td></tr>';

    try {
        const result = await fetchFromGoogleSheets('getBackupKesalahan', { date: filterDate });
        if (result && Array.isArray(result)) {
            // Assume format: index 0=NO, 1=NAMA STAFF, 2=TANGGAL, 3=MISTAKE TYPE, 4=KETERANGAN, 5=TOTAL
            let filtered = result.filter(row => {
                const name = row[1] ? row[1].toString().trim().toLowerCase() : "";
                return name !== "" && name !== "nama staff";
            });

            if (query) {
                filtered = filtered.filter(row => row[1].toString().toLowerCase().includes(query));
            }

            if (filtered.length === 0) {
                body.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 40px; color: rgba(255,255,255,0.4);">Data tidak ditemukan.</td></tr>';
                return;
            }

            body.innerHTML = filtered.map((row, idx) => {
                const details = row[6] ? row[6].split(" || ") : [];
                const detailsHtml = details.map(d => {
                    const parts = d.split("[SS]");
                    const text = parts[0] || "";
                    const ss = parts[1] || "";
                    const ssHtml = ss.includes("http") ? `
                        <a href="${ss}" target="_blank" class="cyber-btn-luxury" style="font-size: 8px; padding: 2px 8px; background: rgba(0, 255, 170, 0.1); text-decoration: none; border-color: var(--primary); color: var(--primary);">
                            VIEW SS
                        </a>
                    ` : (ss ? `<span style="font-size: 9px; color: rgba(255,255,255,0.4); font-family: Arial, sans-serif;">[${ss}]</span>` : "");

                    return `
                        <div class="detail-item-luxury" style="justify-content: space-between;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <span style="color: var(--primary); font-size: 8px; filter: drop-shadow(0 0 5px var(--primary));">▶</span>
                                <span>${text}</span>
                            </div>
                            ${ssHtml}
                        </div>
                    `;
                }).join('');

                const total = parseInt(row[5] || '0');
                let izinQuota = "4";
                let quotaStyle = "color: #ffaa00; font-weight: 700;";

                if (total === 1) {
                    izinQuota = "4";
                    quotaStyle = "color: #ffaa00; font-weight: 700;";
                } else if (total === 2) {
                    izinQuota = "2";
                    quotaStyle = "color: #ff4d4d; font-weight: 800; text-shadow: 0 0 10px rgba(255, 77, 77, 0.3);";
                } else if (total > 2) {
                    izinQuota = "TINGGAL 2";
                    quotaStyle = "background: rgba(255, 77, 77, 0.2); color: #ff4d4d; padding: 2px 8px; border-radius: 4px; font-weight: 900;";
                }

                return `
                    <tr style="border-bottom: none;">
                        <td style="color: var(--primary); font-weight: 800; text-align: center; width: 40px;">${row[0] || ''}</td>
                        <td style="font-weight: 700; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; text-align: center;">${row[1] || '-'}</td>
                        <td style="font-family: Arial, sans-serif; font-size: 11px; color: rgba(255,255,255,0.5); text-align: center; width: 110px; white-space: nowrap;">${row[2] || '-'}</td>
                        <td style="font-family: Arial, sans-serif; font-size: 11px; color: var(--primary); text-align: center; width: 190px;">
                            <div style="display: flex; align-items: center; justify-content: center; gap: 10px; white-space: nowrap;">
                                <span>${row[3] || '-'}</span>
                                <button onclick="window.toggleBackupDetails(event, ${idx})" class="cyber-btn-luxury">LIHAT</button>
                            </div>
                        </td>
                        <td style="text-align: center; font-family: 'Orbitron'; font-size: 12px; width: 150px; ${quotaStyle}">${izinQuota}</td>
                        <td style="background: rgba(0, 255, 170, 0.1); font-weight: 900; color: var(--primary); font-size: 15px; text-align: center; width: 60px;">${total}</td>
                    </tr>
                    <tr id="backupDetails_${idx}" style="display: none; background: rgba(0,0,0,0.4);">
                        <td colspan="5" style="padding: 20px 40px; border-top: 1px solid rgba(0, 255, 170, 0.1);">
                            <div style="font-family: 'Orbitron'; font-size: 10px; color: var(--primary); margin-bottom: 15px; letter-spacing: 2px; display: flex; align-items: center; gap: 12px;">
                                <div style="width: 25px; height: 1px; background: var(--primary); box-shadow: 0 0 10px var(--primary);"></div>
                                KESALAHAN LOG DETAILS
                            </div>
                            <div style="max-height: 250px; overflow-y: auto; padding-right: 10px;" class="custom-scroll">
                                ${detailsHtml}
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        } else {
            const errorMsg = result && result.error ? result.error : 'Data Kosong atau Gagal Memuat.';
            body.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#ff4d4d; padding: 40px;">${errorMsg}</td></tr>`;
        }
    } catch (e) {
        body.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#ff4d4d; padding: 40px;">Eror Koneksi: ${e.message}</td></tr>`;
    }
}

window.toggleBackupDetails = function (event, idx) {
    const el = document.getElementById(`backupDetails_${idx}`);
    const btn = event.target;
    if (el.style.display === 'none') {
        el.style.display = 'table-row';
        btn.textContent = 'SEMBUNYIKAN';
        btn.classList.add('active');
    } else {
        el.style.display = 'none';
        btn.textContent = 'LIHAT';
        btn.classList.remove('active');
    }
};

window.renderBackupKesalahanTable = renderBackupKesalahanTable;

window.filterIzinKeluar = function () {
    renderIzinKeluarTable();
};

async function renderIzinKeluarTable() {
    const body = document.getElementById('izinKeluarBody');
    const dateInput = document.getElementById('izinKeluarDate');
    const selectedDate = dateInput ? dateInput.value : '';

    if (!body) return;

    if (!selectedDate) {
        body.innerHTML = '<tr><td colspan="2" style="text-align:center; padding: 60px; color: rgba(0,255,170,0.4);"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" style="margin-bottom: 20px; display: block; margin: 0 auto;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg><p style="font-family: \'Share Tech Mono\';">Silakan pilih tanggal untuk melihat data absen izin keluar.</p></td></tr>';
        return;
    }

    body.innerHTML = '<tr><td colspan="2" style="text-align:center; padding: 40px;">Memuat data izin...</td></tr>';

    try {
        const result = await fetchFromGoogleSheets('getIzinKeluar');
        if (result && Array.isArray(result)) {
            // Filter berdasarkan tanggal pilihan
            const filtered = result.filter(row => {
                if (!row[1]) return false;
                const rowDate = new Date(row[1]);
                const filterDate = new Date(selectedDate);
                // Bandingkan YYYY-MM-DD
                return rowDate.getFullYear() === filterDate.getFullYear() &&
                    rowDate.getMonth() === filterDate.getMonth() &&
                    rowDate.getDate() === filterDate.getDate();
            });

            if (filtered.length === 0) {
                body.innerHTML = `<tr><td colspan="2" style="text-align:center; padding: 40px; color: rgba(255,150,150,0.6); font-family: Arial, sans-serif;">Tidak ada data izin keluar untuk tanggal ${indonesianDateLong(selectedDate)}.</td></tr>`;
                return;
            }

            body.innerHTML = filtered.map(row => `
                <tr style="animation: slideInUp 0.3s ease forwards;">
                    <td style="font-weight: 700; color: var(--primary); padding: 20px;">${row[0] || '-'}</td>
                    <td style="font-family: Arial, sans-serif; letter-spacing: 1px; padding: 20px;">${indonesianDateLong(row[1])}</td>
                </tr>
            `).join('');
        } else {
            const errorMsg = result && result.error ? result.error : 'Data Kosong atau Gagal Memuat.';
            body.innerHTML = `<tr><td colspan="2" style="text-align:center; color:#ff4d4d; padding: 40px;">${errorMsg}</td></tr>`;
        }
    } catch (e) {
        body.innerHTML = `<tr><td colspan="2" style="text-align:center; color:#ff4d4d; padding: 40px;">Eror Koneksi: ${e.message}</td></tr>`;
    }
}

// --- BAGI NOMINAL WD ---
window.formatRupiahInput = function (input) {
    let value = input.value.replace(/[^0-9]/g, '');
    if (value) {
        input.value = new Intl.NumberFormat('id-ID', {
            style: 'decimal',
            minimumFractionDigits: 0
        }).format(value);
    }
};

window.calculateBagiWd = function () {
    const totalRaw = document.getElementById('bagiWdTotal').value;
    const maxRaw = document.getElementById('bagiWdMax').value;
    const resultArea = document.getElementById('bagiWdResultArea');
    const footer = document.getElementById('bagiWdTotalFooter');
    const checkTotalEl = document.getElementById('bagiWdCheckTotal');

    if (!totalRaw || !maxRaw) {
        if (typeof showToast === 'function') showToast("Masukkan nominal total dan max per bagian", "error");
        return;
    }

    const total = parseInt(totalRaw.replace(/[^0-9]/g, ''));
    const maxNominal = parseInt(maxRaw.replace(/[^0-9]/g, ''));

    if (isNaN(total) || isNaN(maxNominal) || maxNominal <= 0) {
        if (typeof showToast === 'function') showToast("Input tidak valid", "error");
        return;
    }

    let remainder = total;
    let results = [];
    // Safety break to prevent infinite loops if something is wrong
    let loopCount = 0;
    while (remainder > 0 && loopCount < 1000) {
        if (remainder >= maxNominal) {
            results.push(maxNominal);
            remainder -= maxNominal;
        } else {
            results.push(remainder);
            remainder = 0;
        }
        loopCount++;
    }

    let html = '';
    results.forEach((amt, index) => {
        const formatted = new Intl.NumberFormat('id-ID').format(amt);
        html += `
            <div class="split-item" style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: rgba(0,255,170,0.05); margin-bottom: 8px; border-left: 3px solid var(--primary); border-radius: 4px; animation: slideInUp 0.3s ease forwards; animation-delay: ${index * 0.05}s; opacity: 0;">
                <div style="font-family: Arial, sans-serif; color: #fff;">
                    <span style="color: var(--text-muted); font-size: 10px; margin-right: 10px;">#${index + 1}</span>
                    Rp ${formatted}
                </div>
                <button class="btn-mini-action" onclick="window.copyText('${amt}')" title="Salin">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                    </svg>
                </button>
            </div>
        `;
    });

    resultArea.innerHTML = html;
    footer.style.display = 'block';
    checkTotalEl.textContent = 'Rp ' + new Intl.NumberFormat('id-ID').format(total);
};

window.copyAllBagiWd = function () {
    const totalRaw = document.getElementById('bagiWdTotal').value;
    const maxRaw = document.getElementById('bagiWdMax').value;

    if (!totalRaw || !maxRaw) return;

    const total = parseInt(totalRaw.replace(/[^0-9]/g, ''));
    const maxNominal = parseInt(maxRaw.replace(/[^0-9]/g, ''));

    if (isNaN(total) || isNaN(maxNominal) || maxNominal <= 0) return;

    let remainder = total;
    let textRows = [];
    let loopCount = 0;
    while (remainder > 0 && loopCount < 1000) {
        if (remainder >= maxNominal) {
            textRows.push(maxNominal);
            remainder -= maxNominal;
        } else {
            textRows.push(remainder);
            remainder = 0;
        }
        loopCount++;
    }

    window.copyText(textRows.join('\n'));
};

window.copyText = function (text) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
        if (typeof showToast === 'function') showToast("Berhasil disalin!", "success");
    }).catch(err => {
        console.error('Copy failed', err);
    });
};

// --- CUSTOM CALENDAR LOGIC ---
let currentCalDate = new Date();
let selectedCalDate = null;

window.toggleCustomCalendar = function (e) {
    e.stopPropagation();
    const cal = document.getElementById('customCalendar');
    if (cal.style.display === 'none') {
        cal.style.display = 'block';
        window.renderCalendar();
    } else {
        cal.style.display = 'none';
    }
};

window.renderCalendar = function () {
    const monthYearEl = document.getElementById('calendarMonthYear');
    const gridEl = document.getElementById('calendarGrid');

    const year = currentCalDate.getFullYear();
    const month = currentCalDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthNames = ["JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"];
    monthYearEl.textContent = `${monthNames[month]} ${year}`;

    let html = '';

    // Empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="calendar-day empty"></div>';
    }

    const today = new Date();

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        let classes = 'calendar-day';

        if (selectedCalDate === dateStr) classes += ' selected';
        if (today.getFullYear() === year && today.getMonth() === month && today.getDate() === day) classes += ' today';

        html += `<div class="${classes}" onclick="window.selectCalendarDay('${dateStr}')">${day}</div>`;
    }

    gridEl.innerHTML = html;
};

window.changeCalendarMonth = function (offset) {
    currentCalDate.setMonth(currentCalDate.getMonth() + offset);
    window.renderCalendar();
};

window.selectCalendarDay = function (dateStr) {
    selectedCalDate = dateStr;
    window.renderCalendar();
    window.submitCalendar();
};

window.setCalendarToday = function () {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    selectedCalDate = dateStr;
    currentCalDate = new Date();
    window.renderCalendar();
    window.submitCalendar();
};

window.clearCalendar = function () {
    selectedCalDate = null;
    document.getElementById('izinKeluarDate').value = '';
    document.getElementById('izinKeluarDateDisplay').value = '';
    window.renderCalendar();
    if (typeof window.filterIzinKeluar === 'function') {
        window.filterIzinKeluar();
    }
};

window.submitCalendar = function () {
    if (selectedCalDate) {
        document.getElementById('izinKeluarDate').value = selectedCalDate;
        // Format display
        const d = new Date(selectedCalDate);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        document.getElementById('izinKeluarDateDisplay').value = d.toLocaleDateString('id-ID', options);

        // Auto trigger filter
        if (typeof window.filterIzinKeluar === 'function') {
            window.filterIzinKeluar();
        }
    }
    document.getElementById('customCalendar').style.display = 'none';
};

// Close calendar when clicking outside
document.addEventListener('click', function (e) {
    const cal = document.getElementById('customCalendar');
    if (cal && cal.style.display === 'block') {
        if (!cal.contains(e.target) && e.target.id !== 'izinKeluarDateDisplay') {
            cal.style.display = 'none';
        }
    }
});

async function renderSportsbookTable(isManual = false) {
    const resultsContainer = document.getElementById('sportsbookResultsContainer');
    const loader = document.getElementById('sportsbookLoader');
    if (!resultsContainer) return;

    const searchInput = document.getElementById('sbSearchInput');
    const dateVal = document.getElementById('sbDateSelect')?.value || '';
    const sortVal = document.getElementById('sbSortSelect')?.value || '0';

    if (isManual) loader.style.display = 'flex';
    const targetUrl = 'https://sport.ibet288.com/_view/Result.aspx';

    const emergencyTimer = setTimeout(() => {
        if (loader.style.display !== 'none') {
            loader.style.display = 'none';
            if (resultsContainer.innerHTML === '') {
                showSportsbookFallback(resultsContainer, targetUrl, "Koneksi Terlalu Lambat / Diblokir");
            }
        }
    }, 15000);

    try {
        const result = await fetchFromGoogleSheets('getSportsbookResults', {
            date: dateVal,
            sport: 'S,S,p1,g1',
            league: '-1',
            sort: sortVal
        });

        clearTimeout(emergencyTimer);
        loader.style.display = 'none';

        if (result && result.tableData && result.tableData.length > 1) {
            let tableHtml = '<table class="cyber-table" style="font-size:11px; margin-bottom: 20px;">';
            result.tableData.forEach((row, idx) => {
                const tag = idx === 0 ? 'th' : 'td';
                tableHtml += '<tr>' + row.map((cell, cIdx) => {
                    let style = `text-align:center; padding:10px; border: 1px solid rgba(0,255,170,0.1); font-family: Arial, sans-serif;`;
                    if (idx === 0) {
                        style += `position:sticky; top:127px; background:#0a0f19; z-index:900; border-bottom: 2px solid #0ff; font-weight:bold;`;
                        const text = (cell || '').toUpperCase();
                        if (text.includes('DATE')) style += 'color:#00f2ff;';
                        else if (text.includes('HOME')) style += 'color:#00ffaa;';
                        else if (text.includes('RESULTS')) style += 'color:#ffcc00;';
                        else if (text.includes('AWAY')) style += 'color:#ff55aa;';
                        else if (text.includes('H/T')) style += 'color:#cc88ff;';
                    }
                    return `<${tag} style="${style}">${cell || '-'}</${tag}>`;
                }).join('') + '</tr>';
            });
            tableHtml += '</table>';
            resultsContainer.innerHTML = tableHtml;
        } else if (result && result.html) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(result.html, 'text/html');

            // Sync All Dropdowns (Sport, Date, League, Sort) agar ID rahasia ikut terbawa
            const syncDropdown = (remoteId, localId) => {
                const remote = doc.getElementById(remoteId);
                const local = document.getElementById(localId);
                if (remote && local) {
                    const currentVal = local.value;
                    // Simpan teks yang sedang terpilih untuk pencocokan fallback
                    const currentText = local.options[local.selectedIndex]?.text;

                    local.innerHTML = remote.innerHTML;

                    // Coba kembalikan pilihan sebelumnya (berdasarkan Value atau Teks)
                    let found = false;
                    for (let i = 0; i < local.options.length; i++) {
                        if (local.options[i].value === currentVal || local.options[i].text === currentText) {
                            local.selectedIndex = i;
                            found = true;
                            break;
                        }
                    }
                }
            };

            syncDropdown('lstDates', 'sbDateSelect');
            // syncDropdown('lstSortBy', 'sbSortSelect');

            // Mencari tabel hasil dengan beberapa kemungkinan ID
            let table = doc.getElementById('dgResult') || doc.querySelector('table[id*="Result"]') || doc.querySelector('table.cyber-table');

            // Jika tidak ketemu ID, cari tabel pertama yang punya baris data
            if (!table) {
                const tables = doc.getElementsByTagName('table');
                for (let t of tables) {
                    if (t.rows.length > 2) { // Cari tabel yang punya konten
                        table = t;
                        break;
                    }
                }
            }

            if (table) {
                // Sembunyikan gambar yang rusak/tidak perlu
                table.querySelectorAll('img').forEach(img => img.style.display = 'none');

                table.className = 'cyber-table-luxury';
                table.style.width = '100%';
                table.style.borderCollapse = 'separate';
                table.style.borderSpacing = '0 4px'; // Jarak antar baris
                table.removeAttribute('border');
                table.removeAttribute('cellspacing');
                table.removeAttribute('cellpadding');

                table.querySelectorAll('tr').forEach((row, idx) => {
                    const isLeagueRow = row.cells.length === 1;
                    if (isLeagueRow) {
                        row.style.background = 'rgba(0, 255, 170, 0.12)';
                        row.style.color = 'var(--primary)';
                        row.style.fontWeight = 'bold';
                        row.style.letterSpacing = '1px';
                    } else {
                        row.style.background = idx % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(0,255,170,0.02)';
                    }
                    row.style.transition = 'all 0.2s ease';
                    row.onmouseover = () => {
                        if (!isLeagueRow) row.style.background = 'rgba(0,255,170,0.1)';
                    };
                    row.onmouseout = () => {
                        if (isLeagueRow) {
                            row.style.background = 'rgba(0, 255, 170, 0.12)';
                        } else {
                            row.style.background = idx % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(0,255,170,0.02)';
                        }
                    };

                    row.querySelectorAll('td, th').forEach((cell, cellIdx) => {
                        cell.style.padding = '12px 15px';
                        cell.style.textAlign = 'center';
                        cell.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
                        cell.style.color = isLeagueRow ? 'var(--primary)' : '#e0e0e0';
                        cell.style.fontWeight = isLeagueRow ? 'bold' : 'normal';
                        cell.style.fontSize = isLeagueRow ? '13px' : '12px';
                        cell.style.fontFamily = "Arial, sans-serif";

                        // Buat header jadi sticky (Freeze)
                        const isHeader = cell.tagName === 'TH' || (idx === 0);
                        if (isHeader) {
                            cell.style.position = 'sticky';
                            cell.style.top = '127px'; // Jarak dari filter bar (disesuaikan)
                            cell.style.background = '#0a0f19'; // Solid background
                            cell.style.zIndex = '900';
                            cell.style.boxShadow = '0 2px 5px rgba(0,0,0,0.5)';
                            cell.style.borderBottom = '2px solid #0ff';
                            cell.style.fontWeight = 'bold';
                            cell.style.textTransform = 'uppercase';

                            // Warna berbeda untuk tiap header
                            const text = cell.innerText.trim().toUpperCase();
                            if (text.includes('DATE')) cell.style.color = '#00f2ff'; // Cyan
                            else if (text.includes('HOME')) cell.style.color = '#00ffaa'; // Neon Green
                            else if (text.includes('RESULTS')) cell.style.color = '#ffcc00'; // Gold/Yellow
                            else if (text.includes('AWAY')) cell.style.color = '#ff55aa'; // Neon Pink
                            else if (text.includes('H/T')) cell.style.color = '#cc88ff'; // Purple
                        }

                        // Highlight skor
                        if (!isHeader && cell.textContent.includes('-') && cell.textContent.length < 10) {
                            cell.style.color = '#0ff';
                            cell.style.fontWeight = 'bold';
                            cell.style.textShadow = '0 0 10px rgba(0,255,255,0.3)';
                        }
                    });
                });
                table.id = 'dgResult';
                resultsContainer.innerHTML = '';
                resultsContainer.appendChild(table);

                // Tambahkan fungsionalitas pencarian real-time
                if (searchInput) {
                    const runFilter = () => {
                        const filter = searchInput.value.toLowerCase().trim();
                        const rows = table.getElementsByTagName('tr');
                        for (let i = 0; i < rows.length; i++) {
                            const text = rows[i].textContent.toLowerCase();
                            if (filter === "") {
                                rows[i].style.display = '';
                                continue;
                            }
                            rows[i].style.display = text.includes(filter) ? '' : 'none';
                        }
                    };
                    searchInput.addEventListener('input', runFilter);
                    runFilter();
                }
            } else {
                showSportsbookFallback(resultsContainer, targetUrl, "Data tabel tidak ditemukan dalam respon HTML.");
            }
        } else {
            showSportsbookFallback(resultsContainer, targetUrl, result.error || "Server memblokir akses otomatis.");
        }
    } catch (e) {
        clearTimeout(emergencyTimer);
        loader.style.display = 'none';
        showSportsbookFallback(resultsContainer, targetUrl, e.message);
    }
}

window.clearSbSearch = function () {
    const searchInput = document.getElementById('sbSearchInput');
    if (searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.focus();
    }
};

// Fungsi Pembantu untuk Menampilkan Tombol Cadangan
function showSportsbookFallback(container, url, message) {
    container.innerHTML = `
        <div style="text-align:center; padding: 40px; font-family: Arial, sans-serif;">
            <div style="background: rgba(255, 170, 0, 0.1); border: 1px solid rgba(255, 170, 0, 0.3); padding: 25px; border-radius: 12px; margin-bottom: 30px; transition: box-shadow 0.3s ease;" onmouseover="this.style.boxShadow='0 0 20px rgba(255,170,0,0.2)'" onmouseout="this.style.boxShadow='none'">
                <h4 style="color: #ffaa00; margin-bottom: 10px;">AKSES OTOMATIS TERHAMBAT</h4>
                <p style="color: rgba(255,255,255,0.6); font-size: 12px;">${message}</p>
            </div>
            <p style="margin-bottom: 25px; color: var(--primary);">GUNAKAN TOMBOL DI BAWAH UNTUK MELIHAT HASIL:</p>
            <button onclick="window.open('${url}', 'SB', 'width=1200,height=800')" class="btn btn-primary" style="padding: 15px 50px;">
                LAUNCH SPORTSBOOK PORTAL
            </button>
        </div>`;
}

window.formatRupiahInput = function (element) {
    let value = element.value.replace(/[^0-9]/g, '');
    if (value === "") {
        element.value = "";
        return;
    }
    element.value = new Intl.NumberFormat('id-ID').format(parseInt(value));
};

window.formatRupiah = function (number) {
    return new Intl.NumberFormat('id-ID').format(number);
};

window.copyContohResult = function (btn) {
    const text = document.getElementById('contohResultText').innerText;
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
        const originalHtml = btn.innerHTML;
        const originalShadow = btn.style.boxShadow;

        btn.innerHTML = '<i class="fas fa-check"></i> DISALIN!';
        btn.style.background = 'linear-gradient(135deg, rgba(0, 255, 170, 0.4), rgba(0, 255, 170, 0.2))';
        btn.style.boxShadow = '0 0 25px rgba(0, 255, 170, 0.6)';
        btn.style.borderColor = 'var(--primary)';

        setTimeout(() => {
            btn.innerHTML = originalHtml;
            btn.style.background = 'linear-gradient(135deg, rgba(0, 255, 170, 0.2), rgba(0, 255, 170, 0.05))';
            btn.style.boxShadow = originalShadow;
            btn.style.borderColor = 'rgba(0, 255, 170, 0.5)';
        }, 1500);
    });
};

// Fungsi untuk memperbarui tabel contoh perhitungan hadiah
// --- DATA CONTOH PERHITUNGAN ---
const CONTOH_RULES = {
    "umum": {
        "PRIZE 1 4D": { hadiah: 6500, type: "multiplier" },
        "PRIZE 1 3D": { hadiah: 650, type: "multiplier" },
        "PRIZE 1 2D": { hadiah: 70, type: "multiplier" },
        "PRIZE 2 4D": { hadiah: 2100, type: "multiplier" },
        "PRIZE 2 3D": { hadiah: 210, type: "multiplier" },
        "PRIZE 2 2D": { hadiah: 20, type: "multiplier" },
        "PRIZE 3 4D": { hadiah: 1100, type: "multiplier" },
        "PRIZE 3 3D": { hadiah: 110, type: "multiplier" },
        "PRIZE 3 2D": { hadiah: 8, type: "multiplier" },
        "4D FULL": { hadiah: 10000, type: "multiplier" },
        "3D FULL": { hadiah: 1000, type: "multiplier" },
        "2D FULL": { hadiah: 100, type: "multiplier" },
        "BB 4D TEPAT": { hadiah: 4000, type: "multiplier" },
        "BB 3D TEPAT": { hadiah: 400, type: "multiplier" },
        "BB 2D TEPAT": { hadiah: 70, type: "multiplier" },
        "BB 4D TIDAK TEPAT": { hadiah: 200, type: "multiplier" },
        "BB 3D TIDAK TEPAT": { hadiah: 100, type: "multiplier" },
        "BB 2D TIDAK TEPAT": { hadiah: 20, type: "multiplier" },
        "DISC 4D": { diskon: 66.5, hadiah: 3000, type: "discount" },
        "DISC 3D": { diskon: 59.5, hadiah: 400, type: "discount" },
        "DISC 2D": { diskon: 29.5, hadiah: 70, type: "discount" },
        "DISC 2D D/T": { diskon: 29.5, hadiah: 65, type: "discount" },
        "COLOK BEBAS 1 DIGIT": { diskon: 6, hadiah: 1.5, type: "colok" },
        "COLOK BEBAS 2 DIGIT": { diskon: 6, hadiah: 3, type: "colok" },
        "COLOK BEBAS 3 DIGIT": { diskon: 6, hadiah: 4.5, type: "colok" },
        "COLOK BEBAS 4 DIGIT": { diskon: 6, hadiah: 6, type: "colok" },
        "COLOK BEBAS 2D 2 DIGIT": { diskon: 10, hadiah: 7, type: "colok" },
        "COLOK BEBAS 2D 3 DIGIT": { diskon: 10, hadiah: 11, type: "colok" },
        "COLOK BEBAS 2D 4 DIGIT": { diskon: 10, hadiah: 18, type: "colok" },
        "COLOK NAGA 3 DIGIT": { diskon: 10, hadiah: 23, type: "colok" },
        "COLOK NAGA 4 DIGIT": { diskon: 10, hadiah: 35, type: "colok" },
        "COLOK JITU": { diskon: 6, hadiah: 8, type: "colok" },
        "SHIO": { diskon: 5, hadiah: 9.5, type: "colok" },
        "MACAU SHIO": { diskon: 10, hadiah: 110, type: "colok" },
        "KOMBINASI": { diskon: 8, hadiah: 2.6, type: "colok" },
        "TEPI TENGAH": { diskon: 2, key: 3, keyType: "minus", type: "5050" },
        "SILANG HOMO": { diskon: 2, key: 3, keyType: "minus", type: "5050" },
        "DASAR GANJIL-BESAR": { diskon: 2, key: 25, keyType: "minus", type: "5050" },
        "DASAR GENAP-KECIL": { diskon: 2, key: 10, keyType: "plus", type: "5050" },
        "50-50": { diskon: 2, key: 3, keyType: "minus", type: "5050" },
        "KEMBANG KEMPIS": { diskon: 2, key: 3, keyType: "minus", type: "5050" }
    },
    "macau": {
        "4D FULL": { hadiah: 10000, type: "multiplier" },
        "3D FULL": { hadiah: 1000, type: "multiplier" },
        "2D FULL": { hadiah: 100, type: "multiplier" },
        "BB 4D TEPAT": { hadiah: 4000, type: "multiplier" },
        "BB 3D TEPAT": { hadiah: 400, type: "multiplier" },
        "BB 2D TEPAT": { hadiah: 70, type: "multiplier" },
        "BB 4D TIDAK TEPAT": { hadiah: 200, type: "multiplier" },
        "BB 3D TIDAK TEPAT": { hadiah: 100, type: "multiplier" },
        "BB 2D TIDAK TEPAT": { hadiah: 20, type: "multiplier" },
        "DISC 4D": { diskon: 33, hadiah: 3000, type: "discount" },
        "DISC 3D": { diskon: 24, hadiah: 400, type: "discount" },
        "DISC 2D": { diskon: 15, hadiah: 70, type: "discount" },
        "DISC 2D D/T": { diskon: 15, hadiah: 70, type: "discount" },
        "S.DISC 4D": { diskon: 66.5, hadiah: 3000, type: "discount", label: "S.diskon" },
        "S.DISC 3D": { diskon: 59.5, hadiah: 400, type: "discount", label: "S.diskon" },
        "S.DISC 2D": { diskon: 29.5, hadiah: 70, type: "discount", label: "S.diskon" },
        "S.DISC 2D D/T": { diskon: 29.5, hadiah: 70, type: "discount", label: "S.diskon" },
        "COLOK BEBAS 1 DIGIT": { hadiah: 1.6, type: "multiplier_plus" },
        "COLOK BEBAS 2 DIGIT": { hadiah: 3.2, type: "multiplier_plus" },
        "COLOK BEBAS 3 DIGIT": { hadiah: 4.8, type: "multiplier_plus" },
        "COLOK BEBAS 4 DIGIT": { hadiah: 6.4, type: "multiplier_plus" },
        "COLOK BEBAS 2D 2 DIGIT": { hadiah: 7, type: "multiplier_plus" },
        "COLOK BEBAS 2D 3 DIGIT": { hadiah: 13, type: "multiplier_plus" },
        "COLOK BEBAS 2D 4 DIGIT": { hadiah: 21, type: "multiplier_plus" },
        "COLOK NAGA 3 DIGIT": { hadiah: 27, type: "multiplier_plus" },
        "COLOK NAGA 4 DIGIT": { hadiah: 41, type: "multiplier_plus" },
        "COLOK JITU": { hadiah: 8.3, type: "multiplier_plus" },
        "SHIO": { hadiah: 10, type: "multiplier_plus" },
        "MACAU SHIO": { hadiah: 110, type: "multiplier_plus" },
        "KOMBINASI": { hadiah: 2.8, type: "multiplier_plus" },
        "TEPI TENGAH": { key: 2.2, keyType: "minus", type: "5050_no_disc" },
        "SILANG HOMO": { key: 2.2, keyType: "minus", type: "5050_no_disc" },
        "DASAR GANJIL-BESAR": { key: 25, keyType: "minus", type: "5050_no_disc" },
        "DASAR GENAP-KECIL": { key: 10, keyType: "plus", type: "5050_plus" },
        "50-50": { key: 2.2, keyType: "minus", type: "5050_no_disc" },
        "KEMBANG KEMPIS": { key: 2.2, keyType: "minus", type: "5050_no_disc" }
    },
    "hoki5d": {
        "5D FULL": { hadiah: 88000, type: "multiplier" },
        "4D FULL": { hadiah: 10000, type: "multiplier" },
        "3D FULL": { hadiah: 1000, type: "multiplier" },
        "2D FULL": { hadiah: 100, type: "multiplier" },
        "BB 5D TEPAT": { hadiah: 50000, type: "multiplier" },
        "BB 4D TEPAT": { hadiah: 5000, type: "multiplier" },
        "BB 3D TEPAT": { hadiah: 500, type: "multiplier" },
        "BB 2D TEPAT": { hadiah: 80, type: "multiplier" },
        "BB 5D TIDAK TEPAT": { hadiah: 350, type: "multiplier" },
        "BB 4D TIDAK TEPAT": { hadiah: 180, type: "multiplier" },
        "BB 3D TIDAK TEPAT": { hadiah: 75, type: "multiplier" },
        "BB 2D TIDAK TEPAT": { hadiah: 15, type: "multiplier" },
        "DISC 5D": { diskon: 38, hadiah: 50000, type: "discount" },
        "DISC 4D": { diskon: 20, hadiah: 7000, type: "discount" },
        "DISC 3D": { diskon: 20, hadiah: 750, type: "discount" },
        "DISC 2D": { diskon: 20, hadiah: 75, type: "discount" },
        "COLOK BEBAS 1 DIGIT": { diskon: 6, hadiah: 0.9, type: "colok_special", base: 4000 },
        "COLOK BEBAS 2 DIGIT": { diskon: 6, hadiah: 1.8, type: "colok_special", base: 6000 },
        "COLOK BEBAS 3 DIGIT": { diskon: 6, hadiah: 2.7, type: "colok_special", base: 20000 },
        "COLOK BEBAS 4 DIGIT": { diskon: 6, hadiah: 3.6, type: "colok_special", base: 200000 },
        "COLOK BEBAS 5 DIGIT": { diskon: 6, hadiah: 4.5, type: "colok_special", base: 50000 },
        "COLOK BEBAS 2D 2 DIGIT": { diskon: 10, hadiah: 4, type: "colok" },
        "COLOK BEBAS 2D 3 DIGIT": { diskon: 10, hadiah: 6, type: "colok" },
        "COLOK BEBAS 2D 4 DIGIT": { diskon: 10, hadiah: 20, type: "colok" },
        "COLOK BEBAS 2D 5 DIGIT": { diskon: 10, hadiah: 200, type: "colok" },
        "COLOK BEBAS 4D 4 DIGIT": { hadiah: 50, type: "multiplier_special", base: 900 },
        "COLOK BEBAS 4D 5 DIGIT": { hadiah: 200, type: "multiplier_special", base: 900 },
        "COLOK NAGA 3 DIGIT": { diskon: 10, hadiah: 12, type: "colok" },
        "COLOK NAGA 4 DIGIT": { diskon: 10, hadiah: 30, type: "colok" },
        "COLOK NAGA 5 DIGIT": { diskon: 10, hadiah: 125, type: "colok" },
        "COLOK JITU": { diskon: 6, hadiah: 8, type: "colok" },
        "SHIO": { diskon: 5, hadiah: 10, type: "colok" },
        "KOMBINASI": { diskon: 8, hadiah: 2.7, type: "colok" },
        "TEPI TENGAH": { key: 2.2, keyType: "minus", type: "5050_22" },
        "DASAR GANJIL-BESAR": { key: 25, keyType: "minus", type: "5050_no_disc" },
        "DASAR GENAP-KECIL": { key: 10, keyType: "plus", type: "5050_plus" },
        "50-50": { key: 2.2, keyType: "minus", type: "5050_no_disc" }
    },
    "kingkong": {
        "4D FULL": { hadiah: 10000, type: "multiplier" },
        "3D FULL": { hadiah: 1000, type: "multiplier" },
        "2D FULL": { hadiah: 100, type: "multiplier" },
        "BB 4D TEPAT": { hadiah: 4000, type: "multiplier" },
        "BB 3D TEPAT": { hadiah: 400, type: "multiplier" },
        "BB 2D TEPAT": { hadiah: 70, type: "multiplier" },
        "BB 4D TIDAK TEPAT": { hadiah: 200, type: "multiplier" },
        "BB 3D TIDAK TEPAT": { hadiah: 100, type: "multiplier" },
        "BB 2D TIDAK TEPAT": { hadiah: 20, type: "multiplier" },
        "DISC 4D": { diskon: 33, hadiah: 6000, type: "discount" },
        "DISC 3D": { diskon: 24, hadiah: 700, type: "discount" },
        "DISC 2D": { diskon: 15, hadiah: 80, type: "discount" },
        "DISC 2D D/T": { diskon: 15, hadiah: 80, type: "discount" },
        "COLOK BEBAS 1 DIGIT": { hadiah: 1.6, type: "multiplier_plus" },
        "COLOK BEBAS 2 DIGIT": { hadiah: 3.2, type: "multiplier_plus" },
        "COLOK BEBAS 3 DIGIT": { hadiah: 4.8, type: "multiplier_plus" },
        "COLOK BEBAS 4 DIGIT": { hadiah: 6.4, type: "multiplier_plus" },
        "COLOK BEBAS 2D 2 DIGIT": { hadiah: 7, type: "multiplier_plus" },
        "COLOK BEBAS 2D 3 DIGIT": { hadiah: 13, type: "multiplier_plus" },
        "COLOK BEBAS 2D 4 DIGIT": { hadiah: 21, type: "multiplier_plus" },
        "COLOK NAGA 3 DIGIT": { hadiah: 27, type: "multiplier_plus" },
        "COLOK NAGA 4 DIGIT": { hadiah: 41, type: "multiplier_plus" },
        "COLOK JITU": { hadiah: 8.3, type: "multiplier_plus" },
        "SHIO": { hadiah: 10, type: "multiplier_plus" },
        "MACAU SHIO": { hadiah: 110, type: "multiplier_plus" },
        "KOMBINASI": { hadiah: 2.8, type: "multiplier_plus" },
        "TEPI TENGAH": { key: 2.2, keyType: "minus", type: "5050_no_disc" },
        "SILANG HOMO": { key: 2.2, keyType: "minus", type: "5050_no_disc" },
        "DASAR GANJIL-BESAR": { key: 25, keyType: "minus", type: "5050_no_disc" },
        "DASAR GENAP-KECIL": { key: 10, keyType: "plus", type: "5050_plus" },
        "50-50": { key: 5, keyType: "minus", type: "5050_no_disc" },
        "KEMBANG KEMPIS": { key: 2.2, keyType: "minus", type: "5050_no_disc" }
    },
    "jakarta": {
        "4D FULL": { hadiah: 9000, type: "multiplier" },
        "3D FULL": { hadiah: 950, type: "multiplier" },
        "2D FULL": { hadiah: 95, type: "multiplier" },
        "BB 4D TEPAT": { hadiah: 4000, type: "multiplier" },
        "BB 3D TEPAT": { hadiah: 400, type: "multiplier" },
        "BB 2D TEPAT": { hadiah: 70, type: "multiplier" },
        "BB 4D TIDAK TEPAT": { hadiah: 200, type: "multiplier" },
        "BB 3D TIDAK TEPAT": { hadiah: 100, type: "multiplier" },
        "BB 2D TIDAK TEPAT": { hadiah: 20, type: "multiplier" },
        "DISC 4D": { diskon: 66.5, hadiah: 3000, type: "discount" },
        "DISC 3D": { diskon: 59.5, hadiah: 400, type: "discount" },
        "DISC 2D": { diskon: 29, hadiah: 70, type: "discount" },
        "DISC 2D D/T": { diskon: 29, hadiah: 70, type: "discount" },
        "COLOK BEBAS 1 DIGIT": { diskon: 6, hadiah: 1.6, type: "colok" },
        "COLOK BEBAS 2 DIGIT": { diskon: 6, hadiah: 3.2, type: "colok" },
        "COLOK BEBAS 3 DIGIT": { diskon: 6, hadiah: 4.8, type: "colok" },
        "COLOK BEBAS 4 DIGIT": { diskon: 6, hadiah: 6.4, type: "colok" },
        "COLOK BEBAS 2D 2 DIGIT": { diskon: 10, hadiah: 7, type: "colok" },
        "COLOK BEBAS 2D 3 DIGIT": { diskon: 10, hadiah: 13, type: "colok" },
        "COLOK BEBAS 2D 4 DIGIT": { diskon: 10, hadiah: 21, type: "colok" },
        "COLOK NAGA 3 DIGIT": { diskon: 10, hadiah: 27, type: "colok" },
        "COLOK NAGA 4 DIGIT": { diskon: 10, hadiah: 41, type: "colok" },
        "COLOK JITU": { diskon: 6, hadiah: 8.3, type: "colok" },
        "SHIO": { diskon: 5, hadiah: 10, type: "colok" },
        "MACAU SHIO": { diskon: 10, hadiah: 110, type: "colok" },
        "KOMBINASI": { diskon: 8, hadiah: 2.8, type: "colok" },
        "TEPI TENGAH": { diskon: 2, key: 2.2, keyType: "minus", type: "5050" },
        "SILANG HOMO": { diskon: 2, key: 2.2, keyType: "minus", type: "5050" },
        "DASAR GANJIL-BESAR": { diskon: 2, key: 25, keyType: "minus", type: "5050" },
        "DASAR GENAP-KECIL": { diskon: 2, key: 10, keyType: "plus", type: "5050" },
        "50-50": { diskon: 2, key: 5, keyType: "minus", type: "5050" },
        "KEMBANG KEMPIS": { diskon: 2, key: 2.2, keyType: "minus", type: "5050" }
    },
    "totomali": {
        "4D FULL": { hadiah: 10000, type: "multiplier" },
        "3D FULL": { hadiah: 1000, type: "multiplier" },
        "2D FULL": { hadiah: 100, type: "multiplier" },
        "BB 4D TEPAT": { hadiah: 4000, type: "multiplier" },
        "BB 3D TEPAT": { hadiah: 400, type: "multiplier" },
        "BB 2D TEPAT": { hadiah: 70, type: "multiplier" },
        "BB 4D TIDAK TEPAT": { hadiah: 200, type: "multiplier" },
        "BB 3D TIDAK TEPAT": { hadiah: 100, type: "multiplier" },
        "BB 2D TIDAK TEPAT": { hadiah: 20, type: "multiplier" },
        "DISC 4D": { diskon: 67, hadiah: 3000, type: "discount" },
        "DISC 3D": { diskon: 57, hadiah: 400, type: "discount" },
        "DISC 2D": { diskon: 27, hadiah: 70, type: "discount" },
        "DISC 2D D/T": { diskon: 27, hadiah: 70, type: "discount" },
        "COLOK BEBAS 1 DIGIT": { diskon: 6, hadiah: 1.6, type: "colok" },
        "COLOK BEBAS 2 DIGIT": { diskon: 6, hadiah: 3.2, type: "colok" },
        "COLOK BEBAS 3 DIGIT": { diskon: 6, hadiah: 4.8, type: "colok" },
        "COLOK BEBAS 4 DIGIT": { diskon: 6, hadiah: 6.4, type: "colok" },
        "COLOK BEBAS 2D 2 DIGIT": { diskon: 10, hadiah: 7, type: "colok" },
        "COLOK BEBAS 2D 3 DIGIT": { diskon: 10, hadiah: 13, type: "colok" },
        "COLOK BEBAS 2D 4 DIGIT": { diskon: 10, hadiah: 21, type: "colok" },
        "COLOK NAGA 3 DIGIT": { diskon: 10, hadiah: 27, type: "colok" },
        "COLOK NAGA 4 DIGIT": { diskon: 10, hadiah: 41, type: "colok" },
        "COLOK JITU": { diskon: 6, hadiah: 8.3, type: "colok" },
        "SHIO": { diskon: 5, hadiah: 10, type: "colok" },
        "MACAU SHIO": { diskon: 10, hadiah: 110, type: "colok" },
        "KOMBINASI": { diskon: 8, hadiah: 2.8, type: "colok" },
        "TEPI TENGAH": { diskon: 2, key: 2.2, keyType: "minus", type: "5050" },
        "SILANG HOMO": { diskon: 2, key: 2.2, keyType: "minus", type: "5050" },
        "DASAR GANJIL-BESAR": { diskon: 2, key: 25, keyType: "minus", type: "5050" },
        "DASAR GENAP-KECIL": { diskon: 2, key: 10, keyType: "plus", type: "5050" },
        "50-50": { diskon: 2, key: 5, keyType: "minus", type: "5050" },
        "KEMBANG KEMPIS": { diskon: 2, key: 2.2, keyType: "minus", type: "5050" }
    },
    "bonus": {
        "Bonus cashback Slot game": { rate: 5, type: "bonus_cashback", period: "Selasa s/d Senin" },
        "Bonus cashback Live game": { rate: 5, type: "bonus_cashback", period: "Senin s/d Minggu" },
        "Bonus cashback LIVE CASINO PRAGMATIC PLAY": { rate: 5, type: "bonus_cashback", period: "Senin s/d Minggu" },
        "Bonus Rollingan Slot game": { rate: 0.5, type: "bonus_rollingan", period: "Kamis s/d Rabu" },
        "Bonus Rollingan Live game": { rate: 0.7, type: "bonus_rollingan", period: "Kamis s/d Rabu" },
        "Bonus Rollingan LIVE CASINO PRAGMATIC PLAY": { rate: 0.7, type: "bonus_rollingan", period: "Kamis s/d Rabu" },
        "Bonus Referral Slot game": { rate: 0.1, type: "bonus_referral_to" },
        "Bonus Referral Live game": { rate: 0.1, type: "bonus_referral_to" },
        "Bonus Referral LIVE CASINO PRAGMATIC PLAY": { rate: 0.1, type: "bonus_referral_to" },
        "Bonus Referral Togel": { rate: 0.5, type: "bonus_referral_bet" },
        "Bonus Referral Togel TOTO MACAU full/bb 4D / 3D / 2D": { rate: 2.5, type: "bonus_referral_bet" },
        "Bonus Referral Togel TOTO MACAU Diskon 4D / 3D": { rate: 2.0, type: "bonus_referral_bet" },
        "Bonus Referral Togel TOTO MACAU Diskon 2D": { rate: 1.0, type: "bonus_referral_bet" },
        "Bonus Referral Togel TOTO MACAU S.Diskon 4D / 3D": { rate: 2.0, type: "bonus_referral_bet" },
        "Bonus Referral Togel TOTO MACAU S.Diskon 2D": { rate: 1.0, type: "bonus_referral_bet" },
        "Bonus Referral Togel semua pasaran Diskon 4D": { rate: 1.0, type: "bonus_referral_bet" },
        "Bonus Referral Togel semua pasaran Diskon 3D": { rate: 1.0, type: "bonus_referral_bet" },
        "Bonus Referral Togel semua pasaran Diskon 2D": { rate: 0.5, type: "bonus_referral_bet" },
        "Bonus Referral Togel semua pasaran Bett colok": { rate: 0.1, type: "bonus_referral_bet" },
        "Bonus Referral Togel poipet loterry 4D": { rate: 1.0, type: "bonus_referral_bet" },
        "Bonus Referral Togel poipet loterry 3D": { rate: 1.0, type: "bonus_referral_bet" },
        "Bonus Referral Togel poipet loterry 2D": { rate: 0.5, type: "bonus_referral_bet" },
        "Bonus Referral Togel poipet loterry Bett colok": { rate: 0.1, type: "bonus_referral_bet" }
    }
};

window.updateContohPrizeTable = function () {
    const pasaran = document.getElementById('contohPasaranFilter').value;
    const jenis = document.getElementById('contohJenisFilter').value;
    const bonus = document.getElementById('contohBonusFilter').value;
    const nominalRaw = document.getElementById('contohNominalBet').value;
    const resultWrapper = document.getElementById('contohResultWrapper');
    const resultText = document.getElementById('contohResultText');
    const tbody = document.getElementById('contohPrizeTableBody');
    const tableWrapper = document.getElementById('contohTableWrapper');

    if (!tbody || !resultWrapper || !resultText) return;

    // Toggle Groups
    const groupTaruhan = document.getElementById('groupJenisTaruhan');
    const groupBonus = document.getElementById('groupJenisBonus');

    if (pasaran === 'bonus') {
        if (groupBonus) groupBonus.style.display = 'block';
        if (groupTaruhan) groupTaruhan.style.display = 'none';
    } else {
        if (groupBonus) groupBonus.style.display = 'none';
        if (groupTaruhan) groupTaruhan.style.display = 'block';
    }

    const nominal = parseInt(nominalRaw.replace(/[^0-9]/g, '')) || 0;
    const format = (num) => new Intl.NumberFormat('id-ID').format(num);

    let rule = null;
    let selectedType = "";
    if (pasaran === 'bonus') {
        if (CONTOH_RULES.bonus[bonus]) {
            rule = CONTOH_RULES.bonus[bonus];
            selectedType = bonus;
        }
    } else {
        if (CONTOH_RULES[pasaran] && CONTOH_RULES[pasaran][jenis]) {
            rule = CONTOH_RULES[pasaran][jenis];
            selectedType = jenis;
        }
    }

    if (rule && nominal > 0) {
        resultWrapper.style.display = 'block';
        tableWrapper.style.display = 'none';
        let explanation = "";

        const basicMultiplier = (r, n) => {
            const win = r.hadiah * n;
            return `Berikut contoh perhitungan tipe ${selectedType} ya bosku\nNominal bet ${format(n)} x ${format(r.hadiah)} ( hadiah ) = ${format(win)} kemenangan anda ya bosku`;
        };

        const resultValue = (nominal * (rule.rate / 100));

        switch (rule.type) {
            case "multiplier":
                explanation = basicMultiplier(rule, nominal);
                break;
            case "multiplier_plus":
                const winPlus = rule.hadiah * nominal;
                explanation = `Berikut contoh perhitungan tipe ${selectedType} ya bosku\nNominal bet ${format(nominal)} x ${rule.hadiah} ( Hadiah ) = ${format(winPlus)} + ${format(nominal)} ( modal ) = ${format(winPlus + nominal)} kemenangan anda ya bosku`;
                break;
            case "discount":
                const discLabel = rule.label || "diskon";
                const toPay = nominal - (nominal * (rule.diskon / 100));
                const winDisc = rule.hadiah * nominal;
                explanation = `Berikut contoh perhitungan tipe ${selectedType} ya bosku\nNominal bet ${format(nominal)} - ${rule.diskon}% ( ${discLabel} ) = ${format(toPay)} yang harus anda bayar\nHadiah ${format(rule.hadiah)} x ${format(nominal)} = ${format(winDisc)} kemenangan anda ya bosku`;
                break;
            case "colok":
                const toPayColok = nominal - (nominal * (rule.diskon / 100));
                const winColok = rule.hadiah * nominal;
                explanation = `Berikut contoh perhitungan tipe ${selectedType} ya bosku\nNominal bet ${format(nominal)} - diskon sebesar ${rule.diskon}% = ${format(toPayColok)} yang harus anda bayar\nHadiah ${rule.hadiah} x ${format(nominal)} = ${format(winColok)} + ${format(toPayColok)} ( modal ) = ${format(winColok + toPayColok)} kemenangan anda ya bosku`;
                break;
            case "colok_special":
                const toPaySpec = nominal - (nominal * (rule.diskon / 100));
                const winSpec = rule.hadiah * nominal;
                explanation = `Berikut contoh perhitungan tipe ${selectedType} ya bosku\nNominal bet ${format(nominal)} - diskon sebesar ${rule.diskon}% = ${format(toPaySpec)} yang harus anda bayar\nHadiah ${rule.hadiah} x ${format(nominal)} = ${format(winSpec)} + ${format(toPaySpec)} ( modal ) = ${format(winSpec + toPaySpec + (rule.base || 0))} kemenangan anda ya bosku`;
                if (pasaran === "hoki5d") {
                    if (jenis === "COLOK BEBAS 3 DIGIT") explanation = `Berikut contoh perhitungan tipe ${selectedType} ya bosku\nNominal bet ${format(nominal)} - diskon sebesar ${rule.diskon}% = ${format(toPaySpec)} yang harus anda bayar\nHadiah ${rule.hadiah} x ${format(nominal)} = ${format(winSpec)} + ${format(toPaySpec)} ( modal ) = 20,900 kemenangan anda ya bosku`;
                }
                break;
            case "multiplier_special":
                const winSpecMult = rule.hadiah * nominal;
                explanation = `Berikut contoh perhitungan tipe ${selectedType} ya bosku\nNominal bet ${format(nominal)} x ${rule.hadiah} ( Hadiah ) = ${format(winSpecMult)} + ${format(nominal)} ( modal ) = ${format(winSpecMult + nominal + (rule.base || 0))} kemenangan anda ya bosku`;
                break;
            case "5050":
                const toPay5050 = nominal - (nominal * (rule.diskon / 100));
                const keyAmount = nominal * (rule.key / 100);
                const finalPay = rule.keyType === "minus" ? toPay5050 + keyAmount : toPay5050;
                explanation = `Berikut contoh perhitungan tipe ${selectedType} ya bosku\nNominal bet ${format(nominal)} - diskon sebesar ${rule.diskon}% = ${format(toPay5050)} ${rule.keyType === 'minus' ? `+ ( key - ) ${rule.key}% = ${format(finalPay)}` : ''} yang harus anda bayar\nJika anda menang ( Hadiah 1:1 ) ${format(nominal)} + ${format(finalPay)} ( modal ) = ${format(nominal + finalPay)} kemenangan anda ya bosku`;
                if (rule.keyType === "plus") {
                    const keyWin = nominal * (rule.key / 100);
                    explanation = `Berikut contoh perhitungan tipe ${selectedType} ya bosku\nNominal bet ${format(nominal)} - diskon sebesar ${rule.diskon}% = ${format(toPay5050)} yang harus anda bayar\nPerhitungan ( key +) ${rule.key}% x ${format(nominal)} = ${format(keyWin)} key yang anda dapat jika mengalamin kemenangan\nJika anda menang ( Hadiah 1:1 ) ${format(nominal)} + ${format(keyWin)} + ${format(toPay5050)} ( modal ) = ${format(nominal + keyWin + toPay5050)} kemenangan anda ya bosku`;
                }
                break;
            case "5050_no_disc":
                const keyAmtNoDisc = nominal * (rule.key / 100);
                const payNoDisc = nominal + keyAmtNoDisc;
                explanation = `Berikut contoh perhitungan tipe ${selectedType} ya bosku \nNominal bet ${format(nominal)} + ( key - ) ${rule.key}% = ${format(payNoDisc)} yang harus anda bayar \nJika anda menang ( Hadiah 1:1 ) ${format(nominal)} + ${format(payNoDisc)} ( modal ) = ${format(nominal + payNoDisc)} kemenangan anda ya bosku`;
                break;
            case "5050_plus":
                const keyWinPlus = nominal * (rule.key / 100);
                explanation = `Berikut contoh perhitungan tipe ${selectedType} ya bosku\nPerhitungan ( key +) ${rule.key}% x ${format(nominal)} = ${format(keyWinPlus)} key yang anda dapat jika mengalamin kemenangan\nJika anda menang ( Hadiah 1:1 ) ${format(nominal)} + ${format(keyWinPlus)} + ${format(nominal)} ( modal ) = ${format(nominal + keyWinPlus + nominal)} kemenangan anda ya bosku`;
                break;
            case "5050_22":
                const pay22 = nominal + (nominal * 0.002);
                explanation = `Berikut contoh perhitungan tipe ${selectedType} ya bosku \nNominal bet ${format(nominal)} + ( key - ) ${rule.key}% = ${format(finalPay)} yang harus anda bayar \nJika anda menang ( Hadiah 1:1 ) ${format(nominal)} + ${format(pay22)} ( modal ) = ${format(nominal + pay22)} kemenangan anda ya bosku`;
                break;
            case "bonus_cashback":
                explanation = `Berikut contoh perhitungan ${selectedType} ${rule.rate}% ya bosku\nuntuk kekalahan anda dalam periode 1 minggu diambil dari hari ${rule.period} sebesar ${format(nominal)} dikali dengan bonus ${rule.rate}.0% yang anda dapatkan ${format(resultValue)} ya bosku`;
                break;
            case "bonus_rollingan":
                explanation = `Berikut contoh perhitungan ${selectedType} ${rule.rate}% ya bosku\nuntuk Turnover anda dalam periode 1 minggu diambil dari hari ${rule.period} sebesar ${format(nominal)} dikali dengan bonus ${rule.rate}% yang anda dapatkan ${format(resultValue)} ya bosku`;
                break;
            case "bonus_referral_to":
                explanation = `Berikut contoh perhitungan ${selectedType} ${rule.rate}% ya bosku\nuntuk Turnover Refferral anda total ${format(nominal)} dikali ${rule.rate}% yang anda dapatkan ${format(resultValue)} ya bosku`;
                break;
            case "bonus_referral_bet":
                explanation = `Berikut contoh perhitungan ${selectedType} ya bosku\nuntuk bettingan Refferral anda total ${format(nominal)} dikali ${rule.rate}% yang anda dapatkan ${format(resultValue)} ya bosku`;
                break;
        }

        resultText.innerText = explanation;
        // Add a subtle update effect
        resultText.parentElement.style.borderColor = 'var(--primary)';
        setTimeout(() => {
            resultText.parentElement.style.borderColor = 'rgba(0, 255, 170, 0.2)';
        }, 500);
    } else {
        resultWrapper.style.display = 'none';
        tableWrapper.style.display = 'block';
    }
};

// Inisialisasi saat load
if (document.readyState === 'complete') {
    window.updateContohPrizeTable();
} else {
    window.addEventListener('load', window.updateContohPrizeTable);
}
