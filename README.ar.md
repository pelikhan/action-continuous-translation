# الترجمة المستمرة

يستخدم هذا الإجراء ترجمة مستندات Markdown بشكل متزايد باستخدام [نماذج GitHub](https://github.com/models). دعم مدمج لـ [Astro Starlight](https://starlight.astro.build/)!

* [التوثيق](https://pelikhan.github.io/action-continuous-translation/)
* [منشور المدونة](https://microsoft.github.io/genaiscript/blog/continuous-translations/)
* [الفرنسية](./README.fr.md)
* [الإسبانية](./README.es.md)
* [العربية](./README.ar.md)

## كيف يعمل؟

يستخدم هذا الإجراء [GenAIScript](https://microsoft.github.io/genaiscript/) لتحليل وترجمة مستندات Markdown برمجيًا. تعمل عملية الترجمة على النحو التالي:

* تحليل ملف Markdown إلى شجرة AST (شجرة بناء الجملة المجردة)
* زيارة الشجرة والبحث عمّا إذا كانت هناك ترجمة موجودة، أو وضع علامة على العناصر التي تحتاج ترجمة
* تشغيل استدلال نموذج اللغة الكبير (LLM) لجمع الترجمات الجديدة
* إدخال الترجمات الجديدة في المستند والتحقق من الجودة
* حفظ الترجمات في ذاكرة التخزين المؤقت للملفات
* تسجيل التغييرات

## المدخلات

* `lang`: رمز ISO للغة الهدف للترجمة. (القيمة الافتراضية: `fr`)
* `source`: رمز ISO للغة المصدر للترجمة. (القيمة الافتراضية: `en`)
* `files`: الملفات المطلوب معالجتها، مفصولة بفواصل منقوطة. القيمة الافتراضية هي `README.md`.
* `instructions`: تعليمات إضافية لنموذج اللغة الكبير (LLM) لاستخدامها عند الترجمة.
* `instructions_file`: مسار إلى ملف يحتوي على تعليمات إضافية لـ LLM لاستخدامها عند الترجمة.
* `starlight_dir`: مجلد الجذر لتوثيق Astro Starlight. (يتم ضبطه فقط عند استخدام Starlight)
* `starlight_base`: الاسم الأساسي لوثائق Starlight. (اختياري، حتى عندما يتم استخدام Starlight)

### التشخيص

* `force`: فرض الترجمة حتى إذا تمت ترجمة الملف مسبقًا.
* `debug`: تمكين تسجيل التصحيح (<https://microsoft.github.io/genaiscript/reference/scripts/logging/>).

### إعدادات نموذج اللغة الكبير (LLM)

* `github_token`: رمز GitHub مع إذن `models: read` على الأقل (<https://microsoft.github.io/genaiscript/reference/github-actions/#github-models-permissions>). (القيمة الافتراضية: `${{ secrets.GITHUB_TOKEN }}`)

* `openai_api_key`: مفتاح API الخاص بـ OpenAI (القيمة الافتراضية: `${{ secrets.OPENAI_API_KEY }}`)

* `openai_api_base`: عنوان URL الأساسي لـ OpenAI API (القيمة الافتراضية: `${{ env.OPENAI_API_BASE }}`)

* `azure_openai_api_endpoint`: نقطة نهاية Azure لـ OpenAI. افتح المورد الخاص بـ OpenAI الخاص بك في بوابة Azure، ثم انتقل إلى "المفاتيح ونقاط النهاية"، وانسخ النقطة النهاية. (القيمة الافتراضية: `${{ env.AZURE_OPENAI_API_ENDPOINT }}`)

* `azure_openai_api_key`: مفتاح API الخاص بـ Azure OpenAI. \*\*لا تحتاج هذا إذا كنت تستخدم Microsoft Entra ID. (القيمة الافتراضية: `${{ secrets.AZURE_OPENAI_API_KEY }}`)

* `azure_openai_subscription_id`: رقم اشتراك Azure OpenAI لعرض النشر المتاح (Microsoft Entra فقط). (القيمة الافتراضية: `${{ env.AZURE_OPENAI_SUBSCRIPTION_ID }}`)

* `azure_openai_api_version`: إصدار API الخاص بـ Azure OpenAI. (القيمة الافتراضية: `${{ env.AZURE_OPENAI_API_VERSION }}`)

* `azure_openai_api_credentials`: نوع بيانات الاعتماد الخاصة بـ Azure OpenAI API. اتركها على "default" ما لم يكن لديك إعداد خاص في Azure. (القيمة الافتراضية: `${{ env.AZURE_OPENAI_API_CREDENTIALS }}`)

## المخرجات

* `text`: النص المترجم الناتج.

## الاستخدام

قم بإضافة ما يلي إلى الخطوة الخاصة بك في ملف تشغيل سير العمل:

```yaml
uses: pelikhan/action-continuous-translation@v0
with:
  github_token: ${{ secrets.GITHUB_TOKEN }}
  lang: fr,es
```

## مثال

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

## التطوير

تم إنشاء هذا الإجراء تلقائيًا بواسطة GenAIScript من بيانات تعريف البرنامج النصي. نوصي بتحديث بيانات تعريف البرنامج النصي بدلاً من تحرير ملفات الإجراء مباشرة.

* يتم استنتاج مدخلات الإجراء من معلمات البرنامج النصي
* يتم استنتاج مخرجات الإجراء من مخطط إخراج البرنامج النصي
* وصف الإجراء هو وصف البرنامج النصي
* وصف ملف README هو وصف البرنامج النصي
* تمييز الإجراء هو تمييز البرنامج النصي

## 🧞 الأوامر

يتم تشغيل جميع الأوامر من جذر المشروع، وذلك من خلال الطرفية:

| الأمر                | الإجراء                                                                     |
| :------------------- | :-------------------------------------------------------------------------- |
| `npm install`        | تثبيت التبعيات                                                              |
| `npm run dev`        | تشغيل اختبار الترجمة لـ `README.md`README.md `fr`                           |
| `npm run dev:astro`  | ترجمة جميع وثائق Astro                                                      |
| `npm run typecheck`  | فحص الأنواع لملفات TypeScript                                               |
| `npm run lint`       | تشغيل Prettier على جميع الملفات في المستودع                                 |
| `npm run configure`  | إعادة توليد `action.yml`\`action.yml\` عند تغيير المعلمات في البرنامج النصي |
| `npm run upgrade`    | تحديث التبعيات                                                              |
| `npm run test:genai` | مجموعة اختبار محلية                                                         |
