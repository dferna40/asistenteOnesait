# Asistente Onesait

Aplicación de escritorio y web para centralizar conocimiento operativo de trabajo: entornos, accesos, procedimientos, comandos, plantillas y documentación técnica en formato Markdown.

Su objetivo es servir como base de conocimiento local y práctica para el día a día, con foco en consulta rápida, edición sencilla, exportación y persistencia controlada.

## Qué es este proyecto

El proyecto combina:

- una interfaz `React + Vite` para consultar y editar contenido
- un servidor `Express` para persistencia, backups, subida de imágenes y comprobaciones auxiliares
- una variante de escritorio con `Electron`
- scripts de arranque/cierre para uso diario en Windows

La aplicación puede ejecutarse de tres formas:

1. como aplicación web en desarrollo
2. como aplicación web compilada abierta desde el navegador
3. como aplicación de escritorio Electron

## Tecnologías usadas

- `React 18`
- `TypeScript`
- `Vite`
- `Tailwind CSS`
- `Express`
- `Electron`
- `multer` para subida de imágenes
- `react-markdown`, `remark-gfm`, `rehype-highlight`, `highlight.js` para renderizado de Markdown
- `jspdf` y `html2canvas` para exportación a PDF

## Estructura principal

- [src/App.tsx](C:/Desarrollo/asistenteOnesait/src/App.tsx): lógica principal de la aplicación
- [src/components](C:/Desarrollo/asistenteOnesait/src/components): componentes de UI y paneles
- [src/hooks/useSearch.ts](C:/Desarrollo/asistenteOnesait/src/hooks/useSearch.ts): motor de búsqueda y prefijos
- [src/types/index.ts](C:/Desarrollo/asistenteOnesait/src/types/index.ts): tipos de dominio
- [src/data/manual.json](C:/Desarrollo/asistenteOnesait/src/data/manual.json): base inicial del manual
- [server.js](C:/Desarrollo/asistenteOnesait/server.js): servidor local de persistencia y utilidades
- [electron/main.mjs](C:/Desarrollo/asistenteOnesait/electron/main.mjs): bootstrap de escritorio
- [scripts/start-app.ps1](C:/Desarrollo/asistenteOnesait/scripts/start-app.ps1): arranque de la versión compilada en navegador
- [scripts/stop-app.ps1](C:/Desarrollo/asistenteOnesait/scripts/stop-app.ps1): cierre del servidor local
- [Abrir Asistente.vbs](C:/Desarrollo/asistenteOnesait/Abrir%20Asistente.vbs): acceso silencioso de arranque
- [Cerrar Asistente.vbs](C:/Desarrollo/asistenteOnesait/Cerrar%20Asistente.vbs): acceso silencioso de cierre

## Requisitos

Para desarrollo:

- `Node.js` 18 o superior
- `npm`
- Windows con PowerShell, si vas a usar los scripts `.ps1`, `.cmd` o `.vbs`

Para uso como escritorio:

- Windows
- dependencias instaladas con `npm install`

## Instalación

### Primera vez

1. Clona el repositorio.
2. Entra en la carpeta del proyecto.
3. Ejecuta:

```powershell
npm install
```

### Después de instalar

Ya puedes usar cualquiera de estas variantes:

- modo desarrollo web
- modo compilado con navegador
- modo escritorio Electron

## Formas de arrancar la aplicación

### Opción 1: desarrollo web

Levanta Vite y el servidor local a la vez.

```powershell
npm run dev
```

Qué hace:

- Vite sirve el frontend en `http://localhost:5173`
- el servidor Express se levanta en `http://127.0.0.1:3001`

Uso recomendado:

- cuando estés desarrollando
- cuando quieras ver cambios al momento
- cuando necesites depurar frontend o backend

Cómo abrir:

- entra en `http://localhost:5173`

Cómo cerrar:

- detén la terminal con `Ctrl + C`

### Opción 2: versión web compilada con navegador

Esta es la opción pensada para uso diario sin abrir una terminal manualmente.

Antes de usarla por primera vez, compila el frontend:

```powershell
npm run build
```

Después puedes arrancar con cualquiera de estos accesos:

- [Abrir Asistente.vbs](C:/Desarrollo/asistenteOnesait/Abrir%20Asistente.vbs)
- [Abrir Asistente.cmd](C:/Desarrollo/asistenteOnesait/Abrir%20Asistente.cmd)

Qué hace:

- comprueba que exista `dist/index.html`
- arranca el servidor local en segundo plano en el puerto `3001`
- espera a que la app responda
- abre `http://127.0.0.1:3001`

Uso recomendado:

- cuando quieras usar la aplicación en navegador sin consola visible
- cuando no necesites hot reload

Cómo cerrar correctamente:

- [Cerrar Asistente.vbs](C:/Desarrollo/asistenteOnesait/Cerrar%20Asistente.vbs)
- [Cerrar Asistente.cmd](C:/Desarrollo/asistenteOnesait/Cerrar%20Asistente.cmd)

Importante:

- si solo cierras la ventana del navegador, el backend puede quedarse vivo en segundo plano
- para evitar instancias antiguas o puertos ocupados, cierra siempre con los scripts de cierre

### Opción 3: escritorio Electron en desarrollo

Primero levanta el frontend de Vite:

```powershell
npm run vite-dev
```

Luego, en otra terminal:

```powershell
$env:ELECTRON_START_URL="http://localhost:5173"
npm run desktop
```

Qué hace:

- Electron abre una ventana nativa
- reutiliza el frontend servido por Vite
- no arranca el servidor embebido si detecta `ELECTRON_START_URL`

Uso recomendado:

- cuando quieras probar la experiencia de escritorio sin empaquetar

### Opción 4: escritorio empaquetado

Para generar una build de escritorio:

```powershell
npm run desktop:build
```

Para generar la variante portable de Windows:

```powershell
npm run desktop:portable
```

Salida habitual:

- carpeta `release/`

Importante:

- los artefactos de `release/`, `release-fixed/` y `release-icon/` no deben subirse al repositorio

## Qué hacer la primera vez y qué hacer en usos futuros

### Primera vez para un usuario técnico

1. `npm install`
2. `npm run build`
3. arranca con [Abrir Asistente.vbs](C:/Desarrollo/asistenteOnesait/Abrir%20Asistente.vbs)
4. cierra con [Cerrar Asistente.vbs](C:/Desarrollo/asistenteOnesait/Cerrar%20Asistente.vbs)

### Uso habitual diario

1. ejecuta [Abrir Asistente.vbs](C:/Desarrollo/asistenteOnesait/Abrir%20Asistente.vbs)
2. trabaja normalmente
3. cierra con [Cerrar Asistente.vbs](C:/Desarrollo/asistenteOnesait/Cerrar%20Asistente.vbs)

### Cuando cambies código

1. usa `npm run dev` si estás desarrollando
2. cuando quieras pasar al modo compilado, ejecuta `npm run build`
3. vuelve a abrir con `Abrir Asistente.vbs`

## Arquitectura funcional

### Frontend

El frontend mantiene el estado del manual completo:

- secciones
- fichas
- plantillas
- papelera
- ajustes

Responsabilidades principales:

- navegación y filtros
- edición de fichas, secciones y plantillas
- vistas rápidas
- papelera
- exportación e importación
- estados de sincronización y diagnóstico

### Backend

El backend local en [server.js](C:/Desarrollo/asistenteOnesait/server.js) se encarga de:

- leer el manual desde disco
- guardar el manual completo
- crear backups previos al guardado
- servir imágenes subidas
- comprobar endpoints
- detectar conflictos de guardado entre instancias

### Persistencia

La persistencia sigue este esquema:

1. la fuente principal es el manual en disco gestionado por el servidor
2. `localStorage` se usa como apoyo local de sesión
3. si falla el servidor, la aplicación puede seguir temporalmente en local

Estados importantes que verás en la UI:

- `Cargado desde disco`
- `Recuperado desde guardado local`
- `Cambios aún no sincronizados`
- `Conflicto de guardado`

### Variante de escritorio

La variante Electron:

- abre una `BrowserWindow`
- puede arrancar un servidor embebido
- guarda datos de ejecución bajo `app.getPath('userData')`
- carga la versión compilada del frontend desde `dist`

## Endpoints del servidor

El backend expone estos endpoints principales:

- `GET /health`
  - comprueba que el servidor está vivo
- `GET /manual`
  - devuelve el manual actual y su revisión
- `POST /save-manual`
  - guarda el manual completo
  - incluye control de revisión para detectar conflictos entre instancias
- `GET /check-endpoint`
  - valida disponibilidad de URLs o hosts desde el servidor
- `POST /upload`
  - sube imágenes para incrustarlas en contenido Markdown

## Modelo de datos

La aplicación trabaja con un objeto `ManualData` que contiene:

- `categories`
- `entries`
- `templates`
- `trash`
- `settings`
- `deletedCategories`

Esto permite:

- restaurar secciones borradas
- mantener plantillas y papelera
- guardar personalización y modo oscuro

## Funcionalidades principales

### 1. Inicio y navegación

La pantalla principal muestra:

- hero principal
- acceso al buscador
- secciones
- estadísticas
- plantillas
- utilidades laterales

También hay vistas rápidas para:

- `Entorno`
- `Credenciales`
- `Incidencias`
- `Ancladas`

### 2. Gestión de secciones

Puedes:

- crear secciones
- editar nombre, color y descripción
- borrar secciones
- restaurarlas desde la papelera

Al borrar una sección:

- sus fichas van a la papelera
- la metadata de la sección se conserva para poder restaurarla bien

### 3. Gestión de fichas

Cada ficha puede contener:

- título
- categoría
- contenido Markdown
- pasos
- comandos y parámetros
- tags
- fecha de actualización
- estado anclado

Puedes:

- crear
- editar
- anclar
- borrar a papelera
- exportar a PDF

### 4. Plantillas

Las plantillas permiten crear fichas más rápido con:

- contenido base
- tags sugeridos
- pasos sugeridos
- comandos sugeridos
- sección sugerida opcional

Puedes:

- crear plantillas
- editarlas
- usarlas para abrir una nueva ficha preconfigurada

### 5. Búsqueda

La búsqueda soporta:

- texto libre
- filtros por sección
- filtros por múltiples tags
- solo ancladas
- orden por fecha o título

Prefijos disponibles:

- `/cmd`
- `/env`
- `/db`
- `/uml`
- `/task`

### 6. Papelera

La papelera permite:

- restaurar fichas individuales
- restaurar una sección completa
- vaciar la papelera con confirmación

### 7. Importación y exportación

Exportaciones:

- backup JSON completo
- `manual.json`
- PDF por ficha

Importación:

- importación de backups
- modo `fusionar`
- modo `reemplazar`
- resumen de impacto antes de confirmar

### 8. Estados de guardado y conflictos

La app ya contempla:

- guardado en disco
- trabajo temporal en local
- conflicto entre dos instancias abiertas
- recarga manual desde disco

Acciones disponibles:

- `Deshacer`
- `Rehacer`
- `Recargar desde disco`

### 9. Validación de endpoints

Las fichas de entorno pueden lanzar comprobaciones de endpoint desde el backend para evitar falsos positivos del navegador.

### 10. Personalización

Desde Ajustes puedes cambiar:

- nombre de la aplicación
- título y descripción principal
- recordatorio principal
- textos laterales
- icono
- enlaces externos

También existe una tarjeta de diagnóstico con:

- estado de servidor
- estado de guardado
- origen de datos
- revisión activa
- volumen del manual
- profundidad de deshacer/rehacer

## Pantallas y zonas de la app

### Home

- hero
- buscador
- secciones
- panel de plantillas
- estadísticas

### Resultados

- listado filtrado
- chips de filtros activos
- ordenación
- vistas rápidas

### Modal de ficha

- datos básicos
- editor Markdown
- pasos
- comandos
- vista previa

### Modal de sección

- nombre
- color
- descripción
- borrado de sección

### Modal de plantilla

- nombre
- sección sugerida
- título sugerido
- tags
- pasos
- contenido base
- comandos sugeridos

### Ajustes

- personalización
- branding
- enlaces laterales
- icono
- diagnóstico

### Lateral

- herramientas rápidas
- backups
- papelera

## Archivos y carpetas que no deben subirse al repo

No deben versionarse:

- `dist/`
- `release/`
- `release-fixed/`
- `release-icon/`
- `.runtime/`
- `backups/`
- `tmp-userdata/`
- `public/images/`

Eso ya está cubierto por [.gitignore](C:/Desarrollo/asistenteOnesait/.gitignore).

## Seguridad y datos sensibles

Recomendaciones importantes:

- no subas credenciales reales a `src/data/manual.json`
- no subas backups locales con datos sensibles
- no subas imágenes operativas o temporales de `public/images/`
- usa exportación manual o copias locales privadas si el contenido incluye accesos reales

## Flujo recomendado de Git

Si haces cambios de código:

1. desarrolla con `npm run dev`
2. verifica con `npm run build`
3. sube solo código fuente y recursos de origen
4. no hagas commit de `release/`, `dist/`, `backups/` ni datos locales

## Solución de problemas

### La app no abre con `Abrir Asistente.vbs`

Comprueba:

- que exista `dist/index.html`
- que hayas ejecutado `npm run build`
- que el puerto `3001` no esté bloqueado
- los logs en `.runtime/logs/`

### El servidor aparece como `KO`

Posibles causas:

- el backend no arrancó
- había otra instancia antigua ocupando `3001`
- se cerró la ventana pero no el servidor

Prueba:

1. ejecutar [Cerrar Asistente.vbs](C:/Desarrollo/asistenteOnesait/Cerrar%20Asistente.vbs)
2. volver a abrir con [Abrir Asistente.vbs](C:/Desarrollo/asistenteOnesait/Abrir%20Asistente.vbs)

### El guardado falla

Revisa:

- si el servidor está en `online`
- si hay `conflicto de guardado`
- si estás trabajando solo en local

Si hay conflicto:

- usa `Recargar desde disco`
- o exporta/importa antes de seguir

### El push a GitHub falla

No subas:

- builds de Electron
- ejecutables
- backups
- datos runtime
- manuales con credenciales

## Comandos útiles

```powershell
# instalar dependencias
npm install

# desarrollo web
npm run dev

# compilar frontend
npm run build

# vista previa de build
npm run preview

# escritorio en desarrollo
npm run desktop

# build de escritorio
npm run desktop:build

# build portable para Windows
npm run desktop:portable
```

## Estado actual del proyecto

El proyecto ya incorpora:

- persistencia unificada
- papelera con restauración de fichas y secciones
- deshacer y rehacer
- control de conflictos entre instancias
- importación con fusión o reemplazo
- validación fiable de endpoints
- diagnóstico de sesión
- personalización de UI

## Posibles mejoras futuras

- optimización del bundle de frontend
- sanitización avanzada de datos sensibles en `manual.json`
- sincronización multiusuario real
- exportaciones más ricas
- tests automáticos de interfaz y persistencia

