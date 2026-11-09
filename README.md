# DenDEV — Portfolio

Sitio portfolio personal de **Denis Manuel López Molina** (DenDEV), ingeniero en sistemas e ingeniero web.

## Desarrollo local

El sitio es HTML estático (sin build). Para previsualizar:

```bash
python -m http.server 8080
```

y abrir http://localhost:8080

## Push a GitHub

El sitio se publica desde la rama `main` del repo `DenDev93/Dendev93.github.io`.

El token de push se gestiona localmente en `.env` (variable `GITHUB_TOKEN`, ya ignorada por git).

Con token disponible en entorno:

```bash
git add -A
git commit -m "Rediseño profesional del portfolio"
git push origin main
```

Si el token está en `.env`, exportarlo antes del push:

```bash
$env:GITHUB_TOKEN = "<tu_pat>"
git push origin main
```
