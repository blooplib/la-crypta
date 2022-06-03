import {
  cipherArray,
  cipherValue,
  decipherArray,
  decipherValue,
} from "../src/index";
import { createHash } from "crypto";

const generateKey = (phrase: string): Buffer =>
  createHash("sha256").update(phrase).digest();

const keys = [
  "Gabriel Spranger 😳🕶",
  "Macarena Oyague 👩🏻🐇",
  "BloopBlip",
  "BloopLib",
  "➩ The best crypto lib",
  "Machu wayna",
  "Peruvian",
  "漢字汉字",
  "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ",
  "፩፪፫፬፭፮፯፰፱፲፳፴፵፶፷፸፹፺፻",
  "ΑΒΓΔΕϚΖΗΘΙΚΛΜΝΞΟΠϘΡ",
  "ッぜでべょ゜サブポ",
  "a",
];

const plaintexts = [
  "A zero-dependency Node.js library that let's you encrypt/decrypt specific fields on any object. It's purpose is to help with client-side encryption.",
  "1999912281923",
  "➩ The best crypto lib 🫦",
  "o",
  "我们有两种生活，当我们意识到我们只有一种生活时，第二种生活就开始了。",
  "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ",
  "፩፪፫፬፭፮፯፰፱፲፳፴፵፶፷፸፹፺፻",
  "ΑΒΓΔΕϚΖΗΘΙΚΛΜΝΞΟΠϘΡ",
  "ッぜでべょ゜サブポ",
  "a 😼",
  "Sí",
  "ولا تخلط الحق بالباطل ولا تخفي الحق وأنت تعلم",
  "int main(){\n\treturn 0;\n}",
  "se você quer ser bem sucedido, você deve respeitar uma regra - nunca minta para si mesmo",
];

const ivSeeds = [
  "Wiiiiiiiii 🐇",
  "2 de junio del 2022",
  "ይህን ካነበብክ የማወቅ ጉጉት አለህ",
  "\nhola",
  "፩፪፫፬፭፮፯፰፱፲፳፴፵፶፷፸፹፺፻",
  "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ",
  "神隠し",
  "Pulp Fiction",
  "m",
];

describe("cipher and decipher", () => {
  test("string", () => {
    keys.forEach((key) => {
      ivSeeds.forEach((ivSeed) => {
        plaintexts.forEach((plaintext) => {
          const ciphered = cipherValue(generateKey(key), ivSeed, plaintext);
          const deciphered = decipherValue(generateKey(key), ivSeed, ciphered);
          expect(deciphered).toBe(plaintext);
        });
      });
    });
  });
  test("string array", () => {
    keys.forEach((key) => {
      ivSeeds.forEach((ivSeed) => {
        const plaintextsCopy = [...plaintexts];
        const ciphered = cipherArray(generateKey(key), ivSeed, plaintextsCopy);
        const deciphered = decipherArray(generateKey(key), ivSeed, ciphered);
        expect(deciphered).toEqual(plaintexts);
      });
    });
  });
});
