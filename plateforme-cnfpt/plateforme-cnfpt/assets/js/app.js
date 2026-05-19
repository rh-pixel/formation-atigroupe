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

  /* ---------- Routeur : choisit la fonction selon la page ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var z;
    if ((z = document.querySelector("[data-page-accueil]")))   return pageAccueil(z);
    if ((z = document.querySelector("[data-page-formation]"))) return pageFormation(z);
    if (document.querySelector("[data-page-lecteur]"))         return pageLecteur();
  });
})();
