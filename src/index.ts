import crypto from "crypto";
import { CryptoMode } from "./helpers/enums";
import {
  isNotEmptyObjectArray,
  isNotEmptyStringArray,
  isString,
} from "./helpers/functions";
import { PropPath } from "./types/PropPath";

export class LaCrypta {
  private key: Buffer;
  private iv: Buffer;

  constructor(key: Buffer, ivSeed: string) {
    this.iv = Buffer.allocUnsafe(16);
    const ivCrypto = crypto.createHash("sha256").update(ivSeed).digest();
    ivCrypto.copy(this.iv);
    this.key = key;
  }

  public cipherValue(value: string): string {
    const cipher = crypto.createCipheriv("aes256", this.key, this.iv);
    const ciphertextChunks = [];
    ciphertextChunks.push(cipher.update(value, "utf8", "hex"));
    ciphertextChunks.push(cipher.final("hex"));
    return ciphertextChunks.join("");
  }

  public decipherValue(value: string): string {
    const decipher = crypto.createDecipheriv("aes256", this.key, this.iv);
    const plaintextChunks = [];
    plaintextChunks.push(decipher.update(value, "hex", "utf8"));
    plaintextChunks.push(decipher.final("utf8"));
    return plaintextChunks.join("");
  }

  public cipherArray(values: string[]): string[] {
    values.forEach((element: string, idx: number) => {
      values[idx] = this.cipherValue(element);
    });
    return values;
  }

  public decipherArray(values: string[]): string[] {
    values.forEach((element: string, idx: number) => {
      values[idx] = this.decipherValue(element);
    });
    return values;
  }

  public cipherObject<T extends Record<string, any>>(
    fieldsToEncrypt: PropPath<T>[],
    document: T
  ): T {
    return this.cryptoObject(fieldsToEncrypt, document, CryptoMode.ENCRYPT);
  }

  public decipherObject<T extends Record<string, any>>(
    fieldsToDecrypt: PropPath<T>[],
    document: T
  ): T {
    return this.cryptoObject(fieldsToDecrypt, document, CryptoMode.DECRYPT);
  }

  private cryptoTerminal(
    values: string | string[],
    mode: CryptoMode
  ): string | string[] {
    switch (mode) {
      case CryptoMode.ENCRYPT:
        if (isString(values)) {
          return this.cipherValue(values as string);
        } else if (isNotEmptyStringArray(values)) {
          return this.cipherArray(values as string[]);
        }
        return values;
      case CryptoMode.DECRYPT:
        if (isString(values)) {
          return this.decipherValue(values as string);
        } else if (isNotEmptyStringArray(values)) {
          return this.decipherArray(values as string[]);
        }
        return values;
    }
  }

  private cryptoProp(
    path: string,
    document: Record<string, any>,
    mode: CryptoMode
  ): void {
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
          this.cryptoProp(path, element, mode)
        );
        return;
      }
    }
    const lastElement = props[propsSize - 1];
    document[lastElement] = this.cryptoTerminal(document[lastElement], mode);
  }

  private cryptoObject<T extends Record<string, any>>(
    fieldsToEncrypt: PropPath<T>[],
    document: T,
    mode: CryptoMode
  ): T {
    fieldsToEncrypt.forEach((path) => {
      this.cryptoProp(path, document, mode);
    });
    return document;
  }
}
