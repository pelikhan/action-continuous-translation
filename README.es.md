# 🌍 Traducción Continua

> **Traduce automáticamente tu documentación en markdown utilizando IA** - impulsado por [GitHub Actions](https://github.com/actions) y [GitHub Models](https://github.com/models) con soporte integrado para [Astro Starlight](https://starlight.astro.build/)!

[![GitHub Action](https://img.shields.io/badge/GitHub-Action-blue?logo=github)](https://github.com/marketplace/actions/continuous-translation)
[![Documentación](https://img.shields.io/badge/📖-Documentación-green)](https://pelikhan.github.io/action-continuous-translation/)

## ✨ Funciones

* 🚀 **Traducción Incremental** - Sólo traduce el contenido modificado, ahorrando tiempo y costos de API
* 🎯 **Análisis AST Inteligente** - Preserva la estructura y el formato del markdown
* 🔄 **Gestión de Caché** - Caché inteligente para evitar traducciones redundantes
* 📚 **Listo para Astro Starlight** - Soporte integrado para sitios de documentación
* 🌐 **Soporte Multilenguaje** - Traduce a múltiples idiomas simultáneamente
* 🔍 **Validación de Calidad** - Validación automática de la calidad de la traducción
* ⚡ **Nativo en GitHub Actions** - Integración fluida con tu tubería CI/CD

## 📚 Recursos

* 📖 [**Documentación**](https://pelikhan.github.io/action-continuous-translation/) - Guía completa de configuración y referencia de API
* ✍️ [**Publicación del Blog**](https://microsoft.github.io/genaiscript/blog/continuous-translations/) - Análisis profundo de la tecnología
* 🌐 **Traducciones**: [Français](./README.fr.md) | [Español](./README.es.md) | [العربية](./README.ar.md)

## 🔧 Cómo Funciona

Esta acción utiliza [GenAIScript](https://microsoft.github.io/genaiscript/) para analizar y traducir inteligentemente tus documentos en markdown. Aquí está la magia detrás de escena:

1. **📄 Parsear** - Convierte markdown a AST (Árbol de Sintaxis Abstracta)
2. **🔍 Analizar** - Identifica el contenido que necesita traducirse frente a las traducciones existentes
3. **🤖 Traducir** - Usa IA para generar traducciones de alta calidad
4. **✅ Validar** - Asegura la calidad de la traducción e inyecta en el documento
5. **💾 Caché** - Guarda las traducciones para futuras actualizaciones incrementales
6. **📝 Commit** - Realiza commits automáticos de los cambios en tu repositorio

## ⚙️ Configuración

### 📝 Configuración Básica

| Parámetro           | Descripción                                                            | Por defecto |
| ------------------- | ---------------------------------------------------------------------- | ----------- |
| `lang`              | Idiomas objetivo para la traducción (códigos ISO, separados por comas) | `fr`        |
| `source`            | Idioma de origen (código ISO)                                          | `en`        |
| `files`             | Archivos a traducir (separados por punto y coma)                       | `README.md` |
| `instructions`      | Instrucciones personalizadas para la traducción                        | -           |
| `instructions_file` | Ruta al archivo con instrucciones de traducción                        | -           |

### 🌟 Integración con Astro Starlight

| Parámetro        | Descripción                                         | Requerido           |
| ---------------- | --------------------------------------------------- | ------------------- |
| `starlight_dir`  | Carpeta raíz de la documentación de Astro Starlight | Sólo para Starlight |
| `starlight_base` | Alias base para la documentación de Starlight       | Opcional            |

### 🔧 Diagnósticos y Depuración

| Parámetro | Descripción                                                                                                         | Por defecto |
| --------- | ------------------------------------------------------------------------------------------------------------------- | ----------- |
| `force`   | Forzar la traducción incluso si ya está traducido                                                                   | `false`     |
| `debug`   | Habilitar registro de depuración[aprender más](https://microsoft.github.io/genaiscript/reference/scripts/logging/)) | `false`     |

### 🤖 Configuración del Proveedor de IA

#### Modelos de GitHub (Recomendado)

| Parámetro      | Descripción                                                                                                                                                                                    | Por defecto                   |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `github_token` | Token de GitHub con permiso `models: read`permiso (guía de configuración)[guía de configuración](https://microsoft.github.io/genaiscript/reference/github-actions/#github-models-permissions)) | `${{ secrets.GITHUB_TOKEN }}` |

#### OpenAI

| Parámetro         | Descripción               | Por defecto                     |
| ----------------- | ------------------------- | ------------------------------- |
| `openai_api_key`  | Clave de API de OpenAI    | `${{ secrets.OPENAI_API_KEY }}` |
| `openai_api_base` | URL base de API de OpenAI | `${{ env.OPENAI_API_BASE }}`    |

#### Azure OpenAI

| Parámetro                      | Descripción                                                         | Por defecto                               |
| ------------------------------ | ------------------------------------------------------------------- | ----------------------------------------- |
| `azure_openai_api_endpoint`    | Punto de conexión de Azure OpenAI                                   | `${{ env.AZURE_OPENAI_API_ENDPOINT }}`    |
| `azure_openai_api_key`         | Clave de API de Azure OpenAI (no necesaria para Microsoft Entra ID) | `${{ secrets.AZURE_OPENAI_API_KEY }}`     |
| `azure_openai_subscription_id` | ID de suscripción para la lista de implementaciones (solo Entra ID) | `${{ env.AZURE_OPENAI_SUBSCRIPTION_ID }}` |
| `azure_openai_api_version`     | Versión de la API de Azure OpenAI                                   | `${{ env.AZURE_OPENAI_API_VERSION }}`     |
| `azure_openai_api_credentials` | Tipo de credenciales de API                                         | `${{ env.AZURE_OPENAI_API_CREDENTIALS }}` |

## 📤 Salidas

| Salida | Descripción                                 |
| ------ | ------------------------------------------- |
| `text` | El texto generado como salida de traducción |

## 🚀 Inicio Rápido

### Configuración Sencilla

Agrega este paso a tu flujo de trabajo de GitHub Actions para traducir tu README a francés y español:

```yaml
uses: pelikhan/action-continuous-translation@v0
with:
  github_token: ${{ secrets.GITHUB_TOKEN }}
  lang: fr,es
```

### Ejemplo Completo de Flujo de Trabajo

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

## 🛠️ Desarrollo y Contribución

### Arquitectura del Proyecto

Esta acción es generada automáticamente por GenAIScript a partir de metadatos del script, asegurando consistencia y fiabilidad. Recomendamos actualizar los metadatos del script en lugar de editar los archivos de la acción directamente.

**Componentes generados automáticamente:**

* ⚙️ Entradas de la acción → inferidas desde los parámetros del script
* 📤 Salidas de la acción → inferidas desde el esquema de salida del script
* 📝 Descripción de la acción → descripción del script
* 📖 Descripción del README → descripción del script
* 🎨 Branding de la acción → branding del script

### 🧞 Comandos de Desarrollo

Todos los comandos se ejecutan desde la raíz del proyecto:

| Comando              | Acción                                       | Caso de uso                          |
| :------------------- | :------------------------------------------- | :----------------------------------- |
| `npm install`        | Instalar dependencias                        | Configuración inicial                |
| `npm run dev`        | Probar la traducción de `README.md`→ Francés | Pruebas rápidas                      |
| `npm run dev:astro`  | Traducir toda la documentación de Astro      | Traducción completa de documentación |
| `npm run typecheck`  | Validar archivos TypeScript                  | Calidad de código                    |
| `npm run lint`       | Formatear código con Prettier                | Estilo de código                     |
| `npm run configure`  | Regenera `action.yml`                        | Después de cambios en los parámetros |
| `npm run upgrade`    | Actualizar dependencias                      | Mantenimiento                        |
| `npm run test:genai` | Ejecutar pruebas locales                     | Aseguramiento de calidad             |

***

<div align="center">

**Hecho con ❤️ usando [GenAIScript](https://microsoft.github.io/genaiscript/)**

[📖 Documentación](https://pelikhan.github.io/action-continuous-translation/) • [🐛 Problemas](https://github.com/pelikhan/action-continuous-translation/issues) • [💡 Discusiones](https://github.com/pelikhan/action-continuous-translation/discussions)

</div>
