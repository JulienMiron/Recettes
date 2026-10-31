/* Fonctions utilitaires partagées par index.html et ajouter.html. */
window.OUTILS = (() => {
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
    del(k) { try { localStorage.removeItem(k); } catch {} }
  };
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = s => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  const slug = s => norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

  let toastT;
  function toast(msg) {
    const t = document.getElementById("toast"); if (!t) return;
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2200);
  }
  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
    const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } finally { ta.remove(); }
    return Promise.resolve();
  }

  /* Nettoie le HTML et les entités que certains sites laissent dans leurs données. */
  function clean(s) {
    if (!s) return "";
    const d = document.createElement("div");
    d.innerHTML = String(s).replace(/<br\s*\/?>/gi, " ");
    return (d.textContent || "").replace(/\s+/g, " ").trim();
  }

  /* PT1H30M → « 1 h 30 » */
  function isoDur(s) {
    if (!s) return "";
    const m = String(s).match(/^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?/i);
    if (!m || !(m[1] || m[2] || m[3])) return clean(s);
    let h = (+m[1] || 0) * 24 + (+m[2] || 0), min = +m[3] || 0;
    h += Math.floor(min / 60); min %= 60;
    return h ? (min ? `${h} h ${String(min).padStart(2, "0")}` : `${h} h`) : `${min} min`;
  }

  function parseYield(y) {
    if (Array.isArray(y)) y = y.find(v => /[a-zà-ÿ]/i.test(v)) || y[0];
    const s = clean(y);
    const m = s.match(/(\d+)/);
    if (!m) return { n: 0, unite: "" };
    let unite = s.replace(m[0], "").replace(/^\s*(?:à\s*\d+\s*)?/i, "").trim();
    if (/^(servings?|portions?|personnes?|people)$/i.test(unite)) unite = "portions";
    return { n: +m[1], unite };
  }

  /* Première durée mentionnée dans le texte, en secondes. */
  function findDuration(t) {
    const m = String(t).match(/(\d+(?:[.,]\d+)?)\s*(?:(?:à|-|–|to|ou)\s*\d+(?:[.,]\d+)?\s*)?(heures?|hours?|hrs?|h|minutes?|mins?|min)\b/i);
    if (!m) return 0;
    const n = parseFloat(m[1].replace(",", "."));
    const sec = /^h/i.test(m[2]) ? n * 3600 : n * 60;
    return sec > 0 && sec <= 72 * 3600 ? Math.round(sec) : 0;
  }

  /* « 2 c. à soupe d'huile d'olive » → { quantite: 2, unite: "c_soupe", nom: "huile d'olive" } */
  const VULG = { "½": .5, "¼": .25, "¾": .75, "⅓": 1 / 3, "⅔": 2 / 3, "⅛": .125 };
  const UNITS = [
    ["c_soupe", ["cuillères à soupe", "cuillère à soupe", "cuillères a soupe", "cuillère a soupe", "cuil. à soupe", "c. à soupe", "c.à soupe", "c à soupe", "c. à s.", "c.à.s.", "c.s.", "cs", "càs", "tablespoons", "tablespoon", "tbsp", "tbs"]],
    ["c_the", ["cuillères à thé", "cuillère à thé", "cuillères à café", "cuillère à café", "cuil. à thé", "c. à thé", "c.à thé", "c à thé", "c. à café", "c. à t.", "c.à.t.", "c.t.", "càc", "càt", "teaspoons", "teaspoon", "tsp"]],
    ["tasse", ["tasses", "tasse", "cups", "cup"]],
    ["kg", ["kilogrammes", "kilogramme", "kg"]],
    ["g", ["grammes", "gramme", "gr", "g"]],
    ["ml", ["millilitres", "millilitre", "ml"]],
    ["l", ["litres", "litre", "l"]],
    ["oz", ["onces", "once", "ounces", "ounce", "oz"]],
    ["lb", ["livres", "livre", "pounds", "pound", "lbs", "lb"]],
    ["pincee", ["pincées", "pincée", "pinches", "pinch"]]
  ];
  const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const unitRe = new RegExp("^(" + UNITS.flatMap(u => u[1]).sort((a, b) => b.length - a.length).map(escRe).join("|") + ")(?=[\\s.,)]|$)\\.?\\s*", "i");
  function parseIngredient(line) {
    const s = clean(line);
    const q = s.match(/^(\d+\s+\d+\s*\/\s*\d+|\d+\s*\/\s*\d+|\d+(?:[.,]\d+)?\s*[½¼¾⅓⅔⅛]|\d+(?:[.,]\d+)?|[½¼¾⅓⅔⅛])\s*/);
    if (!q) return { nom: s };
    let txt = q[1].replace(/\s+/g, " ").trim(), val = 0;
    let mm;
    if ((mm = txt.match(/^(\d+) (\d+)\s*\/\s*(\d+)$/))) val = +mm[1] + mm[2] / mm[3];
    else if ((mm = txt.match(/^(\d+)\s*\/\s*(\d+)$/))) val = mm[1] / mm[2];
    else if ((mm = txt.match(/^(\d+(?:[.,]\d+)?)\s*([½¼¾⅓⅔⅛])$/))) val = parseFloat(mm[1].replace(",", ".")) + VULG[mm[2]];
    else if (VULG[txt]) val = VULG[txt];
    else val = parseFloat(txt.replace(",", "."));
    if (!val) return { nom: s };
    let rest = s.slice(q[0].length);
    // « 1 à 2 » : on garde la première valeur, la plage reste visible dans le nom
    let unite = "";
    const u = rest.match(unitRe);
    if (u) {
      const word = u[1].toLowerCase();
      unite = UNITS.find(x => x[1].includes(word))[0];
      rest = rest.slice(u[0].length);
    }
    rest = rest.replace(/^(de\s+|d['’]\s*|of\s+)/i, "").trim();
    return { nom: rest || s, quantite: Math.round(val * 1000) / 1000, unite };
  }

  /* Base64 ⇄ UTF-8 */
  function b64decode(b64) {
    const bin = atob(String(b64).replace(/\s/g, ""));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }
  function b64encode(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = "";
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  }

  /* Appel à l'API GitHub avec le jeton enregistré. */
  async function gh(method, path, body) {
    const token = store.get("recettes:token", "");
    const res = await fetch("https://api.github.com" + path, {
      method, cache: "no-store",
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(token ? { Authorization: "Bearer " + token } : {}),
        ...(body ? { "Content-Type": "application/json" } : {})
      },
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msgs = { 401: "jeton invalide ou expiré", 403: "accès refusé (permissions du jeton)", 404: "dépôt ou fichier introuvable (vérifiez le nom du dépôt et l'accès du jeton)", 409: "conflit, réessayez" };
      const e = new Error(msgs[res.status] || data.message || "erreur " + res.status);
      e.status = res.status; throw e;
    }
    return data;
  }

  return { store, esc, norm, slug, toast, copy, clean, isoDur, parseYield, findDuration, parseIngredient, b64decode, b64encode, gh };
})();
