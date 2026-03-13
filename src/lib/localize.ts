import type { Language } from './i18n';

/**
 * Returns the localized value of a scheme field.
 * When lang is 'hi', returns the Hindi column value if available, otherwise falls back to English.
 */
export function localizeScheme(scheme: any, field: string, lang: Language): string {
  if (lang === 'hi') {
    const hiValue = scheme[`${field}_hi`];
    if (hiValue) return hiValue;
  }
  return scheme[field] ?? '';
}

/**
 * Returns scheme_name based on language
 */
export function localizeSchemeName(scheme: any, lang: Language): string {
  return localizeScheme(scheme, 'scheme_name', lang);
}
