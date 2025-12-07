# 🌍 Continuous Translation

> **قم بترجمة مستندات Markdown الخاصة بك تلقائيًا باستخدام الذكاء الاصطناعي** - مدعوم من [GitHub Actions](https://github.com/actions) و [GitHub Models](https://github.com/models) مع دعم مدمج لـ [Astro Starlight](https://starlight.astro.build/)!

[![GitHub Action](https://img.shields.io/badge/GitHub-Action-blue?logo=github)](https://github.com/marketplace/actions/continuous-translation)
[![Documentation](https://img.shields.io/badge/📖-Documentation-green)](https://pelikhan.github.io/action-continuous-translation/)

## ✨ Features

- 🚀 **الترجمة التدريجية** - تُترجم فقط المحتوى الذي تم تغييره، مما يوفر الوقت وتكاليف واجهة برمجة التطبيقات.
- 🎯 **تحليل AST الذكي** - يحافظ على هيكل وتنسيق Markdown.
- 🔄 **إدارة التخزين المؤقت** - تخزين مؤقت ذكي لتجنب الترجمة المتكررة.
- 📚 **جاهز لـ Astro Starlight** - دعم مدمج لمواقع الوثائق.
- 🌐 **دعم متعدد اللغات** - الترجمة إلى عدة لغات في وقت واحد.
- 🔍 **التحقق من الجودة** - التحقق التلقائي من جودة الترجمة.
- ⚡ **متكامل مع GitHub Actions** - تكامل سلس مع خط أنابيب CI/CD الخاص بك.
- 🤖 **مدعوم بالذكاء الاصطناعي** - استفد من GitHub Models للحصول على ترجمات عالية الجودة وسلسة.

## 📚 Resources

- 📖 [**الوثائق**](https://pelikhan.github.io/action-continuous-translation/) - دليل الإعداد الكامل ومرجع واجهة برمجة التطبيقات (تمت ترجمته أيضًا بواسطة هذا الإجراء - انظر [لوحة تحكم الترجمة](https://pelikhan.github.io/action-continuous-translation/dashboard/))
- ✍️ [**المقالة**](https://microsoft.github.io/genaiscript/blog/continuous-translations/) - تحليل معمق للتكنولوجيا.
- 🌐 **الترجمات**: [English](./README.md) | [Français](./README.fr.md) | [Español](./README.es.md) | [Portuguese (Brazil)](./README.pt-br.md) | [العربية](./README.ar.md)

## 🔧 How It Works

يستفيد هذا الإجراء من [GenAIScript](https://microsoft.github.io/genaiscript/) لتحليل وترجمة وثائق Markdown بذكاء. إليك السحر الذي يحدث خلف الكواليس:

1. **📄 التحليل** - تحويل Markdown إلى AST (شجرة البنية المجردة).
2. **🔍 التحليل** - التعرف على المحتوى الذي يحتاج إلى ترجمة مقابل الترجمات الموجودة.
3. **🤖 الترجمة** - استخدام الذكاء الاصطناعي لإنتاج ترجمات عالية الجودة.
4. **✅ التحقق** - ضمان جودة الترجمة ودمجها في الوثيقة.
5. **💾 التخزين المؤقت** - حفظ الترجمات للتحديثات التراكمية المستقبلية.
6. **📝 الالتزام** - الالتزام بالتغييرات تلقائيًا في المستودع الخاص بك.

## ⚙️ Configuration

### 📝 Basic Settings

| المُعامل            | الوصف                                                         | القيمة الافتراضية                              |
| ------------------- | ------------------------------------------------------------- | ---------------------------------------------- |
| `lang`              | اللغة (أو اللغات) المستهدفة للترجمة (أكواد ISO مفصولة بفاصلة) | `fr`                                           |
| `source`            | اللغة المصدر (كود ISO)                                        | `en`                                           |
| `files`             | الملفات التي سيتم ترجمتها (مفصولة بفاصلة منقوطة)              | `README.md`                                    |
| `instructions`      | تعليمات ترجمة مخصصة                                           | -                                              |
| `instructions_file` | مسار الملف الذي يحتوي على تعليمات الترجمة                     | -                                              |
| `glossary_file`     | مسار الملف الذي يحتوي على مصطلحات القاموس                     | -                                              |
| `translations_dir`  | المجلد لتخزين الترجمات                                        | `translations`                                 |
| `filename_template` | قالب Jinja لإنشاء مسار الملف المترجم                          | `{{dirname}}/{{basename}}.{{lang}}{{extname}}` |

### الحدود

| المُعامل                 | الوصف                                                                  | القيمة الافتراضية |
| ------------------------ | ---------------------------------------------------------------------- | ----------------- |
| `max_translation_tokens` | الحد الأقصى من الرموز المتاحة لاستدعاء LLM الترجمة (لتجنب قيود المعدل) | `8000`            |
| `max_validation_tokens`  | الحد الأقصى من الرموز المتاحة لاستدعاء LLM التحقق (لتجنب قيود المعدل)  | `2000`            |

### 🌟 Astro Starlight Integration

| المُعامل         | الوصف                                    | مطلوب            |
| ---------------- | ---------------------------------------- | ---------------- |
| `starlight_dir`  | المجلد الجذري لوثائق Astro Starlight     | فقط لـ Starlight |
| `starlight_base` | الاسم المُستعار الأساسي لوثائق Starlight | اختياري          |

### 🔧 Diagnostics & Debugging

| المُعامل | الوصف                                                                                                           | القيمة الافتراضية |
| -------- | --------------------------------------------------------------------------------------------------------------- | ----------------- |
| `debug`  | تمكين تسجيل تصحيح الأخطاء[تعرف على المزيد](https://microsoft.github.io/genaiscript/reference/scripts/logging/)) | `false`           |

### 🤖 AI Provider Configuration

#### GitHub Models (Recommended)

| المُعامل       | الوصف                                                                                                                                                                                          | القيمة الافتراضية             |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `github_token` | رمز GitHub مع إذن \`models: read\` `models: read`إذن (models: read) (دليل الإعداد)[دليل الإعداد](https://microsoft.github.io/genaiscript/reference/github-actions/#github-models-permissions)) | `${{ secrets.GITHUB_TOKEN }}` |

#### OpenAI

| المُعامل          | الوصف                        | القيمة الافتراضية               |
| ----------------- | ---------------------------- | ------------------------------- |
| `openai_api_key`  | مفتاح OpenAI API             | `${{ secrets.OPENAI_API_KEY }}` |
| `openai_api_base` | عنوان URL الأساسي OpenAI API | `${{ env.OPENAI_API_BASE }}`    |

#### Azure OpenAI

| المُعامل                       | الوصف                                                    | القيمة الافتراضية                         |
| ------------------------------ | -------------------------------------------------------- | ----------------------------------------- |
| `azure_openai_api_endpoint`    | نقطة النهاية لـ Azure OpenAI                             | `${{ env.AZURE_OPENAI_API_ENDPOINT }}`    |
| `azure_openai_api_key`         | مفتاح Azure OpenAI API (غير مطلوب مع Microsoft Entra ID) | `${{ secrets.AZURE_OPENAI_API_KEY }}`     |
| `azure_openai_subscription_id` | معرّف الاشتراك لقائمة النشر (خاص بـ Entra ID فقط)        | `${{ env.AZURE_OPENAI_SUBSCRIPTION_ID }}` |
| `azure_openai_api_version`     | إصدار واجهة برمجة التطبيقات Azure OpenAI                 | `${{ env.AZURE_OPENAI_API_VERSION }}`     |
| `azure_openai_api_credentials` | نوع بيانات الاعتماد الخاصة بـ API                        | `${{ env.AZURE_OPENAI_API_CREDENTIALS }}` |

#### Model Alias

| المُعامل      | الوصف                                 | القيمة الافتراضية |
| ------------- | ------------------------------------- | ----------------- |
| `model_alias` | سلسلة تشبه YAML `alias: modelid`أزواج |                   |

راجع وثائق [النماذج](/action-continuous-translation/models/) لمزيد من التفاصيل.

## 📤 Outputs

| المخرجات | الوصف                              |
| -------- | ---------------------------------- |
| `text`   | النص الذي تم إنتاجه بواسطة الترجمة |

## 🚀 Quick Start

### Simple Setup

أضف هذه الخطوة إلى ملف سير عمل GitHub Actions الخاص بك لترجمة ملف README إلى الفرنسية والإسبانية:

```yaml
uses: pelikhan/action-continuous-translation@v0
with:
  github_token: ${{ secrets.GITHUB_TOKEN }}
  lang: fr,es
```

### Complete Workflow Example

احفظ هذا الملف في الدليل `.github/workflows/` باسم `continuous-translation.yml`:

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
          file_pattern: "**.md* translations/**"
          commit_message: "[cai] translated docs"
          commit_user_name: "genaiscript"
```

<div align="center">

**Made with ❤️ using [GenAIScript](https://microsoft.github.io/genaiscript/)**

</div>
