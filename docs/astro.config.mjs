// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightLinksValidator from "starlight-links-validator";
import { title } from "./resources.json" assert { type: "json" };

// https://astro.build/config
export default defineConfig({
  site: "https://pelikhan.github.io",
  base: "/action-continuous-translation",
  integrations: [
    starlight({
      plugins: [
        starlightLinksValidator({
          errorOnRelativeLinks: false,
          errorOnInconsistentLocale: true,
        }),
      ],
      title,
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/pelikhan/action-continuous-translation",
        },
        {
          icon: "discord",
          label: "Discord",
          href: "https://discord.gg/QFXXBkNZ",
        }
      ],
      defaultLocale: "root",
      locales: {
        root: {
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
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
        {
          label: "Resources",
          autogenerate: { directory: "resources" },
        },
      ],
      components: {
        PageTitle: "./src/components/PageTitle.astro",
        Hero: "./src/components/Hero.astro",
      },
    }),
  ],
});
