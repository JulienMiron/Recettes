/* Synchronisation du menu de la semaine entre appareils (Firebase).
   Sans connexion, le site fonctionne comme avant : le menu reste dans le navigateur.
   Une fois connecté avec Google, le menu et l'historique vivent dans Firestore
   (document foyer/menu) et chaque changement apparaît sur les autres appareils. */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { initializeFirestore, persistentLocalCache, doc, onSnapshot, runTransaction }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = initializeApp({
  apiKey: "AIzaSyDxTm3VMwiOy9uIXnNjfA0vj-vtw_yaYcM",
  authDomain: "recettes-93421.firebaseapp.com",
  projectId: "recettes-93421",
  storageBucket: "recettes-93421.firebasestorage.app",
  messagingSenderId: "601404385736",
  appId: "1:601404385736:web:1b559bbb0d9ff2e8a0b8fd"
});
const auth = getAuth(app);
let db;
try { db = initializeFirestore(app, { localCache: persistentLocalCache() }); }
catch { db = initializeFirestore(app, {}); }
const ref = doc(db, "foyer", "menu");

const M = window.MENU, O = window.OUTILS;
const btn = document.getElementById("syncBtn");
let desabonner = null, premier = true;

const propre = e => ({ semaine: e.semaine, ids: e.ids, historique: e.historique });

/* Fusion à la première connexion d'un appareil : on garde l'union des deux côtés. */
function fusion(a, b) {
  a = M.rouler(a); b = M.rouler(b);
  const ids = [...new Set([...a.ids, ...b.ids])];
  const parSemaine = new Map();
  [...a.historique, ...b.historique].forEach(h => {
    const ex = parSemaine.get(h.semaine) || [];
    parSemaine.set(h.semaine, [...new Set([...ex, ...h.ids])]);
  });
  const historique = [...parSemaine].map(([semaine, ids]) => ({ semaine, ids }))
    .sort((x, y) => y.semaine.localeCompare(x.semaine)).slice(0, 104);
  return { semaine: a.semaine, ids, historique };
}

async function modifier(f) {
  try {
    await runTransaction(db, async tx => {
      const s = await tx.get(ref);
      const nv = f(M.rouler(s.exists() ? s.data() : null));
      tx.set(ref, propre(nv));
    });
  } catch (e) {
    console.error(e);
    O.toast(e.code === "permission-denied" ? "Ce compte n'a pas accès au menu partagé" : "Synchronisation impossible pour l'instant");
  }
}

window.SYNC = {
  basculer(id, ajout) {
    if (!auth.currentUser) return;
    modifier(e => {
      e.ids = ajout ? [...new Set([...e.ids, id])] : e.ids.filter(x => x !== id);
      return e;
    });
  }
};

btn.hidden = false;
btn.onclick = async () => {
  if (auth.currentUser) {
    if (confirmerDeconnexion()) await signOut(auth);
    return;
  }
  const p = new GoogleAuthProvider();
  try { await signInWithPopup(auth, p); }
  catch (e) {
    if (e.code === "auth/popup-blocked" || e.code === "auth/operation-not-supported-in-this-environment") signInWithRedirect(auth, p);
    else if (e.code !== "auth/popup-closed-by-user" && e.code !== "auth/cancelled-popup-request") { console.error(e); O.toast("Connexion impossible"); }
  }
};
/* Pas de boîte de dialogue bloquante : un second toucher dans les 4 s déconnecte. */
let armee = 0;
function confirmerDeconnexion() {
  if (Date.now() - armee < 4000) return true;
  armee = Date.now(); O.toast("Touchez encore pour vous déconnecter"); return false;
}

onAuthStateChanged(auth, user => {
  if (desabonner) { desabonner(); desabonner = null; }
  if (!user) {
    btn.textContent = "Se connecter"; btn.setAttribute("aria-pressed", "false");
    btn.title = "Synchroniser le menu entre vos appareils";
    return;
  }
  btn.textContent = "☁ " + (user.displayName || user.email || "Connecté").split(" ")[0];
  btn.setAttribute("aria-pressed", "true");
  btn.title = "Menu synchronisé (" + user.email + "). Touchez deux fois pour vous déconnecter.";
  premier = true;
  desabonner = onSnapshot(ref, s => {
    if (premier) {
      premier = false;
      /* Première connexion de cet appareil : on fusionne son menu local avec le menu partagé.
         Ensuite, c'est le menu partagé qui fait foi (sinon une recette retirée ailleurs reviendrait). */
      const dejaLie = O.store.get("recettes:sync-uid", "") === user.uid;
      O.store.set("recettes:sync-uid", user.uid);
      const local = M.etat(), distant = s.exists() ? s.data() : null;
      if (distant && dejaLie) { M.appliquer(distant); return; }
      const f = distant ? fusion(distant, local) : M.rouler(local);
      M.appliquer(f);
      if (!distant || JSON.stringify(propre(f)) !== JSON.stringify(propre(M.rouler(distant)))) modifier(e => fusion(e, f));
      return;
    }
    if (s.exists()) M.appliquer(s.data());
  }, e => {
    console.error(e);
    O.toast(e.code === "permission-denied" ? "Ce compte n'a pas accès au menu partagé" : "Synchronisation interrompue");
  });
});
