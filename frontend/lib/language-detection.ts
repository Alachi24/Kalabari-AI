// Language metadata helpers for the UI.
//
// Actual language *detection* and *translation* are performed by the backend AI
// gateway (see `app/api/detect-language` and `app/api/translate`). This module only
// maps language codes to display names for the picker.

export const LANGUAGE_MAP: Record<string, { name: string; nativeName: string }> = {
  en: { name: 'English', nativeName: 'English' },
  es: { name: 'Spanish', nativeName: 'Español' },
  fr: { name: 'French', nativeName: 'Français' },
  ha: { name: 'Hausa', nativeName: 'Hausa' },
  yo: { name: 'Yoruba', nativeName: 'Yorùbá' },
  ig: { name: 'Igbo', nativeName: 'Igbo' },
  pcm: { name: 'Nigerian Pidgin', nativeName: 'Naijá' },
  ff: { name: 'Fulfulde', nativeName: 'Fulfulde' },
  kr: { name: 'Kanuri', nativeName: 'Kanuri' },
  ibb: { name: 'Ibibio', nativeName: 'Ibibio' },
  tiv: { name: 'Tiv', nativeName: 'Tiv' },
  bin: { name: 'Edo', nativeName: 'Ẹ̀dó' },
  urh: { name: 'Urhobo', nativeName: 'Urhobo' },
  ijc: { name: 'Izon (Ijaw)', nativeName: 'Izon' },
  nup: { name: 'Nupe', nativeName: 'Nupe' },
  igb: { name: 'Ebira', nativeName: 'Ebira' },
  its: { name: 'Itsekiri', nativeName: 'Itsekiri' },
  ijn: { name: 'Kalabari', nativeName: 'Kalabari' },
};

/** Get a human-readable language name from its code. */
export function getLanguageName(code: string): string {
  return LANGUAGE_MAP[code]?.name || code.toUpperCase();
}

/** Get all languages available in the picker. */
export function getAvailableLanguages(): Array<{
  code: string;
  name: string;
  nativeName: string;
}> {
  return Object.entries(LANGUAGE_MAP).map(([code, { name, nativeName }]) => ({
    code,
    name,
    nativeName,
  }));
}
