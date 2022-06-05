import crypto from "crypto";
import {
  isNotEmptyObjectArray,
  isNotEmptyStringArray,
  isString,
} from "./helpers/functions";

export const cipherValue = (
  key: Buffer,
  ivSeed: string,
  value: string
): string => {
  const resizedIV = Buffer.allocUnsafe(16);
  const iv = crypto.createHash("sha256").update(ivSeed).digest();
  iv.copy(resizedIV);
  const cipher = crypto.createCipheriv("aes256", key, resizedIV);
  const ciphertextChunks = [];
  ciphertextChunks.push(cipher.update(value, "utf8", "hex"));
  ciphertextChunks.push(cipher.final("hex"));
  return ciphertextChunks.join("");
};

export const cipherArray = (
  key: Buffer,
  ivSeed: string,
  values: string[]
): string[] => {
  values.forEach((element: string, idx: number) => {
    values[idx] = cipherValue(key, ivSeed, element);
  });
  return values;
};

export const decipherValue = (
  key: Buffer,
  ivSeed: string,
  value: string
): string => {
  const resizedIV = Buffer.allocUnsafe(16);
  const iv = crypto.createHash("sha256").update(ivSeed).digest();
  iv.copy(resizedIV);
  const decipher = crypto.createDecipheriv("aes256", key, resizedIV);
  const plaintextChunks = [];
  plaintextChunks.push(decipher.update(value, "hex", "utf8"));
  plaintextChunks.push(decipher.final("utf8"));
  return plaintextChunks.join("");
};

export const decipherArray = (
  key: Buffer,
  ivSeed: string,
  values: string[]
): string[] => {
  values.forEach((element: string, idx: number) => {
    values[idx] = decipherValue(key, ivSeed, element);
  });
  return values;
};

export const cipherTerminal = (
  key: Buffer,
  ivSeed: string,
  values: string | string[]
): string | string[] => {
  if (isString(values)) {
    return cipherValue(key, ivSeed, values as string);
  } else if (isNotEmptyStringArray(values)) {
    return cipherArray(key, ivSeed, values as string[]);
  }
  return values;
};

export const decipherTerminal = (
  key: Buffer,
  ivSeed: string,
  values: string | string[]
): string | string[] => {
  if (isString(values)) {
    return decipherValue(key, ivSeed, values as string);
  } else if (isNotEmptyStringArray(values)) {
    return decipherArray(key, ivSeed, values as string[]);
  }
  return values;
};

export const cryptoProp = (
  path: string,
  document: Record<string, any>,
  key: Buffer,
  ivSeed: string,
  terminalMode: typeof cipherTerminal & typeof decipherTerminal
): void => {
  const props = path.split(".");
  const propsSize = props.length;
  for (let i = 1; i < propsSize; i++) {
    document = document[props[i - 1]];
    if (document === undefined || document === null) {
      return;
    }
    if (isNotEmptyObjectArray(document)) {
      path = props.slice(i).join(".");
      document.forEach((element: Record<string, unknown>) =>
        cryptoProp(path, element, key, ivSeed, terminalMode)
      );
      return;
    }
  }
  const lastElement = props[propsSize - 1];
  document[lastElement] = terminalMode(key, ivSeed, document[lastElement]);
};
