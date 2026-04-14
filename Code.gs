const SHEET_NAME = 'SB';
const SCRIPT_PROPERTIES = 'pk_online_properties';
const TOGEL_SHEET_NAME = 'TOGEL DATA';

let sheet = null;
let togelsheet = null;

function getSheet() {
  if (sheet !== null) {
    return sheet;
  }
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    setupHeaders();
  }

  return sheet;
}

function setupHeaders() {
  const sheet = getSheet();
  const headers = ['JUDUL', 'ISI'];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#0a0a0a')
    .setFontColor('#00ff41');

  sheet.setFrozenRows(1);
}

function getAllNotes() {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    return [];
  }

  const data = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  const notes = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (row[0] || row[1]) {
      notes.push({
        id: `gs_${i + 2}`, // Stable ID based on row index
        judul: row[0],
        isi: row[1],
        rowIndex: i + 2
      });
    }
  }

  return notes;
}

function addNote(judul, isi) {
  const sheet = getSheet();
  const timestamp = new Date().toISOString();
  const newRow = [judul, isi];

  sheet.appendRow(newRow);

  const lastRow = sheet.getLastRow();

  return {
    id: `gs_${lastRow}`,
    judul: judul,
    isi: isi,
    createdAt: timestamp,
    updatedAt: timestamp,
    rowIndex: lastRow
  };
}

function updateNote(id, judul, isi) {
  const sheet = getSheet();
  const rowIndex = parseInt(id.replace('gs_', ''));

  if (isNaN(rowIndex)) {
    throw new Error('ID tidak valid');
  }

  sheet.getRange(rowIndex, 1).setValue(judul);
  sheet.getRange(rowIndex, 2).setValue(isi);

  return {
    id: id,
    judul: judul,
    isi: isi,
    rowIndex: rowIndex,
    updatedAt: new Date().toISOString()
  };
}

function deleteNote(id) {
  const sheet = getSheet();
  const rowIndex = parseInt(id.replace('gs_', ''));

  if (isNaN(rowIndex)) {
    throw new Error('ID tidak valid');
  }

  sheet.deleteRow(rowIndex);

  return { success: true };
}

function searchNotes(keyword) {
  const notes = getAllNotes();

  if (!keyword) {
    return notes;
  }

  const filtered = notes.filter(note =>
    note.judul.toLowerCase().includes(keyword.toLowerCase())
  );

  return filtered;
}

function doGet(e) {
  const action = e.parameter.action;

  let result;

  try {
    switch (action) {
      case 'getAll':
        result = getAllNotes();
        break;
      case 'add':
        const judul = e.parameter.judul;
        const isi = e.parameter.isi || '';
        result = addNote(judul, isi);
        break;
      case 'update':
        const updateId = e.parameter.id;
        const updateJudul = e.parameter.judul;
        const updateIsi = e.parameter.isi || '';
        result = updateNote(updateId, updateJudul, updateIsi);
        break;
      case 'delete':
        const deleteId = e.parameter.id;
        result = deleteNote(deleteId);
        break;
      case 'search':
        const keyword = e.parameter.keyword || '';
        result = searchNotes(keyword);
        break;
      case 'getTogelData':
        result = getTogelData();
        break;
      default:
        result = { error: 'Action tidak valid' };
    }
  } catch (error) {
    result = { error: error.message };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let result;

  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;

    switch (action) {
      case 'saveTogelData':
        result = saveTogelData(payload.data);
        break;
      default:
        result = { error: 'Action tidak valid' };
    }
  } catch (error) {
    result = { error: error.message };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function getTogelSheet() {
  if (togelsheet !== null) {
    return togelsheet;
  }
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  togelsheet = spreadsheet.getSheetByName(TOGEL_SHEET_NAME);

  if (!togelsheet) {
    togelsheet = spreadsheet.insertSheet(TOGEL_SHEET_NAME);
    setupTogelHeaders();
  }

  return togelsheet;
}

function setupTogelHeaders() {
  const sheet = getTogelSheet();
  const headers = ['NAMA', 'BET_CLOSE', 'RESULT', 'LINK_RESMI', 'LINK_ACUAN', 'LOGO'];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#0a0a0a')
    .setFontColor('#00ff41');

  sheet.setFrozenRows(1);
}

function getTogelData() {
  const sheet = getTogelSheet();
  const lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    return [];
  }

  const data = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
  const togels = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (row[0]) {
      togels.push({
        nama: row[0],
        betClose: row[1],
        result: row[2],
        linkResmi: row[3],
        linkAcuan: row[4],
        logo: row[5]
      });
    }
  }

  return togels;
}

function saveTogelData(togelData) {
  if (!togelData || !Array.isArray(togelData)) {
    return { error: 'Data tidak valid' };
  }

  const sheet = getTogelSheet();
  const maxRows = sheet.getMaxRows();
  if (maxRows > 1) {
    sheet.deleteRows(2, maxRows - 1);
  }

  for (let i = 0; i < togelData.length; i++) {
    const t = togelData[i];
    sheet.appendRow([
      t.nama || '',
      t.betClose || '',
      t.result || '',
      t.linkResmi || '',
      t.linkAcuan || '',
      t.logo || ''
    ]);
  }

  return { success: true, count: togelData.length };
}

function setupTrigger() {
  ScriptApp.newTrigger('cleanupOldTriggers')
    .timeBased()
    .everyHours(1)
    .create();
}

function cleanupOldTriggers() {
  const triggers = ScriptApp.getProjectTriggers();

  for (let i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'cleanupOldTriggers') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}

function initializeSheet() {
  getSheet();
  return 'Sheet "SB" siap digunakan!';
}

function testConnection() {
  try {
    const sheet = getSheet();
    const notes = getAllNotes();
    return {
      success: true,
      sheetName: SHEET_NAME,
      totalNotes: notes.length,
      message: 'Koneksi ke Google Sheet berhasil!'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}
