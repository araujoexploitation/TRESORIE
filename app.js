/* ══════════════════════════════════════════════════════════════════════════
   SUIVI TRESORERIE — v2026.04.19
   ══════════════════════════════════════════════════════════════════════════ */

// ─── SECTION 1 : CONSTANTES ──────────────────────────────────────────────────

const KEYS = {
  treso:         "tresorerie_entries_v1",
  tresoV2:       "tresorerie_entries_v2",
  tresoConfig:   "tresorerie_config_v2",
  cashDeposits:  "tresorerie_cash_deposits_v1",
  tr:            "tresorerie_tr_entries_v1",
  ech:           "tresorerie_echeances_entries_v1",
  cat:           "tresorerie_categories_v1",
  catEntries:    "tresorerie_category_entries_v1",
  dep:           "tresorerie_depenses_entries_v1",
  cp:            "tresorerie_coupons_entries_v1",
  dm:            "tresorerie_demarque_entries_v1",
  debitLines:    "tresorerie_debit_lines_v1",
  caProjections: "tresorerie_ca_projections_v1",
  impayes:       "tresorerie_impayes_v1"
};

const TR_SEED = [
  {"date":"2020-12-24","provider":"SCANCOUPON","amount":265.25,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2020-12-24","provider":"SCANCOUPON","amount":6.02,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-01-12","provider":"SOGEC","amount":322.4,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-01-15","provider":"SCANCOUPON","amount":1.6,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-01-25","provider":"SCANCOUPON","amount":9.64,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-03-17","provider":"SCANCOUPON","amount":5.2,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-03-24","provider":"SCANCOUPON","amount":471.8,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-03-30","provider":"SOGEC","amount":9.9,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-04-01","provider":"SCANCOUPON","amount":243.69,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-04-28","provider":"SOGEC","amount":209.07,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-06-02","provider":"SOGEC","amount":156.69,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-07-21","provider":"SOGEC","amount":89.97,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-07-29","provider":"SCANCOUPON","amount":203.07,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-08-10","provider":"SOGEC","amount":74.3,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-08-23","provider":"SOGEC","amount":113.09,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-09-15","provider":"SOGEC","amount":164.95,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-10-06","provider":"SOGEC","amount":54.94,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-10-06","provider":"SCANCOUPON","amount":175.03,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-11-04","provider":"SOGEC","amount":184.69,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-11-17","provider":"HIGH CO DATA","amount":168.19,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-12-22","provider":"SOGEC","amount":130.91,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2022-02-08","provider":"SOGEC","amount":109.31,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2022-02-09","provider":"HIGH CO DATA","amount":7.22,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2022-04-01","provider":"SOGEC","amount":91.5,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2022-04-13","provider":"HIGH CO DATA","amount":394.16,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2022-05-03","provider":"SOGEC","amount":129.83,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2022-06-28","provider":"SOGEC","amount":119.74,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2022-07-06","provider":"HIGH CO DATA","amount":427.93,"source":"SUIVI REMBOURSEMENT"}
];

// ─── SECTION 2 : UTILITAIRES ─────────────────────────────────────────────────

function eur(v) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(Number(v || 0));
}

function parseNum(v) {
  const n = parseFloat(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function addDays(iso, n) {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function dayOfWeek(iso) {
  return new Date(`${iso}T00:00:00`).getDay(); // 0=dim, 6=sam
}

function monthKeyOf(iso) {
  return iso ? iso.slice(0, 7) : "";
}

function getDaysInMonth(monthKey) {
  const [y, m] = monthKey.split("-").map(Number);
  const last = new Date(y, m, 0).getDate();
  const days = [];
  for (let d = 1; d <= last; d++) days.push(`${monthKey}-${String(d).padStart(2, "0")}`);
  return days;
}

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function normalizeDate(v) {
  const s = String(v || "").trim();
  if (!s) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (!m) return s;
  const dd = String(m[1]).padStart(2, "0");
  const mo = String(m[2]).padStart(2, "0");
  const y  = m[3].length === 2 ? `20${m[3]}` : m[3];
  return `${y}-${mo}-${dd}`;
}

function normalizeRef(v) {
  return String(v || "").toUpperCase().replace(/\s+/g, "").replace(/[^A-Z0-9]/g, "");
}

function detectProviderFromText(text) {
  const s = String(text || "").toUpperCase();
  if (s.includes("BIMPLI") || s.includes("APETIZ") || s.includes("NATIXIS")) return "BIMBLI";
  if (s.includes("EDENRED") || s.includes("TICKET REST")) return "EDENRED";
  if (s.includes("PLUXEE") || s.includes("SODEXO")) return "PLUXEE";
  if (s.includes("UP COOP") || s.includes("UPCOOP") || s.includes("UPDEJEUNER")) return "UP COOP";
  if (s.includes("SOGEC")) return "SOGEC";
  if (s.includes("HIGH") && s.includes("CO")) return "HIGH CO DATA";
  if (s.includes("SCANCOUPON") || (s.includes("SCAN") && s.includes("COUPON"))) return "SCANCOUPON";
  return "INCONNU";
}

function loadEntries(key) {
  try {
    const raw = localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (_) { return []; }
}

function saveEntries(key, entries) {
  localStorage.setItem(key, JSON.stringify(entries));
}

// ─── SECTION 3 : CONFIG ──────────────────────────────────────────────────────

function loadConfig() {
  try {
    const raw = localStorage.getItem(KEYS.tresoConfig);
    return raw ? JSON.parse(raw) : {};
  } catch (_) { return {}; }
}

function saveConfig(cfg) {
  localStorage.setItem(KEYS.tresoConfig, JSON.stringify(cfg));
}

function getMonthConfig(monthKey) {
  const cfg = loadConfig();
  return cfg[monthKey] || { soldeDebutMois: 0, caBudget: 0, caPrev: 0, tendance: 0 };
}

function setMonthConfig(monthKey, data) {
  const cfg = loadConfig();
  cfg[monthKey] = { ...(cfg[monthKey] || {}), ...data };
  saveConfig(cfg);
}

function getDefaults() {
  const cfg = loadConfig();
  return cfg._defaults || {
    debit1Label: "Direct", debit2Label: "Com CB", debit3Label: "CRF", debit4Label: "",
    credit2Label: "Credit client", credit3Label: "Depot especes"
  };
}

function updateDefaults(entry) {
  const cfg = loadConfig();
  cfg._defaults = {
    debit1Label: entry.debit1Label || "Direct",
    debit2Label: entry.debit2Label || "Com CB",
    debit3Label: entry.debit3Label || "CRF",
    debit4Label: entry.debit4Label || "",
    credit2Label: entry.credit2Label || "Credit client",
    credit3Label: entry.credit3Label || "Depot especes"
  };
  saveConfig(cfg);
}

function getSoldeAlertThreshold() {
  const cfg = loadConfig();
  return typeof cfg._alertThreshold === "number" ? cfg._alertThreshold : 2000;
}

function setSoldeAlertThreshold(val) {
  const cfg = loadConfig();
  cfg._alertThreshold = parseNum(val);
  saveConfig(cfg);
}

function getHorizonDays() {
  const cfg = loadConfig();
  return parseInt(cfg._horizonDays || 60, 10);
}

function setHorizonDays(days) {
  const cfg = loadConfig();
  cfg._horizonDays = parseInt(days, 10);
  saveConfig(cfg);
}

function getCaPrevDays() {
  const cfg = loadConfig();
  return parseInt(cfg._caPrevDays || 15, 10);
}
function setCaPrevDays(days) {
  const cfg = loadConfig();
  cfg._caPrevDays = parseInt(days, 10);
  saveConfig(cfg);
}

function getPrevMonthKey(monthKey) {
  const [y, m] = monthKey.split("-").map(Number);
  if (m === 1) return `${y - 1}-12`;
  return `${y}-${String(m - 1).padStart(2, "0")}`;
}

function getPrevMonthEndingSolde(monthKey) {
  const prevKey  = getPrevMonthKey(monthKey);
  const prevRows = getMonthRows(prevKey);
  if (!prevRows.length) return null;
  return prevRows[prevRows.length - 1].soldeCumulatif;
}

function loadMonthConfigIntoForm(monthKey) {
  const cfg = getMonthConfig(monthKey);
  const sd  = document.getElementById("cfgSoldeDebut");
  if (sd) sd.value = cfg.soldeDebutMois || "";
}

function prefillFormDefaults() {
  const d = getDefaults();
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
  set("debit1Label", d.debit1Label);
  set("debit2Label", d.debit2Label);
  set("debit3Label", d.debit3Label);
  set("debit4Label", d.debit4Label);
}

// ─── SECTION 4 : DATA CRUD ───────────────────────────────────────────────────

function migrateV1toV2() {
  const v2 = loadEntries(KEYS.tresoV2);
  if (v2.length > 0) return;
  const v1 = loadEntries(KEYS.treso);
  if (v1.length === 0) return;
  const migrated = v1.map(x => ({
    date: x.date, _v: 2,
    ca: parseNum(x.ca), caN1: 0,
    credit2Label: "Autre credit", credit2Amount: parseNum(x.otherPending),
    credit3Label: "Depot especes", credit3Amount: 0,
    debit1Label: "TR attente",    debit1Amount: parseNum(x.trPending),
    debit2Label: "Com CB",        debit2Amount: parseNum(x.cbFees),
    debit3Label: "CRF",           debit3Amount: parseNum(x.expenses),
    debit4Label: "Especes",       debit4Amount: parseNum(x.cashPending),
    note: x.note || ""
  }));
  saveEntries(KEYS.tresoV2, migrated);
}

// ─── Colonnes personnalisées (orange) ────────────────────────────────────────

function getCustomColumns() {
  return loadConfig()._customColumns || [];
}
function saveCustomColumnsToConfig(cols) {
  const cfg = loadConfig();
  cfg._customColumns = cols;
  saveConfig(cfg);
}
function addCustomColumn(label) {
  const cols = getCustomColumns();
  cols.push({ id: `cc${Date.now()}`, label: String(label).trim() });
  saveCustomColumnsToConfig(cols);
}
function removeCustomColumn(id) {
  saveCustomColumnsToConfig(getCustomColumns().filter(c => c.id !== id));
}

function renderColList() {
  const list = document.getElementById("colList");
  if (!list) return;
  const cols = getCustomColumns();
  list.innerHTML = cols.map(c =>
    `<span style="background:#fff7ed;border:1px solid #f97316;color:#c2410c;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:5px">
      ${c.label}
      <button data-remcol="${c.id}" type="button" style="background:none;border:none;cursor:pointer;color:#9a3412;font-size:15px;line-height:1;padding:0">&times;</button>
    </span>`
  ).join("");
  list.querySelectorAll("button[data-remcol]").forEach(b => {
    b.onclick = () => { removeCustomColumn(b.dataset.remcol); rerender(); };
  });
}

function renderTableHeaders() {
  const thead = document.querySelector("#table thead tr");
  if (!thead) return;
  const d    = getDefaults();
  const cols = getCustomColumns();
  const customTh = cols.map(c =>
    `<th class="col-custom-debit" id="th-${c.id}">${c.label}</th>`
  ).join("");
  thead.innerHTML =
    `<th>Date</th>
     <th class="col-debit th-editable" id="th-debit1" title="Cliquer pour renommer">${d.debit1Label||"Direct"}</th>
     <th class="col-debit th-editable" id="th-debit2" title="Cliquer pour renommer">${d.debit2Label||"Com CB"}</th>
     <th class="col-debit th-editable" id="th-debit3" title="Cliquer pour renommer">${d.debit3Label||"CRF"}</th>
     <th class="col-debit th-editable" id="th-debit4" title="Cliquer pour renommer">${d.debit4Label||"Divers"}</th>
     ${customTh}
     <th class="col-credit">CA</th>
     <th class="col-credit">N-1</th>
     <th class="col-credit th-editable" id="th-credit2" title="Cliquer pour renommer">${d.credit2Label||"Credit+"}</th>
     <th class="col-credit th-editable" id="th-credit3" title="Cliquer pour renommer">${d.credit3Label||"Depot"}</th>
     <th class="col-solde">Solde J</th>
     <th>Net J</th>
     <th>Note</th>
     <th></th>`;

  const editable = [
    { id: "th-debit1", field: "debit1Label" },
    { id: "th-debit2", field: "debit2Label" },
    { id: "th-debit3", field: "debit3Label" },
    { id: "th-debit4", field: "debit4Label" },
    { id: "th-credit2", field: "credit2Label" },
    { id: "th-credit3", field: "credit3Label" },
  ];
  editable.forEach(({ id, field }) => {
    const th = document.getElementById(id);
    if (!th) return;
    th.addEventListener("click", () => {
      if (th.querySelector("input")) return;
      const defs  = getDefaults();
      const input = document.createElement("input");
      input.type  = "text";
      input.value = defs[field] || "";
      input.style.cssText = "width:70px;padding:2px 4px;font-size:12px;border:1px solid #0c4a8a;border-radius:4px";
      th.textContent = ""; th.appendChild(input);
      input.focus(); input.select();
      const save = () => {
        const v = input.value.trim();
        if (v) { const cfg = loadConfig(); cfg._defaults = { ...getDefaults(), [field]: v }; saveConfig(cfg); }
        rerender();
      };
      input.addEventListener("blur", save);
      input.addEventListener("keydown", ev => {
        if (ev.key === "Enter")  { ev.preventDefault(); input.blur(); }
        if (ev.key === "Escape") { input.removeEventListener("blur", save); rerender(); }
      });
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────

function computeRow(x, debitLines) {
  const cols        = getCustomColumns();
  const linesTotal  = (debitLines || []).reduce((s, l) => s + parseNum(l.amount), 0);
  const customTotal = cols.reduce((s, c) => s + parseNum(x[c.id] || 0), 0);
  const totalDebits  = parseNum(x.debit1Amount) + parseNum(x.debit2Amount)
                     + parseNum(x.debit3Amount)  + parseNum(x.debit4Amount)
                     + linesTotal + customTotal;
  const totalCredits = parseNum(x.ca) + parseNum(x.credit2Amount) + parseNum(x.credit3Amount);
  const netJour      = totalCredits - totalDebits;
  return { ...x, totalDebits, totalCredits, netJour, debitLines: debitLines || [], linesTotal, customTotal };
}

function upsertEntry(entry) {
  const rows = loadEntries(KEYS.tresoV2);
  const idx  = rows.findIndex(r => r.date === entry.date);
  if (idx >= 0) rows[idx] = { ...rows[idx], ...entry };
  else rows.push(entry);
  rows.sort((a, b) => a.date.localeCompare(b.date));
  saveEntries(KEYS.tresoV2, rows);
}

function deleteEntry(date) {
  saveEntries(KEYS.tresoV2, loadEntries(KEYS.tresoV2).filter(r => r.date !== date));
  saveEntries(KEYS.catEntries, loadEntries(KEYS.catEntries).filter(e =>
    !["D1","D2","D3","D4"].some(p => e.sourceRef === `${p}-${date}`)
  ));
}

function getMonthRows(monthKey) {
  const cfg  = getMonthConfig(monthKey);
  const defs = getDefaults();
  let   solde = parseNum(cfg.soldeDebutMois);
  const allLines   = loadEntries(KEYS.debitLines).filter(l => String(l.date || "").startsWith(monthKey));
  const entriesMap = {};
  loadEntries(KEYS.tresoV2)
    .filter(r => String(r.date || "").startsWith(monthKey))
    .forEach(r => { entriesMap[r.date] = r; });

  return getDaysInMonth(monthKey).map(date => {
    const exists = !!entriesMap[date];
    const r = exists ? entriesMap[date] : {
      date, _v: 2, ca: 0, caN1: 0,
      debit1Label: defs.debit1Label || "Direct", debit1Amount: 0,
      debit2Label: defs.debit2Label || "Com CB",  debit2Amount: 0,
      debit3Label: defs.debit3Label || "CRF",     debit3Amount: 0,
      debit4Label: defs.debit4Label || "",         debit4Amount: 0,
      credit2Label: defs.credit2Label || "Credit client", credit2Amount: 0,
      credit3Label: defs.credit3Label || "Depot especes", credit3Amount: 0,
      note: ""
    };
    const computed = computeRow(r, allLines.filter(l => l.date === date));
    solde += computed.netJour;
    return { ...computed, soldeCumulatif: solde, _exists: exists };
  });
}

// Projections CA manuelles pour l'horizon
function getManualProjection(iso) {
  const p = loadEntries(KEYS.caProjections).find(x => x.date === iso);
  return p ? parseNum(p.ca) : null;
}

function setManualProjection(iso, val) {
  const all = loadEntries(KEYS.caProjections);
  const idx = all.findIndex(x => x.date === iso);
  const v   = parseNum(val);
  if (v <= 0) {
    if (idx >= 0) all.splice(idx, 1);
  } else {
    if (idx >= 0) all[idx].ca = v; else all.push({ date: iso, ca: v });
  }
  saveEntries(KEYS.caProjections, all);
}

function clearAllProjections() {
  saveEntries(KEYS.caProjections, []);
}

// ─── SECTION 5 : MOTEUR HORIZON ──────────────────────────────────────────────

function getSoldeToday() {
  const today = todayISO();
  const mk    = monthKeyOf(today);
  const rows  = getMonthRows(mk);
  // Solde cumulatif à la fin du jour J-1 (base pour les projections à partir de J)
  const yesterday = addDays(today, -1);
  const prevRow = rows.find(r => r.date === yesterday);
  return prevRow ? prevRow.soldeCumulatif : parseNum(getMonthConfig(mk).soldeDebutMois);
}

function forecastCAForDate(iso) {
  const today     = todayISO();
  const targetDow = dayOfWeek(iso);
  const cutoff    = addDays(today, -getCaPrevDays());

  const historical = loadEntries(KEYS.tresoV2)
    .filter(r => r.date >= cutoff && r.date < today && dayOfWeek(r.date) === targetDow)
    .map(r => parseNum(r.ca))
    .filter(v => v > 0);

  if (!historical.length) return 0;

  const avg      = historical.reduce((s, v) => s + v, 0) / historical.length;
  const cfg      = getMonthConfig(monthKeyOf(iso));
  const trend    = 1 + parseNum(cfg.tendance) / 100;
  return Math.round(avg * trend * 100) / 100;
}

function materializeEcheance(ech, from, until) {
  const occurrences = [];
  if (!ech.dueDate) return occurrences;
  const rec = ech.recurrence || "NONE";
  if (rec === "NONE") {
    if (ech.dueDate >= from && ech.dueDate <= until) occurrences.push({ date: ech.dueDate, ech });
    return occurrences;
  }
  let cursor = ech.dueDate;
  for (let i = 0; i < 500; i++) {
    if (cursor > until) break;
    if (cursor >= from) occurrences.push({ date: cursor, ech });
    const next = nextDueDate(cursor, rec);
    if (!next || next === cursor) break;
    cursor = next;
  }
  return occurrences;
}

function applyAutoProjectionCA() {
  const today = todayISO();
  const days  = parseInt(document.getElementById("horizonDays")?.value || 60, 10);
  const realDates = new Set(loadEntries(KEYS.tresoV2).map(r => r.date));
  let count = 0;
  for (let i = 1; i <= days; i++) {
    const iso = addDays(today, i);
    if (realDates.has(iso)) continue;
    const fc = forecastCAForDate(iso);
    if (fc > 0) { setManualProjection(iso, fc); count++; }
  }
  return count;
}

function computeHorizonRows(days) {
  const today     = todayISO();
  const threshold = getSoldeAlertThreshold();
  const until     = addDays(today, days - 1);
  const DAY_NAMES = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  // Pré-charger toutes les données une seule fois
  const allV2   = loadEntries(KEYS.tresoV2);
  const entryMap = new Map(allV2.map(r => [r.date, r]));
  const allLines = loadEntries(KEYS.debitLines);

  // Échéances futures à matérialiser
  const allEch  = loadEntries(KEYS.ech).filter(e =>
    String(e.status || "A_REGLER") !== "REGLE" &&
    parseNum(e.amount) - parseNum(e.paidAmount) > 0
  );
  const echByDate = new Map();
  for (const ech of allEch) {
    for (const { date, ech: e } of materializeEcheance(ech, today, until)) {
      if (!echByDate.has(date)) echByDate.set(date, []);
      echByDate.get(date).push(e);
    }
  }

  // Point de départ = solde fin J-1
  let runningBalance = getSoldeToday();

  const rows = [];
  for (let i = 0; i < days; i++) {
    const date    = addDays(today, i);
    const isToday = date === today;
    const isPast  = date < today;
    const echs    = echByDate.get(date) || [];
    let ca, credits, debits, isForecast, hasManualOverride;

    if (entryMap.has(date)) {
      const e       = entryMap.get(date);
      const dlLines = allLines.filter(l => l.date === date);
      const comp    = computeRow(e, dlLines);
      ca            = parseNum(e.ca);
      credits       = comp.totalCredits;
      debits        = comp.totalDebits;
      isForecast    = false;
      hasManualOverride = false;
    } else {
      const manual = getManualProjection(date);
      ca           = manual !== null ? manual : forecastCAForDate(date);
      isForecast   = manual === null;
      hasManualOverride = manual !== null;
      credits      = ca;
      debits       = echs.reduce((s, e) => s + Math.max(0, parseNum(e.amount) - parseNum(e.paidAmount)), 0);
    }

    const net   = credits - debits;
    runningBalance += net;

    const alertLevel = runningBalance < 0 ? "critical"
                     : runningBalance < threshold ? "warning"
                     : "ok";

    rows.push({
      date, isToday, isPast, isForecast, hasManualOverride,
      dayName: DAY_NAMES[dayOfWeek(date)],
      ca, credits, debits, net,
      balance: runningBalance,
      alertLevel, echs
    });
  }
  return rows;
}

function renderHorizon() {
  const panel = document.getElementById("panel-horizon");
  if (!panel || !panel.classList.contains("active")) return;

  const daysEl = document.getElementById("horizonDays");
  const thrEl  = document.getElementById("horizonThreshold");
  const days   = parseInt(daysEl?.value || 60, 10);
  const threshold = parseNum(thrEl?.value ?? getSoldeAlertThreshold());

  const rows = computeHorizonRows(days);
  renderHorizonKpis(rows, threshold, days);
  renderHorizonAlerts(rows, threshold, days);
  renderHorizonTable(rows);
  renderSparkline(rows, threshold);
  renderHorizonEcheances(rows);
}

function renderHorizonKpis(rows, threshold, days) {
  const container = document.getElementById("horizonKpis");
  if (!container) return;

  const today    = todayISO();
  const todayRow = rows.find(r => r.isToday);
  const soldeAujourdHui = todayRow ? todayRow.balance : getSoldeToday();
  const balances = rows.map(r => r.balance);
  const minBal   = Math.min(...balances);
  const maxBal   = Math.max(...balances);
  const j30Row   = rows[Math.min(29, rows.length - 1)];
  const caProj   = rows.filter(r => !entryExistsFor(r.date) || r.isForecast)
                       .reduce((s, r) => s + r.ca, 0);
  const factures = rows.reduce((s, r) =>
    s + r.echs.reduce((ss, e) => ss + Math.max(0, parseNum(e.amount) - parseNum(e.paidAmount)), 0), 0);

  const cls = v => v < 0 ? "danger" : v < threshold ? "warn" : "ok";
  container.innerHTML = [
    { label: "Solde aujourd'hui",         value: eur(soldeAujourdHui), cls: cls(soldeAujourdHui), big: true },
    { label: "Minimum projete",            value: eur(minBal),          cls: cls(minBal) },
    { label: "Maximum projete",            value: eur(maxBal),          cls: "ok" },
    { label: `Solde a J+${Math.min(30,days)}`, value: eur(j30Row?.balance || 0) },
    { label: "CA projete (total)",         value: eur(caProj) },
    { label: "Factures anticipees",        value: eur(factures),        cls: factures > 0 ? "warn" : "" }
  ].map(c =>
    `<div class="kpi${c.big?" kpi-hero":""}"><div class="v ${c.cls||""}">${c.value}</div><div class="l">${c.label}</div></div>`
  ).join("");
}

function entryExistsFor(date) {
  return loadEntries(KEYS.tresoV2).some(r => r.date === date);
}

function renderHorizonAlerts(rows, threshold) {
  const container = document.getElementById("horizonAlerts");
  if (!container) return;
  const neg  = rows.filter(r => r.balance < 0);
  const warn = rows.filter(r => r.balance >= 0 && r.balance < threshold);
  let html   = "";
  if (neg.length) {
    html += `<div class="alert-box critical">🚨 Solde NEGATIF prevu a partir du <strong>${neg[0].date}</strong> — ${neg.length} jour(s) en rouge sur la periode.</div>`;
  }
  if (warn.length) {
    html += `<div class="alert-box warning">⚠️ Solde sous le seuil d'alerte (${eur(threshold)}) pendant ${warn.length} jour(s).</div>`;
  }
  if (!neg.length && !warn.length) {
    html = `<div class="alert-box success">✅ Solde projete positif et securise sur toute la periode.</div>`;
  }
  container.innerHTML = html;
}

function renderHorizonTable(rows) {
  const tbody = document.getElementById("horizonBody");
  if (!tbody) return;
  let prevMonth = "";

  tbody.innerHTML = rows.map(r => {
    const mk  = monthKeyOf(r.date);
    let sep   = "";
    if (mk !== prevMonth) {
      if (prevMonth) {
        const [y, m] = mk.split("-").map(Number);
        const mName  = ["Jan","Fev","Mar","Avr","Mai","Jun","Jul","Aou","Sep","Oct","Nov","Dec"][m-1];
        sep = `<tr class="month-boundary"><td colspan="8">${mName} ${y}</td></tr>`;
      }
      prevMonth = mk;
    }

    const classes = [
      r.isToday              ? "row-today"     : "",
      r.isForecast           ? "row-projected" : "",
      r.alertLevel==="critical" ? "row-danger" : "",
      r.alertLevel==="warning"  ? "row-warning": "",
      r.echs.length > 0     ? "has-ech"       : ""
    ].filter(Boolean).join(" ");

    const alertIcon = r.alertLevel==="critical" ? "🚨" : r.alertLevel==="warning" ? "⚠️" : r.isToday ? "📍" : "";
    const caTag     = r.hasManualOverride
      ? `<span class="tag projected" title="Saisi manuellement">M</span>`
      : r.isForecast && r.ca > 0
        ? `<span class="tag projected" title="Calcule par historique">P</span>`
        : "";
    const caStr = r.ca > 0 ? eur(r.ca) : "";
    const soldeClass = r.alertLevel==="critical" ? "danger" : r.alertLevel==="warning" ? "warn" : "ok";

    return sep + `<tr class="${classes}" data-hdate="${r.date}">
      <td><strong>${r.date.slice(8)}/${r.date.slice(5,7)}</strong></td>
      <td>${r.dayName}${r.isToday ? " <strong>AUJ.</strong>" : ""}</td>
      <td class="horizon-ca-cell" data-hfield="ca" data-hdate="${r.date}">${caStr} ${caTag}</td>
      <td class="col-credit">${r.credits > 0 ? eur(r.credits) : ""}</td>
      <td class="col-debit ${r.debits > 0?"danger":""}">${r.debits > 0 ? eur(r.debits) : ""}</td>
      <td class="${r.net < 0?"danger":r.net > 0?"ok":""}">${r.net !== 0 ? (r.net>0?"+":"")+eur(r.net) : ""}</td>
      <td class="col-solde ${soldeClass}"><strong>${eur(r.balance)}</strong></td>
      <td style="text-align:center;font-size:16px">${alertIcon}</td>
    </tr>`;
  }).join("");

  // Édition inline du CA dans l'horizon
  tbody.querySelectorAll("td[data-hfield='ca']").forEach(td => {
    td.addEventListener("click", () => {
      if (td.querySelector("input")) return;
      const date     = td.dataset.hdate;
      const manual   = getManualProjection(date);
      const forecast = forecastCAForDate(date);
      const input    = document.createElement("input");
      input.type     = "number"; input.step = "0.01"; input.min = "0";
      input.value    = manual !== null ? manual : forecast || "";
      input.className= "cell-edit-input";
      td.textContent = ""; td.appendChild(input);
      input.focus(); input.select();

      const save = () => {
        setManualProjection(date, parseNum(input.value));
        renderHorizon();
      };
      input.addEventListener("blur", save);
      input.addEventListener("keydown", ev => {
        if (ev.key === "Enter")  { ev.preventDefault(); input.blur(); }
        if (ev.key === "Escape") { input.removeEventListener("blur", save); renderHorizon(); }
        if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
          ev.preventDefault();
          input.removeEventListener("blur", save);
          setManualProjection(date, parseNum(input.value));
          const allCa  = [...tbody.querySelectorAll("td[data-hfield='ca']")];
          const idx    = allCa.indexOf(td);
          const nextTd = allCa[ev.key === "ArrowDown" ? idx + 1 : idx - 1];
          renderHorizon();
          if (nextTd) setTimeout(() => nextTd.click(), 60);
        }
      });
    });
  });
}

function renderHorizonEcheances(rows) {
  const tbody = document.getElementById("horizonEchBody");
  if (!tbody) return;
  const upcoming = rows.flatMap(r => r.echs.map(e => ({ date: r.date, ech: e })));
  if (!upcoming.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="muted-val" style="text-align:center;padding:16px">Aucune echeance anticipee sur la periode 🎉</td></tr>`;
    return;
  }
  tbody.innerHTML = upcoming.map(({ date, ech }) => {
    const reste = Math.max(0, parseNum(ech.amount) - parseNum(ech.paidAmount));
    return `<tr>
      <td class="${date < todayISO() ? "danger" : ""}">${date}</td>
      <td>${ech.vendor || "-"}</td>
      <td>${ech.label || "-"}</td>
      <td class="danger">${eur(reste)}</td>
      <td>${ech.recurrence || "PONCTUELLE"}</td>
    </tr>`;
  }).join("");
}

function renderSparkline(rows, threshold) {
  const svg = document.getElementById("horizonSparkline");
  if (!svg || rows.length < 2) return;

  const W = 900, H = 160;
  const P = { top: 20, bottom: 24, left: 52, right: 12 };
  const iW = W - P.left - P.right;
  const iH = H - P.top  - P.bottom;

  const balances = rows.map(r => r.balance);
  const minV     = Math.min(0, ...balances, -1);
  const maxV     = Math.max(threshold * 1.2, ...balances, 1);
  const range    = maxV - minV || 1;
  const n        = Math.max(1, rows.length - 1);

  const xOf = i => P.left + (i / n) * iW;
  const yOf = v => P.top  + iH - ((v - minV) / range) * iH;

  // Chemin historique vs projeté
  const histPath = []; const projPath = [];
  let lastHistIdx = -1;
  rows.forEach((r, i) => {
    const cmd = `${i === 0 ? "M" : "L"} ${xOf(i).toFixed(1)} ${yOf(r.balance).toFixed(1)}`;
    if (!r.isForecast) { histPath.push(cmd); lastHistIdx = i; }
    else projPath.push(cmd);
  });
  // Connexion entre historique et projection
  if (lastHistIdx >= 0 && projPath.length) {
    projPath.unshift(`M ${xOf(lastHistIdx).toFixed(1)} ${yOf(rows[lastHistIdx].balance).toFixed(1)}`);
  }

  // Points danger
  const dangerCircles = rows
    .map((r, i) => r.balance < 0
      ? `<circle cx="${xOf(i).toFixed(1)}" cy="${yOf(r.balance).toFixed(1)}" r="3.5" class="spark-point-danger"/>`
      : "")
    .join("");

  // Labels mois (1er de chaque mois)
  const seenMonths = new Set();
  const monthLabels = rows.map((r, i) => {
    const mk = monthKeyOf(r.date);
    if (seenMonths.has(mk)) return "";
    seenMonths.add(mk);
    const [, m] = mk.split("-").map(Number);
    const mName = ["","Jan","Fev","Mar","Avr","Mai","Jun","Jul","Aou","Sep","Oct","Nov","Dec"][m];
    return `<text x="${xOf(i).toFixed(1)}" y="${H-4}" class="spark-label" text-anchor="start">${mName}</text>`;
  }).join("");

  // Labels Y (axe solde)
  const yLabels = [minV, (minV+maxV)/2, maxV].map(v =>
    `<text x="${P.left-4}" y="${yOf(v)+4}" class="spark-label" text-anchor="end">${eur(v)}</text>`
  ).join("");

  const yZero   = yOf(0);
  const yThr    = yOf(threshold);
  const todayX  = xOf(rows.findIndex(r => r.isToday) || 0);

  svg.innerHTML = [
    yLabels,
    `<line class="spark-zero" x1="${P.left}" y1="${yZero.toFixed(1)}" x2="${W-P.right}" y2="${yZero.toFixed(1)}"/>`,
    threshold > minV && threshold < maxV
      ? `<line class="spark-threshold" x1="${P.left}" y1="${yThr.toFixed(1)}" x2="${W-P.right}" y2="${yThr.toFixed(1)}"/>`
      : "",
    `<line class="spark-today-line" x1="${todayX.toFixed(1)}" y1="${P.top}" x2="${todayX.toFixed(1)}" y2="${H-P.bottom}"/>`,
    histPath.length > 1 ? `<path class="spark-line" d="${histPath.join(" ")}"/>` : "",
    projPath.length > 1 ? `<path class="spark-line-future" d="${projPath.join(" ")}"/>` : "",
    dangerCircles,
    monthLabels
  ].filter(Boolean).join("\n");
}

// ─── SECTION 6 : JOURNAL MENSUEL ─────────────────────────────────────────────

function renderKpis(monthKey) {
  const kpisEl = document.getElementById("kpis");
  if (!kpisEl) return;
  const allV2       = loadEntries(KEYS.tresoV2);
  const rows        = getMonthRows(monthKey);
  const cfg         = getMonthConfig(monthKey);
  const lastRow     = rows[rows.length - 1];
  const soldeActuel = lastRow ? lastRow.soldeCumulatif : parseNum(cfg.soldeDebutMois);
  const totalCA     = rows.reduce((s, r) => s + parseNum(r.ca), 0);
  const totalDebits = rows.reduce((s, r) => s + r.totalDebits, 0);
  const totalCreds  = rows.reduce((s, r) => s + r.totalCredits, 0);
  const caN1Total   = rows.reduce((s, r) => s + parseNum(r.caN1), 0);
  const caBudget    = parseNum(cfg.caBudget);
  const ecartB      = caBudget > 0 ? totalCA - caBudget : null;
  const ecartN1     = caN1Total > 0 ? totalCA - caN1Total : null;
  const threshold   = getSoldeAlertThreshold();
  const cls = v     => v < 0 ? "danger" : v < threshold ? "warn" : "ok";
  const fmt = (v)   => (v >= 0 ? "+" : "") + eur(v);

  // Espèces non versées = total espèces saisies - total dépôts espèces
  const totalEspeces = allV2.reduce((s, r) => s + parseNum(r.especes), 0);
  const totalDepots  = allV2.reduce((s, r) => s + parseNum(r.credit3Amount), 0);
  const especesNV    = Math.max(0, totalEspeces - totalDepots);

  // Impayes restants
  const impayes      = loadEntries(KEYS.impayes);
  const totalImpayes = impayes.reduce((s, r) => {
    const paid = (r.payments||[]).reduce((ss, p) => ss + parseNum(p.amount), 0);
    return s + Math.max(0, parseNum(r.totalAmount) - paid);
  }, 0);

  const kpiList = [
    { label: "Solde en banque (estime)", value: eur(soldeActuel), cls: cls(soldeActuel), big: true },
    { label: "CA cumule du mois",        value: eur(totalCA) },
    { label: "Total debits",             value: eur(totalDebits) },
    { label: "Total credits",            value: eur(totalCreds) },
    { label: "Ecart vs budget",          value: ecartB  !== null ? fmt(ecartB)  : "Budget non defini", cls: ecartB  !== null ? cls(ecartB)  : "muted" },
    { label: "Ecart vs N-1",             value: ecartN1 !== null ? fmt(ecartN1) : "N-1 non saisi",     cls: ecartN1 !== null ? cls(ecartN1) : "muted" }
  ];
  if (especesNV > 0) kpiList.push({ label: "Especes en caisse (non versees)", value: eur(especesNV), cls: "warn" });
  if (totalImpayes > 0) kpiList.push({ label: "Impayes restants", value: eur(totalImpayes), cls: "danger" });

  kpisEl.innerHTML = kpiList.map(c =>
    `<div class="kpi${c.big?" kpi-hero":""}"><div class="v ${c.cls||""}">${c.value}</div><div class="l">${c.label}</div></div>`
  ).join("");
}

function renderTable(monthKey) {
  const tableBody = document.querySelector("#table tbody");
  if (!tableBody) return;

  renderTableHeaders();
  renderColList();

  const rows      = getMonthRows(monthKey);
  const cfg       = getMonthConfig(monthKey);
  const customCols = getCustomColumns();
  const today     = todayISO();
  const threshold = getSoldeAlertThreshold();
  const NC        = 13 + customCols.length; // total columns for colspan
  let dividerInserted = false;

  const E  = (f, dd, t) => `data-field="${f}" data-date="${dd}" data-type="${t}"`;
  const dv = (v) => v ? eur(v) : "";

  // ── Ligne Solde début de mois (éditable) ──
  const soldeDebut = parseNum(cfg.soldeDebutMois);
  const sdCls = soldeDebut < 0 ? "danger" : soldeDebut < threshold ? "warn" : "ok";
  let html = `<tr class="solde-debut-row" style="background:#f8fafc;border-bottom:2px solid #cbd5e1">
    <td style="font-size:11px;font-weight:700;color:#475569;padding:5px 8px">DEBUT MOIS</td>
    <td colspan="${4 + customCols.length}"></td>
    <td colspan="4"></td>
    <td class="col-solde ${sdCls} editable" ${E("soldeDebutMois", monthKey, "number")} title="Cliquer pour modifier le solde de debut de mois">
      <strong>${eur(soldeDebut)}</strong>
    </td>
    <td colspan="3"></td>
  </tr>`;

  // ── Lignes du mois sélectionné ──
  html += rows.map(r => {
    const isFuture = r.date > today;
    const isToday  = r.date === today;
    const isEmpty  = !r._exists;
    const hasLines = r.debitLines?.length > 0;
    const classes  = [
      hasLines ? "has-lines"   : "",
      isFuture ? "preview-row" : "",
      isToday  ? "today-row"   : "",
      isEmpty  ? "empty-row"   : ""
    ].filter(Boolean).join(" ");

    let divider = "";
    if (isFuture && !dividerInserted) {
      dividerInserted = true;
      divider = `<tr class="today-divider"><td colspan="${NC}">\u25bc Projections</td></tr>`;
    }

    const soldeClass = r.soldeCumulatif < 0 ? "danger" : r.soldeCumulatif < threshold ? "warn" : "ok";
    const netClass   = r.netJour < 0 ? "danger" : r.netJour > 0 ? "ok" : "";
    const shortNote  = r.note ? (r.note.length > 28 ? r.note.slice(0, 28) + "\u2026" : r.note) : "";
    const delBtn     = r._exists ? `<button data-del="${r.date}" type="button">\u00d7</button>` : "";
    const customCells = customCols.map(c =>
      `<td class="col-custom-debit editable" ${E(c.id, r.date, "number")}>${dv(r[c.id])}</td>`
    ).join("");

    const mainRow = `<tr class="${classes}" data-row-date="${r.date}">
      <td class="date-cell"><strong>${r.date.slice(8)}</strong></td>
      <td class="col-debit editable" ${E("debit1Amount",  r.date, "number")}>${dv(r.debit1Amount)}</td>
      <td class="col-debit editable" ${E("debit2Amount",  r.date, "number")}>${dv(r.debit2Amount)}</td>
      <td class="col-debit editable" ${E("debit3Amount",  r.date, "number")}>${dv(r.debit3Amount)}</td>
      <td class="col-debit editable" ${E("debit4Amount",  r.date, "number")}>${dv(r.debit4Amount)}</td>
      ${customCells}
      <td class="col-credit editable" ${E("ca",           r.date, "number")}>${dv(r.ca)}</td>
      <td class="col-credit muted-val editable" ${E("caN1", r.date, "number")}>${dv(r.caN1)}</td>
      <td class="col-credit editable" ${E("credit2Amount",r.date, "number")}>${dv(r.credit2Amount)}</td>
      <td class="col-credit editable" ${E("credit3Amount",r.date, "number")}>${dv(r.credit3Amount)}</td>
      <td class="col-solde ${soldeClass}"><strong>${eur(r.soldeCumulatif)}</strong></td>
      <td class="${netClass}" style="font-size:11px">${r.netJour ? (r.netJour>0?"+":"")+eur(r.netJour) : ""}</td>
      <td class="note-cell editable" ${E("note", r.date, "text")} title="${r.note||""}">${shortNote}</td>
      <td class="del-cell">${delBtn}</td>
    </tr>`;

    const subRows = (r.debitLines || []).map(l => `<tr class="debit-line-row${isFuture?" preview-row":""}">
      <td class="dl-indent">\u2514</td>
      <td colspan="${4 + customCols.length}" class="col-debit dl-label-cell">${l.label || "Prelev."}</td>
      <td colspan="4" class="col-debit dl-amount-cell">\u2212 ${eur(l.amount)}</td>
      <td></td><td></td><td></td>
      <td><button type="button" data-deldl="${l.id}">\u00d7</button></td>
    </tr>`).join("");

    return divider + mainRow + subRows;
  }).join("");

  // ── Extension horizon : au-delà du mois affiché (aujourd'hui → +60j) ──
  if (monthKey === currentMonth()) {
    const DAY_NAMES = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
    const lastMonthDate = rows[rows.length - 1]?.date || today;
    const endDate       = addDays(today, 60);

    if (lastMonthDate < endDate) {
      const hRows  = computeHorizonRows(70);
      const hMap   = new Map(hRows.map(r => [r.date, r]));
      const allV2  = loadEntries(KEYS.tresoV2);
      const realMap = new Map(allV2.map(r => [r.date, r]));
      const allDL  = loadEntries(KEYS.debitLines);
      const MONTHS = ["Jan","Fev","Mar","Avr","Mai","Jun","Jul","Aou","Sep","Oct","Nov","Dec"];
      let prevMk   = monthKey;
      let cursor   = addDays(lastMonthDate, 1);

      while (cursor <= endDate) {
        const mk = monthKeyOf(cursor);
        if (mk !== prevMk) {
          const [y, m] = mk.split("-").map(Number);
          html += `<tr class="month-boundary"><td colspan="${NC}">${MONTHS[m-1]} ${y} — Projections</td></tr>`;
          prevMk = mk;
        }

        const h    = hMap.get(cursor);
        const real = realMap.get(cursor);
        const echs = h?.echs || [];
        let ca, debit1, net, balance;
        let isForecast = false, hasManual = false;

        if (real) {
          const dlLines = allDL.filter(l => l.date === cursor);
          const comp    = computeRow(real, dlLines);
          ca     = parseNum(real.ca);
          debit1 = real.debit1Amount || 0;
          net    = comp.netJour;
        } else {
          const manual = getManualProjection(cursor);
          ca         = manual !== null ? manual : forecastCAForDate(cursor);
          isForecast = manual === null;
          hasManual  = manual !== null;
          debit1 = echs.reduce((s, e) => s + Math.max(0, parseNum(e.amount) - parseNum(e.paidAmount)), 0);
          net    = ca - debit1;
        }
        balance = h?.balance ?? 0;

        const soldeClass = balance < 0 ? "danger" : balance < threshold ? "warn" : "ok";
        const netClass   = net < 0 ? "danger" : net > 0 ? "ok" : "";
        const dayName    = DAY_NAMES[dayOfWeek(cursor)];
        const echNote    = echs.map(e => e.vendor || e.label || "ECH").join(", ");
        const shortNote  = echNote.length > 28 ? echNote.slice(0, 28) + "\u2026" : echNote;
        const caTag      = hasManual
          ? `<span class="tag projected" style="font-size:9px;padding:1px 4px">M</span>`
          : isForecast && ca > 0
            ? `<span class="tag projected" style="font-size:9px;padding:1px 4px">P</span>` : "";
        const rowCls = [
          real ? "preview-row" : "preview-row row-projected",
          balance < 0 ? "row-danger" : balance < threshold ? "row-warning" : ""
        ].filter(Boolean).join(" ");
        const customCellsP = customCols.map(c =>
          `<td class="col-custom-debit editable" ${E(c.id, cursor, "number")}>${real ? dv(real[c.id]) : ""}</td>`
        ).join("");

        html += `<tr class="${rowCls}" data-row-date="${cursor}">
          <td class="date-cell"><strong>${cursor.slice(8)}</strong> <span style="font-size:10px;color:#94a3b8">${dayName}</span></td>
          <td class="col-debit editable" ${E("debit1Amount", cursor, "number")}>${dv(debit1)}</td>
          <td class="col-debit editable" ${E("debit2Amount", cursor, "number")}>${real ? dv(real.debit2Amount) : ""}</td>
          <td class="col-debit editable" ${E("debit3Amount", cursor, "number")}>${real ? dv(real.debit3Amount) : ""}</td>
          <td class="col-debit editable" ${E("debit4Amount", cursor, "number")}>${real ? dv(real.debit4Amount) : ""}</td>
          ${customCellsP}
          <td class="col-credit editable" ${E("ca", cursor, "number")}>${ca > 0 ? eur(ca) : ""} ${caTag}</td>
          <td class="col-credit muted-val editable" ${E("caN1", cursor, "number")}></td>
          <td class="col-credit editable" ${E("credit2Amount", cursor, "number")}>${real ? dv(real.credit2Amount) : ""}</td>
          <td class="col-credit editable" ${E("credit3Amount", cursor, "number")}>${real ? dv(real.credit3Amount) : ""}</td>
          <td class="col-solde ${soldeClass}"><strong>${eur(balance)}</strong></td>
          <td class="${netClass}" style="font-size:11px">${net !== 0 ? (net > 0 ? "+" : "") + eur(net) : ""}</td>
          <td class="note-cell editable" ${E("note", cursor, "text")} title="${echNote}">${shortNote}</td>
          <td class="del-cell">${real ? `<button data-del="${cursor}" type="button">\u00d7</button>` : ""}</td>
        </tr>`;

        cursor = addDays(cursor, 1);
      }
    }
  }

  tableBody.innerHTML = html;

  tableBody.querySelectorAll("button[data-del]").forEach(b =>
    b.addEventListener("click", () => { deleteEntry(b.dataset.del); rerender(); })
  );
  tableBody.querySelectorAll("button[data-deldl]").forEach(b =>
    b.addEventListener("click", () => {
      const id = b.dataset.deldl;
      saveEntries(KEYS.debitLines, loadEntries(KEYS.debitLines).filter(l => l.id !== id));
      rerender();
    })
  );

  tableBody.addEventListener("click", e => {
    const td = e.target.closest("td[data-field]");
    if (!td || td.querySelector("input")) return;
    startCellEdit(td, tableBody);
  });
}

function startCellEdit(td, tableBody) {
  const field = td.dataset.field;
  const date  = td.dataset.date;
  const type  = td.dataset.type || "text";

  // Cas spécial : solde début de mois (stocké dans config, pas tresoV2)
  if (field === "soldeDebutMois") {
    const cfg   = getMonthConfig(date);
    const input = document.createElement("input");
    input.type = "number"; input.step = "0.01";
    input.value = parseNum(cfg.soldeDebutMois) || "";
    input.className = "cell-edit-input";
    td.textContent = ""; td.appendChild(input);
    input.focus(); input.select();
    const save = () => {
      setMonthConfig(date, { soldeDebutMois: parseNum(input.value) });
      const cfgSd = document.getElementById("cfgSoldeDebut");
      if (cfgSd) cfgSd.value = parseNum(input.value) || "";
      rerender();
    };
    input.addEventListener("blur", save);
    input.addEventListener("keydown", ev => {
      if (ev.key === "Enter")  { ev.preventDefault(); input.blur(); }
      if (ev.key === "Escape") { input.removeEventListener("blur", save); rerender(); }
    });
    return;
  }

  const existing = loadEntries(KEYS.tresoV2).find(r => r.date === date);
  const debitRefMap = { debit1Amount:"D1", debit2Amount:"D2", debit3Amount:"D3", debit4Amount:"D4" };

  const input     = document.createElement("input");
  input.type      = type;
  if (type === "number") { input.step = "0.01"; input.min = "0"; }
  input.value     = type === "number"
    ? (existing ? parseNum(existing[field]) || ""
       : field === "ca" ? (getManualProjection(date) || forecastCAForDate(date) || "") : "")
    : (existing ? existing[field] || "" : "");
  input.className = "cell-edit-input";
  td.textContent  = "";
  td.appendChild(input);
  input.focus();
  if (type === "number") input.select();

  const save = () => {
    const rawVal = input.value.trim();
    const newVal = type === "number" ? parseNum(rawVal) : rawVal;
    const rowsAll = loadEntries(KEYS.tresoV2);
    const i       = rowsAll.findIndex(r => r.date === date);
    if (i >= 0) {
      rowsAll[i][field] = newVal;
      saveEntries(KEYS.tresoV2, rowsAll);
    } else if (newVal !== 0 && newVal !== "") {
      const defs = getDefaults();
      const ne = {
        date, _v: 2, ca: 0, caN1: 0,
        debit1Label: defs.debit1Label || "Direct", debit1Amount: 0,
        debit2Label: defs.debit2Label || "Com CB",  debit2Amount: 0,
        debit3Label: defs.debit3Label || "CRF",     debit3Amount: 0,
        debit4Label: defs.debit4Label || "",         debit4Amount: 0,
        credit2Label: defs.credit2Label || "Credit client", credit2Amount: 0,
        credit3Label: defs.credit3Label || "Depot especes", credit3Amount: 0,
        note: ""
      };
      ne[field] = newVal;
      upsertEntry(ne);
    }
    // Auto-catégorisation débits
    const ref = debitRefMap[field];
    if (ref) {
      const rowSaved = loadEntries(KEYS.tresoV2).find(r => r.date === date);
      const lbl = rowSaved ? (rowSaved[field.replace("Amount","Label")] || ref) : ref;
      const cat = suggestCategory(lbl);
      ensureCategory(cat);
      if (newVal > 0) {
        upsertAutoCategoryEntry({ id:`cat-${ref}-${date}`, sourceRef:`${ref}-${date}`, date, category:cat, source:"Debit journal", amount:newVal, label:lbl });
      } else {
        saveEntries(KEYS.catEntries, loadEntries(KEYS.catEntries).filter(e => e.sourceRef !== `${ref}-${date}`));
      }
    }
    rerender();
  };

  const navigateTo = (dx, dy) => {
    input.removeEventListener("blur", save);
    save();
    setTimeout(() => {
      if (dy !== 0) {
        const allCols = [...tableBody.querySelectorAll(`td[data-field="${field}"]`)];
        const idx     = allCols.findIndex(t => t.dataset.date === date);
        const next    = allCols[idx + dy];
        if (next) next.click();
      } else if (dx !== 0) {
        const allTds = [...tableBody.querySelectorAll("td[data-field]")];
        const idx    = allTds.indexOf(td);
        const next   = allTds[idx + dx];
        if (next) next.click();
      }
    }, 50);
  };

  input.addEventListener("blur", save);
  input.addEventListener("keydown", ev => {
    if (ev.key === "Enter")     { ev.preventDefault(); navigateTo(0, 1); }
    if (ev.key === "Escape")    { input.removeEventListener("blur", save); rerender(); }
    if (ev.key === "Tab")       { ev.preventDefault(); navigateTo(ev.shiftKey ? -1 : 1, 0); }
    if (ev.key === "ArrowDown") { ev.preventDefault(); navigateTo(0,  1); }
    if (ev.key === "ArrowUp")   { ev.preventDefault(); navigateTo(0, -1); }
  });
}

function renderCashDeposits(monthKey) {
  const tbody = document.getElementById("cashDepositBody");
  if (!tbody) return;
  const rows = loadEntries(KEYS.cashDeposits)
    .filter(r => String(r.date || "").startsWith(monthKey))
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  tbody.innerHTML = rows.map(r =>
    `<tr><td>${r.date}</td><td>${eur(r.amount)}</td><td>${r.note||"-"}</td><td><button type="button" data-cashdel="${r.id}">Suppr.</button></td></tr>`
  ).join("");
  tbody.querySelectorAll("button[data-cashdel]").forEach(b => b.onclick = () => {
    saveEntries(KEYS.cashDeposits, loadEntries(KEYS.cashDeposits).filter(x => String(x.id) !== String(b.dataset.cashdel)));
    rerender();
  });
}

function exportCsv(monthKey) {
  const rows = getMonthRows(monthKey);
  const d    = getDefaults();
  const head = ["date","ca","caN1",d.debit1Label||"debit1",d.debit2Label||"debit2",d.debit3Label||"debit3",d.debit4Label||"debit4",d.credit2Label||"credit2",d.credit3Label||"credit3","total_debits","total_credits","net_jour","solde_cumulatif","note"];
  const body = rows.map(r => [r.date,r.ca,r.caN1||0,r.debit1Amount||0,r.debit2Amount||0,r.debit3Amount||0,r.debit4Amount||0,r.credit2Amount||0,r.credit3Amount||0,r.totalDebits,r.totalCredits,r.netJour,r.soldeCumulatif,(r.note||"").replace(/"/g,'""')]);
  const csv  = [head.join(","),...body.map(r=>r.map(v=>`"${v??""}"`).join(","))].join("\n");
  const blob = new Blob([csv],{type:"text/csv;charset=utf-8;"});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url; a.download = `tresorerie-${monthKey}.csv`; a.click();
  URL.revokeObjectURL(url);
}

function switchTab(tabId) {
  const tabs   = [...document.querySelectorAll(".tab[data-tab]")];
  const panels = [...document.querySelectorAll(".panel")];
  tabs.forEach(b   => b.classList.toggle("active", b.dataset.tab === tabId));
  panels.forEach(p => p.classList.toggle("active", p.id === `panel-${tabId}`));
}

// ─── SECTION 7 : TR FOURNISSEURS ─────────────────────────────────────────────

function bootTRSeed() {
  if (loadEntries(KEYS.tr).length) return;
  const seeded = TR_SEED.map((x, idx) => ({
    id: `seed-${idx + 1}`,
    date: String(x.date || ""),
    provider: String(x.provider || "INCONNU").replace("SOGC","SOGEC").replace("HIGHT CO DATA","HIGH CO DATA"),
    ref: "", amount: parseNum(x.amount), source: x.source || "Import"
  }));
  saveEntries(KEYS.tr, seeded);
}

function trDuplicateMap(rows) {
  const counts = new Map();
  rows.forEach(r => {
    const key = `${(r.provider||"").toUpperCase()}|${normalizeRef(r.ref)}|${normalizeDate(r.date)}|${Number(r.amount||0).toFixed(2)}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  return counts;
}

function renderTR() {
  const trKpis      = document.getElementById("trKpis");
  const trTableBody = document.getElementById("trTableBody");
  const trSearch    = document.getElementById("trSearch");
  if (!trKpis || !trTableBody) return;

  const q       = String(trSearch?.value || "").toLowerCase().trim();
  const allRows = loadEntries(KEYS.tr).slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const rows    = q
    ? allRows.filter(r =>
        String(r.date).toLowerCase().includes(q) ||
        String(r.provider).toLowerCase().includes(q) ||
        String(r.ref).toLowerCase().includes(q) ||
        String(r.amount).includes(q))
    : allRows;

  const byProvider = {};
  allRows.forEach(r => {
    const p = r.provider || "INCONNU";
    if (!byProvider[p]) byProvider[p] = { total: 0, count: 0 };
    byProvider[p].total += parseNum(r.amount);
    byProvider[p].count++;
  });
  trKpis.innerHTML = Object.entries(byProvider).sort((a,b)=>b[1].total-a[1].total).map(([p,v]) =>
    `<div class="kpi"><div class="v">${eur(v.total)}</div><div class="l">${p} <span style="font-size:11px;color:#64748b">(${v.count} TR)</span></div></div>`
  ).join("") || `<div class="kpi"><div class="v">0 EUR</div><div class="l">Aucune donnee</div></div>`;

  const dupMap = trDuplicateMap(allRows);
  const PROV_OPTIONS = ["BIMPLI","EDENRED","PLUXEE","UP COOP","SOGEC","HIGH CO DATA","SCANCOUPON","INCONNU"];
  trTableBody.innerHTML = rows.map(r => {
    const key   = `${(r.provider||"").toUpperCase()}|${normalizeRef(r.ref)}|${normalizeDate(r.date)}|${Number(r.amount||0).toFixed(2)}`;
    const isDup = (dupMap.get(key)||0) > 1;
    const provOpts = PROV_OPTIONS.map(p => `<option value="${p}"${p===r.provider?" selected":""}>${p}</option>`).join("");
    return `<tr>
      <td>${r.date||"-"}</td>
      <td><strong>${r.provider||"-"}</strong></td>
      <td>${r.ref||"-"}</td>
      <td>${eur(r.amount)}</td>
      <td>${r.source||"-"}</td>
      <td class="${isDup?"danger":"ok"}">${isDup?"DOUBLON":"OK"}</td>
      <td style="white-space:nowrap">
        <button type="button" class="btn-tr-edit" data-id="${r.id}" style="background:#0c4a8a;color:#fff;border:none;padding:3px 9px;border-radius:6px;cursor:pointer;font-size:12px;margin-right:4px">Edit</button>
        <button type="button" data-deltr="${r.id}">Suppr.</button>
      </td>
    </tr>
    <tr id="tredit-${r.id}" style="display:none;background:#f0f9ff">
      <td colspan="7">
        <div style="display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap;padding:8px 4px">
          <label style="font-size:12px;margin:0">Date<br><input type="date" id="tred-date-${r.id}" value="${r.date||""}" style="padding:4px 6px;border:1px solid #cbd5e1;border-radius:6px"></label>
          <label style="font-size:12px;margin:0">Fournisseur<br><select id="tred-prov-${r.id}" style="padding:4px 6px;border:1px solid #cbd5e1;border-radius:6px">${provOpts}</select></label>
          <label style="font-size:12px;margin:0">Reference<br><input type="text" id="tred-ref-${r.id}" value="${r.ref||""}" style="padding:4px 6px;border:1px solid #cbd5e1;border-radius:6px;width:120px"></label>
          <label style="font-size:12px;margin:0">Montant (EUR)<br><input type="number" id="tred-amt-${r.id}" step="0.01" min="0" value="${parseNum(r.amount).toFixed(2)}" style="padding:4px 6px;border:1px solid #cbd5e1;border-radius:6px;width:90px"></label>
          <button type="button" class="btn-tr-save" data-id="${r.id}" style="padding:5px 14px">Enregistrer</button>
          <button type="button" class="btn-tr-cancel" data-id="${r.id}" style="padding:5px 14px;background:#94a3b8">Annuler</button>
        </div>
      </td>
    </tr>`;
  }).join("") || `<tr><td colspan="7" class="muted-val" style="text-align:center;padding:16px">Aucun TR — scannez un bordereau ou importez un fichier</td></tr>`;

  trTableBody.querySelectorAll("button[data-deltr]").forEach(b =>
    b.addEventListener("click", () => {
      saveEntries(KEYS.tr, loadEntries(KEYS.tr).filter(r => String(r.id) !== String(b.dataset.deltr)));
      renderTR();
    })
  );
  trTableBody.querySelectorAll(".btn-tr-edit").forEach(b => {
    b.addEventListener("click", () => {
      const row = document.getElementById(`tredit-${b.dataset.id}`);
      if (row) row.style.display = row.style.display === "none" ? "" : "none";
    });
  });
  trTableBody.querySelectorAll(".btn-tr-cancel").forEach(b => {
    b.addEventListener("click", () => {
      const row = document.getElementById(`tredit-${b.dataset.id}`);
      if (row) row.style.display = "none";
    });
  });
  trTableBody.querySelectorAll(".btn-tr-save").forEach(b => {
    b.addEventListener("click", () => {
      const id  = b.dataset.id;
      const all = loadEntries(KEYS.tr);
      const i   = all.findIndex(x => String(x.id) === id);
      if (i < 0) return;
      all[i].date     = document.getElementById(`tred-date-${id}`)?.value || all[i].date;
      all[i].provider = document.getElementById(`tred-prov-${id}`)?.value || all[i].provider;
      all[i].ref      = document.getElementById(`tred-ref-${id}`)?.value  || "";
      all[i].amount   = parseNum(document.getElementById(`tred-amt-${id}`)?.value);
      saveEntries(KEYS.tr, all);
      renderTR();
    });
  });
  renderTRByMonth();
}

function renderTRByMonth() {
  const container = document.getElementById("trByMonthTable");
  if (!container) return;
  const all = loadEntries(KEYS.tr);
  if (!all.length) { container.innerHTML = `<p class="muted" style="font-size:13px">Aucune donnee TR.</p>`; return; }

  const months    = [...new Set(all.map(r => monthKeyOf(r.date || "")))].filter(Boolean).sort().slice(-12);
  const providers = [...new Set(all.map(r => r.provider || "INCONNU"))].sort();
  const MNAMES    = ["","Jan","Fev","Mar","Avr","Mai","Jun","Jul","Aou","Sep","Oct","Nov","Dec"];

  // Totaux croisés
  const totals = {};
  providers.forEach(p => { totals[p] = {}; months.forEach(m => { totals[p][m] = 0; }); });
  all.forEach(r => {
    const p = r.provider || "INCONNU";
    const m = monthKeyOf(r.date || "");
    if (months.includes(m) && totals[p]) totals[p][m] = (totals[p][m] || 0) + parseNum(r.amount);
  });
  const rowTotals = {};
  providers.forEach(p => { rowTotals[p] = months.reduce((s, m) => s + (totals[p][m] || 0), 0); });
  const colTotals = {};
  months.forEach(m => { colTotals[m] = providers.reduce((s, p) => s + (totals[p][m] || 0), 0); });

  const mHeaders = months.map(m => {
    const [, mo] = m.split("-").map(Number);
    return `<th style="text-align:right;font-size:12px">${MNAMES[mo]} ${m.slice(2,4)}</th>`;
  }).join("");

  // Count per provider × month
  const counts = {};
  providers.forEach(p => { counts[p] = {}; months.forEach(m => { counts[p][m] = 0; }); });
  all.forEach(r => {
    const p = r.provider || "INCONNU";
    const m = monthKeyOf(r.date || "");
    if (months.includes(m) && counts[p]) counts[p][m] = (counts[p][m] || 0) + 1;
  });
  const rowCounts = {};
  providers.forEach(p => { rowCounts[p] = months.reduce((s, m) => s + (counts[p][m] || 0), 0); });

  const bodyRows = providers
    .filter(p => rowTotals[p] > 0)
    .map(p => `<tr>
      <td><strong>${p}</strong></td>
      ${months.map(m => `<td style="text-align:right">${totals[p][m] > 0
        ? `${eur(totals[p][m])}<br><span style="font-size:10px;color:#64748b">${counts[p][m]} TR</span>`
        : "<span style='color:#cbd5e1'>—</span>"}</td>`).join("")}
      <td style="text-align:right;font-weight:600">${eur(rowTotals[p])}<br><span style="font-size:11px;color:#64748b">${rowCounts[p]} TR</span></td>
    </tr>`).join("");

  const grandTotal = providers.reduce((s, p) => s + rowTotals[p], 0);
  const grandCount = providers.reduce((s, p) => s + rowCounts[p], 0);

  container.innerHTML = `<div class="table-wrap"><table style="font-size:13px;width:100%">
    <thead><tr>
      <th>Fournisseur</th>${mHeaders}<th style="text-align:right">Total</th>
    </tr></thead>
    <tbody>${bodyRows}
    <tr style="background:#f1f5f9;border-top:2px solid #334155">
      <td><strong>Total</strong></td>
      ${months.map(m => `<td style="text-align:right;font-weight:600">${colTotals[m] > 0 ? eur(colTotals[m]) : ""}</td>`).join("")}
      <td style="text-align:right;font-weight:700">${eur(grandTotal)}<br><span style="font-size:11px;color:#64748b">${grandCount} TR</span></td>
    </tr></tbody>
  </table></div>`;
}

function exportTRCsv() {
  const rows   = loadEntries(KEYS.tr);
  const dupMap = trDuplicateMap(rows);
  const head   = ["date","provider","ref","amount","source","duplicate_flag"];
  const body   = rows.map(r => {
    const key = `${(r.provider||"").toUpperCase()}|${normalizeRef(r.ref)}|${normalizeDate(r.date)}|${Number(r.amount||0).toFixed(2)}`;
    return [r.date,r.provider,r.ref,r.amount,r.source,(dupMap.get(key)||0)>1?"DUPLICATE":"OK"];
  });
  const csv  = [head.join(","),...body.map(r=>r.map(v=>`"${String(v??"").replace(/"/g,'""')}"`).join(","))].join("\n");
  const blob = new Blob([csv],{type:"text/csv;charset=utf-8;"});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href=url; a.download="tr-fournisseurs.csv"; a.click();
  URL.revokeObjectURL(url);
}

function removeDuplicateTRKeepFirst() {
  const rows = loadEntries(KEYS.tr).slice().sort((a,b)=>String(a.date).localeCompare(String(b.date)));
  const seen = new Set(); const kept = [];
  for (const r of rows) {
    const key = `${(r.provider||"").toUpperCase()}|${normalizeRef(r.ref)}|${normalizeDate(r.date)}|${Number(r.amount||0).toFixed(2)}`;
    if (seen.has(key)) continue;
    seen.add(key); kept.push(r);
  }
  const removed = rows.length - kept.length;
  saveEntries(KEYS.tr, kept);
  renderTR();
  alert(`${removed} doublon(s) supprime(s).`);
}

function parseTrRowsFromWorkbook(file, arrayBuffer) {
  const wb  = XLSX.read(arrayBuffer, { type: "array" });
  const out = [];
  for (const sh of wb.SheetNames) {
    const ws   = wb.Sheets[sh];
    const json = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
    for (const row of json) {
      if (!Array.isArray(row)) continue;
      const cells    = row.map(c => String(c||"").trim());
      const upper    = cells.join(" ").toUpperCase();
      const provider = detectProviderFromText(upper);
      if (provider === "INCONNU") continue;
      const amountCell = row.find(c => typeof c === "number" && c > 0 && c < 100000);
      if (!amountCell) continue;
      const dateCell = row.find(c =>
        c instanceof Date ||
        /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/.test(String(c||"").trim()) ||
        /^\d{4}-\d{2}-\d{2}$/.test(String(c||"").trim())
      );
      out.push({
        id: `imp-${Date.now()}-${Math.floor(Math.random()*1e6)}`,
        date: dateCell instanceof Date
          ? `${dateCell.getFullYear()}-${String(dateCell.getMonth()+1).padStart(2,"0")}-${String(dateCell.getDate()).padStart(2,"0")}`
          : normalizeDate(dateCell||""),
        provider, ref: String(cells.find(c=>/[A-Z0-9]{5,}/.test(c.toUpperCase()))||""),
        amount: parseNum(amountCell), source: `Import ${file.name}`
      });
    }
  }
  return out.filter(r => r.amount > 0);
}

// ─── SECTION 8 : SCAN DOUCHETTE ──────────────────────────────────────────────

function parseBarcodeString(raw) {
  const s = String(raw || "").trim();

  // Détection fournisseur depuis le code-barre
  const provider = detectProviderFromText(s);

  // Extraction du montant
  // Format 1 : décimal avec virgule ou point (ex: "12,50" ou "12.50")
  const decMatches = [...s.matchAll(/(\d{1,6}[,\.]\d{2})/g)]
    .map(m => parseFloat(m[1].replace(",", ".")))
    .filter(v => Number.isFinite(v) && v > 0 && v < 99999);

  // Format 2 : derniers chiffres comme centimes (ex: "00001250" → 12.50)
  // Heuristique : séquence de 8+ chiffres, les 2 derniers sont les centimes
  let amountFromCents = null;
  const digitSeq = s.match(/\b(\d{4,10})\b/g);
  if (digitSeq) {
    for (const seq of digitSeq) {
      if (seq.length >= 4) {
        const v = parseInt(seq, 10) / 100;
        if (v > 0 && v < 500) { amountFromCents = v; break; }
      }
    }
  }

  let amount = decMatches.length > 0
    ? Math.max(...decMatches)
    : amountFromCents;

  // Référence = tout le code normalisé
  const ref = normalizeRef(s).slice(0, 30);

  return { provider, amount, ref };
}

function processBarcodeInput(raw) {
  const { provider, amount, ref } = parseBarcodeString(raw);

  // Remplir les champs de confirmation
  const scanProvider = document.getElementById("scanProvider");
  const scanAmount   = document.getElementById("scanAmount");
  const scanRef      = document.getElementById("scanRef");
  const scanDate     = document.getElementById("scanDate");
  const scanRaw      = document.getElementById("scanRawBarcode");
  const preview      = document.getElementById("scanResultPreview");

  if (scanProvider) scanProvider.value = provider;
  if (scanAmount)   scanAmount.value   = amount ? amount.toFixed(2) : "";
  if (scanRef)      scanRef.value      = ref || "";
  if (scanDate)     scanDate.value     = todayISO();
  if (scanRaw)      scanRaw.textContent = raw;
  if (preview)      preview.style.display = "";

  // Focus sur montant pour correction éventuelle
  if (scanAmount) scanAmount.focus();

  // Mise à jour du badge
  const badge = document.getElementById("scanReadyBadge");
  if (badge) { badge.textContent = "SCANNE"; badge.classList.add("active"); }
}

function saveScannedTR() {
  const scanProvider = document.getElementById("scanProvider");
  const scanAmount   = document.getElementById("scanAmount");
  const scanRef      = document.getElementById("scanRef");
  const scanDate     = document.getElementById("scanDate");
  const preview      = document.getElementById("scanResultPreview");
  const barcode      = document.getElementById("barcodeInput");
  const badge        = document.getElementById("scanReadyBadge");

  const provider = scanProvider?.value || "INCONNU";
  const amount   = parseNum(scanAmount?.value);
  const ref      = String(scanRef?.value || "").trim();
  const date     = scanDate?.value || todayISO();

  if (amount <= 0) {
    alert("Veuillez saisir un montant valide.");
    scanAmount?.focus();
    return;
  }

  const rows = loadEntries(KEYS.tr);
  rows.push({
    id: `tr-scan-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    date, provider, ref, amount, source: "Scan douchette"
  });
  saveEntries(KEYS.tr, rows);
  renderTR();

  // Reset scanner
  if (preview) preview.style.display = "none";
  if (barcode) { barcode.value = ""; barcode.focus(); }
  if (badge)   { badge.textContent = "EN ATTENTE"; badge.classList.remove("active"); }
  if (scanAmount) scanAmount.value = "";
  if (scanRef)    scanRef.value    = "";
}

// ─── SECTION 9 : MODULES ANNEXES ─────────────────────────────────────────────

function renderDepenses() {
  const depTotal    = document.getElementById("depTotal");
  const depTableBody= document.getElementById("depTableBody");
  if (!depTableBody) return;
  const rows  = loadEntries(KEYS.dep).slice().sort((a,b)=>String(a.date).localeCompare(String(b.date)));
  const total = rows.reduce((s,r)=>s+parseNum(r.amount),0);
  if (depTotal) depTotal.innerHTML = `<div class="v">${eur(total)}</div><div class="l">Total depenses</div>`;
  depTableBody.innerHTML = rows.map(r=>
    `<tr><td>${r.date}</td><td>${r.rayon}</td><td>${eur(r.amount)}</td><td><button type="button" data-deldep="${r.id}">Suppr.</button></td></tr>`
  ).join("");
  depTableBody.querySelectorAll("button[data-deldep]").forEach(b=>b.onclick=()=>{
    saveEntries(KEYS.dep, loadEntries(KEYS.dep).filter(r=>String(r.id)!==String(b.dataset.deldep)));
    renderDepenses();
  });
}

function renderEcheances() {
  const echTableBody = document.getElementById("echTableBody");
  if (!echTableBody) return;
  const rows   = loadEntries(KEYS.ech).slice().sort((a,b)=>String(a.dueDate).localeCompare(String(b.dueDate)));
  const visible = rows.filter(r => String(r.status||"A_REGLER") !== "REGLE" || parseNum(r.paidAmount) < parseNum(r.amount));
  const now    = todayISO();
  echTableBody.innerHTML = visible.map(r => {
    const remain = Math.max(0, parseNum(r.amount) - parseNum(r.paidAmount));
    const status = remain <= 0 ? "REGLE" : (r.status || "A_REGLER");
    const isLate = remain > 0 && String(r.dueDate||"") < now;
    return `<tr>
      <td class="${isLate?"danger":""}">${r.dueDate||"-"}</td>
      <td>${r.vendor||"-"}</td><td>${r.label||"-"}</td>
      <td>${eur(r.amount)}</td><td>${eur(r.paidAmount)}</td>
      <td class="${remain>0?"danger":"ok"}">${eur(remain)}</td>
      <td class="${isLate?"danger":""}">${status}${isLate?" / RETARD":""}</td>
      <td>${r.recurrence||"NONE"}</td>
      <td>${r.planNote||"-"} ${r.planDate?`(${r.planDate})`:""}</td>
      <td>${r.paidDate||"-"}</td>
      <td>
        <button type="button" data-ech-pay="${r.id}">Regler</button>
        <button type="button" data-ech-imp="${r.id}">Impaye</button>
        <button type="button" data-ech-del="${r.id}">Suppr.</button>
      </td>
    </tr>`;
  }).join("") || `<tr><td colspan="11" class="muted-val" style="text-align:center;padding:16px">Aucune echeance en cours</td></tr>`;

  echTableBody.querySelectorAll("button[data-ech-imp]").forEach(b => b.onclick = () => {
    const all = loadEntries(KEYS.ech);
    const i   = all.findIndex(x => String(x.id) === String(b.dataset.echImp));
    if (i >= 0) { all[i].status = "IMPAYE"; saveEntries(KEYS.ech, all); }
    renderEcheances();
  });
  echTableBody.querySelectorAll("button[data-ech-del]").forEach(b => b.onclick = () => {
    saveEntries(KEYS.ech, loadEntries(KEYS.ech).filter(x => String(x.id) !== String(b.dataset.echDel)));
    renderEcheances();
  });
}

function renderImpayes() {
  const tbody = document.getElementById("impayesBody");
  const kpis  = document.getElementById("impayesKpis");
  if (!tbody) return;

  const today = todayISO();
  const rows  = loadEntries(KEYS.impayes);

  // KPIs
  const totalDette = rows.reduce((s, r) => s + parseNum(r.totalAmount), 0);
  const totalPaye  = rows.reduce((s, r) => s + (r.payments||[]).reduce((ss, p) => ss + parseNum(p.amount), 0), 0);
  const totalReste = totalDette - totalPaye;
  if (kpis) kpis.innerHTML = [
    { label: "Total dettes",    value: eur(totalDette), cls: totalDette > 0 ? "danger" : "" },
    { label: "Total rembourse", value: eur(totalPaye),  cls: "ok" },
    { label: "Reste a payer",   value: eur(totalReste), cls: totalReste > 0 ? "danger" : "ok", big: true }
  ].map(c =>
    `<div class="kpi${c.big?" kpi-hero":""}"><div class="v ${c.cls||""}">${c.value}</div><div class="l">${c.label}</div></div>`
  ).join("");

  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="muted-val" style="text-align:center;padding:16px">Aucun impaye enregistre \uD83C\uDF89</td></tr>`;
    return;
  }

  // Tri : non soldés d'abord, puis par date
  const sorted = [...rows].sort((a, b) => {
    const aR = parseNum(a.totalAmount) - (a.payments||[]).reduce((s,p)=>s+parseNum(p.amount),0);
    const bR = parseNum(b.totalAmount) - (b.payments||[]).reduce((s,p)=>s+parseNum(p.amount),0);
    if (aR > 0 && bR <= 0) return -1;
    if (aR <= 0 && bR > 0) return  1;
    return String(a.createdDate||"").localeCompare(String(b.createdDate||""));
  });

  let html = "";
  for (const r of sorted) {
    const paid  = (r.payments||[]).reduce((s, p) => s + parseNum(p.amount), 0);
    const reste = Math.max(0, parseNum(r.totalAmount) - paid);
    const isDone = reste <= 0;
    const isLate = reste > 0 && String(r.createdDate||"") < today;
    const rowCls = isDone ? "row-settled" : isLate ? "row-overdue" : "";

    html += `<tr class="${rowCls}">
      <td>${r.createdDate||"-"}</td>
      <td><strong>${r.creditor||"-"}</strong></td>
      <td>${r.label||"-"}${r.note?` <span class="muted" style="font-size:11px">(${r.note})</span>`:""}</td>
      <td class="${isDone?"":"danger"}">${eur(r.totalAmount)}</td>
      <td class="ok">${paid > 0 ? eur(paid) : ""}</td>
      <td class="${reste>0?"danger":"ok"}"><strong>${eur(reste)}</strong></td>
      <td>${isDone
        ? `<span class="tag" style="background:#dcfce7;border-color:#16a34a;color:#166534">SOLDE</span>`
        : `<span class="tag warn">EN COURS</span>`}</td>
      <td style="white-space:nowrap">
        ${!isDone ? `<button type="button" class="btn-imp-pay" data-id="${r.id}">+ Versement</button>` : ""}
        <button type="button" class="btn-imp-del" data-id="${r.id}" style="background:#94a3b8;margin-left:4px">Suppr.</button>
      </td>
    </tr>`;

    // Sous-lignes : historique des versements
    for (const p of (r.payments||[])) {
      html += `<tr class="debit-line-row">
        <td class="dl-indent">\u2514</td>
        <td style="font-size:12px;color:#475569">${p.date}</td>
        <td colspan="2" style="font-size:12px;color:#475569">${p.motif||"-"}</td>
        <td class="ok" style="font-size:12px">${eur(p.amount)}</td>
        <td></td><td></td>
        <td><button type="button" class="btn-imp-del-pay" data-id="${r.id}" data-pid="${p.id}" style="background:#94a3b8;font-size:11px;padding:2px 7px">\u00d7</button></td>
      </tr>`;
    }

    // Formulaire de versement (caché par défaut)
    html += `<tr id="impform-${r.id}" style="display:none;background:#f0f9ff">
      <td class="dl-indent">\u2514</td>
      <td colspan="6">
        <div style="display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap;padding:6px 0">
          <label style="font-size:12px;margin:0">Date
            <input type="date" id="impfd-${r.id}" value="${today}" style="margin-left:4px;padding:4px 8px;border:1px solid #cbd5e1;border-radius:6px">
          </label>
          <label style="font-size:12px;margin:0">Montant (&euro;)
            <input type="number" id="impfa-${r.id}" step="0.01" min="0" placeholder="${reste.toFixed(2)}" style="margin-left:4px;padding:4px 8px;border:1px solid #cbd5e1;border-radius:6px;width:100px">
          </label>
          <label style="font-size:12px;margin:0;flex:1">Motif
            <input type="text" id="impfm-${r.id}" placeholder="Virement, especes, cheque..." style="margin-left:4px;padding:4px 8px;border:1px solid #cbd5e1;border-radius:6px;width:100%">
          </label>
          <button type="button" class="btn-imp-save" data-id="${r.id}" style="padding:5px 14px">Enregistrer</button>
          <button type="button" class="btn-imp-cancel" data-id="${r.id}" style="padding:5px 14px;background:#94a3b8">Annuler</button>
        </div>
      </td>
      <td></td>
    </tr>`;
  }

  tbody.innerHTML = html;

  // Listeners délégués
  tbody.querySelectorAll(".btn-imp-pay").forEach(b => {
    b.onclick = () => {
      const f = document.getElementById(`impform-${b.dataset.id}`);
      if (f) f.style.display = f.style.display === "none" ? "" : "none";
    };
  });
  tbody.querySelectorAll(".btn-imp-cancel").forEach(b => {
    b.onclick = () => {
      const f = document.getElementById(`impform-${b.dataset.id}`);
      if (f) f.style.display = "none";
    };
  });
  tbody.querySelectorAll(".btn-imp-save").forEach(b => {
    b.onclick = () => {
      const id     = b.dataset.id;
      const date   = document.getElementById(`impfd-${id}`)?.value || today;
      const amount = parseNum(document.getElementById(`impfa-${id}`)?.value);
      const motif  = String(document.getElementById(`impfm-${id}`)?.value || "").trim();
      if (amount <= 0) { alert("Veuillez saisir un montant valide."); return; }
      const all = loadEntries(KEYS.impayes);
      const i   = all.findIndex(x => String(x.id) === id);
      if (i < 0) return;
      if (!all[i].payments) all[i].payments = [];
      const dlLabel   = `Remb. ${all[i].creditor}${motif ? " - " + motif : ""}`;
      const dlId      = addDebitLine(date, dlLabel, amount);
      all[i].payments.push({ id: `pay-${Date.now()}-${Math.floor(Math.random()*1000)}`, date, amount, motif, debitLineId: dlId });
      saveEntries(KEYS.impayes, all);
      rerender();
    };
  });
  tbody.querySelectorAll(".btn-imp-del").forEach(b => {
    b.onclick = () => {
      if (!confirm("Supprimer cet impaye et tous ses versements ?")) return;
      saveEntries(KEYS.impayes, loadEntries(KEYS.impayes).filter(x => String(x.id) !== b.dataset.id));
      renderImpayes();
    };
  });
  tbody.querySelectorAll(".btn-imp-del-pay").forEach(b => {
    b.onclick = () => {
      const all = loadEntries(KEYS.impayes);
      const i   = all.findIndex(x => String(x.id) === b.dataset.id);
      if (i >= 0) {
        const pay = (all[i].payments||[]).find(p => String(p.id) === b.dataset.pid);
        if (pay?.debitLineId) {
          saveEntries(KEYS.debitLines, loadEntries(KEYS.debitLines).filter(l => l.id !== pay.debitLineId));
          saveEntries(KEYS.catEntries, loadEntries(KEYS.catEntries).filter(e => e.sourceRef !== `DL-${pay.debitLineId}`));
        }
        all[i].payments = (all[i].payments||[]).filter(p => String(p.id) !== b.dataset.pid);
        saveEntries(KEYS.impayes, all);
      }
      rerender();
    };
  });
}

function renderCoupons() {
  const cpTableBody = document.getElementById("cpTableBody");
  if (!cpTableBody) return;
  const rows = loadEntries(KEYS.cp);
  cpTableBody.innerHTML = rows.map(r => {
    const ecart = parseNum(r.expected) - parseNum(r.paid);
    return `<tr><td>${r.type}</td><td>${r.sentDate||"-"}</td><td>${eur(r.expected)}</td><td>${r.paidDate||"-"}</td><td>${eur(r.paid)}</td><td class="${ecart===0?"ok":"danger"}">${eur(ecart)}</td><td><button type="button" data-delcp="${r.id}">Suppr.</button></td></tr>`;
  }).join("") || `<tr><td colspan="7" class="muted-val" style="text-align:center;padding:16px">Aucun coupon suivi</td></tr>`;
  cpTableBody.querySelectorAll("button[data-delcp]").forEach(b => b.onclick = () => {
    saveEntries(KEYS.cp, loadEntries(KEYS.cp).filter(r => String(r.id) !== String(b.dataset.delcp)));
    renderCoupons();
  });
}

function renderDemarque() {
  const dmTableBody = document.getElementById("dmTableBody");
  if (!dmTableBody) return;
  const rows = loadEntries(KEYS.dm).slice().sort((a,b)=>Number(a.week)-Number(b.week));
  dmTableBody.innerHTML = rows.map(r => {
    const rate = parseNum(r.ca) > 0 ? parseNum(r.loss)/parseNum(r.ca)*100 : 0;
    return `<tr><td>${r.week}</td><td>${eur(r.ca)}</td><td>${eur(r.loss)}</td><td class="${rate>5?"danger":"ok"}">${rate.toFixed(2)}%</td><td><button type="button" data-deldm="${r.id}">Suppr.</button></td></tr>`;
  }).join("") || `<tr><td colspan="5" class="muted-val" style="text-align:center;padding:16px">Aucune ligne</td></tr>`;
  dmTableBody.querySelectorAll("button[data-deldm]").forEach(b => b.onclick = () => {
    saveEntries(KEYS.dm, loadEntries(KEYS.dm).filter(r => String(r.id) !== String(b.dataset.deldm)));
    renderDemarque();
  });
}

// ─── SECTION 10 : CATEGORIES ─────────────────────────────────────────────────

function bootDefaultCategories() {
  if (loadEntries(KEYS.cat).length) return;
  saveEntries(KEYS.cat, ["Frais generaux","Facture CRF","Charges employees","Commissions CB"]);
}

function ensureCategory(name) {
  if (!name) return;
  const rows = loadEntries(KEYS.cat);
  if (!rows.includes(name)) { rows.push(name); saveEntries(KEYS.cat, rows); }
}

function suggestCategory(text) {
  const s = String(text||"").toLowerCase();
  if (s.includes("crf")||s.includes("carrefour")) return "Facture CRF";
  if (s.includes("employ")||s.includes("salaire")||s.includes("urssaf")||s.includes("paie")) return "Charges employees";
  if (s.includes("commission")||s.includes("cb")) return "Commissions CB";
  return "Frais generaux";
}

function upsertAutoCategoryEntry(payload) {
  const rows = loadEntries(KEYS.catEntries);
  const key  = String(payload.sourceRef||"");
  const idx  = rows.findIndex(x => String(x.sourceRef||"") === key && key);
  if (idx >= 0) rows[idx] = {...rows[idx], ...payload};
  else rows.push(payload);
  saveEntries(KEYS.catEntries, rows);
}

function renderCategoryAnalysis() {
  const catEntryCategory = document.getElementById("catEntryCategory");
  const catTotals        = document.getElementById("catTotals");
  const catEntriesBody   = document.getElementById("catEntriesBody");
  if (!catEntriesBody) return;

  const categories = loadEntries(KEYS.cat);
  if (catEntryCategory) catEntryCategory.innerHTML = categories.map(c=>`<option value="${c}">${c}</option>`).join("");
  const rows   = loadEntries(KEYS.catEntries).slice().sort((a,b)=>String(a.date).localeCompare(String(b.date)));
  const totals = {};
  rows.forEach(r => { totals[r.category] = (totals[r.category]||0) + parseNum(r.amount); });
  if (catTotals) catTotals.innerHTML = Object.entries(totals).sort((a,b)=>b[1]-a[1]).map(([k,v])=>
    `<div class="kpi"><div class="v">${eur(v)}</div><div class="l">${k}</div></div>`
  ).join("") || `<div class="kpi"><div class="v">0 EUR</div><div class="l">Aucune categorie classee</div></div>`;
  catEntriesBody.innerHTML = rows.map(r=>
    `<tr><td>${r.date}</td><td>${r.category}</td><td>${r.source}</td><td>${r.label||"-"}</td><td>${eur(r.amount)}</td><td><button type="button" data-catdel="${r.id}">Suppr.</button></td></tr>`
  ).join("");
  catEntriesBody.querySelectorAll("button[data-catdel]").forEach(b => b.onclick = () => {
    saveEntries(KEYS.catEntries, loadEntries(KEYS.catEntries).filter(x => String(x.id) !== String(b.dataset.catdel)));
    renderCategoryAnalysis();
  });
}

function nextDueDate(dueDate, recurrence) {
  if (!dueDate || recurrence === "NONE") return "";
  const d = new Date(`${dueDate}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  if (recurrence === "WEEKLY")    d.setDate(d.getDate() + 7);
  if (recurrence === "MONTHLY")   d.setMonth(d.getMonth() + 1);
  if (recurrence === "QUARTERLY") d.setMonth(d.getMonth() + 3);
  if (recurrence === "YEARLY")    d.setFullYear(d.getFullYear() + 1);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

// ─── SECTION 11 : RERENDER GLOBAL ────────────────────────────────────────────

function rerender() {
  const monthPicker = document.getElementById("monthPicker");
  const m = monthPicker?.value || currentMonth();
  loadMonthConfigIntoForm(m);
  renderKpis(m);
  renderTable(m);
  renderTR();
  renderEcheances();
  renderCategoryAnalysis();
  renderCashDeposits(m);
  renderDepenses();
  renderCoupons();
  renderDemarque();
  renderImpayes();
}

// ─── SECTION 12 : EVENT LISTENERS ────────────────────────────────────────────

// --- Navigation tabs ---
document.querySelectorAll(".tab[data-tab]").forEach(b =>
  b.addEventListener("click", () => switchTab(b.dataset.tab))
);

// --- Month picker + export ---
document.getElementById("monthPicker")?.addEventListener("change", rerender);
document.getElementById("exportBtn")?.addEventListener("click", () =>
  exportCsv(document.getElementById("monthPicker")?.value || currentMonth())
);

// --- Saisie rapide ---
document.getElementById("quickForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const date  = document.getElementById("qDate")?.value;
  if (!date) return;
  const ca      = parseNum(document.getElementById("qCa")?.value);
  const comCb   = parseNum(document.getElementById("qComCb")?.value);
  const depot   = parseNum(document.getElementById("qDepot")?.value);
  const especes = parseNum(document.getElementById("qEspeces")?.value);
  const note    = String(document.getElementById("qNote")?.value || "").trim();
  const defs    = getDefaults();

  upsertEntry({
    date, _v: 2,
    ca, especes,
    caN1:          0,
    credit2Label:  defs.credit2Label || "Credit client",   credit2Amount: 0,
    credit3Label:  defs.credit3Label || "Depot especes",   credit3Amount: depot,
    debit1Label:   defs.debit1Label  || "Direct",           debit1Amount: 0,
    debit2Label:   defs.debit2Label  || "Com CB",           debit2Amount: comCb,
    debit3Label:   defs.debit3Label  || "CRF",              debit3Amount: 0,
    debit4Label:   defs.debit4Label  || "",                  debit4Amount: 0,
    note
  });

  if (ca > 0) setManualProjection(date, 0);
  document.getElementById("qCa").value      = "";
  document.getElementById("qComCb").value   = "";
  document.getElementById("qDepot").value   = "";
  document.getElementById("qEspeces").value = "";
  document.getElementById("qNote").value    = "";
  document.getElementById("qCa")?.focus();
  rerender();
});

// --- Config mois ---
document.getElementById("monthConfigForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const m = document.getElementById("monthPicker")?.value || currentMonth();
  setMonthConfig(m, {
    soldeDebutMois: parseNum(document.getElementById("cfgSoldeDebut")?.value),
    caBudget:       parseNum(document.getElementById("cfgCaBudget")?.value),
    caPrev:         parseNum(document.getElementById("cfgCaPrev")?.value),
    tendance:       parseNum(document.getElementById("cfgTendance")?.value)
  });
  rerender();
});

document.getElementById("cfgSoldeReprendreBtn")?.addEventListener("click", () => {
  const btn   = document.getElementById("cfgSoldeReprendreBtn");
  const solde = parseNum(btn.dataset.solde);
  const el    = document.getElementById("cfgSoldeDebut");
  if (el) { el.value = solde; el.focus(); }
});

// --- Versements espèces ---
document.getElementById("cashDepositForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const rows = loadEntries(KEYS.cashDeposits);
  rows.push({
    id: `cash-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    date:   document.getElementById("cashDepositDate")?.value,
    amount: parseNum(document.getElementById("cashDepositAmount")?.value),
    note:   String(document.getElementById("cashDepositNote")?.value || "").trim()
  });
  saveEntries(KEYS.cashDeposits, rows);
  document.getElementById("cashDepositForm").reset();
  document.getElementById("cashDepositDate").value = todayISO();
  rerender();
});

// --- Prélèvements additionnels (bouton visible) ---
function addDebitLine(date, label, amount, forceId) {
  if (!date || !label || amount <= 0) return null;
  const id    = forceId || `dl-${Date.now()}-${Math.floor(Math.random()*1000)}`;
  const lines = loadEntries(KEYS.debitLines);
  if (!lines.find(l => l.id === id)) lines.push({ id, date, label, amount });
  saveEntries(KEYS.debitLines, lines);
  const cat = suggestCategory(label);
  ensureCategory(cat);
  upsertAutoCategoryEntry({ id:`cat-dl-${id}`, sourceRef:`DL-${id}`, date, category:cat, source:"Prelevement", amount, label });
  return id;
}

document.getElementById("dlAddBtnVisible")?.addEventListener("click", () => {
  const date   = document.getElementById("dlDateVisible")?.value;
  const label  = document.getElementById("dlLabelVisible")?.value.trim();
  const amount = parseNum(document.getElementById("dlAmountVisible")?.value);
  if (addDebitLine(date, label, amount)) {
    document.getElementById("dlLabelVisible").value  = "";
    document.getElementById("dlAmountVisible").value = "";
    document.getElementById("dlLabelVisible")?.focus();
    rerender();
  }
});

// Compatibilité formulaire caché
document.getElementById("dlAddBtn")?.addEventListener("click", () => {
  const date   = document.getElementById("dlDate")?.value;
  const label  = document.getElementById("dlLabel")?.value.trim();
  const amount = parseNum(document.getElementById("dlAmount")?.value);
  if (addDebitLine(date, label, amount)) {
    document.getElementById("dlLabel").value  = "";
    document.getElementById("dlAmount").value = "";
    rerender();
  }
});

// Formulaire caché (compatibilité)
document.getElementById("entry-form")?.addEventListener("submit", e => {
  e.preventDefault();
  const get  = id => document.getElementById(id);
  const d1l  = String(get("debit1Label")?.value||"").trim()||"Direct";
  const d2l  = String(get("debit2Label")?.value||"").trim()||"Com CB";
  const d3l  = String(get("debit3Label")?.value||"").trim()||"CRF";
  const d4l  = String(get("debit4Label")?.value||"").trim();
  const entry = {
    date: get("date")?.value, _v: 2,
    ca: parseNum(get("ca")?.value), caN1: parseNum(get("caN1")?.value),
    credit2Label: "Credit client",   credit2Amount: parseNum(get("credit2Amount")?.value),
    credit3Label: "Depot especes",   credit3Amount: parseNum(get("credit3Amount")?.value),
    debit1Label: d1l, debit1Amount: parseNum(get("debit1Amount")?.value),
    debit2Label: d2l, debit2Amount: parseNum(get("debit2Amount")?.value),
    debit3Label: d3l, debit3Amount: parseNum(get("debit3Amount")?.value),
    debit4Label: d4l, debit4Amount: parseNum(get("debit4Amount")?.value),
    note: String(get("note")?.value||"").trim()
  };
  upsertEntry(entry); updateDefaults(entry);
  document.getElementById("entry-form").reset();
  const dateEl = document.getElementById("date"); if (dateEl) dateEl.value = todayISO();
  prefillFormDefaults();
  rerender();
});

// --- TR manuel ---
document.getElementById("tr-form")?.addEventListener("submit", e => {
  e.preventDefault();
  const provider = document.getElementById("trProvider")?.value || "INCONNU";
  const ref      = String(document.getElementById("trRef")?.value || "").trim();
  const rows     = loadEntries(KEYS.tr);
  rows.push({
    id: `tr-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    date: document.getElementById("trDate")?.value,
    provider, ref,
    amount: parseNum(document.getElementById("trAmount")?.value),
    source: String(document.getElementById("trSource")?.value||"").trim()||"Saisie manuelle"
  });
  saveEntries(KEYS.tr, rows);
  document.getElementById("tr-form").reset();
  const trd = document.getElementById("trDate");   if (trd) trd.value = todayISO();
  const trs = document.getElementById("trSource"); if (trs) trs.value = "Saisie manuelle";
  renderTR();
});

document.getElementById("trExportBtn")?.addEventListener("click", exportTRCsv);
document.getElementById("trKeepFirstBtn")?.addEventListener("click", removeDuplicateTRKeepFirst);
document.getElementById("trSearch")?.addEventListener("input", renderTR);

document.getElementById("trImportXlsx")?.addEventListener("change", async e => {
  const f = e.target.files?.[0];
  if (!f) return;
  try {
    const buf      = await f.arrayBuffer();
    const imported = parseTrRowsFromWorkbook(f, buf);
    if (!imported.length) { alert("Aucune ligne TR exploitable detectee."); return; }
    saveEntries(KEYS.tr, loadEntries(KEYS.tr).concat(imported));
    renderTR();
    alert(`Import TR : ${imported.length} ligne(s) importee(s).`);
  } catch (_) { alert("Import impossible : fichier non lisible."); }
  finally { e.target.value = ""; }
});

// --- Scan douchette ---
const barcodeInput = document.getElementById("barcodeInput");
const badge        = document.getElementById("scanReadyBadge");

barcodeInput?.addEventListener("focus", () => {
  if (badge) { badge.textContent = "PRET"; badge.classList.add("active"); }
});
barcodeInput?.addEventListener("blur", () => {
  const preview = document.getElementById("scanResultPreview");
  if (badge && (!preview || preview.style.display === "none")) {
    badge.textContent = "EN ATTENTE"; badge.classList.remove("active");
  }
});
barcodeInput?.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    const raw = barcodeInput.value.trim();
    if (raw.length >= 4) processBarcodeInput(raw);
    barcodeInput.value = "";
  }
});
// Debounce automatique pour douchettes qui n'envoient pas toujours Enter
let _barcodeTimer = null;
barcodeInput?.addEventListener("input", () => {
  clearTimeout(_barcodeTimer);
  const raw = barcodeInput.value.trim();
  if (raw.length >= 8) {
    _barcodeTimer = setTimeout(() => {
      processBarcodeInput(raw);
      barcodeInput.value = "";
    }, 300);
  }
});

document.getElementById("scanSaveBtn")?.addEventListener("click", saveScannedTR);
document.getElementById("scanCancelBtn")?.addEventListener("click", () => {
  const preview = document.getElementById("scanResultPreview");
  if (preview) preview.style.display = "none";
  if (barcodeInput) barcodeInput.focus();
  if (badge) { badge.textContent = "PRET"; badge.classList.add("active"); }
});

// --- Impayes ---
document.getElementById("impayeForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const rows = loadEntries(KEYS.impayes);
  rows.push({
    id:          `imp-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    createdDate: document.getElementById("impDate")?.value || todayISO(),
    creditor:    String(document.getElementById("impCreditor")?.value||"").trim(),
    label:       String(document.getElementById("impLabel")?.value||"").trim(),
    totalAmount: parseNum(document.getElementById("impAmount")?.value),
    note:        String(document.getElementById("impNote")?.value||"").trim(),
    payments:    []
  });
  saveEntries(KEYS.impayes, rows);
  document.getElementById("impayeForm").reset();
  document.getElementById("impDate").value = todayISO();
  renderImpayes();
});

// --- Echeances ---
document.getElementById("echForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const get  = id => document.getElementById(id);
  const rows = loadEntries(KEYS.ech);
  const newRow = {
    id:         `ech-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    dueDate:    get("echDueDate")?.value,
    vendor:     String(get("echVendor")?.value||"").trim(),
    label:      String(get("echLabel")?.value||"").trim(),
    amount:     parseNum(get("echAmount")?.value),
    status:     get("echStatus")?.value || "A_REGLER",
    recurrence: get("echRecurrence")?.value || "NONE",
    planDate:   get("echPlanDate")?.value || "",
    paidAmount: parseNum(get("echPaidAmount")?.value),
    paidDate:   get("echPaidDate")?.value || "",
    planNote:   String(get("echPlanNote")?.value||"").trim()
  };
  rows.push(newRow);
  saveEntries(KEYS.ech, rows);
  const cat = suggestCategory(`${newRow.vendor} ${newRow.label}`);
  ensureCategory(cat);
  upsertAutoCategoryEntry({ id:`cat-ech-${newRow.id}`, sourceRef:`ECH-${newRow.id}`, date:newRow.dueDate, category:cat, source:"Echeance", amount:parseNum(newRow.amount), label:newRow.label });
  document.getElementById("echForm").reset();
  const ed = document.getElementById("echDueDate");     if (ed) ed.value   = todayISO();
  const es = document.getElementById("echStatus");      if (es) es.value   = "A_REGLER";
  const er = document.getElementById("echRecurrence");  if (er) er.value   = "NONE";
  const ep = document.getElementById("echPaidAmount");  if (ep) ep.value   = "0";
  rerender();
});

// Règlement échéance
document.getElementById("echTableBody")?.addEventListener("click", e => {
  const payBtn = e.target.closest("button[data-ech-pay]");
  if (!payBtn) return;
  const id   = String(payBtn.dataset.echPay);
  const rows = loadEntries(KEYS.ech);
  const i    = rows.findIndex(x => String(x.id) === id);
  if (i < 0) return;
  rows[i].status     = "REGLE";
  rows[i].paidAmount = parseNum(rows[i].amount);
  rows[i].paidDate   = todayISO();
  if (rows[i].recurrence && rows[i].recurrence !== "NONE") {
    const nextDue = nextDueDate(rows[i].dueDate, rows[i].recurrence);
    if (nextDue) rows.push({
      id: `ech-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      dueDate: nextDue, vendor: rows[i].vendor, label: rows[i].label,
      amount: parseNum(rows[i].amount), status: "A_REGLER",
      recurrence: rows[i].recurrence, planDate:"", paidAmount:0, paidDate:"", planNote: rows[i].planNote||""
    });
  }
  saveEntries(KEYS.ech, rows);
  rerender();
});

// --- Categories ---
document.getElementById("catForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const name = String(document.getElementById("catName")?.value||"").trim();
  if (!name) return;
  ensureCategory(name);
  document.getElementById("catForm").reset();
  renderCategoryAnalysis();
});

document.getElementById("catEntryForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const rows = loadEntries(KEYS.catEntries);
  rows.push({
    id:       `cat-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    date:     document.getElementById("catDate")?.value,
    category: document.getElementById("catEntryCategory")?.value,
    source:   document.getElementById("catEntrySource")?.value,
    amount:   parseNum(document.getElementById("catEntryAmount")?.value),
    label:    String(document.getElementById("catEntryLabel")?.value||"").trim()
  });
  saveEntries(KEYS.catEntries, rows);
  document.getElementById("catEntryForm").reset();
  document.getElementById("catDate").value = todayISO();
  renderCategoryAnalysis();
});

// --- Depenses ---
document.getElementById("depForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const depRow = {
    id: `dep-${Date.now()}`,
    date:   document.getElementById("depDate")?.value,
    rayon:  document.getElementById("depRayon")?.value.trim(),
    amount: parseNum(document.getElementById("depAmount")?.value)
  };
  loadEntries(KEYS.dep).concat([depRow]).forEach(r => r); // just to trigger
  saveEntries(KEYS.dep, loadEntries(KEYS.dep).concat([depRow]));
  document.getElementById("depForm").reset();
  document.getElementById("depDate").value = todayISO();
  const cat = suggestCategory(depRow.rayon);
  ensureCategory(cat);
  upsertAutoCategoryEntry({ id:`cat-dep-${depRow.id}`, sourceRef:`DEP-${depRow.id}`, date:depRow.date, category:cat, source:"Depense", amount:depRow.amount, label:depRow.rayon });
  renderDepenses(); renderCategoryAnalysis();
});

// --- Coupons ---
document.getElementById("cpForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const rows = loadEntries(KEYS.cp);
  rows.push({
    id: `cp-${Date.now()}`,
    sentDate: document.getElementById("cpSentDate")?.value,
    type:     document.getElementById("cpType")?.value.trim() || "INCONNU",
    expected: parseNum(document.getElementById("cpExpected")?.value),
    paidDate: document.getElementById("cpPaidDate")?.value,
    paid:     parseNum(document.getElementById("cpPaid")?.value)
  });
  saveEntries(KEYS.cp, rows);
  document.getElementById("cpForm").reset();
  document.getElementById("cpSentDate").value = todayISO();
  renderCoupons();
});

// --- Démarque ---
document.getElementById("dmForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const rows = loadEntries(KEYS.dm);
  rows.push({
    id: `dm-${Date.now()}`,
    week: parseInt(document.getElementById("dmWeek")?.value, 10),
    ca:   parseNum(document.getElementById("dmCa")?.value),
    loss: parseNum(document.getElementById("dmLoss")?.value)
  });
  saveEntries(KEYS.dm, rows);
  document.getElementById("dmForm").reset();
  renderDemarque();
});

// --- Prévisions CA ---
document.getElementById("caPrevDays")?.addEventListener("change", e => {
  setCaPrevDays(parseInt(e.target.value, 10));
  rerender();
});

// --- Solde début de mois (bouton OK du dashboard) ---
document.getElementById("cfgSoldeSave")?.addEventListener("click", () => {
  const m = document.getElementById("monthPicker")?.value || currentMonth();
  setMonthConfig(m, { soldeDebutMois: parseNum(document.getElementById("cfgSoldeDebut")?.value) });
  rerender();
});

// --- Colonnes personnalisées ---
document.getElementById("addColBtn")?.addEventListener("click", () => {
  const input = document.getElementById("newColLabel");
  const label = String(input?.value || "").trim();
  if (!label) { input?.focus(); return; }
  addCustomColumn(label);
  if (input) input.value = "";
  rerender();
});
document.getElementById("newColLabel")?.addEventListener("keydown", e => {
  if (e.key === "Enter") { e.preventDefault(); document.getElementById("addColBtn")?.click(); }
});

// --- Horizon controls ---
document.getElementById("horizonDays")?.addEventListener("change", e => {
  setHorizonDays(parseInt(e.target.value, 10));
  renderHorizon();
});
document.getElementById("horizonThreshold")?.addEventListener("change", e => {
  setSoldeAlertThreshold(parseNum(e.target.value));
  renderHorizon();
});
document.getElementById("horizonAutoProjectBtn")?.addEventListener("click", () => {
  const btn = document.getElementById("horizonAutoProjectBtn");
  btn.disabled = true; btn.textContent = "Calcul...";
  setTimeout(() => {
    const n = applyAutoProjectionCA();
    btn.disabled = false; btn.textContent = "Auto-projeter CA";
    renderHorizon();
    if (n === 0) alert("Aucune projection calculee. Il faut au moins quelques semaines d'historique de CA.");
    else alert(`${n} jour(s) projete(s) d'apres l'historique.`);
  }, 30);
});
document.getElementById("horizonClearBtn")?.addEventListener("click", () => {
  if (!confirm("Effacer toutes les projections CA ? (Le CA reel deja saisi n'est pas affecte)")) return;
  clearAllProjections();
  renderHorizon();
});

// ─── SECTION 13 : INITIALISATION ─────────────────────────────────────────────

// Dates initiales
const _setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
_setVal("qDate",            todayISO());
_setVal("date",             todayISO());
_setVal("dlDate",           todayISO());
_setVal("dlDateVisible",    todayISO());
_setVal("monthPicker",      currentMonth());
_setVal("cashDepositDate",  todayISO());
_setVal("trDate",           todayISO());
_setVal("echDueDate",       todayISO());
_setVal("catDate",          todayISO());
_setVal("depDate",          todayISO());
_setVal("cpSentDate",       todayISO());
_setVal("scanDate",         todayISO());
_setVal("impDate",          todayISO());

bootDefaultCategories();
bootTRSeed();
migrateV1toV2();
prefillFormDefaults();
_setVal("caPrevDays", getCaPrevDays());
rerender();
