/* ============================================================
   Plateforme de formation ATIGROUPE — moteur de navigation
   Lit data/catalogue.json et construit les pages automatiquement.
   Aucune dépendance externe. Ne PAS modifier pour ajouter du contenu :
   tout passe par le fichier data/catalogue.json.
   ============================================================ */

(function () {
  "use strict";

  // Récupère un paramètre dans l'URL (?id=... etc.)
  function param(nom) {
    return new URLSearchParams(window.location.search).get(nom);
  }

  function echappe(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // Charge le catalogue (chemin relatif tolérant pour sous-dossiers)
  function chargerCatalogue() {
    return fetch("data/catalogue.json", { cache: "no-store" })
      .then(function (r) {
        if (!r.ok) throw new Error("Catalogue introuvable (data/catalogue.json)");
        return r.json();
      });
  }

  function piedOrganisme(cat) {
    var p = document.querySelector("[data-pied-organisme]");
    if (p && cat.organisme && cat.organisme.pied) p.textContent = cat.organisme.pied;
    var m = document.querySelector("[data-marque-nom]");
    if (m && cat.organisme && cat.organisme.nom) m.textContent = cat.organisme.nom;
  }

  function erreur(zone, msg) {
    zone.innerHTML =
      '<div class="etat err"><strong>Une erreur est survenue</strong>' +
      '<p>' + echappe(msg) + '</p></div>';
  }

  /* ---------- PAGE D'ACCUEIL : liste des formations ---------- */
  function pageAccueil(zone) {
    chargerCatalogue().then(function (cat) {
      piedOrganisme(cat);
      var fs = cat.formations || [];
      if (!fs.length) {
        zone.innerHTML =
          '<div class="vide"><strong>Aucune formation publiée</strong>' +
          '<p>Ajoutez une formation dans le fichier <code>data/catalogue.json</code>.</p></div>';
        return;
      }
      zone.className = "grille";
      zone.innerHTML = fs.map(function (f) {
        var nbM = (f.modules || []).length;
        var nbQ = (f.quiz || []).length;
        return '' +
          '<article class="carte-formation">' +
            '<div class="cf-bandeau"></div>' +
            '<div class="cf-corps">' +
              (f.client ? '<div class="cf-client">' + echappe(f.client) + '</div>' : '') +
              '<h3>' + echappe(f.titre) + '</h3>' +
              '<p class="cf-resume">' + echappe(f.resume || "") + '</p>' +
              '<div class="cf-meta">' +
                '<span><b>' + nbM + '</b> module' + (nbM > 1 ? 's' : '') + '</span>' +
                '<span><b>' + nbQ + '</b> quiz</span>' +
                (f.niveau ? '<span>Niveau&nbsp;: <b>' + echappe(f.niveau) + '</b></span>' : '') +
              '</div>' +
              '<a class="cf-cta" href="formation.html?id=' + encodeURIComponent(f.id) + '">' +
                'Accéder à la formation' +
                '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
              '</a>' +
            '</div>' +
          '</article>';
      }).join("");
    }).catch(function (e) { erreur(zone, e.message); });
  }

  /* ---------- PAGE FORMATION : modules + quiz ---------- */
  function carteRessource(f, item, type) {
    var lien = "lecteur.html?f=" + encodeURIComponent(f.id) + "&doc=" + encodeURIComponent(item.id);
    var fichier = item.fichier;
    return '' +
      '<article class="carte-res">' +
        '<span class="cr-tag ' + type + '">' + (type === "quiz" ? "Quiz" : "Support de cours") + '</span>' +
        '<h3>' + echappe(item.titre) + '</h3>' +
        '<p>' + echappe(item.resume || "") + '</p>' +
        '<div class="cr-actions">' +
          '<a class="btn btn-plein" href="' + lien + '">' +
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>' +
            (type === "quiz" ? "Commencer le quiz" : "Consulter") +
          '</a>' +
          '<a class="btn btn-ligne" href="' + echappe(fichier) + '" target="_blank" rel="noopener">' +
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3h7v7M21 3l-9 9M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"/></svg>' +
            'Nouvel onglet' +
          '</a>' +
        '</div>' +
      '</article>';
  }

  function pageFormation(zone) {
    var id = param("id");
    chargerCatalogue().then(function (cat) {
      piedOrganisme(cat);
      var f = (cat.formations || []).filter(function (x) { return x.id === id; })[0];
      if (!f) { erreur(zone, "Formation « " + (id || "?") + " » introuvable dans le catalogue."); return; }

      document.title = f.titre + " — " + (cat.organisme ? cat.organisme.nom : "Formation");
      var fil = document.querySelector("[data-fil]");
      if (fil) fil.innerHTML =
        '<a href="index.html">Accueil</a><span class="sep">›</span><span>' + echappe(f.titre) + '</span>';

      var entete = document.querySelector("[data-formation-entete]");
      if (entete) entete.innerHTML =
        (f.client ? '<span class="surtitre">' + echappe(f.client) + '</span>' : '') +
        '<h1>' + echappe(f.titre) + '</h1>' +
        '<p>' + echappe(f.resume || "") + '</p>';

      var mods = f.modules || [], quiz = f.quiz || [];
      var html = "";

      if (f.positionnement && (f.positionnement.questions || []).length) {
        html += '<section class="section" style="padding-bottom:0">' +
          '<div class="pos-bandeau">' +
            '<div>' +
              '<strong>Nouveau sur cette formation&nbsp;?</strong>' +
              '<p>Commencez par le test de positionnement : il évalue votre niveau et vous conseille les modules à travailler en priorité.</p>' +
            '</div>' +
            '<a class="btn btn-plein" href="positionnement.html?f=' + encodeURIComponent(f.id) + '">Passer le test' +
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
            '</a>' +
          '</div>' +
        '</section>';
      }

      html += '<section class="section">' +
        '<div class="section-titre"><h2>Supports de cours</h2>' +
        '<span class="pastille">' + mods.length + '</span></div>';
      if (mods.length) {
        html += '<div class="grille">' +
          mods.map(function (m) { return carteRessource(f, m, "support"); }).join("") +
          '</div>';
      } else {
        html += blocVide("Aucun support pour le moment", "Ajoutez des modules dans le catalogue.");
      }
      html += '</section>';

      html += '<section class="section" style="padding-top:0">' +
        '<div class="section-titre"><h2>Quiz d\'évaluation</h2>' +
        '<span class="pastille">' + quiz.length + '</span></div>';
      if (quiz.length) {
        html += '<div class="grille">' +
          quiz.map(function (q) { return carteRessource(f, q, "quiz"); }).join("") +
          '</div>';
      } else {
        html += blocVide("Aucun quiz pour le moment", "Ajoutez un quiz dans le catalogue.");
      }
      html += '</section>';

      zone.innerHTML = html;
    }).catch(function (e) { erreur(zone, e.message); });
  }

  function blocVide(titre, sous) {
    return '<div class="vide">' +
      '<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>' +
      '<strong>' + echappe(titre) + '</strong><p>' + echappe(sous) + '</p></div>';
  }

  /* ---------- LECTEUR : affiche un support/quiz en plein écran ---------- */
  function pageLecteur() {
    var fId = param("f"), docId = param("doc");
    chargerCatalogue().then(function (cat) {
      var f = (cat.formations || []).filter(function (x) { return x.id === fId; })[0];
      if (!f) return lecteurErreur("Formation introuvable.");
      var liste = (f.modules || []).concat(f.quiz || []);
      var doc = liste.filter(function (d) { return d.id === docId; })[0];
      if (!doc) return lecteurErreur("Document introuvable.");

      document.title = doc.titre + " — " + f.titre;
      var t = document.querySelector("[data-lecteur-titre]");
      if (t) t.innerHTML = echappe(doc.titre) + '<small>' + echappe(f.titre) + '</small>';

      var retour = document.querySelector("[data-lecteur-retour]");
      if (retour) retour.href = "formation.html?id=" + encodeURIComponent(f.id);

      var ouvrir = document.querySelector("[data-lecteur-ouvrir]");
      if (ouvrir) ouvrir.href = doc.fichier;

      var cadre = document.querySelector("[data-lecteur-cadre]");
      if (cadre) {
        cadre.src = doc.fichier;
        cadre.addEventListener("error", function () {
          lecteurErreur("Le fichier « " + doc.fichier + " » est introuvable. Vérifiez qu'il a bien été déposé dans le dossier.");
        });
      }
    }).catch(function (e) { lecteurErreur(e.message); });
  }

  function lecteurErreur(msg) {
    var cadre = document.querySelector("[data-lecteur-cadre]");
    if (!cadre) return;
    var rempl = document.createElement("div");
    rempl.style.cssText = "flex:1;display:flex;align-items:center;justify-content:center;padding:40px";
    rempl.innerHTML =
      '<div class="etat err"><strong>Contenu indisponible</strong><p>' + echappe(msg) + '</p>' +
      '<p style="margin-top:14px"><a class="btn btn-plein" href="index.html">Retour à l\'accueil</a></p></div>';
    cadre.replaceWith(rempl);
  }

  /* ============================================================
     TEST DE POSITIONNEMENT & ESPACE FORMATEUR
     Les résultats sont conservés dans le navigateur (localStorage)
     et envoyés à Netlify Forms (tableau de bord Netlify > Forms).
     ============================================================ */

  var CLE_RESULTATS = "atig_resultats_positionnement";
  var CLE_SESSION_FORMATEUR = "atig_formateur_ok";

  function lireResultats() {
    try {
      var brut = localStorage.getItem(CLE_RESULTATS);
      var liste = brut ? JSON.parse(brut) : [];
      return Array.isArray(liste) ? liste : [];
    } catch (e) { return []; }
  }

  function sauverResultats(liste) {
    try { localStorage.setItem(CLE_RESULTATS, JSON.stringify(liste)); }
    catch (e) { /* stockage indisponible (navigation privée…) */ }
  }

  function niveauDepuisPct(pct, seuils) {
    var sInter = (seuils && seuils.intermediaire) || 40;
    var sAvance = (seuils && seuils.avance) || 75;
    if (pct >= sAvance) return "Avancé";
    if (pct >= sInter)  return "Intermédiaire";
    return "Débutant";
  }

  function classeNiveau(niveau) {
    if (niveau === "Avancé") return "niv-avance";
    if (niveau === "Intermédiaire") return "niv-inter";
    return "niv-debutant";
  }

  function dateLisible(iso) {
    try {
      return new Date(iso).toLocaleDateString("fr-FR", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit"
      });
    } catch (e) { return iso; }
  }

  // Envoi du résultat à Netlify Forms (silencieux : le stockage local reste la référence)
  function envoyerNetlify(res) {
    var corps = new URLSearchParams({
      "form-name": "positionnement",
      "stagiaire": res.prenom + " " + res.nom,
      "formation": res.formationTitre,
      "date": res.date,
      "score": res.score + "/" + res.total + " (" + res.pct + " %)",
      "niveau": res.niveau,
      "details": JSON.stringify(res)
    }).toString();
    return fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: corps
    }).catch(function () { /* hors-ligne ou en local : sans gravité */ });
  }

  /* ---------- PAGE TEST DE POSITIONNEMENT ---------- */
  function pagePositionnement(zone) {
    chargerCatalogue().then(function (cat) {
      piedOrganisme(cat);
      var fs = (cat.formations || []).filter(function (f) {
        return f.positionnement && (f.positionnement.questions || []).length;
      });
      if (!fs.length) {
        zone.innerHTML = '<div class="vide"><strong>Aucun test disponible</strong>' +
          '<p>Ajoutez un bloc <code>positionnement</code> dans <code>data/catalogue.json</code>.</p></div>';
        return;
      }
      var idDemande = param("f");
      var f = fs.filter(function (x) { return x.id === idDemande; })[0] || fs[0];
      etapeIdentite(zone, f, cat);
    }).catch(function (e) { erreur(zone, e.message); });
  }

  // Étape 1 : identité du stagiaire
  function etapeIdentite(zone, f, cat) {
    var pos = f.positionnement;
    zone.innerHTML =
      '<div class="pos-cadre">' +
        '<span class="cr-tag quiz" style="margin-bottom:10px">Test de positionnement</span>' +
        '<h1 class="pos-titre">' + echappe(pos.titre || f.titre) + '</h1>' +
        '<p class="pos-desc">' + echappe(pos.description || "") + '</p>' +
        '<div class="pos-infos">' +
          '<span><b>' + pos.questions.length + '</b> questions</span>' +
          '<span><b>' + compterDomaines(pos.questions) + '</b> domaines évalués</span>' +
          '<span>Résultat <b>immédiat</b></span>' +
        '</div>' +
        '<form class="pos-form" data-form-identite>' +
          '<div class="pos-champs">' +
            '<label>Prénom<input type="text" name="prenom" required autocomplete="given-name" placeholder="Votre prénom"></label>' +
            '<label>Nom<input type="text" name="nom" required autocomplete="family-name" placeholder="Votre nom"></label>' +
          '</div>' +
          '<button type="submit" class="btn btn-plein pos-btn-grand">Commencer le test' +
            '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
          '</button>' +
        '</form>' +
      '</div>';

    zone.querySelector("[data-form-identite]").addEventListener("submit", function (ev) {
      ev.preventDefault();
      var prenom = ev.target.prenom.value.trim();
      var nom = ev.target.nom.value.trim();
      if (!prenom || !nom) return;
      etapeQuestions(zone, f, { prenom: prenom, nom: nom });
    });
  }

  function compterDomaines(questions) {
    var vus = {};
    questions.forEach(function (q) { vus[q.moduleId || q.domaine] = true; });
    return Object.keys(vus).length;
  }

  // Étape 2 : le questionnaire, groupé par domaine
  function etapeQuestions(zone, f, identite) {
    var pos = f.positionnement, qs = pos.questions;
    var html = '<div class="pos-cadre">' +
      '<div class="pos-entete-quiz">' +
        '<h1 class="pos-titre">' + echappe(pos.titre || f.titre) + '</h1>' +
        '<p class="pos-stagiaire">Stagiaire : <b>' + echappe(identite.prenom + " " + identite.nom) + '</b></p>' +
        '<div class="pos-progression"><div class="pos-prog-barre" data-prog style="width:0%"></div></div>' +
        '<p class="pos-prog-txt" data-prog-txt>0 / ' + qs.length + ' réponses</p>' +
      '</div>' +
      '<form data-form-quiz>';

    var dernierDomaine = null;
    qs.forEach(function (q, i) {
      if (q.domaine !== dernierDomaine) {
        dernierDomaine = q.domaine;
        html += '<h2 class="pos-domaine">' + echappe(q.domaine) + '</h2>';
      }
      html += '<fieldset class="pos-question">' +
        '<legend><span class="pos-num">' + (i + 1) + '</span>' + echappe(q.question) + '</legend>' +
        q.choix.map(function (c, j) {
          return '<label class="pos-choix">' +
            '<input type="radio" name="q' + i + '" value="' + j + '">' +
            '<span>' + echappe(c) + '</span></label>';
        }).join("") +
        '</fieldset>';
    });

    html += '<p class="pos-alerte" data-alerte hidden>Merci de répondre à toutes les questions avant de valider.</p>' +
      '<button type="submit" class="btn btn-plein pos-btn-grand">Valider mes réponses</button>' +
      '</form></div>';
    zone.innerHTML = html;
    window.scrollTo(0, 0);

    var form = zone.querySelector("[data-form-quiz]");
    var prog = zone.querySelector("[data-prog]");
    var progTxt = zone.querySelector("[data-prog-txt]");

    form.addEventListener("change", function () {
      var n = 0;
      for (var i = 0; i < qs.length; i++) if (form["q" + i].value !== "") n++;
      prog.style.width = Math.round(n / qs.length * 100) + "%";
      progTxt.textContent = n + " / " + qs.length + " réponses";
    });

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var reponses = [];
      for (var i = 0; i < qs.length; i++) {
        var v = form["q" + i].value;
        if (v === "") {
          zone.querySelector("[data-alerte]").hidden = false;
          var vide = form.querySelectorAll(".pos-question")[i];
          vide.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        reponses.push(parseInt(v, 10));
      }
      var res = corrigerTest(f, identite, reponses);
      var liste = lireResultats();
      liste.push(res);
      sauverResultats(liste);
      envoyerNetlify(res);
      etapeResultat(zone, f, res);
    });
  }

  // Correction : score global + score par domaine (module)
  function corrigerTest(f, identite, reponses) {
    var pos = f.positionnement, qs = pos.questions;
    var domaines = {}, ordre = [];
    var score = 0;

    qs.forEach(function (q, i) {
      var ok = reponses[i] === q.bonne;
      if (ok) score++;
      var cle = q.moduleId || q.domaine;
      if (!domaines[cle]) {
        domaines[cle] = { moduleId: q.moduleId, domaine: q.domaine, score: 0, total: 0 };
        ordre.push(cle);
      }
      domaines[cle].total++;
      if (ok) domaines[cle].score++;
    });

    var detailDomaines = ordre.map(function (cle) {
      var d = domaines[cle];
      d.pct = Math.round(d.score / d.total * 100);
      d.aRevoir = d.pct < 70;
      return d;
    });

    var pct = Math.round(score / qs.length * 100);
    return {
      id: "r" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      nom: identite.nom,
      prenom: identite.prenom,
      formationId: f.id,
      formationTitre: f.titre,
      date: new Date().toISOString(),
      score: score,
      total: qs.length,
      pct: pct,
      niveau: niveauDepuisPct(pct, pos.seuils),
      domaines: detailDomaines,
      reponses: reponses
    };
  }

  // Étape 3 : affichage du résultat au stagiaire
  function etapeResultat(zone, f, res) {
    var modulesARevoir = res.domaines.filter(function (d) { return d.aRevoir; });
    var mods = f.modules || [];

    zone.innerHTML =
      '<div class="pos-cadre">' +
        '<div class="pos-resultat-tete">' +
          '<div class="pos-score-rond ' + classeNiveau(res.niveau) + '">' +
            '<b>' + res.pct + '%</b><span>' + res.score + '/' + res.total + '</span>' +
          '</div>' +
          '<div>' +
            '<h1 class="pos-titre">Merci ' + echappe(res.prenom) + ' !</h1>' +
            '<p class="pos-desc">Votre test est terminé. Niveau estimé&nbsp;: ' +
              '<span class="pos-badge ' + classeNiveau(res.niveau) + '">' + res.niveau + '</span></p>' +
            '<p class="pos-note">Votre résultat a été enregistré et transmis à votre formateur.</p>' +
          '</div>' +
        '</div>' +

        '<h2 class="pos-domaine" style="margin-top:34px">Détail par domaine</h2>' +
        '<div class="pos-barres">' +
          res.domaines.map(function (d) {
            return '<div class="pos-barre-ligne">' +
              '<span class="pbl-nom">' + echappe(d.domaine) + '</span>' +
              '<div class="pbl-fond"><div class="pbl-rempli ' +
                (d.pct >= 70 ? "ok" : d.pct >= 34 ? "moyen" : "bas") +
                '" style="width:' + d.pct + '%"></div></div>' +
              '<span class="pbl-val">' + d.score + '/' + d.total + '</span>' +
            '</div>';
          }).join("") +
        '</div>' +

        (modulesARevoir.length ?
          '<h2 class="pos-domaine" style="margin-top:34px">Modules conseillés pour vous</h2>' +
          '<p class="pos-desc">D\'après vos réponses, nous vous conseillons de travailler en priorité&nbsp;:</p>' +
          '<ul class="pos-conseils">' +
          modulesARevoir.map(function (d) {
            var m = mods.filter(function (x) { return x.id === d.moduleId; })[0];
            return '<li>' + echappe(m ? m.titre : d.domaine) + '</li>';
          }).join("") + '</ul>'
          :
          '<p class="pos-note pos-note-ok">Excellent résultat : tous les domaines sont maîtrisés. ' +
          'La formation vous permettra de consolider et d\'approfondir ces acquis.</p>'
        ) +

        '<div class="cr-actions" style="margin-top:34px">' +
          '<a class="btn btn-plein" href="formation.html?id=' + encodeURIComponent(f.id) + '">Accéder à la formation</a>' +
          '<a class="btn btn-ligne" href="index.html">Retour à l\'accueil</a>' +
        '</div>' +
      '</div>';
    window.scrollTo(0, 0);
  }

  /* ---------- PAGE ESPACE FORMATEUR ---------- */
  function pageFormateur(zone) {
    chargerCatalogue().then(function (cat) {
      piedOrganisme(cat);
      var code = (cat.formateur && cat.formateur.codeAcces) || "ATI2026";
      if (sessionStorage.getItem(CLE_SESSION_FORMATEUR) === "1") {
        tableauFormateur(zone, cat);
      } else {
        porteFormateur(zone, cat, code);
      }
    }).catch(function (e) { erreur(zone, e.message); });
  }

  function porteFormateur(zone, cat, code) {
    zone.innerHTML =
      '<div class="pos-cadre pos-cadre-etroit">' +
        '<span class="cr-tag support" style="margin-bottom:10px">Accès réservé</span>' +
        '<h1 class="pos-titre">Espace formateur</h1>' +
        '<p class="pos-desc">Saisissez le code d\'accès formateur pour consulter les résultats ' +
          'des tests de positionnement.</p>' +
        '<form class="pos-form" data-form-code>' +
          '<div class="pos-champs">' +
            '<label>Code d\'accès<input type="password" name="code" required placeholder="Code formateur" autocomplete="off"></label>' +
          '</div>' +
          '<p class="pos-alerte" data-alerte hidden>Code incorrect. Réessayez ou contactez rh@atigroupe.fr.</p>' +
          '<button type="submit" class="btn btn-plein pos-btn-grand">Entrer</button>' +
        '</form>' +
      '</div>';

    zone.querySelector("[data-form-code]").addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (ev.target.code.value.trim() === code) {
        sessionStorage.setItem(CLE_SESSION_FORMATEUR, "1");
        tableauFormateur(zone, cat);
      } else {
        zone.querySelector("[data-alerte]").hidden = false;
      }
    });
  }

  function tableauFormateur(zone, cat) {
    var liste = lireResultats().slice().sort(function (a, b) {
      return b.date < a.date ? -1 : 1;
    });

    var nb = liste.length;
    var moyenne = nb ? Math.round(liste.reduce(function (s, r) { return s + r.pct; }, 0) / nb) : 0;
    var repartition = { "Débutant": 0, "Intermédiaire": 0, "Avancé": 0 };
    liste.forEach(function (r) { if (repartition[r.niveau] != null) repartition[r.niveau]++; });

    var html =
      '<div class="form-entete">' +
        '<div>' +
          '<h1 class="pos-titre">Résultats des tests de positionnement</h1>' +
          '<p class="pos-desc">Les résultats ci-dessous sont ceux enregistrés sur <b>cet appareil</b>. ' +
            'Chaque test passé est aussi transmis à Netlify (rubrique «&nbsp;Forms&nbsp;» du tableau de bord Netlify). ' +
            'Utilisez Exporter / Importer pour regrouper les résultats de plusieurs postes.</p>' +
        '</div>' +
        '<div class="cr-actions">' +
          '<button class="btn btn-plein" data-export-csv>Exporter CSV</button>' +
          '<button class="btn btn-ligne" data-export-json>Exporter JSON</button>' +
          '<button class="btn btn-ligne" data-importer>Importer JSON</button>' +
          '<input type="file" accept=".json,application/json" data-fichier-import hidden>' +
          '<button class="btn btn-ligne" data-deconnexion>Se déconnecter</button>' +
        '</div>' +
      '</div>' +

      '<div class="form-stats">' +
        '<div class="fs-tuile"><b>' + nb + '</b><span>Test' + (nb > 1 ? 's' : '') + ' passé' + (nb > 1 ? 's' : '') + '</span></div>' +
        '<div class="fs-tuile"><b>' + (nb ? moyenne + '%' : '—') + '</b><span>Score moyen</span></div>' +
        '<div class="fs-tuile niv-debutant"><b>' + repartition["Débutant"] + '</b><span>Débutant' + (repartition["Débutant"] > 1 ? 's' : '') + '</span></div>' +
        '<div class="fs-tuile niv-inter"><b>' + repartition["Intermédiaire"] + '</b><span>Intermédiaire' + (repartition["Intermédiaire"] > 1 ? 's' : '') + '</span></div>' +
        '<div class="fs-tuile niv-avance"><b>' + repartition["Avancé"] + '</b><span>Avancé' + (repartition["Avancé"] > 1 ? 's' : '') + '</span></div>' +
      '</div>';

    if (!nb) {
      html += '<div class="vide" style="margin-top:26px"><strong>Aucun résultat pour le moment</strong>' +
        '<p>Les résultats s\'afficheront ici dès qu\'un stagiaire aura passé le ' +
        '<a href="positionnement.html" style="color:var(--bleu);font-weight:600">test de positionnement</a> sur cet appareil, ' +
        'ou après un import JSON depuis un autre poste.</p></div>';
    } else {
      html += '<div class="form-tableau-cadre"><table class="form-tableau">' +
        '<thead><tr><th>Date</th><th>Stagiaire</th><th>Formation</th><th>Score</th><th>Niveau</th><th></th></tr></thead><tbody>' +
        liste.map(function (r, i) {
          return '<tr data-ligne="' + i + '">' +
            '<td>' + echappe(dateLisible(r.date)) + '</td>' +
            '<td><b>' + echappe(r.prenom + " " + r.nom) + '</b></td>' +
            '<td class="ft-formation">' + echappe(r.formationTitre || r.formationId || "") + '</td>' +
            '<td><b>' + r.pct + '%</b> <small>(' + r.score + '/' + r.total + ')</small></td>' +
            '<td><span class="pos-badge ' + classeNiveau(r.niveau) + '">' + r.niveau + '</span></td>' +
            '<td class="ft-actions">' +
              '<button class="btn-mini" data-detail="' + i + '">Détail</button>' +
              '<button class="btn-mini btn-mini-danger" data-suppr="' + i + '">Supprimer</button>' +
            '</td>' +
          '</tr>' +
          '<tr class="ft-detail" data-detail-ligne="' + i + '" hidden><td colspan="6">' + detailResultat(r) + '</td></tr>';
        }).join("") +
        '</tbody></table></div>';
    }

    zone.innerHTML = html;

    zone.querySelector("[data-deconnexion]").addEventListener("click", function () {
      sessionStorage.removeItem(CLE_SESSION_FORMATEUR);
      pageFormateur(zone);
    });

    zone.querySelector("[data-export-csv]").addEventListener("click", function () {
      telecharger("resultats-positionnement.csv", versCSV(liste), "text/csv;charset=utf-8");
    });
    zone.querySelector("[data-export-json]").addEventListener("click", function () {
      telecharger("resultats-positionnement.json", JSON.stringify(liste, null, 2), "application/json");
    });

    var champFichier = zone.querySelector("[data-fichier-import]");
    zone.querySelector("[data-importer]").addEventListener("click", function () { champFichier.click(); });
    champFichier.addEventListener("change", function () {
      var fichier = champFichier.files[0];
      if (!fichier) return;
      var lecteur = new FileReader();
      lecteur.onload = function () {
        try {
          var importes = JSON.parse(lecteur.result);
          if (!Array.isArray(importes)) throw new Error("format");
          var actuels = lireResultats();
          var ids = {};
          actuels.forEach(function (r) { ids[r.id] = true; });
          var ajoutes = 0;
          importes.forEach(function (r) {
            if (r && r.id && !ids[r.id]) { actuels.push(r); ids[r.id] = true; ajoutes++; }
          });
          sauverResultats(actuels);
          alert(ajoutes + " résultat(s) importé(s).");
          tableauFormateur(zone, cat);
        } catch (e) {
          alert("Fichier invalide : importez un fichier JSON exporté depuis cette page.");
        }
      };
      lecteur.readAsText(fichier);
    });

    zone.querySelectorAll("[data-detail]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var ligne = zone.querySelector('[data-detail-ligne="' + btn.getAttribute("data-detail") + '"]');
        ligne.hidden = !ligne.hidden;
        btn.textContent = ligne.hidden ? "Détail" : "Fermer";
      });
    });

    zone.querySelectorAll("[data-suppr]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var r = liste[parseInt(btn.getAttribute("data-suppr"), 10)];
        if (!r) return;
        if (!confirm("Supprimer le résultat de " + r.prenom + " " + r.nom + " ?")) return;
        sauverResultats(lireResultats().filter(function (x) { return x.id !== r.id; }));
        tableauFormateur(zone, cat);
      });
    });
  }

  function detailResultat(r) {
    var aRevoir = (r.domaines || []).filter(function (d) { return d.aRevoir; });
    return '<div class="pos-barres" style="margin-top:6px">' +
      (r.domaines || []).map(function (d) {
        return '<div class="pos-barre-ligne">' +
          '<span class="pbl-nom">' + echappe(d.domaine) + '</span>' +
          '<div class="pbl-fond"><div class="pbl-rempli ' +
            (d.pct >= 70 ? "ok" : d.pct >= 34 ? "moyen" : "bas") +
            '" style="width:' + d.pct + '%"></div></div>' +
          '<span class="pbl-val">' + d.score + '/' + d.total + '</span>' +
        '</div>';
      }).join("") +
      '</div>' +
      (aRevoir.length ?
        '<p class="pos-desc" style="margin-top:12px"><b>À travailler en priorité :</b> ' +
        aRevoir.map(function (d) { return echappe(d.domaine); }).join(", ") + '</p>'
        : '<p class="pos-desc" style="margin-top:12px"><b>Tous les domaines sont maîtrisés.</b></p>');
  }

  function versCSV(liste) {
    function cellule(v) { return '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"'; }
    var lignes = [["Date", "Prénom", "Nom", "Formation", "Score", "Total", "Pourcentage", "Niveau", "Domaines à revoir"]];
    liste.forEach(function (r) {
      lignes.push([
        dateLisible(r.date), r.prenom, r.nom, r.formationTitre || r.formationId || "",
        r.score, r.total, r.pct + "%", r.niveau,
        (r.domaines || []).filter(function (d) { return d.aRevoir; })
          .map(function (d) { return d.domaine; }).join(" ; ")
      ]);
    });
    // BOM UTF-8 pour un affichage correct des accents dans Excel
    return "﻿" + lignes.map(function (l) { return l.map(cellule).join(";"); }).join("\r\n");
  }

  function telecharger(nomFichier, contenu, type) {
    var blob = new Blob([contenu], { type: type });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = nomFichier;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /* ---------- Routeur : choisit la fonction selon la page ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var z;
    if ((z = document.querySelector("[data-page-accueil]")))        return pageAccueil(z);
    if ((z = document.querySelector("[data-page-formation]")))      return pageFormation(z);
    if ((z = document.querySelector("[data-page-positionnement]"))) return pagePositionnement(z);
    if ((z = document.querySelector("[data-page-formateur]")))      return pageFormateur(z);
    if (document.querySelector("[data-page-lecteur]"))              return pageLecteur();
  });
})();
