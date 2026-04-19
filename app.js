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
  caProjections: "tresorerie_ca_projections_v1"
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
  const lbl = document.getElementById("monthConfigLabel");
  if (lbl) lbl.textContent = monthKey;
  const sd = document.getElementById("cfgSoldeDebut");
  const cb = document.getElementById("cfgCaBudget");
  const cp = document.getElementById("cfgCaPrev");
  const ct = document.getElementById("cfgTendance");
  if (sd) sd.value = cfg.soldeDebutMois || "";
  if (cb) cb.value = cfg.caBudget || "";
  if (cp) cp.value = cfg.caPrev || "";
  if (ct) ct.value = cfg.tendance || "";

  const btn      = document.getElementById("cfgSoldeReprendreBtn");
  if (!btn) return;
  const prevSolde = getPrevMonthEndingSolde(monthKey);
  if (prevSolde !== null && !parseNum(cfg.soldeDebutMois)) {
    btn.textContent    = `\u21e6 Reprendre fin ${getPrevMonthKey(monthKey)} : ${eur(prevSolde)}`;
    btn.style.display  = "block";
    btn.dataset.solde  = prevSolde;
  } else if (prevSolde !== null) {
    btn.textContent    = `Fin ${getPrevMonthKey(monthKey)} : ${eur(prevSolde)}`;
    btn.style.display  = "block";
    btn.dataset.solde  = prevSolde;
  } else {
    btn.style.display  = "none";
  }
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

function computeRow(x, debitLines) {
  const linesTotal   = (debitLines || []).reduce((s, l) => s + parseNum(l.amount), 0);
  const totalDebits  = parseNum(x.debit1Amount) + parseNum(x.debit2Amount)
                     + parseNum(x.debit3Amount)  + parseNum(x.debit4Amount) + linesTotal;
  const totalCredits = parseNum(x.ca) + parseNum(x.credit2Amount) + parseNum(x.credit3Amount);
  const netJour      = totalCredits - totalDebits;
  return { ...x, totalDebits, totalCredits, netJour, debitLines: debitLines || [], linesTotal };
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
  const cutoff    = addDays(today, -90);

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

  kpisEl.innerHTML = [
    { label: "Solde en banque (estime)", value: eur(soldeActuel), cls: cls(soldeActuel), big: true },
    { label: "CA cumule du mois",        value: eur(totalCA) },
    { label: "Total debits",             value: eur(totalDebits) },
    { label: "Total credits",            value: eur(totalCreds) },
    { label: "Ecart vs budget",          value: ecartB  !== null ? fmt(ecartB)  : "Budget non defini", cls: ecartB  !== null ? cls(ecartB)  : "muted" },
    { label: "Ecart vs N-1",             value: ecartN1 !== null ? fmt(ecartN1) : "N-1 non saisi",     cls: ecartN1 !== null ? cls(ecartN1) : "muted" }
  ].map(c =>
    `<div class="kpi${c.big?" kpi-hero":""}"><div class="v ${c.cls||""}">${c.value}</div><div class="l">${c.label}</div></div>`
  ).join("");
}

function renderTable(monthKey) {
  const tableBody = document.querySelector("#table tbody");
  if (!tableBody) return;
  const rows    = getMonthRows(monthKey);
  const d       = getDefaults();
  const today   = todayISO();
  const threshold = getSoldeAlertThreshold();
  let dividerInserted = false;

  const setTh = (id, txt) => { const th = document.getElementById(id); if (th) th.textContent = txt; };
  setTh("th-debit1",  d.debit1Label  || "Direct");
  setTh("th-debit2",  d.debit2Label  || "Com CB");
  setTh("th-debit3",  d.debit3Label  || "CRF");
  setTh("th-debit4",  d.debit4Label  || "Divers");
  setTh("th-credit2", d.credit2Label || "Credit+");
  setTh("th-credit3", d.credit3Label || "Depot");

  const E = (f, d, t) => `data-field="${f}" data-date="${d}" data-type="${t}"`;

  tableBody.innerHTML = rows.map(r => {
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
      divider = `<tr class="today-divider"><td colspan="13">\u25bc Projections</td></tr>`;
    }

    const soldeClass = r.soldeCumulatif < 0 ? "danger" : r.soldeCumulatif < threshold ? "warn" : "ok";
    const netClass   = r.netJour < 0 ? "danger" : r.netJour > 0 ? "ok" : "";
    const shortNote  = r.note ? (r.note.length > 28 ? r.note.slice(0, 28) + "\u2026" : r.note) : "";
    const delBtn     = r._exists ? `<button data-del="${r.date}" type="button">\u00d7</button>` : "";
    const dv         = (v) => v ? eur(v) : "";

    const mainRow = `<tr class="${classes}" data-row-date="${r.date}">
      <td class="date-cell"><strong>${r.date.slice(8)}</strong></td>
      <td class="col-debit editable" ${E("debit1Amount",  r.date, "number")}>${dv(r.debit1Amount)}</td>
      <td class="col-debit editable" ${E("debit2Amount",  r.date, "number")}>${dv(r.debit2Amount)}</td>
      <td class="col-debit editable" ${E("debit3Amount",  r.date, "number")}>${dv(r.debit3Amount)}</td>
      <td class="col-debit editable" ${E("debit4Amount",  r.date, "number")}>${dv(r.debit4Amount)}</td>
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
      <td colspan="8" class="col-debit dl-label-cell">${l.label || "Prelev."}</td>
      <td class="col-debit dl-amount-cell">\u2212 ${eur(l.amount)}</td>
      <td></td><td></td>
      <td><button type="button" data-deldl="${l.id}">\u00d7</button></td>
    </tr>`).join("");

    return divider + mainRow + subRows;
  }).join("");

  tableBody.querySelectorAll("button[data-del]").forEach(b =>
    b.addEventListener("click", () => { deleteEntry(b.dataset.del); rerender(); })
  );
  tableBody.querySelectorAll("button[data-deldl]").forEach(b =>
    b.addEventListener("click", () => {
      const id = b.dataset.deldl;
      saveEntries(KEYS.debitLines, loadEntries(KEYS.debitLines).filter(l => l.id !== id));
      saveEntries(KEYS.catEntries, loadEntries(KEYS.catEntries).filter(e => e.sourceRef !== `DL-${id}`));
      rerender();
    })
  );

  // Édition inline — clic sur cellule
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
  const existing = loadEntries(KEYS.tresoV2).find(r => r.date === date);
  const debitRefMap = { debit1Amount:"D1", debit2Amount:"D2", debit3Amount:"D3", debit4Amount:"D4" };

  const input     = document.createElement("input");
  input.type      = type;
  if (type === "number") { input.step = "0.01"; input.min = "0"; }
  input.value     = type === "number"
    ? (existing ? parseNum(existing[field]) || "" : "")
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
  if (tabId === "horizon") renderHorizon();
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
  allRows.forEach(r => { byProvider[r.provider] = (byProvider[r.provider] || 0) + parseNum(r.amount); });
  trKpis.innerHTML = Object.entries(byProvider).sort((a,b)=>b[1]-a[1]).map(([p,v]) =>
    `<div class="kpi"><div class="v">${eur(v)}</div><div class="l">${p}</div></div>`
  ).join("") || `<div class="kpi"><div class="v">0 EUR</div><div class="l">Aucune donnee</div></div>`;

  const dupMap = trDuplicateMap(allRows);
  trTableBody.innerHTML = rows.map(r => {
    const key   = `${(r.provider||"").toUpperCase()}|${normalizeRef(r.ref)}|${normalizeDate(r.date)}|${Number(r.amount||0).toFixed(2)}`;
    const isDup = (dupMap.get(key)||0) > 1;
    return `<tr>
      <td>${r.date||"-"}</td>
      <td><strong>${r.provider||"-"}</strong></td>
      <td>${r.ref||"-"}</td>
      <td>${eur(r.amount)}</td>
      <td>${r.source||"-"}</td>
      <td class="${isDup?"danger":"ok"}">${isDup?"DOUBLON":"OK"}</td>
      <td><button type="button" data-deltr="${r.id}">Suppr.</button></td>
    </tr>`;
  }).join("") || `<tr><td colspan="7" class="muted-val" style="text-align:center;padding:16px">Aucun TR — saisissez ou scannez un bordereau</td></tr>`;

  trTableBody.querySelectorAll("button[data-deltr]").forEach(b =>
    b.addEventListener("click", () => {
      saveEntries(KEYS.tr, loadEntries(KEYS.tr).filter(r => String(r.id) !== String(b.dataset.deltr)));
      renderTR();
    })
  );
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
  renderHorizon();  // guard interne si onglet inactif
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
  const ca    = parseNum(document.getElementById("qCa")?.value);
  const comCb = parseNum(document.getElementById("qComCb")?.value);
  const depot = parseNum(document.getElementById("qDepot")?.value);
  const note  = String(document.getElementById("qNote")?.value || "").trim();
  const defs  = getDefaults();

  upsertEntry({
    date, _v: 2,
    ca,
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
  document.getElementById("qCa").value    = "";
  document.getElementById("qComCb").value = "";
  document.getElementById("qDepot").value = "";
  document.getElementById("qNote").value  = "";
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
function addDebitLine(date, label, amount) {
  if (!date || !label || amount <= 0) return false;
  const id    = `dl-${Date.now()}-${Math.floor(Math.random()*1000)}`;
  const lines = loadEntries(KEYS.debitLines);
  lines.push({ id, date, label, amount });
  saveEntries(KEYS.debitLines, lines);
  const cat = suggestCategory(label);
  ensureCategory(cat);
  upsertAutoCategoryEntry({ id:`cat-dl-${id}`, sourceRef:`DL-${id}`, date, category:cat, source:"Prelevement", amount, label });
  return true;
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
_setVal("horizonThreshold", getSoldeAlertThreshold());
_setVal("horizonDays",      getHorizonDays());

bootDefaultCategories();
bootTRSeed();
migrateV1toV2();
prefillFormDefaults();
rerender();
