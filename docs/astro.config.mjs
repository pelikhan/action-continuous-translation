// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightLinksValidator from "starlight-links-validator";

// Import translation strings with nested locale structure
import configStrings from "./config-strings.json" with { type: "json" };

// Helper function to get localized string from nested structure
function getLocalizedString(keyPath, locale = 'en') {
  const keys = keyPath.split('.');
  let value = configStrings;
  
  // Navigate through the nested structure
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return null;
    }
  }
  
  // If we have a locale object, return the requested locale or fallback to English
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value[locale] || value['en'] || null;
  }
  
  return value;
}

// https://astro.build/config
export default defineConfig({
  site: "https://microsoft.github.io",
  base: "/action-continuous-translation",
  integrations: [
    starlight({
      plugins: [
        starlightLinksValidator({
          errorOnRelativeLinks: false,
          errorOnInconsistentLocale: true,
        }),
      ],
      // Multi-lingual title using nested translation structure
      title: {
        en: getLocalizedString('title', 'en') || "Continuous Translation",
        fr: getLocalizedString('title', 'fr') || "Continuous Translation",
        es: getLocalizedString('title', 'es') || "Continuous Translation",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/pelikhan/action-continuous-translation",
        },
      ],
      defaultLocale: "en",
      locales: {
        en: {
          label: "English",
          lang: "en",
        },
        ar: {
          label: "Arabic",
          lang: "ar",
          dir: 'rtl',
        },
        fr: {
          label: "French",
          lang: "fr",
        },
        es: {
          label: "Spanish",
          lang: "es",
        },
        "pt-br": {
          label: "Portuguese (Brazil)",
          lang: "pt-BR",
        },
      },
      sidebar: [
        {
          label: getLocalizedString('sidebar.reference', 'en') || "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
      components: {
        PageTitle: "./src/components/PageTitle.astro",
        Hero: "./src/components/Hero.astro",
      },
    }),
  ],
});
