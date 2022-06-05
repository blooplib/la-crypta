export const isString = (values: unknown) => typeof values === "string";

export const isNotEmptyStringArray = (values: unknown) =>
  Array.isArray(values) && values.length > 0 && typeof values[0] === "string";

export const isNotEmptyObjectArray = (document: unknown) =>
  Array.isArray(document) &&
  document.length > 0 &&
  document[0].constructor.name === "Object";
