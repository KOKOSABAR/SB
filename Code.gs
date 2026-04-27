/**
 * CYBER HUD BACKEND - ULTRA PERFORMANCE VERSION (MERGED)
 * Fitur: 
 * 1. Cek Rekening Batch (Master Regex Search) - Kecepatan Maksimal
 * 2. Daftar Games 10.000+ Data (Server-Side Search & Dynamic Header)
 * 3. Minimal Server Roundtrip
 */

const CONFIG = {
  FOLDER_GALLERY_ID: '1CLolADOa94s8tKp9r1mG19YhYNBDHnku',
  FOLDER_EXTENSIONS_ID: '1QaWxbEajWCL2BBTAQLiFLERCpUEg7TTV',
  SPREADSHEET_ID: '1L2WYrWFbQyssIxy7qV-2xnxWyzTCYJfsGjk6a5rbLdc' 
};

function getSS() {
  try {
    if (CONFIG.SPREADSHEET_ID) return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    return SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) { 
    Logger.log("Error getSS: " + e.message);
    return null; 
  }
}

function doGet(e) {
  const action = e.parameter.action;
  if (!action) {
    return ContentService.createTextOutput("Cyber HUD - Backend is Running (OK)").setMimeType(ContentService.MimeType.TEXT);
  }
  return handleAction(e.parameter);
}

function doPost(e) {
  let postData;
  try { postData = JSON.parse(e.postData.contents); } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Invalid JSON" })).setMimeType(ContentService.MimeType.JSON);
  }
  return handleAction(postData);
}

function handleAction(params) {
  const action = params.action ? params.action.toString().trim() : "";
  const callback = params.callback;
  let result;
  try {
    switch (action) {
      case 'getSportsbookResults': result = getSportsbookResults(params); break;
      case 'getBackupKesalahan': result = getBackupKesalahan(params); break;
      case 'getKesalahan': result = getKesalahan(); break;
      case 'getInventaris': result = getInventaris(); break;
      case 'getIzinKeluar': result = getIzinKeluar(); break;
      case 'checkAccountsBatch': result = { results: checkAccountsBatch(params.accounts) }; break;
      case 'getAll': result = getNotes(); break;
      case 'add': result = addNote(params.judul, params.isi); break;
      case 'update': result = updateNote(params.id, params.judul, params.isi); break;
      case 'delete': result = deleteNote(params.id); break;
      case 'scrapeWdbos': result = scrapeWdbos(); break;
      case 'saveTogelData': result = saveTogelData(params.data); break;
      case 'getTogelData': result = getTogelData(); break;
      case 'uploadImage': result = handleFileUpload(params.base64, params.filename, params.folderId); break;
      case 'listFiles': result = listFiles(params.folderId); break;
      case 'deleteFile': result = deleteFile(params.fileId); break;
      case 'getBackground': result = getBackground(); break;
      case 'updateBackground': result = updateBackground(params.url); break;
      case 'getDaftarGames': result = getDaftarGames(params); break;
      case 'getPendinganData': result = getPendinganData(params); break;
      case 'testConnection': 
        const ssTest = getSS();
        result = { 
          status: 'success', 
          spreadsheet: ssTest ? ssTest.getName() : "GAGAL_KONEK",
          id: CONFIG.SPREADSHEET_ID,
          timestamp: new Date().toISOString() 
        }; 
        break;
      default: result = { error: "Action not found: " + action };
    }
  } catch (err) { result = { error: err.message }; }
  const jsonResponse = JSON.stringify(result);
  if (callback) return ContentService.createTextOutput(callback + "(" + jsonResponse + ")").setMimeType(ContentService.MimeType.JAVASCRIPT);
  return ContentService.createTextOutput(jsonResponse).setMimeType(ContentService.MimeType.JSON);
}

// --- HYPER FAST ACCOUNT CHECK (BATCH REGEX) ---
function checkAccountsBatch(accountNumbers) {
  if (!accountNumbers || !Array.isArray(accountNumbers)) return [];
  const ss = getSS();
  if (!ss) return [{ error: "Koneksi Spreadsheet Gagal!" }];
  
  const results = [];
  const foundTargets = new Set();
  const targetsMap = {};
  
  const regexPatterns = accountNumbers.map(n => {
    const raw = n.toString().replace(/\D/g, '');
    const clean = raw.replace(/^0+/, '') || raw;
    targetsMap[clean] = raw;
    return clean;
  }).filter(c => c.length > 4);

  if (regexPatterns.length === 0) return [];
  const masterRegex = "(" + regexPatterns.join("|") + ")";
  const allSheets = ss.getSheets();
  
  for (let s = 0; s < allSheets.length; s++) {
    const sheet = allSheets[s];
    const sheetName = sheet.getName();
    if (sheetName.startsWith('_') || sheetName === "SB_SETTINGS" || sheetName === "DAFTAR GAMES WDBOS") continue;
    if (foundTargets.size === regexPatterns.length) break;

    const matchedCells = sheet.createTextFinder(masterRegex).useRegularExpression(true).findAll();

    matchedCells.forEach(cell => {
      const cellText = cell.getValue().toString();
      const cellClean = cellText.replace(/\D/g, '').replace(/^0+/, '');
      
      if (targetsMap[cellClean] && !foundTargets.has(cellClean)) {
        const rowIdx = cell.getRow();
        const lastCol = Math.min(sheet.getLastColumn(), 22); // Slightly more columns
        
        // Find header row dynamically
        let hRow = 1;
        try {
           const headData = sheet.getRange(1, 1, 10, lastCol).getValues();
           for(let r=0; r<headData.length; r++) {
             if(headData[r].some(v => v && v.toString().toUpperCase().includes("REKENING"))) {
               hRow = r + 1;
               break;
             }
           }
        } catch(e) {}

        const dataRow = sheet.getRange(rowIdx, 1, 1, lastCol).getDisplayValues()[0];
        const header = sheet.getRange(hRow, 1, 1, lastCol).getValues()[0];
        
        let details = { status: "AKTIF", bank: "-", name: "-", number: targetsMap[cellClean], sheet: sheetName };
        header.forEach((h, i) => {
          const head = h.toString().toUpperCase();
          if (head.includes("STATUS")) details.status = dataRow[i];
          if (head.includes("BANK")) details.bank = dataRow[i];
          if (head.includes("NAMA") || head.includes("NAME")) details.name = dataRow[i];
          if (head.includes("REKENING") || head.includes("NOMOR")) details.number = dataRow[i];
        });
        results.push({ accountNumber: targetsMap[cellClean], found: true, details: details });
        foundTargets.add(cellClean);
      }
    });
  }
  return results;
}

// --- OPTIMIZED GAME LIST (SERVER-SIDE SEARCH & DYNAMIC HEADER) ---
function getDaftarGames(params) {
  const s = getSheetRobust("DAFTAR GAMES WDBOS");
  if (!s) return { error: "Sheet 'DAFTAR GAMES WDBOS' tidak ditemukan" };
  
  const h = findHeaderRow(s, "NAMA GAMES");
  const lastRow = s.getLastRow();
  const lastCol = s.getLastColumn();
  
  if (lastRow <= h) return [];

  const queryStr = params && params.query ? params.query.toLowerCase().trim() : "";
  const queries = queryStr.split('\n').map(t => t.trim()).filter(t => t.length >= 3);
  
  // Get header row data to find column indices
  const headerData = s.getRange(h, 1, 1, lastCol).getValues()[0];
  const colIdx = { kategori: -1, provider: -1, nama: -1, gambar: -1 };
  
  for (let i = 0; i < headerData.length; i++) {
    const val = headerData[i] ? headerData[i].toString().toUpperCase().trim() : "";
    if (val.includes("KATEGORI")) colIdx.kategori = i;
    else if (val.includes("PROVIDER")) colIdx.provider = i;
    else if (val.includes("NAMA GAMES") || val.includes("GAME NAME") || val === "GAMES" || val === "GAME") colIdx.nama = i;
    else if (val.includes("LINK GAMBAR") || val.includes("IMAGE LINK") || val.includes("GAMBAR")) colIdx.gambar = i;
  }
  
  if (colIdx.nama === -1) {
    for (let i = 0; i < headerData.length; i++) {
      const hVal = headerData[i].toString().toUpperCase();
      if (hVal.includes("GAMES") || hVal.includes("NAMA")) { colIdx.nama = i; break; }
    }
  }
  
  if (colIdx.nama === -1) colIdx.nama = 2; 
  if (colIdx.provider === -1) colIdx.provider = 1;
  if (colIdx.kategori === -1) colIdx.kategori = 0;
  // If gambar still not found, try to find by common names
  if (colIdx.gambar === -1) {
    for (let i = 0; i < headerData.length; i++) {
      const hVal = headerData[i].toString().toUpperCase();
      if (hVal.includes("IMG") || hVal.includes("URL") || hVal.includes("PHOTO")) { colIdx.gambar = i; break; }
    }
  }

  Logger.log("Column Indices: " + JSON.stringify(colIdx));

  // Optimized Fetch - get all needed columns
  const maxIdx = Math.max(colIdx.nama, colIdx.provider, colIdx.kategori, colIdx.gambar);
  const data = s.getRange(h + 1, 1, lastRow - h, maxIdx + 1).getValues();
  
  const allCounts = {}; 
  const filtered = [];
  const q = queryStr; // Menggunakan variabel queryStr yang sudah didefinisikan di baris 162

  for (let i = 0; i < data.length; i++) {
    const r = data[i];
    if (!r[colIdx.nama]) continue;
    
    const kat = (r[colIdx.kategori] || "").toString().trim();
    const prov = (r[colIdx.provider] || "").toString().trim();
    const nama = (r[colIdx.nama] || "").toString().trim();
    
    // Hitung total database per provider+kategori
    if (prov || kat) {
      const key = prov + "|" + kat;
      allCounts[key] = (allCounts[key] || 0) + 1;
    }
    
    // Filter hasil pencarian
    if (!q || nama.toLowerCase().includes(q)) {
      if (filtered.length < 100) {
        filtered.push({
          kategori: kat,
          provider: prov,
          nama: nama,
          gambar: colIdx.gambar !== -1 ? r[colIdx.gambar] || "" : "",
          countKey: prov + "|" + kat
        });
      }
    }
  }

  // Masukkan total count ke hasil filter
  filtered.forEach(item => {
    item.totalGames = allCounts[item.countKey] || 0;
    delete item.countKey;
  });

  return {
    results: filtered,
    totalDatabase: data.length,
    providerCounts: allCounts
  };
}

function getSportsbookResults(params) {
  const url = 'https://sport.ibet288.com/_view/Result.aspx';
  const ss = getSS();
  let proxySheet = ss.getSheetByName("_DATA_SCRAPER_") || ss.insertSheet("_DATA_SCRAPER_");
  try {
    proxySheet.getRange("A1").setFormula(`=IMPORTXML("${url}", "//table[@id='dgResult']//tr")`);
    Utilities.sleep(3000);
    const data = proxySheet.getDataRange().getValues();
    if (data.length <= 1 || data[0][0] === "#N/A") {
      const res = UrlFetchApp.fetch(url, { muteHttpExceptions: true, headers: { 'User-Agent': 'Mozilla/5.0' } });
      return { html: res.getContentText() };
    }
    return { tableData: data };
  } catch (e) { return { error: e.message }; }
}

function getBackupKesalahan(params) {
  const sheet = getSheetRobust("KESALAHAN LC");
  if (!sheet) return { error: "Sheet not found" };
  const filterDate = params && params.date ? params.date.toString().toLowerCase().trim() : "";
  const data = sheet.getDataRange().getValues(), summary = {};
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let currentDate = "";
  for (let i = 0; i < data.length; i++) {
    const colA = data[i][0] ? data[i][0].toString().trim() : "";
    let colB = data[i][1], colBStr = colB instanceof Date ? colB.getDate() + " " + months[colB.getMonth()] + " " + colB.getFullYear() : (colB ? colB.toString().trim() : "");
    if (!colA && colBStr && colBStr.toLowerCase() !== "tanggal /screenshot") { currentDate = colBStr.trim(); continue; }
    if (colA && colA.toLowerCase() !== "nama staff" && !colA.toLowerCase().includes("coming soon")) {
      let dateMatch = filterDate ? (currentDate.toLowerCase().trim() === filterDate.toLowerCase().trim()) : true;
      if (dateMatch) {
        const name = colA, ket = data[i][2] ? data[i][2].toString().trim() : "-";
        if (!summary[name]) summary[name] = { name: name, mistakes: 0, notes: 0, lastDate: currentDate, details: [] };
        if (ket.toLowerCase().includes("note")) summary[name].notes++; else summary[name].mistakes++;
        if (ket && ket !== "-") summary[name].details.push(ket + "[SS]" + (data[i][1] || ""));
      }
    }
  }
  return Object.values(summary).map((item, idx) => {
    const total = item.mistakes + Math.floor(item.notes / 3);
    return [idx + 1, item.name, item.lastDate.toUpperCase(), `M: ${item.mistakes} | N: ${item.notes}`, total > 2 ? "TINGGAL 2" : "NORMAL", total, item.details.join(" || ")];
  });
}

function getSheetRobust(n) { const ss = getSS(); if (!ss) return null; const s = n.toLowerCase().trim(); for (let sh of ss.getSheets()) { if (sh.getName().toLowerCase().trim().includes(s)) return sh; } return null; }
function findHeaderRow(s, k) { const d = s.getRange(1, 1, 10, 10).getValues(); for (let i = 0; i < d.length; i++) { for (let j = 0; j < d[i].length; j++) { if (d[i][j] && d[i][j].toString().toLowerCase().includes(k.toLowerCase())) return i + 1; } } return 1; }
function getKesalahan() { const s = getSheetRobust("DATA KESALAHAN"); if (!s) return []; const h = findHeaderRow(s, "NAMA STAFF"); return s.getDataRange().getValues().slice(h).filter(r => r[1]); }
function getInventaris() { const s = getSheetRobust("DATA INVENTARIS"); if (!s) return []; const h = findHeaderRow(s, "NAMA REKENING"); return s.getDataRange().getValues().slice(h).filter(r => r[1]); }
function getIzinKeluar() { const s = getSheetRobust("IZIN KELUAR SISA 2"); if (!s) return []; const h = findHeaderRow(s, "NAMA STAFF"); return s.getDataRange().getValues().slice(h).filter(r => r[0]); }
function getNotesSheet() { const ss = getSS(); let s = ss.getSheetByName("_SYSTEM_NOTES_") || ss.insertSheet("_SYSTEM_NOTES_"); if (s.getLastRow() === 0) s.appendRow(["ID", "JUDUL", "ISI", "CREATED_AT", "UPDATED_AT"]); return s; }
function getNotes() { const d = getNotesSheet().getDataRange().getValues(); return d.length <= 1 ? [] : d.slice(1).map(r => ({ id: r[0], judul: r[1], isi: r[2], createdAt: r[3], updatedAt: r[4] })).reverse(); }
function addNote(j, i) { const id = "note_" + Date.now(); getNotesSheet().appendRow([id, j, i, new Date().toISOString(), new Date().toISOString()]); return { success: true, id: id }; }
function updateNote(id, j, i) { const s = getNotesSheet(), d = s.getDataRange().getValues(); for (let r = 1; r < d.length; r++) { if (d[r][0] == id) { s.getRange(r + 1, 2, 1, 2).setValues([[j, i]]); s.getRange(r + 1, 5).setValue(new Date().toISOString()); return { success: true }; } } return { error: "Not found" }; }
function deleteNote(id) { const s = getNotesSheet(), d = s.getDataRange().getValues(); for (let r = 1; r < d.length; r++) { if (d[r][0] == id) { s.deleteRow(r + 1); return { success: true }; } } return { error: "Not found" }; }
function scrapeWdbos() { const url = 'https://wdbos.net/office/game-oc/game/getNodeInfoList?parentId=9796'; try { const res = UrlFetchApp.fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, muteHttpExceptions: true }); const json = JSON.parse(res.getContentText()), d = json.data || []; return d.map(it => { const info = it.lotteryNodeFetchOutDto || {}, att = info.attachInfo || {}; return { market: info.gameName || '?', result: att.winningNumber || '----', period: info.gameDetail || '-', countdown: info.countDown > 0 ? [Math.floor(info.countDown/3600), Math.floor((info.countDown%3600)/60), info.countDown%60].map(v => v.toString().padStart(2,'0')).join(':') : '00:00:00', image: 'https://wdbos.net' + (info.iconPath || ''), banner: 'https://wdbos.net' + (info.bgPath || '') }; }).filter(it => it.market !== '?'); } catch (e) { return { error: e.message }; } }
function saveTogelData(d) { const ss = getSS(); (ss.getSheetByName("_SYSTEM_TOGEL_") || ss.insertSheet("_SYSTEM_TOGEL_")).getRange(1, 1).setValue(JSON.stringify(d)); return { success: true }; }
function getTogelData() { const s = getSS().getSheetByName("_SYSTEM_TOGEL_"); return s ? JSON.parse(s.getRange(1, 1).getValue() || "[]") : []; }
function handleFileUpload(b64, fn, fid) { try { const bytes = Utilities.base64Decode(b64.includes(',') ? b64.split(',')[1] : b64); const folder = fid ? DriveApp.getFolderById(fid) : DriveApp.getRootFolder(); const file = folder.createFile(Utilities.newBlob(bytes, "image/jpeg", fn)); try { file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch(e) {} return { success: true, id: file.getId(), url: "https://drive.google.com/uc?export=view&id=" + file.getId() }; } catch (e) { return { error: e.message }; } }
function listFiles(fid) { try { const folder = DriveApp.getFolderById(fid || CONFIG.FOLDER_GALLERY_ID), files = folder.getFiles(); let res = []; while (files.hasNext()) { let f = files.next(); res.push({ id: f.getId(), name: f.getName(), size: (f.getSize() / 1048576).toFixed(2) + " MB", url: "https://drive.google.com/uc?id=" + f.getId() }); } return res; } catch (e) { return { error: e.message }; } }
function deleteFile(id) { try { DriveApp.getFileById(id).setTrashed(true); return { success: true }; } catch (e) { return { error: e.message }; } }
function updateBackground(u) { const ss = getSS(); let s = getSheetRobust("SB_SETTINGS") || ss.insertSheet("SB_SETTINGS"); if (s.getLastRow() === 0) s.appendRow(["KEY", "VALUE"]); const d = s.getDataRange().getValues(); let f = false; for (let i = 0; i < d.length; i++) { if (d[i][0] === "BACKGROUND_URL") { s.getRange(i + 1, 2).setValue(u); f = true; break; } } if (!f) s.appendRow(["BACKGROUND_URL", u]); return { success: true }; }
function getBackground() { const s = getSheetRobust("SB_SETTINGS"); if (!s) return { url: "" }; const d = s.getDataRange().getValues(); for (let i = 0; i < d.length; i++) { if (d[i][0] === "BACKGROUND_URL") return { url: d[i][1] }; } return { url: "" }; }

// --- PENDINGAN DATA FETCHING ---
function getPendinganData(params) {
  try {
    const ssId = '1Oo3eeOSThbcEzUk62F14RHx1WBMrRHyoosLvf0u895Y';
    const ss = SpreadsheetApp.openById(ssId);
    if (!ss) return { error: "Spreadsheet tidak bisa diakses. Cek izin akses." };
    
    const sheets = ss.getSheets();
    const sheetNames = sheets.map(s => s.getName());
    
    const targetSheetName = (params && params.sheetName) ? params.sheetName : sheetNames[0];
    const sheet = ss.getSheetByName(targetSheetName);
    
    if (!sheet) return { error: "Sheet " + targetSheetName + " tidak ditemukan." };
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getDisplayValues(); 
    
    return {
      sheetNames: sheetNames,
      currentSheet: targetSheetName,
      data: values
    };
  } catch (e) {
    return { error: "Error reading Pendingan: " + e.message };
  }
}
