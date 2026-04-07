# 🚀 Creazione Nuova Repository GitHub

## 📋 Passaggi

### 1. Elimina Repository Esistente
Vai su: https://github.com/gmazzu997/stack-pdf
1. Clicca **"Settings"** (tab in alto)
2. Scorri fino in fondo alla pagina
3. Clicca **"Danger Zone"**
4. Clicca **"Delete this repository"**
5. Digita `stack-pdf` per confermare
6. Clicca **"I understand the consequences..."**
7. Clicca **"Delete this repository"**

### 2. Crea Nuova Repository
1. Vai su [github.com](https://github.com)
2. Clicca **+** in alto a destra
3. Seleziona **"New repository"**
4. **Repository name**: `stack-pdf`
5. **Description**: `Convert photos to stacked PDF - Web application`
6. **Visibility**: Public
7. **NON spuntare**:
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
8. Clicca **"Create repository"**

### 3. Push del Codice Pulito
Esegui questi comandi nel terminale:

```bash
# Sostituisci con il tuo URL
git remote add origin https://github.com/gmazzu997/stack-pdf.git
git branch -M main
git push -u origin main
```

### 4. Deploy su Vercel
1. Vai su [vercel.com](https://vercel.com)
2. **"New Project"** → **"Import Git Repository"**
3. Seleziona `gmazzu997/stack-pdf`
4. **"Deploy"**

---

## 🎯 URL Finali

- **Repository**: `https://github.com/gmazzu997/stack-pdf`
- **Web App**: `https://stack-pdf-gmazzu997.vercel.app`

---

## ⚠️ Importante

- **Elimina prima** la repository esistente per evitare conflitti
- **Usa sempre** lo stesso nome `stack-pdf`
- **Non aggiungere** README o .gitignore durante la creazione
