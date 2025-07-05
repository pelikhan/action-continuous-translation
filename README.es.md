# Traducción Continua

Esta acción utiliza la traducción incremental de documentos Markdown mediante [GitHub Models](https://github.com/models). ¡Compatibilidad integrada con [Astro Starlight](https://starlight.astro.build/)!

* [Documentación](https://pelikhan.github.io/action-continuous-translation/)
* [Publicación en el blog](https://microsoft.github.io/genaiscript/blog/continuous-translations/)
* [Francés](./README.fr.md)
* [Español](./README.es.md)
* [Árabe](./README.ar.md)

## ¿Cómo funciona?

Esta acción utiliza [GenAIScript](https://microsoft.github.io/genaiscript/) para analizar y traducir documentos Markdown de manera programática. El proceso de traducción funciona de la siguiente manera:

* Analizar el archivo Markdown a un AST (árbol de sintaxis abstracta).
* Recorrer el árbol y buscar traducciones existentes o marcar el nodo que necesita traducción.
* Ejecutar inferencia con LLM para recolectar nuevas traducciones.
* Inyectar las nuevas traducciones en el documento y validar la calidad.
* Guardar las traducciones en la caché del archivo.
* Confirmar los cambios.

## Entradas

* `lang`: El código ISO del idioma objetivo para la traducción. (por defecto: `fr`)
* `source`: El código ISO del idioma fuente para la traducción. (por defecto: `en`)
* `files`: Archivos a procesar, separados por punto y coma. Por defecto es `README.md`.
* `instructions`: Instrucciones adicionales para que el LLM las utilice al traducir.
* `instructions_file`: Ruta a un archivo que contiene instrucciones adicionales para que el LLM las utilice al traducir.
* `starlight_dir`: Carpeta raíz de la documentación Astro Starlight. (se establece solo al usar Starlight)
* `starlight_base`: Alias base para la documentación Starlight. (opcional, incluso al usar Starlight)

### Diagnósticos

* `force`: Forzar la traducción incluso si el archivo ya ha sido traducido.
* `debug`: Habilitar el registro de depuración (<https://microsoft.github.io/genaiscript/reference/scripts/logging/>).

### Configuración de LLM

* `github_token`: Token de GitHub con permiso mínimo de `models: read` (<https://microsoft.github.io/genaiscript/reference/github-actions/#github-models-permissions>). (por defecto: `${{ secrets.GITHUB_TOKEN }}`)

* `openai_api_key`: Clave API de OpenAI (por defecto: `${{ secrets.OPENAI_API_KEY }}`)

* `openai_api_base`: URL base de la API de OpenAI (por defecto: `${{ env.OPENAI_API_BASE }}`)

* `azure_openai_api_endpoint`: Endpoint de Azure OpenAI. En el Portal de Azure, abre tu recurso de Azure OpenAI, selecciona Claves y Endpoints, y copia el Endpoint. (por defecto: `${{ env.AZURE_OPENAI_API_ENDPOINT }}`)

* `azure_openai_api_key`: Clave API de Azure OpenAI. \*\*No necesitas esto si utilizas Microsoft Entra ID. (por defecto: `${{ secrets.AZURE_OPENAI_API_KEY }}`)

* `azure_openai_subscription_id`: ID de suscripción de Azure OpenAI para listar implementaciones disponibles (solo Microsoft Entra). (por defecto: `${{ env.AZURE_OPENAI_SUBSCRIPTION_ID }}`)

* `azure_openai_api_version`: Versión de la API de Azure OpenAI. (por defecto: `${{ env.AZURE_OPENAI_API_VERSION }}`)

* `azure_openai_api_credentials`: Tipo de credenciales de API de Azure OpenAI. Déjalo como 'default' a menos que tengas una configuración especial de Azure. (por defecto: `${{ env.AZURE_OPENAI_API_CREDENTIALS }}`)

## Salidas

* `text`: La salida de texto generada.

## Uso

Agrega lo siguiente a tu paso en el archivo de flujo de trabajo:

```yaml
uses: pelikhan/action-continuous-translation@v0
with:
  github_token: ${{ secrets.GITHUB_TOKEN }}
  lang: fr,es
```

## Ejemplo

Guarda este archivo en tu directorio `.github/workflows/` como `continuous-translation.yml`:

```yaml
name: Continuous Translation
on:
  workflow_dispatch:
  push:
    branches:
      - main
    paths:
      - "README.md"
      - "docs/src/content/docs/**"
permissions:
  contents: write
  models: read
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
jobs:
  continuous_translation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/cache@v4
        with:
          path: .genaiscript/cache/**
          key: continuous-translation-${{ github.run_id }}
          restore-keys: |
            continuous-translation-
      - uses: pelikhan/action-continuous-translation@v0
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          lang: fr,es
      - uses: stefanzweifel/git-auto-commit-action@v5
        with:
          file_pattern: "translations/*.json **.md* translations/*.json"
          commit_message: "[cai] translated docs"
          commit_user_name: "genaiscript"
```

## Desarrollo

Esta acción fue generada automáticamente por GenAIScript a partir de los metadatos del script.
Recomendamos actualizar los metadatos del script en lugar de editar directamente los archivos de la acción.

* Las entradas de la acción se infieren a partir de los parámetros del script.
* Las salidas de la acción se infieren a partir del esquema de salida del script.
* La descripción de la acción es la descripción del script.
* La descripción del README es la descripción del script.
* La marca de la acción es la marca del script.

## 🧞 Comandos

Todos los comandos se ejecutan desde la raíz del proyecto, desde una terminal:

| Comando              | Acción                                                                      |
| :------------------- | :-------------------------------------------------------------------------- |
| `npm install`        | Instala las dependencias.                                                   |
| `npm run dev`        | Ejecuta una prueba de traducción de `README.md`\`README.md\` `fr`           |
| `npm run dev:astro`  | Traduce toda la documentación Astro.                                        |
| `npm run typecheck`  | Revisa los archivos TypeScript.                                             |
| `npm run lint`       | Ejecuta prettier en todos los archivos del repositorio.                     |
| `npm run configure`  | Regenera `action.yml`\`action.yml\` al cambiar los parámetros en el script. |
| `npm run upgrade`    | Refrescar las dependencias.                                                 |
| `npm run test:genai` | Suite de pruebas locales.                                                   |
