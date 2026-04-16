const KEYS = {
  treso: "tresorerie_entries_v1",
  tr: "tresorerie_tr_entries_v1",
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
  note: document.getElementById("note"),
  monthPicker: document.getElementById("monthPicker"),
  kpis: document.getElementById("kpis"),
  tableBody: document.querySelector("#table tbody"),
  exportBtn: document.getElementById("exportBtn"),
  improvements: document.getElementById("improvements"),
  trForm: document.getElementById("tr-form"),
  trDate: document.getElementById("trDate"),
  trProvider: document.getElementById("trProvider"),
  trRef: document.getElementById("trRef"),
  trAmount: document.getElementById("trAmount"),
  trSource: document.getElementById("trSource"),
  trKpis: document.getElementById("trKpis"),
  trTableBody: document.getElementById("trTableBody"),
  trExportBtn: document.getElementById("trExportBtn"),
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
  const available = parseNum(x.ca) - pending - parseNum(x.expenses);
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
  const totalCA = rows.reduce((s, r) => s + parseNum(r.ca), 0);
  const totalPending = rows.reduce((s, r) => s + r.pending, 0);
  const totalExpenses = rows.reduce((s, r) => s + parseNum(r.expenses), 0);
  const totalAvailable = rows.reduce((s, r) => s + r.available, 0);
  const cards = [
    { label: "CA cumule", value: eur(totalCA) },
    { label: "Ecart encaissement", value: eur(totalPending) },
    { label: "Depenses", value: eur(totalExpenses) },
    { label: "Disponible reel", value: eur(totalAvailable) }
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
        <td>${eur(r.ca)}</td>
        <td>${eur(r.trPending)}</td>
        <td>${eur(r.cashPending)}</td>
        <td>${eur(r.otherPending)}</td>
        <td>${eur(r.expenses)}</td>
        <td class="${ecartClass}">${eur(r.pending)}</td>
        <td class="${availClass}">${eur(r.available)}</td>
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

function renderImprovements(monthKey) {
  const rows = getMonthRows(monthKey);
  const pendingTR = rows.reduce((s, r) => s + parseNum(r.trPending), 0);
  const pendingCash = rows.reduce((s, r) => s + parseNum(r.cashPending), 0);
  const negativeDays = rows.filter((r) => r.available < 0).length;
  const list = [
    pendingTR > 0
      ? `Mettre en place un suivi de remise TR (batch quotidien) : ${eur(pendingTR)} actuellement non credites.`
      : "Process TR: bon niveau sur le mois selectionne.",
    pendingCash > 0
      ? `Structurer les versements d'especes (frequence fixe) : ${eur(pendingCash)} encore non verses.`
      : "Especes: pas d'encours non verse detecte sur ce mois.",
    negativeDays > 0
      ? `${negativeDays} jour(s) avec disponible reel negatif: ajouter une alerte J+0 et un plafond depenses journaliere.`
      : "Aucun jour negatif: conserver la discipline de depenses.",
    "Ajouter une prevision a 14 jours (charges fixes + depenses prevues) pour anticiper les tensions de tresorerie.",
    "Ajouter un rapprochement bancaire hebdomadaire pour fermer les ecarts plus vite."
  ];
  el.improvements.innerHTML = list.map((x) => `<li>${x}</li>`).join("");
}

function rerender() {
  const m = el.monthPicker.value || currentMonth();
  renderKpis(m);
  renderTable(m);
  renderImprovements(m);
  renderTR();
  renderDepenses();
  renderCoupons();
  renderDemarque();
}

function exportCsv(monthKey) {
  const rows = getMonthRows(monthKey);
  const head = [
    "date", "ca", "tr_pending", "cash_pending", "other_pending",
    "expenses", "pending_total", "available_real", "note"
  ];
  const body = rows.map((r) => [
    r.date, r.ca, r.trPending, r.cashPending, r.otherPending, r.expenses, r.pending, r.available, (r.note || "").replace(/"/g, '""')
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
    const key = `${(r.provider||"").toUpperCase()}|${(r.ref||"").trim().toUpperCase()}|${r.date||""}|${Number(r.amount||0).toFixed(2)}`;
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
    const key = `${(r.provider||"").toUpperCase()}|${(r.ref||"").trim().toUpperCase()}|${r.date||""}|${Number(r.amount||0).toFixed(2)}`;
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
    const key = `${(r.provider||"").toUpperCase()}|${(r.ref||"").trim().toUpperCase()}|${r.date||""}|${Number(r.amount||0).toFixed(2)}`;
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

el.form.addEventListener("submit", (e) => {
  e.preventDefault();
  const entry = {
    date: el.date.value,
    ca: parseNum(el.ca.value),
    trPending: parseNum(el.trPending.value),
    cashPending: parseNum(el.cashPending.value),
    otherPending: parseNum(el.otherPending.value),
    expenses: parseNum(el.expenses.value),
    note: String(el.note.value || "").trim()
  };
  upsertEntry(entry);
  rerender();
});

el.trForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  const rows = loadEntries(KEYS.tr);
  rows.push({
    id: `tr-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    date: el.trDate.value,
    provider: el.trProvider.value,
    ref: String(el.trRef.value||"").trim(),
    amount: parseNum(el.trAmount.value),
    source: String(el.trSource.value||"").trim() || "Saisie manuelle"
  });
  saveEntries(KEYS.tr, rows);
  el.trForm.reset();
  el.trDate.value = todayISO();
  el.trSource.value = "Saisie manuelle";
  renderTR();
});

el.depForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  const rows = loadEntries(KEYS.dep);
  rows.push({id:`dep-${Date.now()}`, date:el.depDate.value, rayon:el.depRayon.value.trim(), amount:parseNum(el.depAmount.value)});
  saveEntries(KEYS.dep, rows); el.depForm.reset(); el.depDate.value=todayISO(); renderDepenses();
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

el.tabs.forEach(b=>b.addEventListener("click",()=>switchTab(b.dataset.tab)));
el.monthPicker.addEventListener("change", rerender);
el.exportBtn.addEventListener("click", () => exportCsv(el.monthPicker.value || currentMonth()));
el.trExportBtn.addEventListener("click", exportTRCsv);

el.date.value = todayISO();
el.monthPicker.value = currentMonth();
el.trDate.value = todayISO();
el.depDate.value = todayISO();
el.cpSentDate.value = todayISO();
bootTRSeed();
rerender();
