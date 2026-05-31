# 🚀 Guía para Publicar en GitHub

## Opción 1: Desde la Terminal (Recomendado)

### Paso 1: Crear repositorio en GitHub
1. Ve a https://github.com/new
2. Nombre del repositorio: `gymbro-symmetry` (o el nombre que prefieras)
3. Descripción: "Gestión de gimnasios con funcionalidades Symmetry App"
4. **NO** marcar "Initialize this repository with a README" (ya tenemos código)
5. Click en "Create repository"

### Paso 2: Conectar repositorio local con GitHub

```bash
# Reemplaza TU_USUARIO con tu username de GitHub
git remote add origin https://github.com/TU_USUARIO/gymbro-symmetry.git

# Verificar que se agregó correctamente
git remote -v

# Subir todo el código a GitHub
git push -u origin main
```

### Paso 3: Verificar en GitHub
- Ve a https://github.com/TU_USUARIO/gymbro-symmetry
- Deberías ver todos los archivos del proyecto

---

## Opción 2: Usando GitHub CLI (Más rápido)

Si tienes instalado `gh` (GitHub CLI):

```bash
# Autenticar con GitHub
gh auth login

# Crear repositorio y hacer push en un solo comando
gh repo create gymbro-symmetry --public --source=. --remote=origin --push
```

---

## 🔐 Configurar Autenticación

### Si usas HTTPS (contraseña):
GitHub ya no acepta contraseñas normales. Necesitas:

1. **Token de Acceso Personal**:
   - Ve a https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Marca los permisos: `repo`, `workflow`
   - Copia el token generado
   - Úsalo como contraseña cuando hagas push

2. **O usa SSH (recomendado)**:
```bash
# Generar clave SSH
ssh-keygen -t ed25519 -C "tu_email@ejemplo.com"

# Agregar clave a GitHub
# Ve a https://github.com/settings/keys
# Click "New SSH key" y pega el contenido de ~/.ssh/id_ed25519.pub

# Cambiar remote a SSH
git remote set-url origin git@github.com:TU_USUARIO/gymbro-symmetry.git

# Hacer push
git push -u origin main
```

---

## 📋 Comandos Útiles

```bash
# Ver estado del repositorio
git status

# Ver cambios antes de subir
git diff

# Actualizar desde GitHub (si trabajas en equipo)
git pull origin main

# Ver historial de commits
git log --oneline

# Cambiar URL del remote si te equivocaste
git remote set-url origin https://github.com/TU_USUARIO/nuevo-nombre.git
```

---

## ⚠️ Antes de Publicar

### 1. Verificar .gitignore
El archivo `.gitignore` ya está configurado para NO subir:
- ✅ `node_modules/`
- ✅ `.env` (variables de entorno con credenciales)
- ✅ Archivos de build
- ✅ Configuraciones locales

### 2. Revisar archivos sensibles
Asegúrate de que NO haya:
- Contraseñas en código
- Keys de API expuestas
- Archivos `.env` con datos reales

### 3. Licencia
El proyecto usa licencia MIT. Puedes cambiarla si lo necesitas.

---

## 🎉 Después de Publicar

### Agregar badge al README
Copia esto al inicio de tu README.md:

```markdown
![GitHub stars](https://img.shields.io/github/stars/TU_USUARIO/gymbro-symmetry?style=social)
![GitHub forks](https://img.shields.io/github/forks/TU_USUARIO/gymbro-symmetry?style=social)
![GitHub license](https://img.shields.io/github/license/TU_USUARIO/gymbro-symmetry)
```

### Compartir el proyecto
- Web: https://github.com/TU_USUARIO/gymbro-symmetry
- Clonar: `git clone https://github.com/TU_USUARIO/gymbro-symmetry.git`

---

## 🆘 Solución de Problemas

### Error: "repository not found"
```bash
# Verifica la URL
git remote -v

# Si está mal, corrígela
git remote set-url origin https://github.com/TU_USUARIO/gymbro-symmetry.git
```

### Error: "permission denied"
- Verifica que el token SSH esté configurado
- O usa token de acceso personal en lugar de contraseña

### Error: "large files"
Si hay archivos muy grandes (>100MB):
```bash
# Instalar Git LFS
git lfs install

# Trackear archivos grandes
git lfs track "*.zip"

# Hacer commit y push nuevamente
git add .gitattributes
git commit -m "Configure Git LFS"
git push
```

---

## 📞 ¿Necesitas ayuda?

- Documentación oficial: https://docs.github.com
- GitHub Community: https://github.community
- Stack Overflow: https://stackoverflow.com/questions/tagged/github

---

**¡Listo! Tu proyecto GymBro + Symmetry App estará disponible para todo el mundo 🌍**
