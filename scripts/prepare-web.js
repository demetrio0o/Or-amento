// Monta a pasta "www" com a página, as bibliotecas e as fontes (tudo dentro do app, sem internet).
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const www = path.join(root, 'www');
const nm = (...p) => path.join(root, 'node_modules', ...p);

fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(www, { recursive: true });

const b64 = (f) => fs.readFileSync(path.join(root, 'assets', f)).toString('base64');
let html = fs.readFileSync(path.join(root, 'src', 'index.html'), 'utf8');
html = html.split('__ICON__').join(b64('icon-ui.png')).split('__FULL__').join(b64('logo-full.png'));
fs.writeFileSync(path.join(www, 'index.html'), html);

fs.copyFileSync(nm('jspdf', 'dist', 'jspdf.umd.min.js'), path.join(www, 'jspdf.umd.min.js'));
fs.copyFileSync(nm('jspdf-autotable', 'dist', 'jspdf.plugin.autotable.min.js'), path.join(www, 'jspdf.plugin.autotable.min.js'));

for (const [pkg, dest] of [['montserrat', 'montserrat'], ['public-sans', 'public-sans']]) {
  const from = nm('@fontsource-variable', pkg);
  const to = path.join(www, 'fonts', dest);
  fs.mkdirSync(to, { recursive: true });
  fs.copyFileSync(path.join(from, 'index.css'), path.join(to, 'index.css'));
  fs.cpSync(path.join(from, 'files'), path.join(to, 'files'), { recursive: true });
}
console.log('www pronto:', fs.readdirSync(www).join(', '));
