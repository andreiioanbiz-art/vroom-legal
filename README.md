# Vroom · páginas legales

Privacidad y términos de la app Vroom, servidos con GitHub Pages en
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

La de privacidad es la que se pega en la ficha de App Store Connect. Las dos
se enlazan desde Perfil y desde el paywall, que es donde Apple las exige con
dos productos de pago.

## Por confirmar

- **La región del proyecto de Supabase**. Si la base está fuera de la UE,
  conviene decirlo con todas las letras en la política y no solo ampararse en
  las cláusulas contractuales tipo.

## Para actualizarlas

Editar el HTML, cambiar la fecha de "Última actualización" y hacer push. Pages
republica solo. La URL no cambia nunca, que es justo lo que necesita Apple.

## Estructura

- `index.html`, portada con los dos enlaces y el contacto de soporte.
- `privacidad.html`
- `terminos.html`
- `estilo.css`, hoja compartida. Sin fuentes ni recursos externos a propósito:
  son páginas que revisa Apple y que se abren desde el móvil.
- `CNAME`, el dominio propio para GitHub Pages.
