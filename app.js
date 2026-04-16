const KEYS = {
  treso: "tresorerie_entries_v1",
  cashDeposits: "tresorerie_cash_deposits_v1",
  tr: "tresorerie_tr_entries_v1",
  ech: "tresorerie_echeances_entries_v1",
  cat: "tresorerie_categories_v1",
  catEntries: "tresorerie_category_entries_v1",
  dep: "tresorerie_depenses_entries_v1",
  cp: "tresorerie_coupons_entries_v1",
  dm: "tresorerie_demarque_entries_v1"
};

const TR_SEED = [
  {"date":"2020-12-24","provider":"SCANCOUPON","amount":265.25,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2020-12-24","provider":"SCANCOUPON","amount":6.02,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-01-12","provider":"SOGEC","amount":322.4,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-01-15","provider":"SCANCOUPON","amount":1.6,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-01-25","provider":"SCANCOUPON","amount":9.64,"source":"SUIVI REMBOURSEMENT"},
  {"date":"22-Fevrier","provider":"SCANCOUPON","amount":18.4,"source":"SUIVI REMBOURSEMENT"},
  {"date":"23-Fevrier","provider":"SOGEC","amount":122.12,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-03-17","provider":"SCANCOUPON","amount":5.2,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-03-24","provider":"SCANCOUPON","amount":471.8,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-03-30","provider":"SOGEC","amount":9.9,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-04-01","provider":"SCANCOUPON","amount":243.69,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-04-20","provider":"SCANCOUPON","amount":6.1,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-04-28","provider":"SOGEC","amount":209.07,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-05-10","provider":"SCANCOUPON","amount":1.8,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-06-02","provider":"SOGEC","amount":156.69,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-06-16","provider":"SCANCOUPON","amount":8.2,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-07-16","provider":"SCANCOUPON","amount":5.8,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-07-16","provider":"SCANCOUPON","amount":6.46,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-07-21","provider":"SOGEC","amount":89.97,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-07-29","provider":"SCANCOUPON","amount":203.07,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-08-10","provider":"SOGEC","amount":74.3,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-08-23","provider":"SOGEC","amount":113.09,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-08-23","provider":"SCANCOUPON","amount":17.5,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-09-10","provider":"SCANCOUPON","amount":13.5,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-09-15","provider":"SOGC","amount":164.95,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-10-06","provider":"SOGEC","amount":54.94,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-10-06","provider":"SCANCOUPON","amount":175.03,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-10-14","provider":"SCANCOUPON","amount":5.3,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-10-14","provider":"SCANCOUPON","amount":3.32,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-11-09","provider":"SOGEC","amount":2.0,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-11-04","provider":"SOGEC","amount":184.69,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-11-17","provider":"SOGEC","amount":3.7,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-11-17","provider":"HIGHT CO DATA","amount":168.19,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2021-12-22","provider":"SOGEC","amount":130.91,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2022-01-19","provider":"HIGHT CO DATA","amount":0.9,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2022-02-08","provider":"SOGEC","amount":109.31,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2022-02-09","provider":"HIGHT CO DATA","amount":7.22,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2022-04-01","provider":"SOGEC","amount":91.5,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2022-04-12","provider":"HIGH CO DATA","amount":0.6,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2022-04-13","provider":"HIGH CO DATA","amount":394.16,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2022-05-03","provider":"SOGEC","amount":129.83,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2022-06-28","provider":"SOGEC","amount":119.74,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2022-07-01","provider":"HIGH CO DATA","amount":6.99,"source":"SUIVI REMBOURSEMENT"},
  {"date":"2022-07-06","provider":"HIGH CO DATA","amount":427.93,"source":"SUIVI REMBOURSEMENT"}
];

const el = {
  tabs: [...document.querySelectorAll(".tab[data-tab]")],
  panels: [...document.querySelectorAll(".panel")],
  form: document.getElementById("entry-form"),
  date: document.getElementById("date"),
  ca: document.getElementById("ca"),
  trPending: document.getElementById("trPending"),
  cashPending: document.getElementById("cashPending"),
  otherPending: document.getElementById("otherPending"),
  expenses: document.getElementById("expenses"),
  cbFees: document.getElementById("cbFees"),
  note: document.getElementById("note"),
  monthPicker: document.getElementById("monthPicker"),
  kpis: document.getElementById("kpis"),
  tableBody: document.querySelector("#table tbody"),
  exportBtn: document.getElementById("exportBtn"),
  cashDepositForm: document.getElementById("cashDepositForm"),
  cashDepositDate: document.getElementById("cashDepositDate"),
  cashDepositAmount: document.getElementById("cashDepositAmount"),
  cashDepositNote: document.getElementById("cashDepositNote"),
  cashDepositBody: document.getElementById("cashDepositBody"),
  trForm: document.getElementById("tr-form"),
  trDate: document.getElementById("trDate"),
  trRef: document.getElementById("trRef"),
  trAmount: document.getElementById("trAmount"),
  trSource: document.getElementById("trSource"),
  trKpis: document.getElementById("trKpis"),
  trTableBody: document.getElementById("trTableBody"),
  trExportBtn: document.getElementById("trExportBtn"),
  echForm: document.getElementById("echForm"),
  echDueDate: document.getElementById("echDueDate"),
  echVendor: document.getElementById("echVendor"),
  echLabel: document.getElementById("echLabel"),
  echAmount: document.getElementById("echAmount"),
  echStatus: document.getElementById("echStatus"),
  echRecurrence: document.getElementById("echRecurrence"),
  echPlanDate: document.getElementById("echPlanDate"),
  echPaidAmount: document.getElementById("echPaidAmount"),
  echPaidDate: document.getElementById("echPaidDate"),
  echPlanNote: document.getElementById("echPlanNote"),
  echTableBody: document.getElementById("echTableBody"),
  catForm: document.getElementById("catForm"),
  catName: document.getElementById("catName"),
  catEntryForm: document.getElementById("catEntryForm"),
  catDate: document.getElementById("catDate"),
  catEntryCategory: document.getElementById("catEntryCategory"),
  catEntrySource: document.getElementById("catEntrySource"),
  catEntryAmount: document.getElementById("catEntryAmount"),
  catEntryLabel: document.getElementById("catEntryLabel"),
  catTotals: document.getElementById("catTotals"),
  catEntriesBody: document.getElementById("catEntriesBody"),
  depForm: document.getElementById("depForm"),
  depDate: document.getElementById("depDate"),
  depRayon: document.getElementById("depRayon"),
  depAmount: document.getElementById("depAmount"),
  depTotal: document.getElementById("depTotal"),
  depTableBody: document.getElementById("depTableBody"),
  cpForm: document.getElementById("cpForm"),
  cpSentDate: document.getElementById("cpSentDate"),
  cpType: document.getElementById("cpType"),
  cpExpected: document.getElementById("cpExpected"),
  cpPaidDate: document.getElementById("cpPaidDate"),
  cpPaid: document.getElementById("cpPaid"),
  cpTableBody: document.getElementById("cpTableBody"),
  dmForm: document.getElementById("dmForm"),
  dmWeek: document.getElementById("dmWeek"),
  dmCa: document.getElementById("dmCa"),
  dmLoss: document.getElementById("dmLoss"),
  dmTableBody: document.getElementById("dmTableBody")
};

function eur(v) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(Number(v || 0));
}

function parseNum(v) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function normalizeDate(v){
  const s=String(v||"").trim();
  if(!s) return "";
  if(/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const m=s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if(!m) return s;
  const d=String(m[1]).padStart(2,"0");
  const mo=String(m[2]).padStart(2,"0");
  const y=String(m[3]).length===2?`20${m[3]}`:String(m[3]);
  return `${y}-${mo}-${d}`;
}

function normalizeRef(v){
  return String(v||"").toUpperCase().replace(/\s+/g,"").replace(/[^A-Z0-9]/g,"");
}

function detectProviderFromText(text){
  const s=String(text||"").toUpperCase();
  if(s.includes("SOGEC")) return "SOGEC";
  if(s.includes("HIGH")) return "HIGH CO DATA";
  if(s.includes("SCAN")) return "SCANCOUPON";
  return "INCONNU";
}

function loadEntries(key) {
  try {
    const raw = localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (_) {
    return [];
  }
}

function saveEntries(key, entries) {
  localStorage.setItem(key, JSON.stringify(entries));
}

function computeRow(x) {
  const pending = parseNum(x.trPending) + parseNum(x.cashPending) + parseNum(x.otherPending);
  const available = parseNum(x.ca) - pending - parseNum(x.expenses) - parseNum(x.cbFees);
  return { ...x, pending, available };
}

function upsertEntry(entry) {
  const rows = loadEntries(KEYS.treso);
  const idx = rows.findIndex((r) => r.date === entry.date);
  if (idx >= 0) rows[idx] = entry;
  else rows.push(entry);
  rows.sort((a, b) => a.date.localeCompare(b.date));
  saveEntries(KEYS.treso, rows);
}

function deleteEntry(date) {
  const rows = loadEntries(KEYS.treso).filter((r) => r.date !== date);
  saveEntries(KEYS.treso, rows);
}

function getMonthRows(monthKey) {
  return loadEntries(KEYS.treso).filter((r) => String(r.date || "").startsWith(monthKey)).map(computeRow);
}

function renderKpis(monthKey) {
  const rows = getMonthRows(monthKey);
  const deposits = loadEntries(KEYS.cashDeposits).filter((r)=>String(r.date||"").startsWith(monthKey));
  const totalCA = rows.reduce((s, r) => s + parseNum(r.ca), 0);
  const totalPending = rows.reduce((s, r) => s + r.pending, 0);
  const totalExpenses = rows.reduce((s, r) => s + parseNum(r.expenses), 0);
  const totalCbFees = rows.reduce((s, r) => s + parseNum(r.cbFees), 0);
  const totalCashPending = rows.reduce((s, r) => s + parseNum(r.cashPending), 0);
  const totalCashDeposited = deposits.reduce((s,r)=>s+parseNum(r.amount),0);
  const totalCashToDeposit = Math.max(0, totalCashPending - totalCashDeposited);
  const totalAvailable = rows.reduce((s, r) => s + r.available, 0);
  const cards = [
    { label: "CA cumule", value: eur(totalCA) },
    { label: "Ecart encaissement", value: eur(totalPending) },
    { label: "Depenses", value: eur(totalExpenses + totalCbFees) },
    { label: "Disponible reel", value: eur(totalAvailable) },
    { label: "Total commissions CB", value: eur(totalCbFees) },
    { label: "Especes a verser", value: eur(totalCashToDeposit) }
  ];
  el.kpis.innerHTML = cards.map((c) => `<div class="kpi"><div class="v">${c.value}</div><div class="l">${c.label}</div></div>`).join("");
}

function renderTable(monthKey) {
  const rows = getMonthRows(monthKey);
  el.tableBody.innerHTML = rows
    .map((r) => {
      const ecartClass = r.pending > 0 ? "danger" : "ok";
      const availClass = r.available < 0 ? "danger" : "ok";
      return `<tr>
        <td>${r.date}</td>
        <td class="col-credit">${eur(r.ca)}</td>
        <td class="col-debit">${eur(r.trPending)}</td>
        <td class="col-debit">${eur(r.cashPending)}</td>
        <td class="col-debit">${eur(r.otherPending)}</td>
        <td class="col-debit">${eur(r.expenses)}</td>
        <td class="col-debit">${eur(r.cbFees)}</td>
        <td class="col-solde ${ecartClass}">${eur(r.pending)}</td>
        <td class="col-solde ${availClass}">${eur(r.available)}</td>
        <td title="${r.note || ""}">${r.note || "-"}</td>
        <td><button data-del="${r.date}" type="button">Suppr.</button></td>
      </tr>`;
    })
    .join("");

  el.tableBody.querySelectorAll("button[data-del]").forEach((b) => {
    b.addEventListener("click", () => {
      deleteEntry(b.dataset.del);
      rerender();
    });
  });
}

function rerender() {
  const m = el.monthPicker.value || currentMonth();
  renderKpis(m);
  renderTable(m);
  renderTR();
  renderEcheances();
  renderCategoryAnalysis();
  renderCashDeposits(m);
  renderDepenses();
  renderCoupons();
  renderDemarque();
}

function renderCashDeposits(monthKey){
  const rows = loadEntries(KEYS.cashDeposits).filter((r)=>String(r.date||"").startsWith(monthKey)).sort((a,b)=>String(a.date).localeCompare(String(b.date)));
  el.cashDepositBody.innerHTML = rows.map(r=>`<tr><td>${r.date}</td><td>${eur(r.amount)}</td><td>${r.note||"-"}</td><td><button type="button" data-cashdel="${r.id}">Suppr.</button></td></tr>`).join("");
  el.cashDepositBody.querySelectorAll("button[data-cashdel]").forEach((b)=>b.onclick=()=>{
    saveEntries(KEYS.cashDeposits, loadEntries(KEYS.cashDeposits).filter(x=>String(x.id)!==String(b.dataset.cashdel)));
    rerender();
  });
}

function exportCsv(monthKey) {
  const rows = getMonthRows(monthKey);
  const head = [
    "date", "ca", "tr_pending", "cash_pending", "other_pending",
    "expenses", "cb_fees", "pending_total", "available_real", "note"
  ];
  const body = rows.map((r) => [
    r.date, r.ca, r.trPending, r.cashPending, r.otherPending, r.expenses, r.cbFees, r.pending, r.available, (r.note || "").replace(/"/g, '""')
  ]);
  const csv = [head.join(","), ...body.map((r) => r.map((v) => `"${v ?? ""}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `tresorerie-${monthKey}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function switchTab(tabId){
  el.tabs.forEach(b=>b.classList.toggle("active", b.dataset.tab===tabId));
  el.panels.forEach(p=>p.classList.toggle("active", p.id===`panel-${tabId}`));
}

function bootTRSeed(){
  const existing = loadEntries(KEYS.tr);
  if(existing.length) return;
  const seeded = TR_SEED.map((x, idx)=>({
    id: `seed-${idx+1}`,
    date: String(x.date || ""),
    provider: String(x.provider||"INCONNU").replace("SOGC","SOGEC").replace("HIGHT CO DATA","HIGH CO DATA"),
    ref: "",
    amount: parseNum(x.amount),
    source: x.source || "Import Excel"
  }));
  saveEntries(KEYS.tr, seeded);
}

function trDuplicateMap(rows){
  const counts = new Map();
  rows.forEach(r=>{
    const key = `${(r.provider||"").toUpperCase()}|${normalizeRef(r.ref)}|${normalizeDate(r.date)}|${Number(r.amount||0).toFixed(2)}`;
    counts.set(key, (counts.get(key)||0)+1);
  });
  return counts;
}

function renderTR(){
  const rows = loadEntries(KEYS.tr).slice().sort((a,b)=>String(a.date).localeCompare(String(b.date)));
  const byProvider = {};
  rows.forEach(r=>{ byProvider[r.provider]=(byProvider[r.provider]||0)+parseNum(r.amount); });
  el.trKpis.innerHTML = Object.entries(byProvider).sort((a,b)=>b[1]-a[1]).map(([p,v])=>
    `<div class="kpi"><div class="v">${eur(v)}</div><div class="l">${p}</div></div>`
  ).join("") || `<div class="kpi"><div class="v">0</div><div class="l">Aucune donnee</div></div>`;

  const dupMap = trDuplicateMap(rows);
  el.trTableBody.innerHTML = rows.map(r=>{
    const key = `${(r.provider||"").toUpperCase()}|${normalizeRef(r.ref)}|${normalizeDate(r.date)}|${Number(r.amount||0).toFixed(2)}`;
    const isDup = (dupMap.get(key)||0) > 1;
    return `<tr>
      <td>${r.date||"-"}</td>
      <td>${r.provider||"-"}</td>
      <td>${r.ref||"-"}</td>
      <td>${eur(r.amount)}</td>
      <td>${r.source||"-"}</td>
      <td class="${isDup?'danger':'ok'}">${isDup?'DOUBLON':'OK'}</td>
      <td><button type="button" data-deltr="${r.id}">Suppr.</button></td>
    </tr>`;
  }).join("");
  el.trTableBody.querySelectorAll("button[data-deltr]").forEach(b=>{
    b.addEventListener("click", ()=>{
      saveEntries(KEYS.tr, loadEntries(KEYS.tr).filter(r=>String(r.id)!==String(b.dataset.deltr)));
      renderTR();
    });
  });
}

function exportTRCsv(){
  const rows = loadEntries(KEYS.tr);
  const head = ["date","provider","ref","amount","source","duplicate_flag"];
  const dupMap = trDuplicateMap(rows);
  const body = rows.map(r=>{
    const key = `${(r.provider||"").toUpperCase()}|${normalizeRef(r.ref)}|${normalizeDate(r.date)}|${Number(r.amount||0).toFixed(2)}`;
    return [r.date,r.provider,r.ref,r.amount,r.source,(dupMap.get(key)||0)>1?"DUPLICATE":"OK"];
  });
  const csv=[head.join(","),...body.map(r=>r.map(v=>`"${String(v??"").replace(/"/g,'""')}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `tr-fournisseurs.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function renderDepenses(){
  const rows = loadEntries(KEYS.dep).slice().sort((a,b)=>String(a.date).localeCompare(String(b.date)));
  const total = rows.reduce((s,r)=>s+parseNum(r.amount),0);
  el.depTotal.innerHTML = `<div class="v">${eur(total)}</div><div class="l">Total depenses</div>`;
  el.depTableBody.innerHTML = rows.map(r=>`<tr><td>${r.date}</td><td>${r.rayon}</td><td>${eur(r.amount)}</td><td><button type="button" data-deldep="${r.id}">Suppr.</button></td></tr>`).join("");
  el.depTableBody.querySelectorAll("button[data-deldep]").forEach(b=>b.onclick=()=>{
    saveEntries(KEYS.dep, loadEntries(KEYS.dep).filter(r=>String(r.id)!==String(b.dataset.deldep)));renderDepenses();
  });
}

function renderEcheances(){
  const rows = loadEntries(KEYS.ech).slice().sort((a,b)=>String(a.dueDate).localeCompare(String(b.dueDate)));
  const visible = rows.filter(r=>String(r.status||"A_REGler")!=="REGLE" || parseNum(r.paidAmount)<parseNum(r.amount));
  const now = todayISO();
  el.echTableBody.innerHTML = visible.map(r=>{
    const remain = Math.max(0, parseNum(r.amount) - parseNum(r.paidAmount));
    const status = remain<=0 ? "REGLE" : (r.status||"A_REGler");
    const isLate = remain > 0 && String(r.dueDate || "") < now;
    const statusLabel = isLate ? `${status} / RETARD` : status;
    return `<tr>
      <td class="${isLate?'danger':''}">${r.dueDate||"-"}</td>
      <td>${r.vendor||"-"}</td>
      <td>${r.label||"-"}</td>
      <td>${eur(r.amount)}</td>
      <td>${eur(r.paidAmount)}</td>
      <td class="${remain>0?'danger':'ok'}">${eur(remain)}</td>
      <td class="${isLate?'danger':''}">${statusLabel}</td>
      <td>${r.recurrence||"NONE"}</td>
      <td>${r.planNote||"-"} ${r.planDate?`(${r.planDate})`:""}</td>
      <td>${r.paidDate||"-"}</td>
      <td>
        <button type="button" data-ech-pay="${r.id}">Regler</button>
        <button type="button" data-ech-imp="${r.id}">Impaye</button>
        <button type="button" data-ech-del="${r.id}">Suppr.</button>
      </td>
    </tr>`;
  }).join("");

  el.echTableBody.querySelectorAll("button[data-ech-imp]").forEach(b=>b.onclick=()=>{
    const id = String(b.dataset.echImp);
    const rowsAll = loadEntries(KEYS.ech);
    const i = rowsAll.findIndex(x=>String(x.id)===id);
    if(i<0) return;
    rowsAll[i].status = "IMPAYE";
    saveEntries(KEYS.ech, rowsAll);
    renderEcheances();
  });
  el.echTableBody.querySelectorAll("button[data-ech-del]").forEach(b=>b.onclick=()=>{
    const id = String(b.dataset.echDel);
    saveEntries(KEYS.ech, loadEntries(KEYS.ech).filter(x=>String(x.id)!==id));
    renderEcheances();
  });
}

function renderCoupons(){
  const rows = loadEntries(KEYS.cp);
  el.cpTableBody.innerHTML = rows.map(r=>{
    const ecart = parseNum(r.expected)-parseNum(r.paid);
    return `<tr><td>${r.type}</td><td>${r.sentDate||"-"}</td><td>${eur(r.expected)}</td><td>${r.paidDate||"-"}</td><td>${eur(r.paid)}</td><td class="${ecart===0?'ok':'danger'}">${eur(ecart)}</td><td><button type="button" data-delcp="${r.id}">Suppr.</button></td></tr>`;
  }).join("");
  el.cpTableBody.querySelectorAll("button[data-delcp]").forEach(b=>b.onclick=()=>{
    saveEntries(KEYS.cp, loadEntries(KEYS.cp).filter(r=>String(r.id)!==String(b.dataset.delcp)));renderCoupons();
  });
}

function renderDemarque(){
  const rows = loadEntries(KEYS.dm).slice().sort((a,b)=>Number(a.week)-Number(b.week));
  el.dmTableBody.innerHTML = rows.map(r=>{
    const rate = parseNum(r.ca)>0 ? (parseNum(r.loss)/parseNum(r.ca)*100) : 0;
    return `<tr><td>${r.week}</td><td>${eur(r.ca)}</td><td>${eur(r.loss)}</td><td class="${rate>5?'danger':'ok'}">${rate.toFixed(2)}%</td><td><button type="button" data-deldm="${r.id}">Suppr.</button></td></tr>`;
  }).join("");
  el.dmTableBody.querySelectorAll("button[data-deldm]").forEach(b=>b.onclick=()=>{
    saveEntries(KEYS.dm, loadEntries(KEYS.dm).filter(r=>String(r.id)!==String(b.dataset.deldm)));renderDemarque();
  });
}

function bootDefaultCategories(){
  const existing = loadEntries(KEYS.cat);
  if(existing.length) return;
  saveEntries(KEYS.cat, ["Frais generaux","Facture CRF","Charges employees","Commissions CB"]);
}

function ensureCategory(name){
  if(!name) return;
  const rows = loadEntries(KEYS.cat);
  if(rows.includes(name)) return;
  rows.push(name);
  saveEntries(KEYS.cat, rows);
}

function suggestCategory(text){
  const s = String(text||"").toLowerCase();
  if(s.includes("crf") || s.includes("carrefour")) return "Facture CRF";
  if(s.includes("employ") || s.includes("salaire") || s.includes("urssaf") || s.includes("paie")) return "Charges employees";
  if(s.includes("commission") || s.includes("cb")) return "Commissions CB";
  return "Frais generaux";
}

function upsertAutoCategoryEntry(payload){
  const rows = loadEntries(KEYS.catEntries);
  const key = String(payload.sourceRef || "");
  const idx = rows.findIndex(x=>String(x.sourceRef||"")===key && key);
  if(idx>=0) rows[idx] = { ...rows[idx], ...payload };
  else rows.push(payload);
  saveEntries(KEYS.catEntries, rows);
}

function renderCategoryAnalysis(){
  const categories = loadEntries(KEYS.cat);
  el.catEntryCategory.innerHTML = categories.map(c=>`<option value="${c}">${c}</option>`).join("");
  const rows = loadEntries(KEYS.catEntries).slice().sort((a,b)=>String(a.date).localeCompare(String(b.date)));
  const totals = {};
  rows.forEach(r=>{ totals[r.category]=(totals[r.category]||0)+parseNum(r.amount); });
  el.catTotals.innerHTML = Object.entries(totals).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<div class="kpi"><div class="v">${eur(v)}</div><div class="l">${k}</div></div>`).join("") || `<div class="kpi"><div class="v">0 EUR</div><div class="l">Aucune categorie classee</div></div>`;
  el.catEntriesBody.innerHTML = rows.map(r=>`<tr><td>${r.date}</td><td>${r.category}</td><td>${r.source}</td><td>${r.label||"-"}</td><td>${eur(r.amount)}</td><td><button type="button" data-catdel="${r.id}">Suppr.</button></td></tr>`).join("");
  el.catEntriesBody.querySelectorAll("button[data-catdel]").forEach(b=>b.onclick=()=>{
    saveEntries(KEYS.catEntries, loadEntries(KEYS.catEntries).filter(x=>String(x.id)!==String(b.dataset.catdel)));
    renderCategoryAnalysis();
  });
}

function nextDueDate(dueDate, recurrence){
  if(!dueDate || recurrence==="NONE") return "";
  const d = new Date(`${dueDate}T00:00:00`);
  if(Number.isNaN(d.getTime())) return "";
  if(recurrence==="WEEKLY") d.setDate(d.getDate()+7);
  if(recurrence==="MONTHLY") d.setMonth(d.getMonth()+1);
  if(recurrence==="QUARTERLY") d.setMonth(d.getMonth()+3);
  if(recurrence==="YEARLY") d.setFullYear(d.getFullYear()+1);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

el.form.addEventListener("submit", (e) => {
  e.preventDefault();
  const entry = {
    date: el.date.value,
    ca: parseNum(el.ca.value),
    trPending: parseNum(el.trPending.value),
    cashPending: parseNum(el.cashPending.value),
    otherPending: parseNum(el.otherPending.value),
    expenses: parseNum(el.expenses.value),
    cbFees: parseNum(el.cbFees.value),
    note: String(el.note.value || "").trim()
  };
  upsertEntry(entry);
  if(parseNum(entry.cbFees) > 0){
    const category = "Commissions CB";
    ensureCategory(category);
    upsertAutoCategoryEntry({
      id:`cat-cb-${entry.date}`,
      sourceRef:`CB-${entry.date}`,
      date: entry.date,
      category,
      source: "Commission CB",
      amount: parseNum(entry.cbFees),
      label: "Commission CB journaliere"
    });
  }
  rerender();
});

el.cashDepositForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  const rows = loadEntries(KEYS.cashDeposits);
  rows.push({
    id:`cash-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    date: el.cashDepositDate.value,
    amount: parseNum(el.cashDepositAmount.value),
    note: String(el.cashDepositNote.value||"").trim()
  });
  saveEntries(KEYS.cashDeposits, rows);
  el.cashDepositForm.reset();
  el.cashDepositDate.value = todayISO();
  rerender();
});

el.trForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  const rows = loadEntries(KEYS.tr);
  const ref = String(el.trRef.value||"").trim();
  const autoProvider = detectProviderFromText(ref);
  rows.push({
    id: `tr-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    date: el.trDate.value,
    provider: autoProvider!=="INCONNU" ? autoProvider : "INCONNU",
    ref,
    amount: parseNum(el.trAmount.value),
    source: String(el.trSource.value||"").trim() || "Saisie manuelle"
  });
  saveEntries(KEYS.tr, rows);
  el.trForm.reset();
  el.trDate.value = todayISO();
  el.trSource.value = "Saisie manuelle";
  renderTR();
});

el.echForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  const rows = loadEntries(KEYS.ech);
  const newRow = {
    id:`ech-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    dueDate: el.echDueDate.value,
    vendor: String(el.echVendor.value||"").trim(),
    label: String(el.echLabel.value||"").trim(),
    amount: parseNum(el.echAmount.value),
    status: el.echStatus.value || "A_REGler",
    recurrence: el.echRecurrence.value || "NONE",
    planDate: el.echPlanDate.value || "",
    paidAmount: parseNum(el.echPaidAmount.value),
    paidDate: el.echPaidDate.value || "",
    planNote: String(el.echPlanNote.value||"").trim()
  };
  rows.push(newRow);
  saveEntries(KEYS.ech, rows);
  const cat = suggestCategory(`${newRow.vendor} ${newRow.label}`);
  ensureCategory(cat);
  upsertAutoCategoryEntry({
    id:`cat-ech-${newRow.id}`,
    sourceRef:`ECH-${newRow.id}`,
    date: newRow.dueDate,
    category: cat,
    source: "Echeance",
    amount: parseNum(newRow.amount),
    label: newRow.label
  });
  el.echForm.reset();
  el.echDueDate.value = todayISO();
  el.echStatus.value = "A_REGler";
  el.echRecurrence.value = "NONE";
  el.echPaidAmount.value = "0";
  renderEcheances();
});

el.catForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  const name = String(el.catName.value||"").trim();
  if(!name) return;
  const rows = loadEntries(KEYS.cat);
  if(!rows.includes(name)){ rows.push(name); saveEntries(KEYS.cat, rows); }
  el.catForm.reset();
  renderCategoryAnalysis();
});

el.catEntryForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  const rows = loadEntries(KEYS.catEntries);
  rows.push({
    id:`cat-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    date: el.catDate.value,
    category: el.catEntryCategory.value,
    source: el.catEntrySource.value,
    amount: parseNum(el.catEntryAmount.value),
    label: String(el.catEntryLabel.value||"").trim()
  });
  saveEntries(KEYS.catEntries, rows);
  el.catEntryForm.reset();
  el.catDate.value = todayISO();
  renderCategoryAnalysis();
});

el.trRef.addEventListener("input", ()=>{
  // fournisseur detecte automatiquement au submit
});

function removeDuplicateTRKeepFirst(){
  const rows = loadEntries(KEYS.tr).slice().sort((a,b)=>String(a.date).localeCompare(String(b.date)));
  const seen = new Set();
  const kept = [];
  for(const r of rows){
    const key = `${(r.provider||"").toUpperCase()}|${normalizeRef(r.ref)}|${normalizeDate(r.date)}|${Number(r.amount||0).toFixed(2)}`;
    if(seen.has(key)) continue;
    seen.add(key);
    kept.push(r);
  }
  saveEntries(KEYS.tr, kept);
  renderTR();
}

function parseTrRowsFromWorkbook(file, arrayBuffer){
  const wb = XLSX.read(arrayBuffer, { type:"array" });
  const out = [];
  for(const sh of wb.SheetNames){
    const ws = wb.Sheets[sh];
    const json = XLSX.utils.sheet_to_json(ws,{header:1,defval:""});
    for(const row of json){
      if(!Array.isArray(row)) continue;
      const cells = row.map(c=>String(c||"").trim());
      const upper = cells.join(" ").toUpperCase();
      const provider = detectProviderFromText(upper);
      if(provider==="INCONNU") continue;
      const amountCell = row.find(c=>typeof c==="number" && c>0 && c<100000);
      if(!amountCell) continue;
      const dateCell = row.find(c=>c instanceof Date || /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/.test(String(c||"").trim()) || /^\d{4}-\d{2}-\d{2}$/.test(String(c||"").trim()));
      out.push({
        id:`imp-${Date.now()}-${Math.floor(Math.random()*1e6)}`,
        date: dateCell instanceof Date ? `${dateCell.getFullYear()}-${String(dateCell.getMonth()+1).padStart(2,"0")}-${String(dateCell.getDate()).padStart(2,"0")}` : normalizeDate(dateCell || ""),
        provider,
        ref: String(cells.find(c=>/[A-Z0-9]{5,}/.test(c.toUpperCase())) || ""),
        amount: parseNum(amountCell),
        source: `Import ${file.name}`
      });
    }
  }
  return out.filter(r=>r.amount>0);
}

el.depForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  const rows = loadEntries(KEYS.dep);
  const depRow = {id:`dep-${Date.now()}`, date:el.depDate.value, rayon:el.depRayon.value.trim(), amount:parseNum(el.depAmount.value)};
  rows.push(depRow);
  saveEntries(KEYS.dep, rows); el.depForm.reset(); el.depDate.value=todayISO(); renderDepenses();
  const cat = suggestCategory(depRow.rayon);
  ensureCategory(cat);
  upsertAutoCategoryEntry({
    id:`cat-dep-${depRow.id}`,
    sourceRef:`DEP-${depRow.id}`,
    date: depRow.date,
    category: cat,
    source: "Depense",
    amount: parseNum(depRow.amount),
    label: depRow.rayon
  });
  renderCategoryAnalysis();
});

el.cpForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  const rows = loadEntries(KEYS.cp);
  rows.push({
    id:`cp-${Date.now()}`, sentDate:el.cpSentDate.value, type:el.cpType.value.trim()||"INCONNU",
    expected:parseNum(el.cpExpected.value), paidDate:el.cpPaidDate.value, paid:parseNum(el.cpPaid.value)
  });
  saveEntries(KEYS.cp, rows); el.cpForm.reset(); el.cpSentDate.value=todayISO(); renderCoupons();
});

el.dmForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  const rows = loadEntries(KEYS.dm);
  rows.push({id:`dm-${Date.now()}`, week:parseInt(el.dmWeek.value,10), ca:parseNum(el.dmCa.value), loss:parseNum(el.dmLoss.value)});
  saveEntries(KEYS.dm, rows); el.dmForm.reset(); renderDemarque();
});

el.echTableBody.addEventListener("click", (e)=>{
  const payBtn = e.target.closest("button[data-ech-pay]");
  if(!payBtn) return;
  const id = String(payBtn.dataset.echPay);
  const rows = loadEntries(KEYS.ech);
  const i = rows.findIndex(x=>String(x.id)===id);
  if(i<0) return;
  const row = rows[i];
  row.status = "REGLE";
  row.paidAmount = parseNum(row.amount);
  row.paidDate = todayISO();
  const recurrence = row.recurrence || "NONE";
  if(recurrence !== "NONE"){
    const nextDue = nextDueDate(row.dueDate, recurrence);
    if(nextDue){
      rows.push({
        id:`ech-${Date.now()}-${Math.floor(Math.random()*1000)}`,
        dueDate: nextDue,
        vendor: row.vendor,
        label: row.label,
        amount: parseNum(row.amount),
        status: "A_REGler",
        recurrence,
        planDate: "",
        paidAmount: 0,
        paidDate: "",
        planNote: row.planNote || ""
      });
    }
  }
  saveEntries(KEYS.ech, rows);
  renderEcheances();
});

el.tabs.forEach(b=>b.addEventListener("click",()=>switchTab(b.dataset.tab)));
el.monthPicker.addEventListener("change", rerender);
el.exportBtn.addEventListener("click", () => exportCsv(el.monthPicker.value || currentMonth()));
el.trExportBtn.addEventListener("click", exportTRCsv);
document.getElementById("trKeepFirstBtn").addEventListener("click", removeDuplicateTRKeepFirst);
document.getElementById("trImportXlsx").addEventListener("change", async (e)=>{
  const f=e.target.files?.[0];
  if(!f) return;
  try{
    const buf=await f.arrayBuffer();
    const imported=parseTrRowsFromWorkbook(f, buf);
    if(!imported.length){ alert("Aucune ligne TR exploitable detectee dans ce fichier."); return; }
    const rows=loadEntries(KEYS.tr);
    saveEntries(KEYS.tr, rows.concat(imported));
    renderTR();
    alert(`Import TR termine: ${imported.length} ligne(s).`);
  }catch(_){
    alert("Import impossible: fichier non lisible.");
  }finally{
    e.target.value="";
  }
});

el.date.value = todayISO();
el.monthPicker.value = currentMonth();
el.cashDepositDate.value = todayISO();
el.trDate.value = todayISO();
el.echDueDate.value = todayISO();
el.catDate.value = todayISO();
el.depDate.value = todayISO();
el.cpSentDate.value = todayISO();
bootDefaultCategories();
bootTRSeed();
rerender();
