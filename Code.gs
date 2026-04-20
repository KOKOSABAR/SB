const CONFIG = {
  FOLDER_GALLERY_ID: '1CLolADOa94s8tKp9r1mG19YhYNBDHnku',
  FOLDER_EXTENSIONS_ID: '1QaWxbEajWCL2BBTAQLiFLERCpUEg7TTV',
  SPREADSHEET_ID: '1L2WYrWFbQyssIxy7qV-2xnxWyzTCYJfsGjk6a5rbLdc' 
};

function getSS() {
  try {
    if (CONFIG.SPREADSHEET_ID) return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    return SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) { return null; }
}

function doGet(e) {
  const action = e.parameter.action;
  if (!action) {
    return HtmlService.createHtmlOutputFromFile('index').setTitle('Cyber HUD - Dashboard SB')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1');
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
      case 'getSportsbookResults': result = getSportsbookResults(); break;
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
      case 'testConnection': result = { status: 'success', timestamp: new Date().toISOString() }; break;
      default: result = { error: "Action not found: " + action };
    }
  } catch (err) { result = { error: err.message }; }
  const jsonResponse = JSON.stringify(result);
  if (callback) return ContentService.createTextOutput(callback + "(" + jsonResponse + ")").setMimeType(ContentService.MimeType.JAVASCRIPT);
  return ContentService.createTextOutput(jsonResponse).setMimeType(ContentService.MimeType.JSON);
}

function checkAccountsBatch(accountNumbers) {
  if (!accountNumbers || !Array.isArray(accountNumbers)) return [];
  const ss = getSS();
  const sheetsToSearch = ["BANK KAS BERSIH DAN KOTOR", "BANK WD BERSIH DAN KOTOR", "BANK DEPOSIT", "BANK E-WALLET DANA", "BANK E-WALLET GOPAY", "BANK E-WALLET OVO", "BANK E-WALLET LINKAJA"];
  let results = [];
  const searchNumbers = accountNumbers.map(n => n.toString().replace(/\D/g, ''));
  sheetsToSearch.forEach(name => {
    const sheet = ss.getSheetByName(name);
    if (!sheet) return;
    const data = sheet.getDataRange().getValues();
    if (data.length === 0) return;
    let norekCol = -1, statusCol = 0, bankCol = 1, nameCol = 2;
    const firstRow = data[0];
    for (let j = 0; j < firstRow.length; j++) {
      const h = firstRow[j].toString().toLowerCase();
      if (h.includes("nomor") || h.includes("rekening") || h.includes("norek")) norekCol = j;
      if (h.includes("status")) statusCol = j;
      if (h.includes("bank")) bankCol = j;
      if (h.includes("nama")) nameCol = j;
    }
    if (norekCol === -1) norekCol = 3;
    for (let i = 1; i < data.length; i++) {
      let rawVal = data[i][norekCol] ? data[i][norekCol].toString() : "";
      if (rawVal.includes('E+') || rawVal.includes('e+')) {
         try { rawVal = BigInt(data[i][norekCol]).toString(); } catch(e) {}
      }
      const cleanVal = rawVal.replace(/\D/g, '');
      if (cleanVal && searchNumbers.indexOf(cleanVal) !== -1) {
        results.push({ 
          accountNumber: cleanVal, found: true, 
          details: { status: data[i][statusCol] || "AKTIF", bank: data[i][bankCol] || "-", name: data[i][nameCol] || "-", number: cleanVal, sheet: name } 
        });
      }
    }
  });
  return results;
}

function getSportsbookResults() {
  const url = 'https://sport.ibet288.com/_view/Result.aspx';
  const ss = getSS();
  let proxySheet = ss.getSheetByName("_DATA_SCRAPER_") || ss.insertSheet("_DATA_SCRAPER_");
  if (!proxySheet.isSheetHidden()) proxySheet.hideSheet();
  try {
    proxySheet.getRange("A1").setFormula(`=IMPORTXML("${url}", "//table[@id='dgResult']//tr")`);
    Utilities.sleep(3000);
    const data = proxySheet.getDataRange().getValues();
    if (data.length <= 1 || data[0][0] === "#N/A" || data[0][0] === "") {
      const res = UrlFetchApp.fetch(url, { muteHttpExceptions: true, headers: { 'User-Agent': 'Mozilla/5.0 Chrome/124.0.0.0' } });
      return { html: res.getContentText() };
    }
    return { tableData: data };
  } catch (e) { return { error: e.message }; }
}

function getBackupKesalahan(params) {
  const sheet = getSheetRobust("KESALAHAN LC");
  if (!sheet) return { error: "Sheet not found" };
  const filterDate = params && params.date ? params.date.toString().toLowerCase().trim() : "";
  const data = sheet.getDataRange().getValues(), summary = {}, months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let currentDate = "";
  for (let i = 0; i < data.length; i++) {
    const colA = data[i][0] ? data[i][0].toString().trim() : "";
    let colB = data[i][1], colBStr = colB instanceof Date ? colB.getDate() + " " + months[colB.getMonth()] + " " + colB.getFullYear() : (colB ? colB.toString().trim() : "");
    if (!colA && colBStr && !colBStr.includes("http") && colBStr.toLowerCase() !== "tanggal /screenshot") { currentDate = colBStr.trim(); continue; }
    if (colA && colA.toLowerCase() !== "nama staff" && !colA.toLowerCase().includes("coming soon")) {
      let dateMatch = filterDate ? (currentDate.toLowerCase().trim() === filterDate.toLowerCase().trim() || currentDate.toLowerCase().replace("april", "apr") === filterDate.toLowerCase().replace("april", "apr")) : true;
      if (dateMatch) {
        const name = colA, ket = data[i][2] ? data[i][2].toString().trim() : "-";
        if (!summary[name]) summary[name] = { name: name, mistakes: 0, notes: 0, lastDate: currentDate || "-", details: [] };
        if (ket.toLowerCase().includes("note")) summary[name].notes++; else summary[name].mistakes++;
        if (currentDate) summary[name].lastDate = currentDate;
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
function scrapeWdbos() { const url = 'https://wdbos.net/office/game-oc/game/getNodeInfoList?parentId=9796'; try { const res = UrlFetchApp.fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, muteHttpExceptions: true }); const json = JSON.parse(res.getContentText()), d = json.data || [], ts = new Date().toLocaleTimeString('id-ID'); return d.map(it => { const info = it.lotteryNodeFetchOutDto || {}, att = info.attachInfo || {}; return { market: info.gameName || '?', result: att.winningNumber || '----', period: info.gameDetail || '-', countdown: info.countDown > 0 ? [Math.floor(info.countDown/3600), Math.floor((info.countDown%3600)/60), info.countDown%60].map(v => v.toString().padStart(2,'0')).join(':') : '00:00:00', image: 'https://wdbos.net' + (info.iconPath || ''), banner: 'https://wdbos.net' + (info.bgPath || '') }; }).filter(it => it.market !== '?'); } catch (e) { return { error: e.message }; } }
function saveTogelData(d) { const ss = getSS(); (ss.getSheetByName("_SYSTEM_TOGEL_") || ss.insertSheet("_SYSTEM_TOGEL_")).getRange(1, 1).setValue(JSON.stringify(d)); return { success: true }; }
function getTogelData() { const s = getSS().getSheetByName("_SYSTEM_TOGEL_"); return s ? JSON.parse(s.getRange(1, 1).getValue() || "[]") : []; }
function handleFileUpload(b64, fn, fid) { try { const bytes = Utilities.base64Decode(b64.includes(',') ? b64.split(',')[1] : b64), folder = fid ? DriveApp.getFolderById(fid) : DriveApp.getRootFolder(), file = folder.createFile(Utilities.newBlob(bytes, "image/jpeg", fn)); file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); return { success: true, id: file.getId(), url: "https://drive.google.com/uc?export=view&id=" + file.getId() }; } catch (e) { return { error: e.message }; } }
function listFiles(fid) { try { const folder = DriveApp.getFolderById(fid || CONFIG.FOLDER_GALLERY_ID), files = folder.getFiles(); let res = []; while (files.hasNext()) { let f = files.next(); res.push({ id: f.getId(), name: f.getName(), size: (f.getSize() / 1048576).toFixed(2) + " MB", url: "https://drive.google.com/uc?id=" + f.getId() }); } return res; } catch (e) { return { error: e.message }; } }
function deleteFile(id) { try { DriveApp.getFileById(id).setTrashed(true); return { success: true }; } catch (e) { return { error: e.message }; } }
function updateBackground(u) { const ss = getSS(); let s = getSheetRobust("SB_SETTINGS") || ss.insertSheet("SB_SETTINGS"); if (s.getLastRow() === 0) s.appendRow(["KEY", "VALUE"]); const d = s.getDataRange().getValues(); let f = false; for (let i = 0; i < d.length; i++) { if (d[i][0] === "BACKGROUND_URL") { s.getRange(i + 1, 2).setValue(u); f = true; break; } } if (!f) s.appendRow(["BACKGROUND_URL", u]); return { success: true }; }
function getBackground() { const s = getSheetRobust("SB_SETTINGS"); if (!s) return { url: "" }; const d = s.getDataRange().getValues(); for (let i = 0; i < d.length; i++) { if (d[i][0] === "BACKGROUND_URL") return { url: d[i][1] }; } return { url: "" }; }
