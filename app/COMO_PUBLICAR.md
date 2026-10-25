# Guía: Cómo Instalar AutoTrack en el Celular y Publicar Gratis

Esta carpeta `app/` contiene la versión **PWA (Progressive Web App)** de AutoTrack. A diferencia de Google Sites (que mete la página en un iframe y no permite instalarla), al publicarla en un servidor web gratuito la podrás **instalar en tu celular con ícono propio, pantalla completa y funcionamiento sin internet**.

Ambas versiones (Google Sites y la App instalada) se conectan a tu misma hoja de Google Sheets, por lo que **lo que cargues en una aparecerá inmediatamente en la otra**.

---

## Opción 1: Publicar en GitHub Pages (Recomendado - 2 minutos)

1. Ingresa a [GitHub.com](https://github.com) con tu cuenta (o créate una gratis).
2. Haz clic en **"New repository"** (Nuevo repositorio).
   - Nombre: por ejemplo `autotrack`
   - Márcalo como **Public** (Público).
   - Haz clic en **"Create repository"**.
3. En la pantalla que aparece, haz clic en el enlace azul **"uploading an existing file"** (subir archivos existentes).
4. Arrastra y suelta dentro de la página todo el contenido que está dentro de la carpeta `app/`:
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - La carpeta `icons` (con `icon-192.png` y `icon-512.png`).
5. Haz clic en el botón verde **"Commit changes"**.
6. Ve a la pestaña **Settings** (Configuración del repositorio) &rarr; en el menú de la izquierda entra en **Pages**.
7. En la sección **Branch**, cambia `None` por `main` (o `master`), deja la carpeta `/ (root)` y haz clic en **Save** (Guardar).
8. En 1 minuto tendrás tu enlace listo: `https://TU_USUARIO.github.io/autotrack/`.

---

## Opción 2: Publicar en Netlify Drop (Sin cuenta de Git - 1 minuto)

1. Entra a [app.netlify.com/drop](https://app.netlify.com/drop).
2. Arrastra la carpeta `app` completa desde tu explorador de archivos y suéltala en el círculo punteado de Netlify.
3. Te dará una URL directa gratuita e instantánea (por ejemplo `https://autotrack-megane.netlify.app/`).

---

## Cómo Instalarla en tu Celular

### En Android (Google Chrome):
1. Abre tu enlace (`https://TU_USUARIO.github.io/autotrack/`) en Chrome en tu celular.
2. Verás arriba el botón **"Instalar App"** con ícono de descarga. Tócalo y confirma "Instalar".
3. *(O si no aparece el botón: toca los tres puntos ⋮ arriba a la derecha y elige "Instalar aplicación" o "Agregar a la pantalla principal")*.
4. ¡Listo! Se creará el ícono de **AutoTrack** en el menú de aplicaciones de tu celular y abrirá a pantalla completa como una app nativa.

### En iPhone / iPad (Safari):
1. Abre tu enlace en **Safari**.
2. Toca el botón **Compartir** (el ícono del cuadrado con la flecha hacia arriba en la barra inferior).
3. Desliza hacia abajo y selecciona **"Agregar a pantalla de inicio"** (Add to Home Screen).
4. Confirma el nombre y toca **"Agregar"**.
5. ¡Listo! Tendrás el ícono en la pantalla de inicio de tu iPhone y abrirá sin barra de navegación.

---

## Sincronización con Google Sheets

En tu app instalada en el celular, ve a la pestaña **Nube & Backup** y asegúrate de tener pegada tu URL de Google Apps Script (`/exec`). Al presionar "Conectar y Sincronizar", todo tu historial quedará vinculado en tiempo real.
