# 🌍 الترجمة المستمرة

> **الترجمة التلقائية لوثائق Markdown الخاصة بك باستخدام الذكاء الاصطناعي** - مدعومة بواسطة [GitHub Models](https://github.com/models) مع دعم مدمج لـ [Astro Starlight](https://starlight.astro.build/) !

[![إجراء GitHub](https://img.shields.io/badge/GitHub-Action-blue?logo=github)](https://github.com/marketplace/actions/continuous-translation)
[![الوثائق](https://img.shields.io/badge/📖-Documentation-green)](https://pelikhan.github.io/action-continuous-translation/)

## ✨ الميزات

* 🚀 **الترجمة التدريجية** - تُترجم فقط المحتوى الذي تم تغييره، مما يوفر الوقت وتكاليف واجهة برمجة التطبيقات.
* 🎯 **تحليل AST الذكي** - يحافظ على هيكل وتنسيق Markdown.
* 🔄 **إدارة التخزين المؤقت** - تخزين مؤقت ذكي لتجنب الترجمة المتكررة.
* 📚 **جاهز لـ Astro Starlight** - دعم مدمج لمواقع الوثائق.
* 🌐 **دعم متعدد اللغات** - الترجمة إلى عدة لغات في وقت واحد.
* 🔍 **التحقق من الجودة** - التحقق التلقائي من جودة الترجمة.
* ⚡ **متكامل مع GitHub Actions** - تكامل سلس مع خط أنابيب CI/CD الخاص بك.

## 📚 المصادر

* 📖 [**الوثائق**](https://pelikhan.github.io/action-continuous-translation/) - دليل الإعداد الكامل ومرجع API.
* ✍️ [**المقالة**](https://microsoft.github.io/genaiscript/blog/continuous-translations/) - تحليل معمق للتكنولوجيا.
* 🌐 **الترجمات**: [Français](./README.fr.md) | [Español](./README.es.md) | [العربية](./README.ar.md)

## 🔧 كيف تعمل

يستفيد هذا الإجراء من [GenAIScript](https://microsoft.github.io/genaiscript/) لتحليل وترجمة وثائق Markdown بذكاء. إليك السحر الذي يحدث خلف الكواليس:

1. **📄 التحليل** - تحويل Markdown إلى AST (شجرة البنية المجردة).
2. **🔍 التحليل** - التعرف على المحتوى الذي يحتاج إلى ترجمة مقابل الترجمات الموجودة.
3. **🤖 الترجمة** - استخدام الذكاء الاصطناعي لإنتاج ترجمات عالية الجودة.
4. **✅ التحقق** - ضمان جودة الترجمة ودمجها في الوثيقة.
5. **💾 التخزين المؤقت** - حفظ الترجمات للتحديثات التراكمية المستقبلية.
6. **📝 الالتزام** - الالتزام بالتغييرات تلقائيًا في المستودع الخاص بك.

## ⚙️ الإعداد

### 📝 الإعدادات الأساسية

| المُعامل            | الوصف                                                           | القيمة الافتراضية |
| ------------------- | --------------------------------------------------------------- | ----------------- |
| `lang`              | Target language(s) for translation (ISO codes, comma-separated) | `fr`              |
| `source`            | Source language (ISO code)                                      | `en`              |
| `files`             | Files to translate (semicolon-separated)                        | `README.md`       |
| `instructions`      | تعليمات ترجمة مخصصة                                             | -                 |
| `instructions_file` | مسار الملف الذي يحتوي على تعليمات الترجمة                       | -                 |

### 🌟 تكامل Astro Starlight

| المُعامل         | الوصف                                    | مطلوب            |
| ---------------- | ---------------------------------------- | ---------------- |
| `starlight_dir`  | المجلد الجذري لوثائق Astro Starlight     | فقط لـ Starlight |
| `starlight_base` | الاسم المُستعار الأساسي لوثائق Starlight | اختياري          |

### 🔧 التشخيص واستكشاف الأخطاء

| المُعامل | الوصف                                                                                                        | القيمة الافتراضية |
| -------- | ------------------------------------------------------------------------------------------------------------ | ----------------- |
| `force`  | إجبار الترجمة حتى إذا كانت مترجمة بالفعل                                                                     | `false`           |
| `debug`  | Enable debug logging ([تعرف على المزيد](https://microsoft.github.io/genaiscript/reference/scripts/logging/)) | `false`           |

### 🤖 إعداد مقدم الخدمة الخاص بالذكاء الاصطناعي

#### نماذج GitHub (موصى بها)

| المُعامل       | الوصف                                                                                                                                                                      | القيمة الافتراضية             |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `github_token` | رمز GitHub مع إذن \`models: read\` `models: read` permission ([دليل الإعداد](https://microsoft.github.io/genaiscript/reference/github-actions/#github-models-permissions)) | `${{ secrets.GITHUB_TOKEN }}` |

#### OpenAI

| المُعامل          | الوصف                        | القيمة الافتراضية               |
| ----------------- | ---------------------------- | ------------------------------- |
| `openai_api_key`  | مفتاح OpenAI API             | `${{ secrets.OPENAI_API_KEY }}` |
| `openai_api_base` | عنوان URL الأساسي OpenAI API | `${{ env.OPENAI_API_BASE }}`    |

#### Azure OpenAI

| المُعامل                       | الوصف                                                    | القيمة الافتراضية                         |
| ------------------------------ | -------------------------------------------------------- | ----------------------------------------- |
| `azure_openai_api_endpoint`    | نقطة النهاية لـ Azure OpenAI                             | `${{ env.AZURE_OPENAI_API_ENDPOINT }}`    |
| `azure_openai_api_key`         | Azure OpenAI API key (not needed for Microsoft Entra ID) | `${{ secrets.AZURE_OPENAI_API_KEY }}`     |
| `azure_openai_subscription_id` | Subscription ID for deployment listing (Entra ID only)   | `${{ env.AZURE_OPENAI_SUBSCRIPTION_ID }}` |
| `azure_openai_api_version`     | إصدار واجهة برمجة التطبيقات Azure OpenAI                 | `${{ env.AZURE_OPENAI_API_VERSION }}`     |
| `azure_openai_api_credentials` | نوع بيانات الاعتماد الخاصة بـ API                        | `${{ env.AZURE_OPENAI_API_CREDENTIALS }}` |

## 📤 المخرجات

| المخرجات | الوصف                              |
| -------- | ---------------------------------- |
| `text`   | النص الذي تم إنتاجه بواسطة الترجمة |

## 🚀 الانطلاقة السريعة

### الإعداد البسيط

أضف هذه الخطوة إلى ملف سير عمل GitHub Actions الخاص بك لترجمة ملف README إلى الفرنسية والإسبانية:

```yaml
uses: pelikhan/action-continuous-translation@v0
with:
  github_token: ${{ secrets.GITHUB_TOKEN }}
  lang: fr,es
```

### مثال على سير عمل كامل

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
          file_pattern: "translations/*.json **.md* translations/*.json"
          commit_message: "[cai] translated docs"
          commit_user_name: "genaiscript"
```

## 🛠️ التطوير والمساهمة

### هيكل المشروع

يتم توليد هذا الإجراء تلقائيًا بواسطة GenAIScript من بيانات وصفية للبرنامج النصي، مما يضمن الاتساق والموثوقية. نوصي بتحديث البيانات الوصفية للنص بدلاً من تعديل ملفات الإجراء مباشرة.

**المكونات التي يتم توليدها تلقائيًا:**

* ⚙️ مدخلات الإجراء → يتم استنتاجها من معلمات النصوص
* 📤 مخرجات الإجراء → يتم استنتاجها من مخطط مخرجات النص
* 📝 وصف الإجراء → وصف النص
* 📖 وصف README → وصف النص
* 🎨 العلامة التجارية للإجراء → العلامة التجارية للنص

### أوامر التطوير 🧞

يتم تشغيل جميع الأوامر من جذر المشروع:

| الأمر                | الإجراء                                   | حالة الاستخدام       |
| :------------------- | :---------------------------------------- | :------------------- |
| `npm install`        | تثبيت التبعيات                            | الإعداد الأولي       |
| `npm run dev`        | اختبار الترجمة لـ `README.md`إلى الفرنسية | اختبار سريع          |
| `npm run dev:astro`  | ترجمة وثائق Astro الكاملة                 | ترجمة كاملة للوثائق  |
| `npm run typecheck`  | التحقق من صحة ملفات TypeScript            | جودة الشيفرات        |
| `npm run lint`       | تنسيق الشيفرات باستخدام Prettier          | أسلوب الشيفرات       |
| `npm run configure`  | إعادة توليد `action.yml`                  | بعد تغييرات المعلمات |
| `npm run upgrade`    | تحديث التبعيات                            | الصيانة              |
| `npm run test:genai` | تشغيل مجموعة الاختبارات المحلية           | ضمان الجودة          |

***

<div align="center">

**مصنوع بحب باستخدام [GenAIScript](https://microsoft.github.io/genaiscript/)**

[📖 الوثائق](https://pelikhan.github.io/action-continuous-translation/) • [🐛 الأخطاء](https://github.com/pelikhan/action-continuous-translation/issues) • [💡 المناقشات](https://github.com/pelikhan/action-continuous-translation/discussions)

</div>
