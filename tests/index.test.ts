import { cipherTerminal, cryptoObject, decipherTerminal } from "../src/index";
import { PropPath } from "../src/types/PropPath";
import { isNotEmptyStringArray, isString } from "../src/helpers/functions";
import { ivSeeds, keys, object, Person, plaintexts } from "./helpers/mock";
import { dotProp, generateKey } from "./helpers/functions";

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
        const objectCopy = JSON.parse(JSON.stringify(object)) as Person;
        cryptoObject(props, objectCopy, keyBuffer, ivSeed, cipherTerminal);
        props.forEach((prop) => {
          const propObject = dotProp(prop, object);
          const propObjectCopy = dotProp(prop, objectCopy);
          if (isNotEmptyStringArray(propObject)) {
            expect(propObject).not.toEqual(propObjectCopy);
          } else if (isString(propObject)) {
            expect(propObject).not.toBe(propObjectCopy);
          }
        });
        expect(objectCopy).not.toEqual(object);
        cryptoObject(props, objectCopy, keyBuffer, ivSeed, decipherTerminal);
        props.forEach((prop) => {
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
