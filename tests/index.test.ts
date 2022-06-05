import { cipherTerminal, cryptoProp, decipherTerminal } from "../src/index";
import { createHash } from "crypto";
import { PropPath } from "../src/types/PropPath";
import {
  isNotEmptyObjectArray,
  isNotEmptyStringArray,
  isString,
} from "../src/helpers/types";

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

type Person = {
  name: string;
  pets: string[];
  age: number;
  education: {
    institution: string;
    major: string;
    classOf: number;
  };
  children: {
    name: string;
    hobbies: string[];
  }[];
};

const object: Person = {
  name: "Vida",
  pets: ["dog", "cat", "horse"],
  age: 25,
  education: {
    institution: "UTEC",
    major: "CS",
    classOf: 2023,
  },
  children: [
    {
      name: "Jesus",
      hobbies: ["sing", "basket"],
    },
    {
      name: "Rodrigo",
      hobbies: ["handcraft", "read"],
    },
  ],
};

const dotProp = (
  path: string,
  document: Record<string, any>
): string | string[] | undefined => {
  const props = path.split(".");
  const propsSize = props.length;
  for (let i = 1; i < propsSize; i++) {
    document = document[props[i - 1]];
    if (document === undefined || document === null) {
      return;
    }
    if (isNotEmptyObjectArray(document)) {
      path = props.slice(i).join(".");
      const terminals: string[] = [];
      document.forEach((element: Record<string, unknown>) => {
        const terminal = dotProp(path, element);
        if (isNotEmptyStringArray(terminal)) {
          terminals.push(...(terminal as string[]));
        } else {
          terminals.push(terminal as string);
        }
      });
      return terminals;
    }
  }

  const lastElement = props[propsSize - 1];
  return document[lastElement];
};

describe("cipher and decipher", () => {
  test("string", () => {
    keys.forEach((key) => {
      ivSeeds.forEach((ivSeed) => {
        plaintexts.forEach((plaintext) => {
          const keyBuffer = generateKey(key);
          const ciphered = cipherTerminal(keyBuffer, ivSeed, plaintext);
          expect(ciphered).not.toBe(plaintext);
          const deciphered = decipherTerminal(keyBuffer, ivSeed, ciphered);
          expect(deciphered).toBe(plaintext);
        });
      });
    });
  });
  test("string array", () => {
    keys.forEach((key) => {
      ivSeeds.forEach((ivSeed) => {
        const keyBuffer = generateKey(key);
        const plaintextsCopy = [...plaintexts];
        const ciphered = cipherTerminal(keyBuffer, ivSeed, plaintextsCopy);
        expect(ciphered).not.toEqual(plaintexts);
        const deciphered = decipherTerminal(keyBuffer, ivSeed, ciphered);
        expect(deciphered).toEqual(plaintexts);
      });
    });
  });
  test("object property", () => {
    const props: PropPath<Person>[] = [
      "name",
      "pets",
      "education.institution",
      "education.major",
      "children.name",
      "children.hobbies",
    ];
    keys.forEach((key) => {
      ivSeeds.forEach((ivSeed) => {
        const keyBuffer = generateKey(key);
        const objectCopy = JSON.parse(JSON.stringify(object));

        props.forEach((prop) => {
          cryptoProp(prop, objectCopy, keyBuffer, ivSeed, cipherTerminal);
          const propObject = dotProp(prop, object);
          const propObjectCopy = dotProp(prop, objectCopy);
          if (isNotEmptyStringArray(propObject)) {
            expect(propObject).not.toEqual(propObjectCopy);
          } else if (isString(propObject)) {
            expect(propObject).not.toBe(propObjectCopy);
          }
        });
        expect(objectCopy).not.toEqual(object);
        props.forEach((prop) => {
          cryptoProp(prop, objectCopy, keyBuffer, ivSeed, decipherTerminal);
          const propObject = dotProp(prop, object);
          const propObjectCopy = dotProp(prop, objectCopy);
          if (isNotEmptyStringArray(propObject)) {
            expect(propObject).toEqual(propObjectCopy);
          } else if (isString(propObject)) {
            expect(propObject).toBe(propObjectCopy);
          }
        });
        expect(objectCopy).toEqual(object);
      });
    });
  });
});
