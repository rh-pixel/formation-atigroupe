/* ============================================================
   ATI Groupe Hub — moteur de l'application
   En principe vous n'avez JAMAIS besoin de modifier ce fichier :
   tout le contenu se gère dans data/contenu.json et data/stagiaires.json.
   ============================================================ */
'use strict';

/* ---------- Icônes (SVG inspirés de lucide.dev) ---------- */
const IC = {
  accueil: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  cible: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
  resultats: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',
  sortie: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  soleil: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4"/></svg>',
  lune: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
  livre: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
  crayon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',
  quiz: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/><circle cx="12" cy="12" r="10"/></svg>',
  chevron: '<svg class="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  droite: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
  retour: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
  ok: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  ko: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
  coche: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  horloge: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  medaille: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',
  alerte: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
};

/* ---------- État global ---------- */
let CONTENU = null;
let STAGIAIRES = [];
let session = null;
let quizEnCours = null;

const $ = (sel) => document.querySelector(sel);

/* ---------- Utilitaires ---------- */
function normaliser(s) {
  return String(s || '').trim().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}
function normaliserCode(s) {
  return String(s || '').toUpperCase().replace(/\s+/g, '');
}
function normaliserReponse(s) {
  return normaliser(s).replace(/,/g, '.').replace(/[€$']/g, '').replace(/\s+/g, ' ').trim();
}
function echap(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function dateCourte(iso) {
  try {
    return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch (e) { return ''; }
}
let minuteurToast = null;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('visible');
  clearTimeout(minuteurToast);
  minuteurToast = setTimeout(() => t.classList.remove('visible'), 2600);
}

/* ---------- Stockage local (progression par stagiaire) ---------- */
function cleProgres() { return 'atihub_progres_' + session.code; }
function lireProgres() {
  try {
    const brut = localStorage.getItem(cleProgres());
    const p = brut ? JSON.parse(brut) : {};
    p.lecons = p.lecons || {};
    p.exercices = p.exercices || {};
    p.quiz = p.quiz || {};
    p.positionnement = p.positionnement || {};
    return p;
  } catch (e) {
    return { lecons: {}, exercices: {}, quiz: {}, positionnement: {} };
  }
}
function ecrireProgres(p) {
  try {
    localStorage.setItem(cleProgres(), JSON.stringify(p));
  } catch (e) {
    toast("Impossible d'enregistrer la progression sur cet appareil.");
  }
}

/* ---------- Recherche dans le contenu ---------- */
function trouverModule(mid) {
  return CONTENU.modules.find(m => m.id === mid) || null;
}
function trouverElement(mid, eid) {
  const module = trouverModule(mid);
  if (!module) return null;
  for (const section of module.sections) {
    const element = section.elements.find(e => e.id === eid);
    if (element) return { module, section, element };
  }
  return null;
}
function trouverTest(tid) {
  return CONTENU.positionnement.tests.find(t => t.id === tid) || null;
}

/* ---------- Calcul de progression ---------- */
function elementFait(el, p) {
  if (el.type === 'lecon') return !!p.lecons[el.id];
  if (el.type === 'exercice') return !!p.exercices[el.id];
  if (el.type === 'quiz') return !!p.quiz[el.id];
  return false;
}
function progresSection(section, p) {
  const total = section.elements.length;
  const faits = section.elements.filter(el => elementFait(el, p)).length;
  return { faits, total, complet: total > 0 && faits === total };
}
function progresModule(module, p) {
  let faits = 0, total = 0;
  for (const s of module.sections) {
    const ps = progresSection(s, p);
    faits += ps.faits; total += ps.total;
  }
  return { faits, total, pct: total ? Math.round(100 * faits / total) : 0 };
}
function progresGlobal(p) {
  let faits = 0, total = 0;
  for (const m of CONTENU.modules) {
    const pm = progresModule(m, p);
    faits += pm.faits; total += pm.total;
  }
  return { faits, total, pct: total ? Math.round(100 * faits / total) : 0 };
}
function niveauPour(test, pct) {
  let retenu = test.niveaux[0];
  for (const n of test.niveaux) if (pct >= n.min) retenu = n;
  return retenu;
}

/* ---------- Thème clair / sombre ---------- */
function themeActuel() {
  const memo = localStorage.getItem('atihub_theme');
  if (memo) return memo;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'sombre' : 'clair';
}
function appliquerTheme(theme) {
  if (theme === 'sombre') document.documentElement.setAttribute('data-theme', 'sombre');
  else document.documentElement.removeAttribute('data-theme');
  localStorage.setItem('atihub_theme', theme);
  const libelle = theme === 'sombre' ? 'Mode clair' : 'Mode sombre';
  const icone = theme === 'sombre' ? IC.soleil : IC.lune;
  const btn = $('#btn-theme');
  if (btn) btn.innerHTML = icone + '<span>' + libelle + '</span>';
  const btnM = $('#btn-theme-mobile');
  if (btnM) btnM.innerHTML = icone;
}
function basculerTheme() {
  appliquerTheme(themeActuel() === 'sombre' ? 'clair' : 'sombre');
}

/* ---------- Navigation ---------- */
const ONGLETS = [
  { route: '#/accueil', libelle: 'Accueil', icone: IC.accueil },
  { route: '#/positionnement', libelle: 'Positionnement', icone: IC.cible },
  { route: '#/resultats', libelle: 'Mes résultats', icone: IC.resultats }
];

function construireNavigation() {
  const renduLien = (o) =>
    `<button class="nav-lien" data-route="${o.route}" type="button">${o.icone}<span>${o.libelle}</span></button>`;
  $('#nav-cote').innerHTML = ONGLETS.map(renduLien).join('');
  $('#nav-bas').innerHTML = ONGLETS.map(renduLien).join('');
  document.querySelectorAll('[data-route]').forEach(btn => {
    btn.addEventListener('click', () => { location.hash = btn.dataset.route; });
  });
}
function majNavActive(hash) {
  const actif = ONGLETS.find(o => hash.startsWith(o.route));
  document.querySelectorAll('[data-route]').forEach(btn => {
    btn.classList.toggle('actif', !!actif && btn.dataset.route === actif.route);
  });
}

/* ---------- Connexion / déconnexion ---------- */
function initConnexion() {
  $('#form-connexion').addEventListener('submit', (ev) => {
    ev.preventDefault();
    const prenom = $('#ch-prenom').value;
    const nom = $('#ch-nom').value;
    const code = $('#ch-code').value;
    const zoneErreur = $('#connexion-erreur');
    zoneErreur.classList.add('cache');

    if (!prenom.trim() || !nom.trim() || !code.trim()) {
      zoneErreur.innerHTML = IC.alerte + '<span>Merci de remplir les trois champs.</span>';
      zoneErreur.classList.remove('cache');
      return;
    }
    const trouve = STAGIAIRES.find(s =>
      normaliser(s.prenom) === normaliser(prenom) &&
      normaliser(s.nom) === normaliser(nom) &&
      normaliserCode(s.code) === normaliserCode(code)
    );
    if (!trouve) {
      zoneErreur.innerHTML = IC.alerte + "<span>Identifiants non reconnus. Vérifiez l'orthographe de votre nom, prénom et code stagiaire, ou contactez votre formateur.</span>";
      zoneErreur.classList.remove('cache');
      return;
    }
    session = { nom: trouve.nom, prenom: trouve.prenom, code: normaliserCode(trouve.code) };
    localStorage.setItem('atihub_session', JSON.stringify(session));
    ouvrirApplication();
    location.hash = '#/accueil';
    toast('Bienvenue, ' + session.prenom + ' !');
  });
}
function deconnecter() {
  localStorage.removeItem('atihub_session');
  session = null;
  $('#app').classList.add('cache');
  $('#connexion').classList.remove('cache');
  $('#form-connexion').reset();
  location.hash = '';
}
function ouvrirApplication() {
  $('#connexion').classList.add('cache');
  $('#app').classList.remove('cache');
  $('#avatar-cote').textContent = (session.prenom[0] || '') + (session.nom[0] || '');
  $('#nom-cote').textContent = session.prenom + ' ' + session.nom;
  $('#code-cote').textContent = session.code;
  router();
}

/* ---------- Routeur ---------- */
function router() {
  if (!session) return;
  const hash = location.hash || '#/accueil';
  const parties = hash.replace(/^#\//, '').split('/');
  const vue = $('#vue');
  majNavActive(hash);
  quizEnCours = null;

  let html = '';
  if (parties[0] === '' || parties[0] === 'accueil') html = vueAccueil();
  else if (parties[0] === 'module' && parties[1]) html = vueModule(parties[1]);
  else if (parties[0] === 'lecon' && parties[2]) html = vueLecon(parties[1], parties[2]);
  else if (parties[0] === 'activite' && parties[2]) html = vueActivite(parties[1], parties[2]);
  else if (parties[0] === 'positionnement') html = vuePositionnement();
  else if (parties[0] === 'test' && parties[1]) html = vueTest(parties[1]);
  else if (parties[0] === 'resultats') html = vueResultats();
  else html = vueAccueil();

  vue.innerHTML = '<div class="vue">' + html + '</div>';
  activerInteractions(vue);
  vue.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

/* Branche les comportements après chaque rendu */
function activerInteractions(racine) {
  racine.querySelectorAll('[data-aller]').forEach(el => {
    el.addEventListener('click', () => { location.hash = el.dataset.aller; });
  });
  racine.querySelectorAll('[data-section]').forEach(tete => {
    tete.addEventListener('click', () => {
      tete.closest('.section-bloc').classList.toggle('ouvert');
    });
  });
  const btnLecon = racine.querySelector('#btn-lecon-finie');
  if (btnLecon) {
    btnLecon.addEventListener('click', () => {
      const p = lireProgres();
      p.lecons[btnLecon.dataset.lecon] = { date: new Date().toISOString() };
      ecrireProgres(p);
      toast('Leçon terminée, bravo !');
      location.hash = '#/module/' + btnLecon.dataset.module;
    });
  }
  if (quizEnCours) monterQuestion();
}

/* ============================================================
   VUES
   ============================================================ */

/* ---------- Accueil ---------- */
function vueAccueil() {
  const p = lireProgres();
  const global = progresGlobal(p);
  const testsNonFaits = CONTENU.positionnement.tests.filter(t => !p.positionnement[t.id]);

  let bandeau = '';
  if (testsNonFaits.length > 0) {
    bandeau = `
      <div class="bandeau">
        <div class="bandeau-texte">
          <strong>Commencez par votre test de positionnement</strong>
          <span>Quelques minutes pour évaluer votre niveau et adapter votre parcours.</span>
        </div>
        <button class="btn btn-principal" data-aller="#/positionnement">Faire le test</button>
      </div>`;
  }

  const cartes = CONTENU.modules.map(m => {
    const pm = progresModule(m, p);
    const test = CONTENU.positionnement.tests.find(t => t.module === m.id);
    const resTest = test ? p.positionnement[test.id] : null;
    const badgeNiveau = resTest ? `<span class="badge badge-accent">${echap(resTest.niveau)}</span>` : '';
    return `
      <button class="carte carte-module" data-aller="#/module/${m.id}" type="button">
        <div class="carte-module-haut">
          <div class="icone-module" style="background:color-mix(in srgb, ${echap(m.couleur)} 14%, var(--surface-2));">${echap(m.icone)}</div>
          <h3>${echap(m.titre)}</h3>
        </div>
        <p>${echap(m.description)}</p>
        <div class="carte-module-pied">
          <div class="barre${pm.pct === 100 ? ' ok' : ''}"><span style="width:${pm.pct}%"></span></div>
          <span class="pct">${pm.pct}%</span>
        </div>
        <div class="carte-module-pied">
          <span>${pm.faits} / ${pm.total} étapes</span>
          ${badgeNiveau}
        </div>
      </button>`;
  }).join('');

  return `
    <header class="entete-page">
      <h1>Bonjour ${echap(session.prenom)} 👋</h1>
      <p class="sous-titre">Heureux de vous revoir. Voici votre parcours de formation.</p>
    </header>
    ${bandeau}
    <div class="carte" style="display:flex;align-items:center;gap:16px;margin-bottom:22px;flex-wrap:wrap;">
      <div style="flex:1;min-width:180px;">
        <strong style="font-size:14.5px;">Progression générale</strong>
        <div style="display:flex;align-items:center;gap:12px;margin-top:8px;">
          <div class="barre${global.pct === 100 ? ' ok' : ''}"><span style="width:${global.pct}%"></span></div>
          <span class="pct">${global.pct}%</span>
        </div>
      </div>
      <span class="badge badge-neutre">${global.faits} / ${global.total} étapes terminées</span>
    </div>
    <h2 class="titre-section-page">Mes modules</h2>
    <div class="grille-modules">${cartes}</div>
    <p class="pied-page">${echap(CONTENU.app.pied)}</p>`;
}

/* ---------- Page d'un module ---------- */
function vueModule(mid) {
  const module = trouverModule(mid);
  if (!module) return vueIntrouvable();
  const p = lireProgres();
  const pm = progresModule(module, p);

  const sections = module.sections.map((s, i) => {
    const ps = progresSection(s, p);
    const lignes = s.elements.map(el => {
      const fait = elementFait(el, p);
      let sousTexte = '';
      let route = '';
      if (el.type === 'lecon') {
        sousTexte = 'Leçon' + (el.duree ? ' · ' + echap(el.duree) : '');
        route = `#/lecon/${module.id}/${el.id}`;
      } else if (el.type === 'exercice') {
        sousTexte = 'Exercice · correction immédiate';
        route = `#/activite/${module.id}/${el.id}`;
      } else {
        const res = p.quiz[el.id];
        sousTexte = 'Quiz · ' + el.questions.length + ' questions' + (res ? ' · dernier score : ' + res.score + '/' + res.total : '');
        route = `#/activite/${module.id}/${el.id}`;
      }
      const badge = fait
        ? '<span class="badge badge-ok">' + IC.coche + ' Terminé</span>'
        : '<span class="badge badge-neutre">À faire</span>';
      const icone = el.type === 'lecon' ? IC.livre : (el.type === 'exercice' ? IC.crayon : IC.quiz);
      return `
        <button class="ligne-element" data-aller="${route}" type="button">
          <span class="icone-element ${el.type}">${icone}</span>
          <span class="ligne-element-infos"><strong>${echap(el.titre)}</strong><span>${sousTexte}</span></span>
          ${badge}
          <span style="color:var(--texte-3)">${IC.droite}</span>
        </button>`;
    }).join('');

    return `
      <div class="carte section-bloc${i === 0 ? ' ouvert' : ''}">
        <button class="section-tete" data-section="${s.id}" type="button" aria-expanded="${i === 0}">
          <span class="section-num${ps.complet ? ' fait' : ''}">${ps.complet ? IC.coche : (i + 1)}</span>
          <span class="section-infos">
            <h3>${echap(s.titre)}</h3>
            <p>${echap(s.description)} · ${ps.faits}/${ps.total} fait${ps.faits > 1 ? 's' : ''}</p>
          </span>
          ${IC.chevron}
        </button>
        <div class="section-corps">${lignes}</div>
      </div>`;
  }).join('');

  return `
    <button class="fil-retour" data-aller="#/accueil" type="button">${IC.retour} Accueil</button>
    <header class="entete-page">
      <h1>${echap(module.icone)} ${echap(module.titre)}</h1>
      <p class="sous-titre">${echap(module.description)}</p>
      <div style="display:flex;align-items:center;gap:12px;margin-top:14px;max-width:420px;">
        <div class="barre${pm.pct === 100 ? ' ok' : ''}"><span style="width:${pm.pct}%"></span></div>
        <span class="pct">${pm.pct}%</span>
      </div>
    </header>
    ${sections}`;
}

/* ---------- Leçon ---------- */
function rendreBloc(b) {
  if (b.t === 'h') return '<h2>' + echap(b.x) + '</h2>';
  if (b.t === 'p') return '<p>' + echap(b.x) + '</p>';
  if (b.t === 'liste') return '<ul>' + b.x.map(li => '<li>' + echap(li) + '</li>').join('') + '</ul>';
  if (b.t === 'exemple') return '<div class="encadre encadre-exemple"><strong>Exemple</strong>' + echap(b.x) + '</div>';
  if (b.t === 'astuce') return '<div class="encadre encadre-astuce"><strong>Astuce</strong>' + echap(b.x) + '</div>';
  return '';
}
function vueLecon(mid, eid) {
  const trouve = trouverElement(mid, eid);
  if (!trouve || trouve.element.type !== 'lecon') return vueIntrouvable();
  const { module, section, element } = trouve;
  const p = lireProgres();
  const dejaFaite = !!p.lecons[element.id];

  return `
    <button class="fil-retour" data-aller="#/module/${module.id}" type="button">${IC.retour} ${echap(module.titre)}</button>
    <header class="entete-page">
      <span class="badge badge-accent">${echap(section.titre)}</span>
      <h1 style="margin-top:10px;">${echap(element.titre)}</h1>
      ${element.duree ? '<p class="sous-titre">' + IC.horloge + ' Environ ' + echap(element.duree) + ' de lecture</p>' : ''}
    </header>
    <div class="carte contenu-lecon" style="padding:26px;">
      ${element.contenu.map(rendreBloc).join('')}
    </div>
    <div class="actions-quiz" style="margin-top:18px;">
      ${dejaFaite
        ? '<span class="badge badge-ok" style="font-size:14px;padding:9px 16px;">' + IC.coche + ' Leçon déjà terminée</span>'
        : '<button class="btn btn-principal" id="btn-lecon-finie" data-lecon="' + element.id + '" data-module="' + module.id + '" type="button">' + IC.coche + " J'ai terminé cette leçon</button>"}
    </div>`;
}

/* ---------- Exercices, quiz et tests de positionnement ---------- */
function vueActivite(mid, eid) {
  const trouve = trouverElement(mid, eid);
  if (!trouve || trouve.element.type === 'lecon') return vueIntrouvable();
  const { module, section, element } = trouve;
  quizEnCours = {
    mode: element.type,             /* 'exercice' ou 'quiz' */
    module, section, element,
    questions: element.questions,
    index: 0,
    bonnes: 0,
    reponses: [],
    retourRoute: '#/module/' + module.id
  };
  return `
    <button class="fil-retour" data-aller="#/module/${module.id}" type="button">${IC.retour} ${echap(module.titre)}</button>
    <header class="entete-page">
      <span class="badge badge-accent">${echap(section.titre)}</span>
      <h1 style="margin-top:10px;">${echap(element.titre)}</h1>
      ${element.consigne ? '<p class="sous-titre">' + echap(element.consigne) + '</p>' : ''}
    </header>
    ${element.contexte ? '<div class="contexte-exercice">' + echap(element.contexte) + '</div>' : ''}
    <div class="carte" id="zone-quiz" style="padding:24px;"></div>`;
}

function vueTest(tid) {
  const test = trouverTest(tid);
  if (!test) return vueIntrouvable();
  quizEnCours = {
    mode: 'test',
    test,
    questions: test.questions,
    index: 0,
    bonnes: 0,
    reponses: [],
    retourRoute: '#/positionnement'
  };
  return `
    <button class="fil-retour" data-aller="#/positionnement" type="button">${IC.retour} Positionnement</button>
    <header class="entete-page">
      <h1>${echap(test.titre)}</h1>
      <p class="sous-titre">${echap(test.description)} Répondez sans aide extérieure : ce test sert uniquement à adapter votre parcours.</p>
    </header>
    <div class="carte" id="zone-quiz" style="padding:24px;"></div>`;
}

/* Affiche la question courante dans #zone-quiz */
function monterQuestion() {
  const q = quizEnCours;
  const zone = $('#zone-quiz');
  if (!zone) return;
  if (q.index >= q.questions.length) { monterResultat(); return; }

  const question = q.questions[q.index];
  const num = q.index + 1;
  let corps = '';

  if (question.type === 'qcm') {
    corps = '<div class="liste-choix">' + question.choix.map((c, i) =>
      `<button class="choix" data-choix="${i}" type="button"><span class="pastille"></span><span>${echap(c)}</span></button>`
    ).join('') + '</div>';
  } else if (question.type === 'vraifaux') {
    corps = '<div class="liste-choix">' +
      '<button class="choix" data-choix="vrai" type="button"><span class="pastille"></span><span>Vrai</span></button>' +
      '<button class="choix" data-choix="faux" type="button"><span class="pastille"></span><span>Faux</span></button>' +
      '</div>';
  } else {
    corps = `<div class="reponse-texte"><input id="saisie-reponse" autocomplete="off" placeholder="Votre réponse…" aria-label="Votre réponse"></div>`;
  }

  zone.innerHTML = `
    <div class="quiz-progression">
      <span>Question ${num} / ${q.questions.length}</span>
      <div class="barre"><span style="width:${Math.round(100 * q.index / q.questions.length)}%"></span></div>
    </div>
    <p class="question-texte">${echap(question.q)}</p>
    ${corps}
    <div id="zone-retour"></div>
    <div class="actions-quiz">
      <button class="btn btn-principal" id="btn-valider" type="button" disabled>Valider</button>
    </div>`;

  let selection = null;
  const btnValider = $('#btn-valider');

  zone.querySelectorAll('.choix').forEach(btn => {
    btn.addEventListener('click', () => {
      zone.querySelectorAll('.choix').forEach(b => b.classList.remove('choisi'));
      btn.classList.add('choisi');
      selection = btn.dataset.choix;
      btnValider.disabled = false;
    });
  });
  const saisie = $('#saisie-reponse');
  if (saisie) {
    saisie.addEventListener('input', () => { btnValider.disabled = saisie.value.trim() === ''; });
    saisie.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' && !btnValider.disabled) { ev.preventDefault(); btnValider.click(); }
    });
    saisie.focus();
  }

  btnValider.addEventListener('click', () => {
    let juste = false;
    let reponseAffichee = '';
    if (question.type === 'qcm') {
      juste = Number(selection) === question.bonne;
      reponseAffichee = question.choix[question.bonne];
    } else if (question.type === 'vraifaux') {
      juste = (selection === 'vrai') === question.bonne;
      reponseAffichee = question.bonne ? 'Vrai' : 'Faux';
    } else {
      const val = normaliserReponse(saisie.value);
      juste = question.reponses.some(r => normaliserReponse(r) === val);
      reponseAffichee = question.reponses[0];
    }
    if (juste) q.bonnes++;
    q.reponses.push({ question, juste });

    if (q.mode === 'test') {
      /* Pas de correction pendant un test de positionnement : on enchaîne. */
      q.index++;
      monterQuestion();
      return;
    }

    /* Exercice / quiz : correction immédiate puis question suivante. */
    zone.querySelectorAll('.choix').forEach(b => {
      b.disabled = true;
      const val = b.dataset.choix;
      const estBonne = question.type === 'qcm'
        ? Number(val) === question.bonne
        : (val === 'vrai') === question.bonne;
      if (estBonne) b.classList.add('juste');
      else if (b.classList.contains('choisi')) b.classList.add('faux');
    });
    if (saisie) saisie.disabled = true;

    $('#zone-retour').innerHTML = `
      <div class="retour-question ${juste ? 'juste' : 'faux'}">
        <strong>${juste ? 'Bonne réponse !' : 'Pas tout à fait… La bonne réponse était : « ' + echap(reponseAffichee) + ' »'}</strong>
        ${question.explication ? '<div class="explication">' + echap(question.explication) + '</div>' : ''}
      </div>`;

    const derniere = q.index === q.questions.length - 1;
    btnValider.outerHTML = `<button class="btn btn-principal" id="btn-suivant" type="button">${derniere ? 'Voir mon résultat' : 'Question suivante'} </button>`;
    $('#btn-suivant').addEventListener('click', () => { q.index++; monterQuestion(); });
    $('#btn-suivant').focus();
  });
}

/* Écran de fin d'une activité */
function monterResultat() {
  const q = quizEnCours;
  const zone = $('#zone-quiz');
  const total = q.questions.length;
  const score = q.bonnes;
  const pct = total ? Math.round(100 * score / total) : 0;
  const p = lireProgres();
  const maintenant = new Date().toISOString();

  let titre = '', message = '', extra = '';
  const classeCercle = pct >= 70 ? 'ok' : (pct >= 50 ? 'alerte' : 'erreur');

  if (q.mode === 'exercice') {
    p.exercices[q.element.id] = { score, total, pct, date: maintenant };
    titre = 'Exercice terminé !';
    message = pct === 100 ? 'Sans faute, félicitations !' :
      pct >= 70 ? 'Très bien ! Vous pouvez passer à la suite.' :
      'Relisez la leçon puis refaites l’exercice pour progresser.';
  } else if (q.mode === 'quiz') {
    const precedent = p.quiz[q.element.id];
    p.quiz[q.element.id] = {
      score, total, pct, date: maintenant,
      essais: precedent ? (precedent.essais || 1) + 1 : 1,
      meilleurPct: precedent ? Math.max(precedent.meilleurPct || 0, pct) : pct
    };
    titre = 'Quiz terminé !';
    message = pct >= 70 ? 'Acquis validés, bravo !' :
      pct >= 50 ? 'C’est en bonne voie. Un petit tour par la leçon et ce sera parfait.' :
      'Pas de panique : relisez la leçon et retentez le quiz.';
  } else {
    const niveau = niveauPour(q.test, pct);
    p.positionnement[q.test.id] = { score, total, pct, niveau: niveau.label, date: maintenant };
    titre = 'Test terminé, merci !';
    message = 'Votre niveau de départ : ' + niveau.label + '.';
    extra = `
      <div class="encadre encadre-astuce" style="text-align:left;margin-top:18px;">
        <strong>Notre conseil</strong>${echap(niveau.conseil)}
      </div>`;
  }
  ecrireProgres(p);

  const rayon = 60, circonference = 2 * Math.PI * rayon;
  const decalage = circonference * (1 - pct / 100);

  let recap = '';
  if (q.mode !== 'test') {
    recap = '<h2 class="titre-section-page">Le détail de vos réponses</h2>' + q.reponses.map(r => `
      <div class="recap-question ${r.juste ? 'juste' : 'faux'}">
        <div class="q">${r.juste ? IC.ok : IC.ko}<span>${echap(r.question.q)}</span></div>
        ${r.juste ? '' : '<div class="detail">Bonne réponse : ' + echap(
          r.question.type === 'qcm' ? r.question.choix[r.question.bonne] :
          r.question.type === 'vraifaux' ? (r.question.bonne ? 'Vrai' : 'Faux') :
          r.question.reponses[0]
        ) + (r.question.explication ? ' — ' + echap(r.question.explication) : '') + '</div>'}
      </div>`).join('');
  }

  const refaire = q.mode === 'test' ? '' :
    `<button class="btn btn-secondaire" id="btn-refaire" type="button">Refaire</button>`;

  zone.innerHTML = `
    <div style="text-align:center;">
      <div class="cercle-score">
        <svg width="138" height="138" viewBox="0 0 138 138">
          <circle class="cercle-fond" cx="69" cy="69" r="${rayon}"/>
          <circle class="cercle-valeur ${classeCercle}" cx="69" cy="69" r="${rayon}"
            stroke-dasharray="${circonference}" stroke-dashoffset="${decalage}"/>
        </svg>
        <div class="cercle-texte"><span class="grand">${score}/${total}</span><span class="petit">${pct} %</span></div>
      </div>
      <h2 style="font-size:20px;">${titre}</h2>
      <p style="color:var(--texte-2);margin-top:4px;">${message}</p>
      ${extra}
      <div class="actions-quiz" style="justify-content:center;margin-top:22px;">
        ${refaire}
        <button class="btn btn-principal" data-aller="${q.retourRoute}" type="button">Continuer</button>
      </div>
    </div>
    ${recap}`;

  zone.querySelectorAll('[data-aller]').forEach(el => {
    el.addEventListener('click', () => { location.hash = el.dataset.aller; });
  });
  const btnRefaire = $('#btn-refaire');
  if (btnRefaire) btnRefaire.addEventListener('click', () => {
    q.index = 0; q.bonnes = 0; q.reponses = [];
    monterQuestion();
  });
}

/* ---------- Positionnement ---------- */
function vuePositionnement() {
  const p = lireProgres();
  const cartes = CONTENU.positionnement.tests.map(t => {
    const res = p.positionnement[t.id];
    const module = trouverModule(t.module);
    if (res) {
      return `
        <div class="carte carte-lien" style="cursor:default;">
          <span class="icone-element lecon">${IC.medaille}</span>
          <span class="ligne-element-infos">
            <strong>${echap(t.titre)}</strong>
            <span>Réalisé le ${dateCourte(res.date)} · score ${res.score}/${res.total}</span>
          </span>
          <span class="badge badge-accent">${echap(res.niveau)}</span>
        </div>`;
    }
    return `
      <button class="carte carte-lien" data-aller="#/test/${t.id}" type="button">
        <span class="icone-element quiz">${IC.cible}</span>
        <span class="ligne-element-infos">
          <strong>${echap(t.titre)}</strong>
          <span>${echap(t.description)} ${t.duree ? '· ' + echap(t.duree) : ''}</span>
        </span>
        <span class="badge badge-alerte">À faire</span>
        <span style="color:var(--texte-3)">${IC.droite}</span>
      </button>`;
  }).join('');

  return `
    <header class="entete-page">
      <h1>Tests de positionnement</h1>
      <p class="sous-titre">${echap(CONTENU.positionnement.intro)}</p>
    </header>
    <div class="liste-cartes">${cartes}</div>`;
}

/* ---------- Mes résultats ---------- */
function vueResultats() {
  const p = lireProgres();
  const global = progresGlobal(p);
  const quizFaits = Object.values(p.quiz);
  const nbLecons = Object.keys(p.lecons).length;
  const moyenne = quizFaits.length
    ? Math.round(quizFaits.reduce((s, r) => s + r.pct, 0) / quizFaits.length) : null;

  const stats = `
    <div class="grille-stats">
      <div class="carte stat"><div class="stat-valeur">${global.pct} %</div><div class="stat-libelle">Progression générale</div></div>
      <div class="carte stat"><div class="stat-valeur">${nbLecons}</div><div class="stat-libelle">Leçons terminées</div></div>
      <div class="carte stat"><div class="stat-valeur">${quizFaits.length}</div><div class="stat-libelle">Quiz réalisés</div></div>
      <div class="carte stat"><div class="stat-valeur">${moyenne == null ? '—' : moyenne + ' %'}</div><div class="stat-libelle">Moyenne des quiz</div></div>
    </div>`;

  /* Niveaux de positionnement */
  const niveaux = CONTENU.positionnement.tests.map(t => {
    const res = p.positionnement[t.id];
    if (!res) {
      return `<div class="carte carte-lien" style="cursor:default;">
        <span class="icone-element quiz">${IC.cible}</span>
        <span class="ligne-element-infos"><strong>${echap(t.titre)}</strong><span>Pas encore réalisé</span></span>
        <button class="btn btn-secondaire" data-aller="#/test/${t.id}" type="button">Faire le test</button>
      </div>`;
    }
    return `<div class="carte carte-lien" style="cursor:default;">
      <span class="icone-element lecon">${IC.medaille}</span>
      <span class="ligne-element-infos"><strong>${echap(t.titre)}</strong><span>${res.score}/${res.total} · le ${dateCourte(res.date)}</span></span>
      <span class="badge badge-accent">${echap(res.niveau)}</span>
    </div>`;
  }).join('');

  /* Tableau des quiz */
  let lignesQuiz = [];
  for (const m of CONTENU.modules) {
    for (const s of m.sections) {
      for (const el of s.elements) {
        if (el.type !== 'quiz') continue;
        const res = p.quiz[el.id];
        if (!res) continue;
        const badge = res.pct >= 70 ? '<span class="badge badge-ok">Acquis</span>' :
          res.pct >= 50 ? '<span class="badge badge-alerte">En cours</span>' :
          '<span class="badge badge-erreur">À revoir</span>';
        lignesQuiz.push(`<tr>
          <td>${echap(m.icone)} ${echap(m.titre)}</td>
          <td>${echap(el.titre)}</td>
          <td><strong>${res.score}/${res.total}</strong> (${res.pct} %)</td>
          <td>${dateCourte(res.date)}</td>
          <td>${badge}</td>
        </tr>`);
      }
    }
  }

  const tableau = lignesQuiz.length
    ? `<div class="carte" style="padding:6px 12px;"><div class="tableau-scroll"><table>
        <thead><tr><th>Module</th><th>Quiz</th><th>Score</th><th>Date</th><th>Statut</th></tr></thead>
        <tbody>${lignesQuiz.join('')}</tbody>
      </table></div></div>`
    : `<div class="carte etat-vide">
        <div class="grande-icone">${IC.resultats}</div>
        <h3>Aucun quiz réalisé pour le moment</h3>
        <p>Vos scores apparaîtront ici dès que vous aurez terminé votre premier quiz.</p>
        <button class="btn btn-principal" data-aller="#/accueil" type="button">Voir mes modules</button>
      </div>`;

  return `
    <header class="entete-page">
      <h1>Mes résultats</h1>
      <p class="sous-titre">Votre progression et vos scores, enregistrés sur cet appareil.</p>
    </header>
    ${stats}
    <h2 class="titre-section-page">Mon niveau de départ</h2>
    <div class="liste-cartes">${niveaux}</div>
    <h2 class="titre-section-page">Mes quiz</h2>
    ${tableau}`;
}

/* ---------- Page introuvable ---------- */
function vueIntrouvable() {
  return `
    <div class="carte etat-vide" style="margin-top:40px;">
      <div class="grande-icone">${IC.alerte}</div>
      <h3>Page introuvable</h3>
      <p>Ce contenu n'existe pas ou a été déplacé.</p>
      <button class="btn btn-principal" data-aller="#/accueil" type="button">Retour à l'accueil</button>
    </div>`;
}

/* ============================================================
   Démarrage
   ============================================================ */
async function demarrer() {
  appliquerTheme(themeActuel());
  try {
    const [repContenu, repStagiaires] = await Promise.all([
      fetch('data/contenu.json', { cache: 'no-cache' }),
      fetch('data/stagiaires.json', { cache: 'no-cache' })
    ]);
    if (!repContenu.ok || !repStagiaires.ok) throw new Error('HTTP');
    CONTENU = await repContenu.json();
    STAGIAIRES = (await repStagiaires.json()).stagiaires || [];
  } catch (e) {
    $('#chargement').innerHTML =
      '<p style="max-width:340px;text-align:center;color:var(--texte-2);padding:0 20px;">' +
      'Impossible de charger le contenu de la formation.<br>Vérifiez votre connexion Internet puis rechargez la page.</p>' +
      '<button class="btn btn-principal" onclick="location.reload()">Recharger</button>';
    return;
  }

  construireNavigation();
  initConnexion();
  $('#btn-deconnexion').innerHTML = IC.sortie + '<span>Se déconnecter</span>';
  $('#btn-deconnexion').addEventListener('click', deconnecter);
  $('#btn-deconnexion-mobile').innerHTML = IC.sortie;
  $('#btn-deconnexion-mobile').addEventListener('click', deconnecter);
  $('#btn-theme').addEventListener('click', basculerTheme);
  $('#btn-theme-mobile').addEventListener('click', basculerTheme);
  appliquerTheme(themeActuel()); /* met à jour les libellés des boutons */
  window.addEventListener('hashchange', router);

  const memoSession = localStorage.getItem('atihub_session');
  if (memoSession) {
    try {
      const s = JSON.parse(memoSession);
      const valide = STAGIAIRES.find(x =>
        normaliser(x.nom) === normaliser(s.nom) &&
        normaliser(x.prenom) === normaliser(s.prenom) &&
        normaliserCode(x.code) === normaliserCode(s.code));
      if (valide) {
        session = { nom: valide.nom, prenom: valide.prenom, code: normaliserCode(valide.code) };
        ouvrirApplication();
      } else {
        localStorage.removeItem('atihub_session');
        $('#connexion').classList.remove('cache');
      }
    } catch (e) {
      $('#connexion').classList.remove('cache');
    }
  } else {
    $('#connexion').classList.remove('cache');
  }
  $('#chargement').classList.add('cache');
}

demarrer();
