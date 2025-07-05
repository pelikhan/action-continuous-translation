// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightLinksValidator from "starlight-links-validator";

// Import translation strings
import configStrings from "./config-strings.json" with { type: "json" };
import configStringsFr from "./config-strings.fr.json" with { type: "json" };
import configStringsEs from "./config-strings.es.json" with { type: "json" };

// Helper function to get localized string
function getLocalizedString(key, locale = 'en') {
  const translations = {
    en: configStrings,
    fr: configStringsFr,
    es: configStringsEs,
  };
  return translations[locale]?.[key] || configStrings[key];
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
      // Multi-lingual title using translation files
      title: {
        root: getLocalizedString('title', 'en'),
        fr: getLocalizedString('title', 'fr'),
        es: getLocalizedString('title', 'es'),
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/pelikhan/action-continuous-translation",
        },
      ],
      defaultLocale: "root",
      locales: {
        root: {
          label: "English",
          lang: "en",
        },
        fr: {
          label: "French",
          lang: "fr",
        },
        es: {
          label: "Spanish",
          lang: "es",
        },
      },
      sidebar: [
        {
          label: getLocalizedString('sidebar.reference', 'en'),
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