// ==========================================
// CYBER HUD CORE SYSTEM - GOOGLE APPS SCRIPT
// ==========================================

/**
 * CONFIGURATION
 */
const CONFIG = {
  FOLDER_GALLERY_ID: '1CLolADOa94s8tKp9r1mG19YhYNBDHnku',
  FOLDER_EXTENSIONS_ID: '1QaWxbEajWCL2BBTAQLiFLERCpUEg7TTV',
  FOLDER_BACKGROUND_ID: '1CLolADOa94s8tKp9r1mG19YhYNBDHnku',
  // Jika script ini standalone (bukan dari spreadsheet), masukkan ID Spreadsheet di sini
  SPREADSHEET_ID: '1L2WYrWFbQyssIxy7qV-2xnxWyzTCYJfsGjk6a5rbLdc' 
};

// Jalankan fungsi ini satu kali di Editor untuk memberikan izin Akses Drive & Sheet
function authorizeEverything() {
  const ss = getSS();
  const folder = DriveApp.getRootFolder();
  Logger.log("Izin berhasil diberikan!");
}
function getSS() {
  try {
    if (CONFIG.SPREADSHEET_ID) return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    return SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {
    return null;
  }
}

function doGet(e) {
  const action = e.parameter.action;
  
  if (!action) {
    return HtmlService.createHtmlOutputFromFile('index')
        .setTitle('Cyber HUD - Dashboard SB')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }
  
  return handleAction(e.parameter);
}

function doPost(e) {
  let postData;
  try {
    postData = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Invalid JSON payload" }))
        .setMimeType(ContentService.MimeType.JSON);
  }
  
  return handleAction(postData);
}

function handleAction(params) {
  const action = params.action;
  const callback = params.callback; // For JSONP support
  let result;
  
  try {
    switch (action) {
      // 1. DATA KESALAHAN STAFF
      case 'getKesalahan':
        result = getKesalahan();
        break;
      
      // 2. DATA INVENTARIS HP WDBOS
      case 'getInventaris':
        result = getInventaris();
        break;
      
      // 3. DATA IZIN KELUAR SISA 2
      case 'getIzinKeluar':
        result = getIzinKeluar();
        break;
        
      // 4. CEK DATA REKENING
      case 'checkAccountsBatch':
        result = { results: checkAccountsBatch(params.accounts) };
        break;
        
      // 5. NOTEPAD SYSTEM
      case 'getAll':
        result = getNotes();
        break;
      case 'add':
        result = addNote(params.judul, params.isi);
        break;
      case 'update':
        result = updateNote(params.id, params.judul, params.isi);
        break;
      case 'delete':
        result = deleteNote(params.id);
        break;
        
      // 6. TOGEL DATA
      case 'scrapeWdbos':
        result = scrapeWdbos();
        break;
      case 'saveTogelData':
        result = saveTogelData(params.data);
        break;
        
      // 7. DRIVE OPERATIONS
      case 'uploadImage':
        result = handleFileUpload(params.base64, params.filename, params.folderId);
        break;
      case 'listFiles':
        result = listFiles(params.folderId);
        break;
      case 'deleteFile':
        result = deleteFile(params.fileId);
        break;
        
      case 'authorize':
        result = { success: true, message: "Authorization confirmed" };
        break;
      case 'getBackground':
        result = getBackground();
        break;
      case 'updateBackground':
        if (!params.url) throw new Error("URL parameter is missing");
        result = updateBackground(params.url);
        break;

      // 8. SYSTEM
      case 'testConnection':
        result = testConnection();
        break;
        
      default:
        result = { error: "Action not found: " + action };
    }
  } catch (err) {
    result = { error: err.message };
  }
  
  const jsonResponse = JSON.stringify(result);
  
  if (callback) {
    // Return as JSONP
    return ContentService.createTextOutput(callback + "(" + jsonResponse + ")")
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
  } else {
    // Return as pure JSON
    return ContentService.createTextOutput(jsonResponse)
        .setMimeType(ContentService.MimeType.JSON);
  }
}


// --- MODULE: DATA FETCHING ---

function getSheetRobust(name) {
  const ss = getSS();
  if (!ss) return null;
  const sheets = ss.getSheets();
  const normalizedSearch = name.toString().toLowerCase().trim();
  
  for (let i = 0; i < sheets.length; i++) {
    const sheetName = sheets[i].getName().toLowerCase().trim();
    if (sheetName === normalizedSearch || sheetName.includes(normalizedSearch)) return sheets[i];
  }
  return null;
}

function findHeaderRow(sheet, keyword) {
  const maxRows = sheet.getMaxRows();
  const maxCols = sheet.getMaxColumns();
  const numRows = Math.min(10, maxRows > 0 ? maxRows : 1);
  const numCols = Math.min(10, maxCols > 0 ? maxCols : 1);
  
  if (numRows === 0 || numCols === 0) return 1;
  
  const data = sheet.getRange(1, 1, numRows, numCols).getValues(); // Search safely
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      if (data[i][j] && data[i][j].toString().toLowerCase().includes(keyword.toLowerCase())) {
        return i + 1; // Return 1-based row index
      }
    }
  }
  return 1; // Default to first row
}

function getKesalahan() {
  const sheet = getSheetRobust("DATA KESALAHAN");
  if (!sheet) return { error: "Sheet 'DATA KESALAHAN' tidak ditemukan." };
  const headerRow = findHeaderRow(sheet, "NAMA STAFF");
  const rows = sheet.getDataRange().getValues();
  return rows.slice(headerRow).filter(row => row[1] && row[1].toString().trim() !== "");
}

function getInventaris() {
  const sheet = getSheetRobust("DATA INVENTARIS HP WDBOS");
  if (!sheet) return { error: "Sheet 'DATA INVENTARIS HP WDBOS' tidak ditemukan." };
  const headerRow = findHeaderRow(sheet, "NAMA REKENING");
  const rows = sheet.getDataRange().getValues();
  return rows.slice(headerRow).filter(row => row[1] && row[1].toString().trim() !== "");
}

function getIzinKeluar() {
  const sheet = getSheetRobust("IZIN KELUAR SISA 2");
  if (!sheet) return { error: "Sheet 'IZIN KELUAR SISA 2' tidak ditemukan." };
  const headerRow = findHeaderRow(sheet, "NAMA STAFF");
  const rows = sheet.getDataRange().getValues();
  return rows.slice(headerRow).filter(row => row[0] && row[0].toString().trim() !== "");
}

// --- MODULE: CEK REKENING ---

function checkAccountsBatch(accountNumbers) {
  if (!accountNumbers || !Array.isArray(accountNumbers)) return [];
  
  const ss = getSS();
  if (!ss) return { error: "Could not access spreadsheet." };
  const sheetsToSearch = [
    "BANK KAS BERSIH DAN KOTOR", "BANK WD BERSIH DAN KOTOR", "BANK DEPOSIT",
    "BANK E-WALLET DANA", "BANK E-WALLET GOPAY", "BANK E-WALLET OVO", "BANK E-WALLET LINKAJA"
  ];
  
  let results = [];
  
  sheetsToSearch.forEach(name => {
    const sheet = ss.getSheetByName(name);
    if (!sheet) return;
    
    const data = sheet.getDataRange().getValues();
    data.forEach(row => {
      const norek = row[3] ? row[3].toString().trim() : "";
      if (norek && accountNumbers.includes(norek)) {
        results.push({
          accountNumber: norek,
          found: true,
          details: {
            status: row[0] || "TIDAK ADA STATUS",
            bank: row[1] || "-",
            name: row[2] || "-",
            number: norek,
            sheet: name
          }
        });
      }
    });
  });
  
  return results;
}

// --- MODULE: NOTEPAD (Using a hidden sheet for persistence) ---

function getNotesSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("_SYSTEM_NOTES_");
  if (!sheet) {
    sheet = ss.insertSheet("_SYSTEM_NOTES_");
    sheet.appendRow(["ID", "JUDUL", "ISI", "CREATED_AT", "UPDATED_AT"]);
    sheet.hideSheet();
  }
  return sheet;
}

function getNotes() {
  const sheet = getNotesSheet();
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  return data.slice(1).map(row => ({
    id: row[0],
    judul: row[1],
    isi: row[2],
    createdAt: row[3],
    updatedAt: row[4]
  })).reverse(); // Newest first
}

function addNote(judul, isi) {
  const sheet = getNotesSheet();
  const id = "note_" + new Date().getTime();
  const now = new Date().toISOString();
  sheet.appendRow([id, judul, isi, now, now]);
  return { success: true, id: id };
}

function updateNote(id, judul, isi) {
  const sheet = getNotesSheet();
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      sheet.getRange(i + 1, 2, 1, 2).setValues([[judul, isi]]);
      sheet.getRange(i + 1, 5).setValue(new Date().toISOString());
      return { success: true };
    }
  }
  return { error: "Note not found" };
}

function deleteNote(id) {
  const sheet = getNotesSheet();
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { error: "Note not found" };
}

// --- MODULE: TOGEL DATA ---

function getTogelSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("_SYSTEM_TOGEL_");
  if (!sheet) {
    sheet = ss.insertSheet("_SYSTEM_TOGEL_");
    sheet.appendRow(["DATA_JSON"]);
    sheet.hideSheet();
  }
  return sheet;
}

function getTogelData() {
  const sheet = getTogelSheet();
  const val = sheet.getRange(2, 1).getValue();
  return val ? JSON.parse(val) : [];
}

function saveTogelData(data) {
  const sheet = getTogelSheet();
  sheet.getRange(2, 1).setValue(JSON.stringify(data));
  return { success: true };
}

/**
 * SCRAPER: Realtime Lottery Results from WDBOS
 */
function scrapeWdbos() {
  const url = 'https://wdbos.net/office/game-oc/game/getNodeInfoList';
  const payload = {
    parentId: 2,   // Number 2 is for Lottery category
    language: "id-ID"
  };
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Origin': 'https://wdbos.net',
      'Referer': 'https://wdbos.net/'
    }
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    const text = response.getContentText();
    const json = JSON.parse(text);
    
    // Check if result or data is available
    if (!json || (!json.result && !json.data)) return { error: "Failed to fetch data from WDBOS" };
    
    const dataArray = json.result || json.data;
    if (!Array.isArray(dataArray)) return { error: "Invalid data format from WDBOS" };

    const lastUpdateTs = new Date().toLocaleTimeString('id-ID');
    
    return dataArray.map(item => {
      const info = item.lotteryNodeFetchOutDto || {};
      const attach = info.attachInfo || {};
      
      let rawRes = attach.winningNumber || "----";
      
      return {
        market: info.gameName || 'UNKNOWN',
        result: rawRes,
        period: info.gameDetail || '-',
        countdown: 'UPDATE: ' + lastUpdateTs,
        image: attach.iconUrl || '',
        banner: attach.bgUrl || ''
      };
    }).filter(it => it.market !== 'UNKNOWN');
    
  } catch (e) {
    return { error: "Scraper Error: " + e.message };
  }
}

// --- MODULE: DRIVE OPERATIONS ---

function handleFileUpload(base64, filename, folderId) {
  try {
    if (!base64) throw new Error("File data is missing");
    
    const rawBase64 = base64.includes(',') ? base64.split(',')[1] : base64;
    const bytes = Utilities.base64Decode(rawBase64);
    const blob = Utilities.newBlob(bytes, "image/jpeg", filename);
    
    // Create directly in ROOT as fallback
    const file = DriveApp.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    // Try to move to folder, but don't fail if it doesn't work
    try {
      const targetId = folderId || CONFIG.FOLDER_GALLERY_ID || '';
      if (targetId) {
        const folder = DriveApp.getFolderById(targetId);
        folder.addFile(file);
        DriveApp.getRootFolder().removeFile(file);
      }
    } catch (moveErr) {
      console.log("Could not move file to folder, keeping in root.");
    }

    return {
      success: true,
      id: file.getId(),
      url: "https://drive.google.com/uc?export=view&id=" + file.getId()
    };
  } catch (err) {
    return { error: "Drive Error: " + err.message };
  }
}

function listFiles(folderId) {
  const folder = DriveApp.getFolderById(folderId || CONFIG.FOLDER_GALLERY_ID);
  const files = folder.getFiles();
  let result = [];
  
  while (files.hasNext()) {
    const file = files.next();
    result.push({
      id: file.getId(),
      name: file.getName(),
      size: (file.getSize() / (1024 * 1024)).toFixed(2) + " MB",
      url: file.getUrl()
    });
  }
  return result;
}

function deleteFile(fileId) {
  try {
    const file = DriveApp.getFileById(fileId);
    file.setTrashed(true);
    return { success: true };
  } catch (e) {
    return { error: e.message };
  }
}

function testConnection() {
  var ssStatus = 'Error';
  var driveStatus = 'Error';
  var ssName = 'Unknown';
  
  try {
    var ss = getSS();
    if (ss) {
      ssStatus = 'Connected';
      ssName = ss.getName();
    } else {
      ssStatus = 'Disconnected (Cannot Open Spreadsheet)';
    }
  } catch (e) { ssStatus = 'Error: ' + e.message; }
  
  try {
    var folder = DriveApp.getFolderById(CONFIG.FOLDER_GALLERY_ID);
    if (folder) driveStatus = 'Connected';
  } catch (e) { driveStatus = 'Error: ' + e.message; }

  return {
    status: 'success',
    message: 'Koneksi ke Google Apps Script Berhasil!',
    timestamp: new Date().toISOString(),
    details: {
      spreadsheet: ssStatus,
      spreadsheetName: ssName,
      drive: driveStatus
    }
  };
}
function updateBackground(url) {
  if (!url) url = ""; // Handle null/undefined
  const sheetName = "SB_SETTINGS";
  let sheet = getSheetRobust(sheetName);
  const ss = getSS();
  
  if (!sheet) {
    if (!ss) return { error: "No Spreadsheet connected" };
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(["KEY", "VALUE"]);
  }
  
  const data = sheet.getDataRange().getValues();
  let found = false;
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === "BACKGROUND_URL") {
      sheet.getRange(i + 1, 2).setValue(url);
      found = true;
      break;
    }
  }
  
  if (!found) {
    sheet.appendRow(["BACKGROUND_URL", url]);
  }
  
  return { success: true, url: url, message: "URL updated in sheet: " + url };
}

function getBackground() {
  const sheet = getSheetRobust("SB_SETTINGS");
  if (!sheet) return { url: "" };
  
  const data = sheet.getDataRange().getValues();
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === "BACKGROUND_URL") {
      return { url: data[i][1] };
    }
  }
  return { url: "" };
}
