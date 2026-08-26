/**
 * AES-256-CBC helpers shared with the tcctechweb frontend — the backend is the same
 * service (different DB), so the key/IV handling and the hex-ciphertext wire format
 * must match exactly or the API rejects the request / the response won't decode.
 *
 * Ported from tcctechweb's `src/utils/encrypt-decrypt-data.ts`. Only the three helpers
 * this site actually needs are included; add more from there if a new endpoint requires them.
 */

import CryptoJS from "crypto-js";

const getKeyAndIv = () => {
  const keyValue: string = process.env.NEXT_PUBLIC_ENCRYPT_DECRYPT_KEY ?? "";
  const ivValue: string = process.env.NEXT_PUBLIC_ENCRYPT_DECRYPT_IV ?? "";
  return {
    key: CryptoJS.enc.Hex.parse(keyValue),
    iv: CryptoJS.enc.Hex.parse(ivValue),
  };
};

const normalizeHexCiphertext = (text: string): string => text.replace(/\s/g, "").trim();

/** Encrypt a request body. Returns hex ciphertext. */
export const encryptResponseData = (text: unknown): string => {
  const { key, iv } = getKeyAndIv();
  const cipher = CryptoJS.AES.encrypt(JSON.stringify(text), key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return cipher.ciphertext.toString(CryptoJS.enc.Hex);
};

/** Decrypt a hex-ciphertext response body back to its JSON string. */
export const decryptRequestData = (text: string): string => {
  const { key, iv } = getKeyAndIv();
  const normalizedHex = normalizeHexCiphertext(text);

  if (!normalizedHex || normalizedHex.length % 2 !== 0) {
    return "";
  }

  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Hex.parse(normalizedHex),
  });

  const bytes = CryptoJS.AES.decrypt(cipherParams, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  if (!bytes.sigBytes) {
    return "";
  }

  try {
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return "";
  }
};

/** Every request carries an encrypted `company_key` query param. */
export const encryptCompanyKey = (company_key: string): string => {
  const { key, iv } = getKeyAndIv();
  const cipher = CryptoJS.AES.encrypt(company_key, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return cipher.ciphertext.toString(CryptoJS.enc.Hex);
};
