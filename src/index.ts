import crypto from "crypto";

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
