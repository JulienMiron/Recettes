// Ajoute à recettes.js la recette contenue dans le corps d'une issue (bloc ```json).
// Utilisé par .github/workflows/ajouter-recette.yml. Écrit l'id ajouté dans $GITHUB_OUTPUT.
const fs = require("fs");
const path = require("path");

const body = process.env.ISSUE_BODY || "";
const fichier = path.join(process.env.GITHUB_WORKSPACE || process.cwd(), "recettes.js");

function echec(msg) {
  console.error(msg);
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, "erreur=" + msg.replace(/\n/g, " ") + "\n");
  process.exit(1);
}

const m = body.match(/```(?:json)?\s*\n([\s\S]*?)\n\s*```/);
if (!m) echec("Aucun bloc ```json trouvé dans l'issue.");

let r;
try { r = JSON.parse(m[1]); } catch (e) { echec("Le JSON de la recette est invalide : " + e.message); }

if (!r || typeof r !== "object" || Array.isArray(r)) echec("La recette doit être un objet JSON.");
if (!r.titre || typeof r.titre !== "string") echec("La recette n'a pas de titre.");
if (!Array.isArray(r.ingredients)) r.ingredients = [];
if (!Array.isArray(r.etapes)) r.etapes = [];
if (!r.categorie) r.categorie = "Autres";
if (!Array.isArray(r.etiquettes)) r.etiquettes = [];
r.portions = Math.max(1, parseInt(r.portions, 10) || 1);
if (!r.ajoutee) r.ajoutee = new Date().toISOString().slice(0, 10);

const texte = fs.readFileSync(fichier, "utf8");
let liste;
try { liste = JSON.parse(texte.slice(texte.indexOf("["), texte.lastIndexOf("]") + 1)); }
catch (e) { echec("Impossible de lire recettes.js : " + e.message); }

const slug = s => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
  .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "recette";
const ids = new Set(liste.map(x => x.id));
let base = slug(r.id || r.titre), id = base, k = 2;
while (ids.has(id)) id = base + "-" + k++;
r.id = id;

liste.push(r);
fs.writeFileSync(fichier, "window.RECETTES = " + JSON.stringify(liste, null, 2) + ";\n");
console.log("Recette ajoutée : " + r.titre + " (" + id + ")");
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, "id=" + id + "\ntitre=" + r.titre.replace(/\n/g, " ") + "\n");
