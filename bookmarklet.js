/*
 * Source lisible du favori « Ajouter recette ».
 * La version minifiée (une seule ligne commençant par javascript:) est affichée
 * sur la page ajouter.html, avec un bouton pour la copier.
 *
 * Le script lit les données schema.org/Recipe (JSON-LD) que la plupart des sites
 * de recettes incluent, puis ouvre la page ajouter.html du site avec la recette.
 */
(function () {
  var SITE = "https://julienmiron.github.io/Recettes/ajouter.html";
  function isRecipe(o) {
    var t = o && o["@type"];
    return t === "Recipe" || (Array.isArray(t) && t.indexOf("Recipe") >= 0);
  }
  function find(o) {
    if (!o || typeof o !== "object") return null;
    if (isRecipe(o)) return o;
    var list = Array.isArray(o) ? o : o["@graph"] || o.mainEntity || null;
    if (list) {
      if (!Array.isArray(list)) list = [list];
      for (var i = 0; i < list.length; i++) { var r = find(list[i]); if (r) return r; }
    }
    return null;
  }
  function txt(x) {
    if (!x) return "";
    if (typeof x === "string") return x;
    if (Array.isArray(x)) return x.map(txt).join(", ");
    return x.text || x.name || "";
  }
  function steps(x, out) {
    out = out || [];
    if (!x) return out;
    if (typeof x === "string") { x.split(/\n+/).forEach(function (s) { if (s.trim()) out.push(s.trim()); }); return out; }
    if (Array.isArray(x)) { x.forEach(function (s) { steps(s, out); }); return out; }
    if (x.itemListElement) { if (x.name) out.push("## " + x.name); return steps(x.itemListElement, out); }
    var t = x.text || x.name;
    if (t) out.push(String(t).trim());
    return out;
  }
  var r = null, nodes = document.querySelectorAll('script[type="application/ld+json"]');
  for (var i = 0; i < nodes.length && !r; i++) {
    try { r = find(JSON.parse(nodes[i].textContent)); } catch (e) {}
  }
  var d;
  if (r) {
    var img = r.image; if (Array.isArray(img)) img = img[0]; if (img && img.url) img = img.url;
    d = {
      titre: txt(r.name), description: txt(r.description),
      ingredients: [].concat(r.recipeIngredient || r.ingredients || []).map(txt),
      etapes: steps(r.recipeInstructions),
      rendement: r.recipeYield || "", tempsActif: r.prepTime || "", tempsTotal: r.totalTime || r.cookTime || "",
      categorie: txt(r.recipeCategory), motsCles: txt(r.keywords), image: typeof img === "string" ? img : "",
      source: location.href
    };
  } else {
    if (!confirm("Aucune recette structurée trouvée sur cette page. Ouvrir le formulaire avec le titre et le lien seulement?")) return;
    d = { titre: document.title, source: location.href, ingredients: [], etapes: [] };
  }
  location.href = SITE + "#r=" + encodeURIComponent(JSON.stringify(d));
})();
