import { createHash } from "crypto";
import {
  isNotEmptyObjectArray,
  isNotEmptyStringArray,
} from "../../src/helpers/functions";

export const dotProp = (
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

export const generateKey = (phrase: string): Buffer =>
  createHash("sha256").update(phrase).digest();
