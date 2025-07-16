const dbg = host.logger(`ct:models`);

export async function resolveModels(lang: string): Promise<LangConfiguration> {
  const config = LANGS[lang];
  if (!config)
    throw new Error(`Language configuration for "${lang}" not found.`);
  const res: LangConfiguration = {
    name: config.name,
    models: {},
  };
  // try to resolve user defined models
  for (const suffix of ["_" + lang.replace("-", "_").toLowerCase(), ""]) {
    if (!res.models.translation) {
      const alias = "translation" + suffix;
      dbg(`resolve alias %s`, alias);
      const info = await host.resolveLanguageModel(alias);
      if (info?.provider) {
        dbg(`translation alias %s: %o`, alias, info);
        res.models.translation = `${info.provider}:${info.model}`;
        res.alias = alias;
      }
    }
    if (!res.models.validation) {
      const alias = "validation" + suffix;
      dbg(`resolve alias %s`, alias);
      const info = await host.resolveLanguageModel(alias);
      if (info?.provider) {
        dbg(`validate alias %s: %o`, alias, info);
        res.models.validation = [`${info.provider}:${info.model}`];
        res.alias = alias;
      }
    }
  }

  // apply defaults if not found
  res.models.translation ??=
    config.models?.translation ?? DEFAULT_MODELS.translation;
  res.models.validation ??=
    config.models?.validation ?? DEFAULT_MODELS.validation;

  dbg(`resolved: %s -> %O`, lang, res.models);
  return res;
}

export interface LangConfiguration {
  name: string;
  alias?: string;
  models?: {
    translation?: string;
    validation?: string[];
  };
}

const DEFAULT_MODELS = {
  translation: "github:openai/gpt-4o",
  validation: ["github:openai/gpt-4o-mini", "github:openai/gpt-4o"],
} as Required<LangConfiguration["models"]>;

const LANGS = Object.freeze({
  en: { name: "English" },
  fr: { name: "French" },
  es: { name: "Spanish" },
  de: { name: "German" },
  it: { name: "Italian" },
  pt: { name: "Portuguese" },
  "pt-br": { name: "Brazilian Portuguese" },
  ru: { name: "Russian" },
  zh: { name: "Chinese" },
  ja: { name: "Japanese" },
  ko: { name: "Korean" },
  ar: {
    name: "Arabic",
    models: {
      translation: "github:openai/gpt-4o",
    },
  },
  hi: { name: "Hindi" },
  tr: { name: "Turkish" },
  nl: { name: "Dutch" },
  pl: { name: "Polish" },
  sv: { name: "Swedish" },
  no: { name: "Norwegian" },
  fi: { name: "Finnish" },
  da: { name: "Danish" },
  cs: { name: "Czech" },
  hu: { name: "Hungarian" },
  ro: { name: "Romanian" },
  th: { name: "Thai" },
  vi: { name: "Vietnamese" },
  id: { name: "Indonesian" },
  ms: { name: "Malay" },
  he: { name: "Hebrew" },
  bg: { name: "Bulgarian" },
  uk: { name: "Ukrainian" },
  el: { name: "Greek" },
  sk: { name: "Slovak" },
  sl: { name: "Slovenian" },
  hr: { name: "Croatian" },
} as Record<string, LangConfiguration>);
