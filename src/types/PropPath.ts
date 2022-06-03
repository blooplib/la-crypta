export type PropPath<T, P extends string = ""> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown>
    ? PropPath<T[K], `${P}${K}.`> extends infer S
      ? `${S & string}`
      : never
    : T[K] extends string | string[]
    ? `${P}${K}`
    : T[K] extends Record<string, unknown>[]
    ? PropPath<T[K][number], `${P}${K}.`> extends infer S
      ? `${S & string}`
      : never
    : never;
}[keyof T & string];
