import { LaCrypta } from "../src/index";
import { PropPath } from "../src/helpers/types";
import { isNotEmptyStringArray, isString } from "../src/helpers/functions";
import { ivSeeds, keys, object, Person, plaintexts } from "./helpers/mock";
import { dotProp, generateKey } from "./helpers/functions";

describe("cipher and decipher", () => {
  test("string", () => {
    keys.forEach((key) => {
      const keyBuffer = generateKey(key);
      ivSeeds.forEach((ivSeed) => {
        const laCrypta: LaCrypta = new LaCrypta(keyBuffer, ivSeed);
        plaintexts.forEach((plaintext) => {
          const ciphered = laCrypta.cipherValue(plaintext);
          expect(ciphered).not.toBe(plaintext);
          const deciphered = laCrypta.decipherValue(ciphered);
          expect(deciphered).toBe(plaintext);
        });
      });
    });
  });
  test("string array", () => {
    keys.forEach((key) => {
      const keyBuffer = generateKey(key);
      ivSeeds.forEach((ivSeed) => {
        const laCrypta: LaCrypta = new LaCrypta(keyBuffer, ivSeed);
        const plaintextsCopy = [...plaintexts];
        const ciphered = laCrypta.cipherArray(plaintextsCopy);
        expect(ciphered).not.toEqual(plaintexts);
        const deciphered = laCrypta.decipherArray(ciphered);
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
      const keyBuffer = generateKey(key);
      ivSeeds.forEach((ivSeed) => {
        const laCrypta: LaCrypta = new LaCrypta(keyBuffer, ivSeed);
        const objectCopy = JSON.parse(JSON.stringify(object)) as Person;
        laCrypta.cipherObject(props, objectCopy);
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
        laCrypta.decipherObject(props, objectCopy);
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
