# Vroom · sitio web

La portada de Vroom más sus páginas legales, servidas con GitHub Pages en
**vroomdgt.com**.

Responsable: Andrei Ioan. Contacto: soporte@vroomdgt.com para la app,
privacidad@vroomdgt.com para las solicitudes de RGPD, que tienen plazo legal
de un mes y conviene no mezclarlas con las incidencias.

Viven en un repo **aparte y público** a propósito: GitHub Pages sobre repo
privado es una función de pago, y el repo de la app no debe hacerse público.
Aquí dentro no hay nada sensible.

## Puesta en marcha (una sola vez)

1. Crear en GitHub un repo **público** llamado `vroom-legal`.
2. Desde esta carpeta:

   ```
   git init
   git add -A
   git commit -m "Privacidad y terminos de Vroom"
   git branch -M main
   git remote add origin https://github.com/andreiioanbiz-art/vroom-legal.git
   git push -u origin main
   ```

3. En el repo: Settings → Pages → Source **Deploy from a branch**, rama `main`,
   carpeta `/ (root)`.
4. En el mismo Settings → Pages, campo **Custom domain**: `vroomdgt.com`.
   El fichero `CNAME` de esta carpeta ya lo deja puesto, así que debería
   detectarlo solo.
5. En el DNS del dominio, crear los registros que pide GitHub:
   - cuatro registros `A` del ápice apuntando a las IP de GitHub Pages, o un
     `ALIAS`/`ANAME` si el registrador lo soporta;
   - un `CNAME` de `www` a `andreiioanbiz-art.github.io`.

   Las IP exactas las da la propia pantalla de Pages: cópialas de ahí y no de
   ningún tutorial, que han cambiado alguna vez.
6. Esperar a que Pages emita el certificado (puede tardar un rato) y marcar
   **Enforce HTTPS**.

Quedan en:

- `https://vroomdgt.com/privacidad.html`
- `https://vroomdgt.com/terminos.html`
- `https://vroomdgt.com/soporte.html`

En la ficha de App Store Connect van dos: la de privacidad en su campo y la de
soporte en el campo **URL de soporte**. Privacidad y términos se enlazan además
desde Perfil y desde el paywall, que es donde Apple las exige con dos productos
de pago.

## Por confirmar

- **La región del proyecto de Supabase**. Si la base está fuera de la UE,
  conviene decirlo con todas las letras en la política y no solo ampararse en
  las cláusulas contractuales tipo.

## Para actualizarlas

Editar el HTML, cambiar la fecha de "Última actualización" y hacer push. Pages
republica solo. La URL no cambia nunca, que es justo lo que necesita Apple.

## Estructura

- `index.html`, la portada. **Es un fichero generado: no se edita a mano.**
  Sale de `carnetify-dgt/web-vroom/build.mjs`, que convierte el export de
  Claude Design (`Vroom.dc.html`) en HTML estático. El export se deja tal cual
  sale de Claude Design, sin tocar: todo lo que se le añade (el enlace real de
  la App Store, la keyword del H1, los iconos, el enlace de soporte, los
  breakpoints, el JSON-LD y las imágenes en WebP) vive dentro del build, así
  que volver a exportar no borra nada. Cada añadido falla ruidosamente si no
  encuentra su anclaje, para que un cambio de diseño no publique una página a
  medias en silencio.

  Para actualizarla: se reemplaza el export, se lanza `node build.mjs` (escribe
  en `dist/`) y luego `node deploy.mjs`, que copia aquí todo lo generado sin
  tocar lo que se mantiene a mano. Un cambio hecho directamente sobre este
  fichero se pierde en el siguiente build.
- `guia/`, la guía del examen: un índice y un artículo por pregunta
  (/guia/cuantos-fallos-se-permiten-en-el-examen-teorico/ y compañía).
  **También generada**: los artículos se escriben en Markdown en
  `carnetify-dgt/web-vroom/guia/*.md` y el build los convierte, les pone la
  cabecera y el pie de la portada y los mete en el sitemap. Para tocar un
  artículo se edita su .md y se relanza build + deploy. Los datos oficiales que
  citan (tasa 2.1 a 94,05 euros, plazos, resultados) se contrastaron con
  dgt.es el 23-08-2026; cuando la DGT los cambie, se cambia el .md.
- `app.js`, la interacción de la portada (acordeón de las FAQ, selector de plan
  y el abanico del hero). También generado, misma vía.
- `assets/`, las capturas y los iconos que usa la portada, en WebP y con las
  dimensiones ya escritas en el HTML. Solo viaja lo que se referencia: el resto
  del material vive en `carnetify-dgt/web-vroom/assets`.
- `robots.txt` y `sitemap.xml`, también generados. Si algún día se añade una
  página nueva al dominio, hay que meterla en la lista `paginas` del build.
- `privacidad.html`
- `terminos.html`
- `soporte.html`, la página de ayuda. Escrita a mano como las legales, y es la
  que va en el campo **URL de soporte** de App Store Connect: la guideline 1.5
  pide que ahí se vea cómo pedir ayuda, y un `mailto:` en el pie de la portada
  se queda corto si el revisor la abre sin cliente de correo. Cuando cambie la
  app (compras, recuperación de cuenta, recordatorios) hay que barrerla, igual
  que las legales.
- `estilo.css`, hoja compartida por las tres páginas escritas a mano. Sin
  fuentes ni recursos externos a propósito: son páginas que revisa Apple y que se abren
  desde el móvil. La portada no la usa.
- `CNAME`, el dominio propio para GitHub Pages.
- `.nojekyll`, para que Pages sirva la carpeta tal cual y no la pase por Jekyll.
