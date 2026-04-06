# 🚀 Setup Repository GitHub per Stack PDF

## 📋 Prerequisiti
- Account GitHub (crealo gratis su [github.com](https://github.com))
- Git installato sul tuo PC

## 🛠️ Passaggi per Creare Repository

### 1. Vai su GitHub
1. Accedi a [github.com](https://github.com)
2. Clicca sul **+** in alto a destra
3. Seleziona **"New repository"**

### 2. Configura Repository
- **Repository name**: `stack-pdf`
- **Description**: `Convert photos to stacked PDF - Web application`
- **Visibility**: Public (o Private se preferisci)
- **NON spuntare**:
  - ❌ Add a README file
  - ❌ Add .gitignore
  - ❌ Choose a license

3. Clicca **"Create repository"**

### 3. Collega Repository Locale
Copia gli URL che ti mostra GitHub:

```bash
# HTTPS (semplice)
https://github.com/TUO_USERNAME/stack-pdf.git

# O SSH (se hai chiave SSH configurata)
git@github.com:TUO_USERNAME/stack-pdf.git
```

### 4. Push su GitHub
Esegui questi comandi nel terminale:

```bash
# Sostituisci TUO_USERNAME con il tuo username GitHub
git remote add origin https://github.com/TUO_USERNAME/stack-pdf.git
git branch -M main
git push -u origin main
```

## 🎯 Comandi Rapidi (Copia e Incolla)

Sostituisci `TUO_USERNAME` con il tuo username GitHub:

```bash
git remote add origin https://github.com/TUO_USERNAME/stack-pdf.git
git branch -M main
git push -u origin main
```

## ✅ Verifica

Dopo il push, vai su:
`https://github.com/TUO_USERNAME/stack-pdf`

Dovresti vedere tutti i file del progetto!

## 🚨 Troubleshooting

### Errore "Authentication failed"
```bash
# Configura credenziali GitHub
git config --global user.name "Il Tuo Nome"
git config --global user.email "tua-email@example.com"
```

### Errore "remote already exists"
```bash
git remote remove origin
# Poi riprova il comando add
```

### Errore "Permission denied"
- Assicurati di avere accesso al repository
- Controlla che l'URL sia corretto

## 🔄 Prossimi Passi

Una volta su GitHub:

1. **Vai su Vercel**: [vercel.com](https://vercel.com)
2. **"New Project"**
3. **"Import Git Repository"**
4. **Seleziona `stack-pdf`**
5. **"Deploy"**

## 📱 Risultato Finale

- **Repository**: `https://github.com/TUO_USERNAME/stack-pdf`
- **Web App**: `https://stack-pdf-TUO_USERNAME.vercel.app`
- **Deploy automatico**: Ad ogni push su GitHub

---

## 🎉 Fatto!

Ora hai il tuo repository GitHub pronto per il deploy su Vercel! 🚀
