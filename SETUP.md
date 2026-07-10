# Innotek Process Map — Setup

A hybrid mind-map / process-flow tool for redesigning the NFG wet-processing line.
Runs entirely in the browser as **one self-contained file**; Google Sheets is used only
as a **version history store**.

## 1. Files

- `index.html` → the entire app (HTML + CSS + JS + the seeded process data, all in one file). No other files needed to run it.
- `Code.gs` → paste into a Google Apps Script project (see below) — only needed once you want shared version history.
- This file.

## 2. Try it immediately (no setup)

**Important:** open `index.html` by double-clicking it (or dragging it into a Chrome/Edge tab)
so it runs as a real page. Previewing it inside a chat window's built-in file viewer can block
things like local storage and isn't a substitute for opening it in an actual browser tab.

Once opened properly, it works fully offline, pre-loaded with the current NFG process from
CORE_Process_New_V1, autosaving to your browser (localStorage) as you edit. You only need
Google Sheets once you want **shared, permanent version history** (so Milind, Meherzade etc.
can see it too, and you can roll back).

## 3. Connect Google Sheets (for shared history)

1. Create a new Google Sheet — name it e.g. `Innotek Process Map — Versions`.
2. Extensions → Apps Script.
3. Delete the placeholder code, paste in the contents of `Code.gs`.
4. Deploy → New deployment → type **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone** (not "Anyone with Google account" — this breaks JSONP reads, same issue you hit with the other apps)
5. Click Deploy, authorize, then copy the **Web app URL** (ends in `/exec`).
6. In the Process Map app, click **⚙ Settings** (top right), paste the URL, add your name, Save.
7. Click **Save Version** any time to push a snapshot — it becomes a new row in the sheet, never overwriting old ones.
8. Click **⏱ Versions** to browse and restore any past snapshot.

## 4. Host on GitHub Pages

Same pattern as your other apps:
1. Push `index.html` to a repo (e.g. `innotek-process-map`) — it's the whole app, one file.
2. Settings → Pages → deploy from `main` branch, root folder.
3. Share the `https://<you>.github.io/innotek-process-map/` link with Mahesh, Milind, Meherzade — anyone with the link + the Sheet URL in Settings sees the same live version history.

## 5. How to use it

- **Canvas**: starts as an auto-arranged tree (7 process stages → their steps). Drag any node
  anywhere to break it out of the tree — it stays wherever you put it.
- **⤳ Connect**: click two nodes to draw a custom relationship line between them (e.g. "Stock Master" feeding every unloading step, or a proposed new ETP link) — this is what makes it a real mind map, not just an org chart.
- **⤢ Arrange**: snaps everything back into a clean tree layout if it gets messy (custom connections are preserved).
- **Click any node** → right panel: edit title, category (color), status (as-is / redesign / new equipment / eliminate), and the engineering fields consultants need — machine, capacity, cycle time, utilities, space, automation level — plus a free-text notes field.
- **+ Node** → drop a blank node anywhere (e.g. a proposed new machine) and connect it in.
- Every original step also carries an **"Original SOP — responsibility detail"** box (who does what, LAB/SAFETY/HYGIENE/DATA/ELECTRICAL duties) — nothing from the source document was dropped, it's just tucked into the panel instead of cluttering the map.
- **▤ Consultant Report**: generates a clean, printable brief grouped by stage with every structured field — this is what you hand to the engineering consultants. Print → Save as PDF, or **Export CSV** for a spreadsheet version.

## 6. Admin PIN

Not used in this app — it's single-purpose for the MD/management team, no login gate. Say the word if you'd like one added (your usual `1218` convention).
