/**
 * Innotek Process Map — Apps Script backend.
 *
 * Storage model: every "Save Version" from the app appends a NEW ROW to the
 * "Versions" sheet — nothing is ever overwritten. That gives the MD a full,
 * scrollable history of how the redesign evolved, and any version can be
 * reloaded from the app's "Versions" panel.
 *
 * Sheet tab required: "Versions" with header row:
 *   Timestamp | Label | Author | GraphJSON
 * (created automatically on first save if missing)
 *
 * SETUP — see SETUP.md for full step-by-step instructions.
 */

const SHEET_NAME = "Versions";

function getSheet_(){
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if(!ss){
    throw new Error("This script isn't bound to a Google Sheet. Create it via Extensions → Apps Script from inside your Sheet (not from script.google.com directly).");
  }
  let sh = ss.getSheetByName(SHEET_NAME);
  if(!sh){
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(["Timestamp","Label","Author","GraphJSON"]);
    sh.setFrozenRows(1);
  }
  return sh;
}

function jsonpOut_(obj, callback){
  const body = (callback ? callback + "(" : "") + JSON.stringify(obj) + (callback ? ")" : "");
  return ContentService.createTextOutput(body).setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function doGet(e){
  if(!e || !e.parameter){
    return ContentService.createTextOutput(
      "This script only responds to real web requests (via the deployed /exec URL), not the editor's Run button. " +
      "Deploy → New deployment → Web app, then test using that URL with ?action=history on the end."
    ).setMimeType(ContentService.MimeType.TEXT);
  }
  const action = e.parameter.action;
  const callback = e.parameter.callback;
  const sh = getSheet_();
  const lastRow = sh.getLastRow();

  if(action === "load"){
    if(lastRow < 2) return jsonpOut_({error:"empty"}, callback);
    const row = sh.getRange(lastRow, 1, 1, 4).getValues()[0];
    return jsonpOut_({ timestamp: fmt_(row[0]), label: row[1], author: row[2], data: row[3] }, callback);
  }

  if(action === "history"){
    if(lastRow < 2) return jsonpOut_({ versions: [] }, callback);
    const rows = sh.getRange(2, 1, lastRow-1, 3).getValues(); // Timestamp, Label, Author (skip heavy JSON col)
    const versions = rows.map(r=> ({ timestamp: fmt_(r[0]), label: r[1], author: r[2] }));
    return jsonpOut_({ versions }, callback);
  }

  if(action === "loadVersion"){
    const ts = e.parameter.ts;
    if(lastRow < 2) return jsonpOut_({error:"empty"}, callback);
    const rows = sh.getRange(2, 1, lastRow-1, 4).getValues();
    for(let i=0;i<rows.length;i++){
      if(fmt_(rows[i][0]) === ts){
        return jsonpOut_({ timestamp: ts, label: rows[i][1], author: rows[i][2], data: rows[i][3] }, callback);
      }
    }
    return jsonpOut_({error:"not found"}, callback);
  }

  return jsonpOut_({error:"unknown action"}, callback);
}

function doPost(e){
  if(!e || !e.parameter){
    return ContentService.createTextOutput(JSON.stringify({error:"No request data — this only works when called via the deployed web app URL, not the editor's Run button."})).setMimeType(ContentService.MimeType.JSON);
  }
  const sh = getSheet_();
  const label = e.parameter.label || "Untitled update";
  const author = e.parameter.author || "Unknown";
  const data = e.parameter.data || "{}";
  sh.appendRow([new Date(), label, author, data]);
  return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
}

function fmt_(d){
  if(Object.prototype.toString.call(d) === "[object Date]"){
    return Utilities.formatDate(d, Session.getScriptTimeZone(), "yyyy-MM-dd'T'HH:mm:ss");
  }
  return String(d);
}
