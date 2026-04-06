# 🚀 Deploy Guida - Stack PDF Web App

## 📋 Opzioni Hosting (dalla più semplice alla più professionale)

### 1. **Vercel (Consigliato per iniziare)**
- ✅ **Gratis** per progetti personali
- ✅ **Deploy automatico** da GitHub
- ✅ **HTTPS** automatico
- ✅ **CDN globale**
- ✅ **Custom domain** gratuito

### 2. **Netlify**
- ✅ **Gratis** con piano generous
- ✅ **Deploy drag & drop**
- ✅ **Form redirects**
- ✅ **Split testing**

### 3. **GitHub Pages**
- ✅ **Completamente gratis**
- ✅ **Integrato con GitHub**
- ✅ **HTTPS** automatico
- ⚠️ **Limitato** a 1GB bandwidth/mese

### 4. **Firebase Hosting**
- ✅ **Gratis** fino a 10GB/mese
- ✅ **CDN globale**
- ✅ **Custom domain**
- ✅ **Analytics integrato**

---

## 🛠️ Metodo 1: Vercel (Più Semplice)

### Prerequisiti
- Account GitHub (gratis)
- Repository GitHub con il codice

### Passaggi

1. **Push su GitHub**
   ```bash
   git add .
   git commit -m "Add Stack PDF web app"
   git branch -M main
   git remote add origin https://github.com/tuonome/stack-pdf.git
   git push -u origin main
   ```

2. **Deploy su Vercel**
   - Vai su [vercel.com](https://vercel.com)
   - Clicca "New Project"
   - Importa da GitHub
   - Seleziona il repository `stack-pdf`
   - Clicca "Deploy"

3. **Risultato**
   - URL: `https://stack-pdf-tuonome.vercel.app`
   - Deploy automatico ad ogni push

---

## 🛠️ Metodo 2: Netlify (Drag & Drop)

### Passaggi

1. **Build di produzione**
   ```bash
   bun run build:web
   ```

2. **Upload su Netlify**
   - Vai su [netlify.com](https://netlify.com)
   - Drag & drop della cartella `dist`
   - Assegna un nome al sito
   - Click "Deploy site"

3. **Risultato**
   - URL: `https://nomesito-random.netlify.app`
   - Possibile custom domain

---

## 🛠️ Metodo 3: GitHub Pages

### Passaggi

1. **Abilita GitHub Pages**
   - Nel repository GitHub
   - Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: "main"
   - Folder: "/dist"

2. **Modifica package.json**
   ```json
   {
     "homepage": "https://tuonome.github.io/stack-pdf"
   }
   ```

3. **Build e push**
   ```bash
   bun run build:web
   git add dist -f
   git commit -m "Add production build"
   git push
   ```

---

## 🔧 Configurazione Aggiuntiva

### Base URL per Assets
Se necessario, modifica `app.json`:
```json
{
  "expo": {
    "web": {
      "base": "/stack-pdf/"
    }
  }
}
```

### Custom Domain
Su Vercel/Netlify:
1. Vai su domain settings
2. Aggiungi CNAME: `stack-pdf.tuodomain.com`
3. Configura DNS come indicato

---

## 📊 Costi e Limiti

| Servizio | Gratis | Piano a Pagamento | Limiti Principali |
|----------|---------|------------------|-------------------|
| Vercel | ✅ | Pro: $20/mese | 100GB bandwidth |
| Netlify | ✅ | Pro: $19/mese | 100GB bandwidth |
| GitHub Pages | ✅ | - | 1GB bandwidth/mese |
| Firebase | ✅ | Blaze: $0.18/GB | 10GB gratuito |

---

## 🎯 Raccomandazione

**Per iniziare**: Usa **Vercel**
- Più semplice e veloce
- Deploy automatico
- Ottimo per progetti React/Expo

**Per lungo termine**: Valuta **piano a pagamento** se:
- Superi 100GB/mese bandwidth
- Vuoi custom domain professionale
- Hai bisogno di analytics avanzate

---

## 🚀 Deploy Automatico (GitHub Actions)

Crea `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    - name: Install dependencies
      run: bun install
    - name: Build
      run: bun run build:web
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🔍 Test Post-Deploy

Dopo il deploy, verifica:
- ✅ Caricamento corretto di tutte le pagine
- ✅ Funzionalità upload immagini
- ✅ Generazione PDF funzionante
- ✅ Download PDF automatico
- ✅ Responsive design su mobile
- ✅ Performance accettabile (<3s load)

---

## 📞 Supporto

Per problemi di deploy:
- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Netlify**: [netlify.com/support](https://netlify.com/support)
- **GitHub**: [github.com/support](https://github.com/support)

---

## 🎉 Fatto!

Una volta deployato, la tua Stack PDF webapp sarà:
- 🌐 **Online 24/7**
- 📱 **Accessibile da qualsiasi dispositivo**
- ⚡ **Veloce e performante**
- 🔒 **HTTPS sicuro**
- 🌍 **Globale tramite CDN**
