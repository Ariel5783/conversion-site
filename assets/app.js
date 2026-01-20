/* EKM Conversions — multi-pages (v1) */

const EKM = (() => {
  const LS_KEY = "ekm_conversions_multipage_v1";

  const MODES = {
    length: {
      label: "Longueurs (km → mm)",
      help: "Règle : ×10 vers la droite, ÷10 vers la gauche.",
      units: [
        { key:"km", pow:"10^3" },
        { key:"hm", pow:"10^2" },
        { key:"dam", pow:"10^1" },
        { key:"m", pow:"10^0" },
        { key:"dm", pow:"10^-1" },
        { key:"cm", pow:"10^-2" },
        { key:"mm", pow:"10^-3" },
      ],
      step: 10
    },
    mass: {
      label: "Masses (t → mg)",
      help: "Règle : ×10 vers la droite, ÷10 vers la gauche.",
      units: [
        { key:"t", pow:"" },
        { key:"kg", pow:"" },
        { key:"hg", pow:"" },
        { key:"dag", pow:"" },
        { key:"g", pow:"" },
        { key:"dg", pow:"" },
        { key:"cg", pow:"" },
        { key:"mg", pow:"" },
      ],
      step: 10
    },
    capacity: {
      label: "Capacités (kL → mL)",
      help: "Règle : ×10 / ÷10. Liens : 1 L = 1 dm³ ; 1 mL = 1 cm³.",
      units: [
        { key:"kL", pow:"" },
        { key:"hL", pow:"" },
        { key:"daL", pow:"" },
        { key:"L", pow:"" },
        { key:"dL", pow:"" },
        { key:"cL", pow:"" },
        { key:"mL", pow:"" },
      ],
      step: 10
    },
    time: {
      label: "Temps (h → min → s)",
      help: "Règle : 1 h = 60 min ; 1 min = 60 s.",
      units: [
        { key:"h", pow:"×60" },
        { key:"min", pow:"×60" },
        { key:"s", pow:"" },
      ],
      custom: "time"
    },
    electric: {
      label: "Électricité (kV/V, A/mA, kΩ/Ω, kW/W)",
      help: "Conversions : facteur 1000 sur les paires concernées.",
      units: [
        { key:"kV", pow:"×1000" },
        { key:"V", pow:"" },
        { key:"A", pow:"×1000 mA" },
        { key:"mA", pow:"" },
        { key:"kΩ", pow:"×1000" },
        { key:"Ω", pow:"" },
        { key:"kW", pow:"×1000 W" },
        { key:"W", pow:"" },
      ],
      custom: "electric"
    },
    data: {
      label: "Informatique / Réseaux (bits, octets, Ko/Mo/Go/To)",
      help: "Rappels : 1 octet = 8 bits ; 1 Ko = 1024 o ; etc.",
      units: [
        { key:"bits", pow:"↔ octets" },
        { key:"octets", pow:"↔ Ko" },
        { key:"Ko", pow:"↔ Mo" },
        { key:"Mo", pow:"↔ Go" },
        { key:"Go", pow:"↔ To" },
        { key:"To", pow:"" },
      ],
      custom: "data"
    },
    area: {
      label: "Aires (km² → mm²)",
      help: "Attention : pas de ×10 mais ×100 à chaque colonne.",
      units: [
        { key:"km²", pow:"" },
        { key:"hm²", pow:"" },
        { key:"dam²", pow:"" },
        { key:"m²", pow:"" },
        { key:"dm²", pow:"" },
        { key:"cm²", pow:"" },
        { key:"mm²", pow:"" },
      ],
      step: 100
    },
    volume3: {
      label: "Volumes cubiques (m³ → mm³)",
      help: "Règle : ×1000 / ÷1000. Rappel : 1 m³ = 1000 L.",
      units: [
        { key:"m³", pow:"" },
        { key:"dm³", pow:"= L" },
        { key:"cm³", pow:"= mL" },
        { key:"mm³", pow:"" },
      ],
      step: 1000
    }
  };

  const TRACK_NOTES = {
    general: {
      title: "Référentiel : Général",
      text: "Travailler SI (longueur, masse, capacité, temps) + liens L ↔ dm³. Réinvestir dans des contextes concrets."
    },
    cap: {
      title: "CAP Électricité",
      text: "Prioriser : mA/A, kΩ/Ω, kW/W, V/kV + longueurs (câblage) et temps (durées d’intervention)."
    },
    bpciel: {
      title: "Bac Pro CIEL",
      text: "Prioriser : bits/octet, Ko/Mo/Go, tailles de fichiers ; + conversions V/A/Ω et SI (métrologie)."
    },
    bpmspc: {
      title: "Bac Pro MSPC",
      text: "Prioriser : temps (GMAO), masses/capacités (consommables), longueurs (implantation) ; + A/mA, Ω/kΩ."
    },
    bts: {
      title: "BTS CIEL",
      text: "Renforcer : conversions en chaîne, précision/arrondis, ordre de grandeur ; + données (1024) et préfixes (k, m)."
    }
  };

  // 30 exercices (progressifs) + solution attendue (valeur + unité).
  // Remarque : les réponses sont données “en clair” ici (utile pour le mode enseignant).
  const EXERCISES = [
    // Longueurs
    { id:"E01", level:1, tag:"Longueurs", q:"Convertir 2,5 m en cm.", a:"250 cm" },
    { id:"E02", level:1, tag:"Longueurs", q:"Convertir 120 cm en m.", a:"1,2 m" },
    { id:"E03", level:1, tag:"Longueurs", q:"Convertir 3 km en m.", a:"3000 m" },
    { id:"E04", level:2, tag:"Longueurs", q:"Convertir 0,45 m en mm.", a:"450 mm" },
    { id:"E05", level:2, tag:"Longueurs", q:"Convertir 7500 mm en m.", a:"7,5 m" },

    // Masses
    { id:"E06", level:1, tag:"Masses", q:"Convertir 0,75 kg en g.", a:"750 g" },
    { id:"E07", level:1, tag:"Masses", q:"Convertir 250 g en kg.", a:"0,25 kg" },
    { id:"E08", level:2, tag:"Masses", q:"Convertir 1,2 t en kg.", a:"1200 kg" },
    { id:"E09", level:2, tag:"Masses", q:"Convertir 6500 mg en g.", a:"6,5 g" },

    // Capacités
    { id:"E10", level:1, tag:"Capacités", q:"Convertir 1,25 L en mL.", a:"1250 mL" },
    { id:"E11", level:1, tag:"Capacités", q:"Convertir 50 cL en L.", a:"0,5 L" },
    { id:"E12", level:2, tag:"Capacités", q:"Convertir 3,5 hL en L.", a:"350 L" },
    { id:"E13", level:2, tag:"Capacités", q:"Convertir 0,09 L en cL.", a:"9 cL" },

    // Temps
    { id:"E14", level:1, tag:"Temps", q:"Convertir 1,5 h en minutes.", a:"90 min" },
    { id:"E15", level:1, tag:"Temps", q:"Convertir 45 min en secondes.", a:"2700 s" },
    { id:"E16", level:2, tag:"Temps", q:"Convertir 5400 s en heures.", a:"1,5 h" },

    // Aires (×100)
    { id:"E17", level:2, tag:"Aires", q:"Convertir 1 m² en cm².", a:"10000 cm²" },
    { id:"E18", level:2, tag:"Aires", q:"Convertir 2500 cm² en m².", a:"0,25 m²" },
    { id:"E19", level:3, tag:"Aires", q:"Convertir 0,8 m² en mm².", a:"800000 mm²" },

    // Volumes cubiques (×1000)
    { id:"E20", level:2, tag:"Volumes", q:"Convertir 1 m³ en L.", a:"1000 L" },
    { id:"E21", level:2, tag:"Volumes", q:"Convertir 2 dm³ en mL.", a:"2000 mL" },

    // Électricité
    { id:"E22", level:1, tag:"Électricité", q:"Convertir 4,7 kΩ en Ω.", a:"4700 Ω" },
    { id:"E23", level:1, tag:"Électricité", q:"Convertir 250 mA en A.", a:"0,25 A" },
    { id:"E24", level:2, tag:"Électricité", q:"Convertir 0,23 kV en V.", a:"230 V" },
    { id:"E25", level:2, tag:"Électricité", q:"Convertir 1,2 kW en W.", a:"1200 W" },

    // Données (8 + 1024)
    { id:"E26", level:1, tag:"Numérique", q:"Convertir 64 bits en octets.", a:"8 octets" },
    { id:"E27", level:2, tag:"Numérique", q:"Convertir 2 Go en Mo.", a:"2048 Mo" },
    { id:"E28", level:2, tag:"Numérique", q:"Convertir 1024 Ko en Mo.", a:"1 Mo" },
    { id:"E29", level:3, tag:"Numérique", q:"Convertir 1,5 Mo en Ko.", a:"1536 Ko" },
    { id:"E30", level:3, tag:"Numérique", q:"Convertir 3 To en Go.", a:"3072 Go" },
  ];

  // QCM (20)
  const QCM = [
    { id:"Q01", cat:"SI", q:"Dans un tableau de longueurs, un déplacement d’une colonne vers la droite correspond à :", choices:["×10","×100","×60","×1000"], ans:0, explain:"Longueurs : facteur 10 entre colonnes." },
    { id:"Q02", cat:"SI", q:"1 L correspond à :", choices:["1 cm³","1 dm³","1 m³","10 dm³"], ans:1, explain:"1 L = 1 dm³." },
    { id:"Q03", cat:"Aires", q:"Pour les aires (m², cm²...), entre deux colonnes successives on multiplie par :", choices:["10","100","1000","60"], ans:1, explain:"Aires : facteur 100 par colonne." },
    { id:"Q04", cat:"Volumes", q:"1 m³ correspond à :", choices:["100 L","1000 L","10 L","1 L"], ans:1, explain:"1 m³ = 1000 L." },
    { id:"Q05", cat:"Temps", q:"1 h correspond à :", choices:["10 min","100 min","60 min","30 min"], ans:2, explain:"Temps : 1 h = 60 min." },

    { id:"Q06", cat:"Électricité", q:"1 kΩ correspond à :", choices:["100 Ω","1000 Ω","10 000 Ω","0,001 Ω"], ans:1, explain:"Préfixe kilo = 1000." },
    { id:"Q07", cat:"Électricité", q:"250 mA correspond à :", choices:["2,5 A","0,25 A","25 A","0,025 A"], ans:1, explain:"Diviser par 1000 : 250 mA = 0,25 A." },
    { id:"Q08", cat:"Électricité", q:"0,23 kV correspond à :", choices:["230 V","23 V","2300 V","0,023 V"], ans:0, explain:"Multiplier par 1000 : 0,23 kV = 230 V." },
    { id:"Q09", cat:"Électricité", q:"1,2 kW correspond à :", choices:["120 W","1200 W","12 000 W","0,12 W"], ans:1, explain:"1 kW = 1000 W." },

    { id:"Q10", cat:"Numérique", q:"1 octet correspond à :", choices:["4 bits","8 bits","16 bits","1024 bits"], ans:1, explain:"1 octet = 8 bits." },
    { id:"Q11", cat:"Numérique", q:"1 Ko correspond à :", choices:["1000 octets","1024 octets","8 octets","1024 bits"], ans:1, explain:"Convention informatique : 1 Ko = 1024 octets." },
    { id:"Q12", cat:"Numérique", q:"2 Go correspondent à :", choices:["2000 Mo","2048 Mo","1024 Mo","4096 Mo"], ans:1, explain:"2×1024 = 2048." },

    { id:"Q13", cat:"Méthode", q:"La méthode la plus fiable pour éviter les erreurs est :", choices:[
      "Faire des multiplications au hasard",
      "Écrire la valeur dans la bonne colonne puis compléter avec des zéros",
      "Toujours diviser par 10",
      "Toujours multiplier par 100"
    ], ans:1, explain:"C’est la méthode structurante demandée." },

    { id:"Q14", cat:"SI", q:"0,45 m correspond à :", choices:["45 mm","450 mm","4500 mm","0,045 mm"], ans:1, explain:"0,45 m = 45 cm = 450 mm." },
    { id:"Q15", cat:"SI", q:"7500 mm correspondent à :", choices:["0,75 m","7,5 m","75 m","750 m"], ans:1, explain:"7500 mm = 7,5 m." },

    { id:"Q16", cat:"Capacités", q:"50 cL correspondent à :", choices:["5 L","0,5 L","50 L","0,05 L"], ans:1, explain:"50 cL = 0,5 L." },
    { id:"Q17", cat:"Masses", q:"0,75 kg correspondent à :", choices:["75 g","750 g","7500 g","0,075 g"], ans:1, explain:"×1000." },
    { id:"Q18", cat:"Aires", q:"1 m² correspond à :", choices:["100 cm²","1000 cm²","10 000 cm²","1 000 000 cm²"], ans:2, explain:"(100 cm)² = 10 000 cm²." },
    { id:"Q19", cat:"Temps", q:"45 min correspondent à :", choices:["270 s","2700 s","4500 s","900 s"], ans:1, explain:"45×60 = 2700." },
    { id:"Q20", cat:"Volumes", q:"2 dm³ correspondent à :", choices:["2 mL","200 mL","2000 mL","20 000 mL"], ans:2, explain:"1 dm³ = 1 L = 1000 mL." },
  ];

  const defaultState = () => ({
    track: "general",
    precision: "auto",
    converter: { mode: "length", board: {} },
    student: { name:"", class:"", period:"", group:"", comment:"" },
    exercises: { answers: {}, showCorrections: {} },
    qcm: { answers: {}, lastScore: null, lastMax: null, lastAt: null },
  });

  let state = defaultState();

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  function load(){
    try{
      const raw = localStorage.getItem(LS_KEY);
      if(raw){
        const s = JSON.parse(raw);
        if(s && typeof s === "object") state = { ...defaultState(), ...s };
      }
    }catch(e){}
  }

  function save(){
    try{ localStorage.setItem(LS_KEY, JSON.stringify(state)); }
    catch(e){}
  }

  function parseNum(str){
    if(str == null) return null;
    const s = String(str).trim().replace(/\s+/g,'').replace(',', '.');
    if(s === "") return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }

  function formatNum(n){
    const p = state.precision;
    if(!Number.isFinite(n)) return "";
    if(p === "auto"){
      const nearInt = Math.abs(n - Math.round(n)) < 1e-12;
      if(nearInt) return String(Math.round(n));
      let t = n.toFixed(6).replace(/\.?0+$/,'');
      return t.replace('.', ',');
    }
    const d = Number(p);
    let t = n.toFixed(d).replace(/\.?0+$/,'');
    return t.replace('.', ',');
  }

  /* ---------- Student fields (common) ---------- */
  function mountStudentForm(){
    const name = $("#studentName");
    if(!name) return;

    const cls = $("#studentClass");
    const period = $("#period");
    const group = $("#teacherOrGroup");
    const comment = $("#comment");

    name.value = state.student.name || "";
    cls.value = state.student.class || "";
    period.value = state.student.period || "";
    group.value = state.student.group || "";
    comment.value = state.student.comment || "";

    const bind = (el, key) => el.addEventListener("input", () => {
      state.student[key] = el.value;
      save();
    });

    bind(name,"name"); bind(cls,"class"); bind(period,"period"); bind(group,"group"); bind(comment,"comment");
  }

  /* ---------- Track tabs (common) ---------- */
  function mountTrackTabs(){
    const tabs = $$(".tab[data-track]");
    if(!tabs.length) return;

    function setSelected(track){
      tabs.forEach(t => t.setAttribute("aria-selected", t.dataset.track === track ? "true" : "false"));
    }

    function updateNote(){
      const box = $("#trackNote");
      if(!box) return;
      const t = TRACK_NOTES[state.track] || TRACK_NOTES.general;
      box.innerHTML = `<strong>${t.title}</strong><br/>${t.text}`;
    }

    setSelected(state.track);
    updateNote();

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        state.track = tab.dataset.track;
        setSelected(state.track);
        updateNote();
        save();
      });
    });
  }

  /* ---------- Precision select (common) ---------- */
  function mountPrecision(){
    const sel = $("#precisionSelect");
    if(!sel) return;
    sel.value = state.precision || "auto";
    sel.addEventListener("change", () => {
      state.precision = sel.value;
      save();
      // refresh converter if present
      if($("#unitGrid")) buildConverter();
    });
  }

  /* ---------- Converter (common) ---------- */
  function buildConverter(){
    const modeSel = $("#modeSelect");
    const grid = $("#unitGrid");
    const help = $("#modeHelp");
    if(!modeSel || !grid || !help) return;

    modeSel.value = state.converter.mode || "length";
    const mode = MODES[modeSel.value];

    help.innerHTML = `<strong>${mode.label}</strong><br/>${mode.help}`;
    grid.innerHTML = "";

    mode.units.forEach(u => {
      const div = document.createElement("div");
      div.className = "cell";
      div.innerHTML = `
        <div class="u">
          <span>${u.key}</span>
          ${u.pow ? `<span class="pow">${u.pow}</span>` : `<span class="pow" style="opacity:.35"> </span>`}
        </div>
        <input type="text" inputmode="decimal" data-unit="${u.key}" placeholder="—" />
      `;
      grid.appendChild(div);
    });

    const inputs = $$("input[data-unit]", grid);
    inputs.forEach(inp => {
      const key = inp.dataset.unit;
      inp.value = (state.converter.board[key] ?? "");
      inp.addEventListener("input", () => onConverterInput(key, inp.value));
      inp.addEventListener("focus", () => inp.select());
    });

    const status = $("#boardStatus");
    if(status) status.textContent = "Saisissez une valeur dans une colonne : le tableau se complète automatiquement.";
  }

  function mountConverter(){
    const modeSel = $("#modeSelect");
    if(!modeSel) return;

    const btnClear = $("#btnClearBoard");
    const btnExample = $("#btnExample");
    const btnPrint = $("#btnPrint");
    const btnReset = $("#btnResetAll");

    modeSel.addEventListener("change", () => {
      state.converter.mode = modeSel.value;
      state.converter.board = {};
      save();
      buildConverter();
    });

    if(btnClear) btnClear.addEventListener("click", () => {
      state.converter.board = {};
      save();
      buildConverter();
      const status = $("#boardStatus");
      if(status) status.textContent = "Tableau effacé.";
    });

    if(btnExample) btnExample.addEventListener("click", () => applyConverterExample());

    if(btnPrint) btnPrint.addEventListener("click", () => window.print());

    if(btnReset) btnReset.addEventListener("click", () => {
      if(confirm("Réinitialiser toutes les données du site (y compris l’enregistrement local) ?")){
        state = defaultState();
        localStorage.removeItem(LS_KEY);
        save();
        // re-mount
        mountAll();
        // rebuild converter
        if($("#unitGrid")) buildConverter();
        // refresh exercises/QCM if present
        if($("#exList")) renderExercises();
        if($("#qcmRoot")) renderQCM();
        alert("Données réinitialisées.");
      }
    });

    buildConverter();
  }

  function onConverterInput(unitKey, raw){
    const mode = MODES[state.converter.mode];
    state.converter.board[unitKey] = raw;

    const n = parseNum(raw);
    if(n === null){
      save();
      return;
    }

    if(mode.custom === "time") computeTime(unitKey, n);
    else if(mode.custom === "electric") computeElectric(unitKey, n);
    else if(mode.custom === "data") computeData(unitKey, n);
    else computeUniform(mode, unitKey, n);

    save();
    // update UI
    const grid = $("#unitGrid");
    if(!grid) return;
    $$("input[data-unit]", grid).forEach(inp => {
      const k = inp.dataset.unit;
      if(inp !== document.activeElement) inp.value = state.converter.board[k] ?? "";
    });
  }

  function computeUniform(mode, unitKey, value){
    const units = mode.units.map(u => u.key);
    const idx = units.indexOf(unitKey);
    if(idx < 0) return;

    const step = mode.step;
    const results = {};
    results[unitKey] = value;

    let v = value;
    for(let i = idx - 1; i >= 0; i--){ v = v / step; results[units[i]] = v; }
    v = value;
    for(let i = idx + 1; i < units.length; i++){ v = v * step; results[units[i]] = v; }

    units.forEach(k => state.converter.board[k] = formatNum(results[k]));
  }

  function computeTime(unitKey, value){
    const r = {};
    if(unitKey === "h"){ r.h=value; r.min=value*60; r.s=value*3600; }
    if(unitKey === "min"){ r.h=value/60; r.min=value; r.s=value*60; }
    if(unitKey === "s"){ r.h=value/3600; r.min=value/60; r.s=value; }
    ["h","min","s"].forEach(k => state.converter.board[k] = formatNum(r[k]));
  }

  function computeElectric(unitKey, value){
    const pairs = [
      { big:"kV", small:"V", factor:1000 },
      { big:"A", small:"mA", factor:1000 },
      { big:"kΩ", small:"Ω", factor:1000 },
      { big:"kW", small:"W", factor:1000 },
    ];
    for(const p of pairs){
      if(unitKey === p.big){
        state.converter.board[p.big] = formatNum(value);
        state.converter.board[p.small] = formatNum(value * p.factor);
      }
      if(unitKey === p.small){
        state.converter.board[p.small] = formatNum(value);
        state.converter.board[p.big] = formatNum(value / p.factor);
      }
    }
  }

  function computeData(unitKey, value){
    const r = {};
    function setFromOctets(o){
      r.octets = o;
      r.bits = o * 8;
      r.Ko = o / 1024;
      r.Mo = r.Ko / 1024;
      r.Go = r.Mo / 1024;
      r.To = r.Go / 1024;
    }
    if(unitKey==="bits") setFromOctets(value/8);
    if(unitKey==="octets") setFromOctets(value);
    if(unitKey==="Ko") setFromOctets(value*1024);
    if(unitKey==="Mo") setFromOctets(value*1024*1024);
    if(unitKey==="Go") setFromOctets(value*1024*1024*1024);
    if(unitKey==="To") setFromOctets(value*1024*1024*1024*1024);

    ["bits","octets","Ko","Mo","Go","To"].forEach(k => state.converter.board[k] = formatNum(r[k]));
  }

  function applyConverterExample(){
    const ex = {
      length: { unit:"m", value:"2,5", msg:"Exemple : 2,5 m → 250 cm → 2500 mm" },
      mass: { unit:"kg", value:"0,75", msg:"Exemple : 0,75 kg → 750 g" },
      capacity: { unit:"L", value:"1,25", msg:"Exemple : 1,25 L → 125 cL → 1250 mL" },
      time: { unit:"h", value:"1,5", msg:"Exemple : 1,5 h → 90 min → 5400 s" },
      electric: { unit:"kΩ", value:"4,7", msg:"Exemple : 4,7 kΩ → 4700 Ω" },
      data: { unit:"Go", value:"2", msg:"Exemple : 2 Go → 2048 Mo" },
      area: { unit:"m²", value:"1", msg:"Exemple : 1 m² → 10 000 cm²" },
      volume3: { unit:"m³", value:"1", msg:"Exemple : 1 m³ → 1000 dm³ (= 1000 L)" },
    }[state.converter.mode];

    if(!ex) return;
    state.converter.board = {};
    state.converter.board[ex.unit] = ex.value;
    save();
    buildConverter();
    // trigger compute
    onConverterInput(ex.unit, ex.value);

    const status = $("#boardStatus");
    if(status) status.textContent = ex.msg;
  }

  /* ---------- Exercises page ---------- */
  function renderExercises(opts={ teacher:false }){
    const root = $("#exList");
    if(!root) return;
    root.innerHTML = "";

    const teacher = !!opts.teacher;

    EXERCISES.forEach(ex => {
      const answerKey = `ex_${ex.id}`;
      const showKey = `show_${ex.id}`;

      const wrapper = document.createElement("div");
      wrapper.className = "exercise";
      wrapper.dataset.show = teacher ? "true" : (state.exercises.showCorrections[showKey] ? "true" : "false");

      const current = state.exercises.answers[answerKey] || "";

      wrapper.innerHTML = `
        <div class="meta">
          <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            <span class="tag">${ex.tag}</span>
            <span class="tag">Niveau ${ex.level}</span>
            <span class="tag">${ex.id}</span>
          </div>
          <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            ${teacher ? `<span class="tag" style="border-color:rgba(126,240,198,.65); color:var(--text)">Mode enseignant</span>` :
              `<button class="btn" data-toggle="${ex.id}">Afficher / masquer la correction</button>`}
          </div>
        </div>
        <div class="q">${ex.q}</div>
        <div style="margin-top:10px" class="row">
          <div style="grid-column: 1 / -1;">
            <label for="ans_${ex.id}">Réponse élève</label>
            <input type="text" id="ans_${ex.id}" value="${escapeHtml(current)}" placeholder="Ex. 250 cm" />
            <div class="small" style="margin-top:6px">Astuce : écrire la valeur dans la bonne colonne puis compléter avec des zéros.</div>
          </div>
        </div>
        <div class="a">
          <b>Correction :</b> ${ex.a}
        </div>
      `;

      root.appendChild(wrapper);

      const inp = $(`#ans_${ex.id}`, wrapper);
      inp.addEventListener("input", () => {
        state.exercises.answers[answerKey] = inp.value;
        save();
      });

      if(!teacher){
        const btn = $(`button[data-toggle="${ex.id}"]`, wrapper);
        btn.addEventListener("click", () => {
          const isShown = wrapper.dataset.show === "true";
          wrapper.dataset.show = (!isShown).toString();
          state.exercises.showCorrections[showKey] = !isShown;
          save();
        });
      }
    });

    const kpi = $("#exKpi");
    if(kpi){
      const filled = Object.values(state.exercises.answers).filter(v => String(v||"").trim() !== "").length;
      kpi.textContent = `Réponses remplies : ${filled} / ${EXERCISES.length}`;
    }
  }

  function mountExercisesPage(){
    const root = $("#exList");
    if(!root) return;

    const teacher = (new URLSearchParams(location.search)).get("teacher") === "1";
    renderExercises({ teacher });

    const btnExportJson = $("#btnExportJson");
    const btnExportCsv = $("#btnExportCsv");
    const btnPrint = $("#btnPrint");
    const btnEmail = $("#btnEmail");

    if(btnPrint) btnPrint.addEventListener("click", () => window.print());
    if(btnEmail) btnEmail.addEventListener("click", sendEmailSummary);

    if(btnExportJson) btnExportJson.addEventListener("click", () => downloadExport("json"));
    if(btnExportCsv) btnExportCsv.addEventListener("click", () => downloadExport("csv"));
  }

  /* ---------- QCM page ---------- */
  function renderQCM(opts={ teacher:false }){
    const root = $("#qcmRoot");
    if(!root) return;
    root.innerHTML = "";

    const teacher = !!opts.teacher;

    QCM.forEach((it, idx) => {
      const key = `q_${it.id}`;
      const saved = state.qcm.answers[key];

      const block = document.createElement("div");
      block.className = "exercise";
      block.dataset.show = (teacher ? "true" : "false");

      const choicesHtml = it.choices.map((c, i) => {
        const checked = (saved === i) ? "checked" : "";
        return `
          <label style="display:flex; gap:10px; align-items:flex-start; cursor:pointer; margin:8px 0; color:var(--muted)">
            <input type="radio" name="${it.id}" value="${i}" ${checked} />
            <span>${escapeHtml(c)}</span>
          </label>
        `;
      }).join("");

      block.innerHTML = `
        <div class="meta">
          <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            <span class="tag">${it.cat}</span>
            <span class="tag">${it.id}</span>
          </div>
          <div class="small">Question ${idx+1} / ${QCM.length}</div>
        </div>
        <div class="q">${escapeHtml(it.q)}</div>
        <div style="margin-top:10px">${choicesHtml}</div>
        <div class="a">
          <b>Correction :</b> réponse attendue = <b>${escapeHtml(it.choices[it.ans])}</b><br/>
          <span class="small">${escapeHtml(it.explain)}</span>
        </div>
      `;

      root.appendChild(block);

      $$(`input[type="radio"][name="${it.id}"]`, block).forEach(r => {
        r.addEventListener("change", () => {
          state.qcm.answers[key] = Number(r.value);
          save();
        });
      });
    });

    const btnScore = $("#btnScore");
    const btnShowCorr = $("#btnShowCorrections");
    const btnHideCorr = $("#btnHideCorrections");
    const btnExportJson = $("#btnExportJson");
    const btnExportCsv = $("#btnExportCsv");
    const btnPrint = $("#btnPrint");
    const btnEmail = $("#btnEmail");

    if(btnPrint) btnPrint.addEventListener("click", () => window.print());
    if(btnEmail) btnEmail.addEventListener("click", sendEmailSummary);

    if(btnScore) btnScore.addEventListener("click", () => {
      const { score, max } = scoreQCM();
      state.qcm.lastScore = score;
      state.qcm.lastMax = max;
      state.qcm.lastAt = new Date().toISOString();
      save();
      updateQcmKpi();
      alert(`Score : ${score} / ${max}`);
    });

    if(btnShowCorr) btnShowCorr.addEventListener("click", () => {
      $$(".exercise", root).forEach(b => b.dataset.show = "true");
    });

    if(btnHideCorr) btnHideCorr.addEventListener("click", () => {
      if(teacher) return;
      $$(".exercise", root).forEach(b => b.dataset.show = "false");
    });

    if(btnExportJson) btnExportJson.addEventListener("click", () => downloadExport("json"));
    if(btnExportCsv) btnExportCsv.addEventListener("click", () => downloadExport("csv"));

    updateQcmKpi();
    if(teacher) $$(".exercise", root).forEach(b => b.dataset.show = "true");
  }

  function scoreQCM(){
    let score = 0;
    QCM.forEach(it => {
      const key = `q_${it.id}`;
      const ans = state.qcm.answers[key];
      if(typeof ans === "number" && ans === it.ans) score += 1;
    });
    return { score, max: QCM.length };
  }

  function updateQcmKpi(){
    const box = $("#qcmKpi");
    if(!box) return;

    const filled = QCM.filter(it => typeof state.qcm.answers[`q_${it.id}`] === "number").length;
    const last = (state.qcm.lastScore != null) ? `Dernier score : ${state.qcm.lastScore}/${state.qcm.lastMax}` : "Dernier score : —";
    box.textContent = `Questions répondues : ${filled}/${QCM.length} · ${last}`;
  }

  function mountQcmPage(){
    const root = $("#qcmRoot");
    if(!root) return;
    const teacher = (new URLSearchParams(location.search)).get("teacher") === "1";
    renderQCM({ teacher });
  }

  /* ---------- Exports (JSON/CSV) ---------- */
  function buildExportObject(){
    const { score, max } = scoreQCM();

    return {
      meta: {
        exportedAt: new Date().toISOString(),
        site: "EKM Conversions — multi-pages v1"
      },
      student: state.student,
      track: state.track,
      precision: state.precision,
      converter: {
        mode: state.converter.mode,
        board: state.converter.board
      },
      exercises: {
        answers: state.exercises.answers
      },
      qcm: {
        answers: state.qcm.answers,
        computedScore: { score, max }
      }
    };
  }

  function downloadExport(format){
    const obj = buildExportObject();

    if(format === "json"){
      const blob = new Blob([JSON.stringify(obj, null, 2)], { type:"application/json" });
      downloadBlob(blob, "ekm_conversions_export.json");
      return;
    }

    // CSV: one flat list of key/value for simplicity (robust for teachers)
    const rows = [];
    const push = (k,v) => rows.push([k, String(v ?? "")]);

    push("student.name", obj.student.name);
    push("student.class", obj.student.class);
    push("student.period", obj.student.period);
    push("student.group", obj.student.group);
    push("student.comment", obj.student.comment);
    push("track", obj.track);
    push("precision", obj.precision);
    push("converter.mode", obj.converter.mode);

    Object.entries(obj.converter.board || {}).forEach(([k,v]) => push(`converter.${k}`, v));

    Object.entries(obj.exercises.answers || {}).forEach(([k,v]) => push(`exercise.${k}`, v));

    Object.entries(obj.qcm.answers || {}).forEach(([k,v]) => push(`qcm.${k}`, v));

    push("qcm.score", obj.qcm.computedScore.score);
    push("qcm.max", obj.qcm.computedScore.max);

    const csv = "key,value\n" + rows.map(r => `${csvEscape(r[0])},${csvEscape(r[1])}`).join("\n");
    const blob = new Blob([csv], { type:"text/csv;charset=utf-8" });
    downloadBlob(blob, "ekm_conversions_export.csv");
  }

  function csvEscape(s){
    const t = String(s ?? "");
    if(/[",\n]/.test(t)) return `"${t.replace(/"/g,'""')}"`;
    return t;
  }

  function downloadBlob(blob, filename){
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  /* ---------- Email summary (mailto) ---------- */
  function sendEmailSummary(){
    const obj = buildExportObject();
    const { score, max } = obj.qcm.computedScore;

    const lines = [];
    lines.push("Ressource : Tableaux de conversion (EKM Conseils / La Salle Saint-Nicolas)");
    lines.push("");
    lines.push(`Élève : ${obj.student.name || "—"}`);
    lines.push(`Classe : ${obj.student.class || "—"}`);
    lines.push(`Période : ${obj.student.period || "—"}`);
    if(obj.student.group) lines.push(`Groupe/Atelier : ${obj.student.group}`);
    lines.push(`Référentiel : ${(TRACK_NOTES[obj.track]||TRACK_NOTES.general).title}`);
    lines.push("");
    lines.push(`Convertisseur : ${MODES[obj.converter.mode].label}`);
    const boardEntries = Object.entries(obj.converter.board || {}).filter(([,v]) => String(v||"").trim() !== "");
    if(boardEntries.length){
      lines.push("Derniers résultats convertisseur :");
      boardEntries.forEach(([k,v]) => lines.push(`- ${k} : ${v}`));
      lines.push("");
    }

    lines.push(`QCM : score ${score}/${max}`);
    lines.push("");

    const filledEx = Object.values(obj.exercises.answers || {}).filter(v => String(v||"").trim() !== "").length;
    lines.push(`Exercices : réponses remplies ${filledEx}/${EXERCISES.length}`);

    if(obj.student.comment && obj.student.comment.trim()){
      lines.push("");
      lines.push("Commentaire :");
      lines.push(obj.student.comment.trim());
    }

    lines.push("");
    lines.push("—");
    lines.push("© 2026 Eric MORMIN — Tous droits réservés");

    const subject = encodeURIComponent("Productions — Tableaux de conversion (élève)");
    const body = encodeURIComponent(lines.join("\n"));

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  /* ---------- Fiche A4 page ---------- */
  function mountFicheA4(){
    const box = $("#ficheContent");
    if(!box) return;

    const obj = buildExportObject();
    const { score, max } = obj.qcm.computedScore;

    const exFilled = Object.entries(obj.exercises.answers || {})
      .filter(([,v]) => String(v||"").trim() !== "");

    const conv = Object.entries(obj.converter.board || {})
      .filter(([,v]) => String(v||"").trim() !== "");

    const trackTitle = (TRACK_NOTES[obj.track]||TRACK_NOTES.general).title;

    box.innerHTML = `
      <div class="note ok">
        <strong>Astuce pédagogique (méthode)</strong><br/>
        Écrire la valeur dans la bonne colonne, puis compléter avec des zéros.
        (Aires : ×100 ; Volumes : ×1000 ; Temps : ×60)
      </div>

      <div class="row" style="margin-top:12px">
        <div>
          <label>Nom de l’élève</label>
          <div class="chip" style="display:inline-block">${escapeHtml(obj.student.name || "—")}</div>
        </div>
        <div>
          <label>Classe</label>
          <div class="chip" style="display:inline-block">${escapeHtml(obj.student.class || "—")}</div>
        </div>
      </div>

      <div class="row" style="margin-top:10px">
        <div>
          <label>Période / Date</label>
          <div class="chip" style="display:inline-block">${escapeHtml(obj.student.period || "—")}</div>
        </div>
        <div>
          <label>Référentiel</label>
          <div class="chip" style="display:inline-block">${escapeHtml(trackTitle)}</div>
        </div>
      </div>

      ${obj.student.group ? `
      <div style="margin-top:10px">
        <label>Groupe / Atelier</label>
        <div class="chip" style="display:inline-block">${escapeHtml(obj.student.group)}</div>
      </div>` : ""}

      ${obj.student.comment ? `
      <div style="margin-top:10px">
        <label>Commentaire</label>
        <div class="note">${escapeHtml(obj.student.comment).replace(/\n/g,"<br/>")}</div>
      </div>` : ""}

      <hr class="sep"/>

      <div class="section-title">
        <h3>Dernier convertisseur utilisé</h3>
        <span class="chip">${escapeHtml(MODES[obj.converter.mode].label)}</span>
      </div>

      ${conv.length ? `
        <table>
          <thead><tr><th>Unité</th><th>Valeur</th></tr></thead>
          <tbody>
            ${conv.map(([k,v]) => `<tr><td><b>${escapeHtml(k)}</b></td><td>${escapeHtml(v)}</td></tr>`).join("")}
          </tbody>
        </table>
      ` : `<div class="small">Aucune valeur enregistrée dans le convertisseur.</div>`}

      <div class="print-break" style="height:14px"></div>

      <div class="section-title">
        <h3>Exercices — réponses élève (synthèse)</h3>
        <span class="chip">${exFilled.length}/${EXERCISES.length}</span>
      </div>

      ${exFilled.length ? `
        <table>
          <thead><tr><th>Exercice</th><th>Réponse</th></tr></thead>
          <tbody>
            ${exFilled.map(([k,v]) => {
              const id = k.replace("ex_","");
              return `<tr><td><b>${escapeHtml(id)}</b></td><td>${escapeHtml(v)}</td></tr>`;
            }).join("")}
          </tbody>
        </table>
      ` : `<div class="small">Aucune réponse saisie pour les exercices.</div>`}

      <div style="height:12px"></div>

      <div class="section-title">
        <h3>QCM — résultat</h3>
        <span class="chip">${score}/${max}</span>
      </div>

      <div class="note">
        Score calculé à l’export : <b>${score}/${max}</b><br/>
        Pour afficher les corrections : page QCM (bouton “Afficher les corrections”).
      </div>
    `;
  }

  /* ---------- Teacher page (generator + accès corrigés) ---------- */
  function mountTeacherPage(){
    const root = $("#teacherRoot");
    if(!root) return;

    // 1) Afficher accès rapides + indicateurs
    const { score, max } = scoreQCM();
    const exFilled = Object.values(state.exercises.answers).filter(v => String(v||"").trim() !== "").length;

    $("#teacherKpi").textContent =
      `Exercices : ${exFilled}/${EXERCISES.length} · QCM : ${score}/${max} · Convertisseur : ${MODES[state.converter.mode].label}`;

    // 2) Générateur d’exercices (simple et robuste)
    const out = $("#genOut");
    const btnGen = $("#btnGenerate");
    const countSel = $("#genCount");

    function genOne(){
      // Génération basée sur familles + facteurs simples (10/100/1000/60/1024)
      const families = [
        { kind:"Longueurs", mode:"length", pairs:[["km","m"],["m","cm"],["m","mm"],["cm","m"],["mm","m"]] },
        { kind:"Masses", mode:"mass", pairs:[["kg","g"],["g","kg"],["t","kg"],["mg","g"]] },
        { kind:"Capacités", mode:"capacity", pairs:[["L","mL"],["cL","L"],["hL","L"],["L","cL"]] },
        { kind:"Temps", mode:"time", pairs:[["h","min"],["min","s"],["s","min"]] },
        { kind:"Aires", mode:"area", pairs:[["m²","cm²"],["cm²","m²"],["m²","mm²"]] },
        { kind:"Volumes", mode:"volume3", pairs:[["m³","dm³"],["dm³","mL"],["m³","L"]] },
        { kind:"Électricité", mode:"electric", pairs:[["kΩ","Ω"],["mA","A"],["kV","V"],["kW","W"]] },
        { kind:"Numérique", mode:"data", pairs:[["bits","octets"],["Go","Mo"],["Ko","Mo"],["To","Go"]] },
      ];

      const fam = families[Math.floor(Math.random()*families.length)];
      const [uFrom, uTo] = fam.pairs[Math.floor(Math.random()*fam.pairs.length)];

      // valeurs “propres” selon famille
      const vPool = fam.kind === "Numérique"
        ? [1,2,3,4,8,16,32,64,128,256,512,1024,1.5]
        : fam.kind === "Temps"
          ? [0.5,1,1.5,2,30,45,60,90,120,2700,5400]
          : [0.2,0.25,0.5,0.75,1,1.2,2.5,3,4.7,10,12,23,100,250,450,750];

      const val = vPool[Math.floor(Math.random()*vPool.length)];

      // calcul rapide via convertisseur interne (en passant par “board”)
      // On utilise les compute* en simulant une saisie sur uFrom
      const tmpBoard = {};
      state.converter.mode = fam.mode;
      state.converter.board = {};
      // inject raw in French format
      const raw = String(val).replace(".", ",");
      state.converter.board[uFrom] = raw;

      // compute
      const mode = MODES[fam.mode];
      const n = parseNum(raw);
      if(n != null){
        if(mode.custom === "time") computeTime(uFrom, n);
        else if(mode.custom === "electric") computeElectric(uFrom, n);
        else if(mode.custom === "data") computeData(uFrom, n);
        else computeUniform(mode, uFrom, n);
      }

      const expected = state.converter.board[uTo] || "—";
      // restore previous converter mode/board? (on ne touche pas à l’état élève)
      // On évite de perturber l’élève : on ne save pas ici.
      return { fam:fam.kind, q:`Convertir ${raw} ${uFrom} en ${uTo}.`, a:`${expected} ${uTo}` };
    }

    function generate(){
      const n = Number(countSel.value || 10);
      const list = Array.from({length:n}, () => genOne());
      out.innerHTML = list.map((it, i) => `
        <div class="exercise" data-show="true">
          <div class="meta">
            <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
              <span class="tag">${escapeHtml(it.fam)}</span>
              <span class="tag">G${String(i+1).padStart(2,"0")}</span>
            </div>
            <span class="tag" style="border-color:rgba(126,240,198,.65); color:var(--text)">Corrigé affiché</span>
          </div>
          <div class="q">${escapeHtml(it.q)}</div>
          <div class="a"><b>Correction :</b> ${escapeHtml(it.a)}</div>
        </div>
      `).join("");
    }

    btnGen.addEventListener("click", generate);
    generate();
  }

  /* ---------- Common footer mount (no code needed) ---------- */

  /* ---------- Utils ---------- */
  function escapeHtml(s){
    return String(s ?? "")
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#039;");
  }

  function mountAll(){
    load();
    mountStudentForm();
    mountTrackTabs();
    mountPrecision();
    mountConverter();
    mountExercisesPage();
    mountQcmPage();
    mountFicheA4();
    mountTeacherPage();
    save();
  }

  return { mountAll, sendEmailSummary, downloadExport };
})();

document.addEventListener("DOMContentLoaded", () => {
  EKM.mountAll();
});
