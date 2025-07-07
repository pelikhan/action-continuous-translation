declare namespace App {
  type StarlightLocals = import('@astrojs/starlight').StarlightLocals;
  interface Locals extends StarlightLocals {}
}

declare namespace StarlightApp {
  type UIStrings = typeof import('./content/i18n/en.json');
  interface I18n extends UIStrings {}
}