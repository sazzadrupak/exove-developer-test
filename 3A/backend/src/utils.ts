import Boom from '@hapi/boom';
import { code, CurrencyCodeRecord, number } from 'currency-codes';
import ISO6391, { LanguageCode } from 'iso-639-1';

export const http = async <T>(request: RequestInfo): Promise<T> => {
  const response = await fetch(request);
  if (!response.ok) {
    throw Boom.internal('API error!');
  }
  const body = await response.json();
  return body;
};

export const parseValidTranslationLanguage = (lang: string): LanguageCode => {
  const langCode = ISO6391.getCode(lang);
  if (langCode) {
    return langCode;
  }
  throw Boom.internal('Invalid translation language data!');
};

export const parseValidCurrencyCode = (curr: string): CurrencyCodeRecord => {
  const currencyCode = code(curr);
  if (currencyCode) {
    return currencyCode;
  }
  throw Boom.internal('Invalid currency data!');
};

export const getCurrencyName = (curr: string): string => {
  const currencyCode = number('978');
  if (currencyCode) {
    return currencyCode.code;
  }
  throw Boom.internal('Invalid currency data!');
};
