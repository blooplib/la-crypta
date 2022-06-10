# La Crypta

A zero-dependency Node.js library that let's you encrypt/decrypt specific fields on any object. It's purpose is to help with client-side encryption.

- **Small**: aproximately only 8 kB.

- **Simple**: can only encrypt/decrypt `string` and `string[]` fields.

- **Flexible**: it allows you to encrypt/decrypt specific fields in any object regardless of how nested they are.

- **Fully-typed**: it shows you which fields can be encrypted/decrypted for a specific type in a _dotted path_ manner.

## **Usage**

### Instantiation

```typescript
import crypto from "crypto";
import { LaCrypta } from "la-crypta";

const key: Buffer = crypto.randomBytes(32);
const ivSeed: string = new Date().toISOString(); /* should be random to generate the iv */

const laCrypta = LaCrypta(key, ivSeed);
```

### Object

Let use the type `ExampleType`.

```typescript
type ExampleType = {
  prop1: string;
  nested: {
    prop2: number;
    prop3: string[];
    prop6: string;
  };
  nestedArray: {
    prop4: number[];
    prop5: string[];
  }[];
};
```

Now we instantiate the type. Notice that the encryptable/decryptable fields could be: `prop1`, `nested.prop3`, `nested.prop6` and `nesteArray.prop5`. That's because they are of type `string` and `string[]`.

```typescript
const obj: ExampleType = {
  prop1: "a",
  nested: {
    prop2: 1,
    prop3: ["a", "b", "c"],
    prop6: "b",
  },
  nestedArray: [
    {
      prop4: [1, 2, 3],
      prop5: ["q", "w", "e"],
    },
    {
      prop4: [4, 5, 6],
      prop5: ["r", "t", "y"],
    },
  ],
};
```

Now we can encrypt specific fields of `obj`. Notice that `obj` is modified **inplace**.

```typescript
laCrypta.cipherObject(["prop1", "nested.prop6", "nestedArray.prop5"], obj);

console.log(obj);
/*
{
  prop1: '<<encrypted text>>',
  nested: {
    prop2: 1,
    prop3: ['a', 'b', 'c'],
    prop6: '<<encrypted text>>',
  },
  nestedArray: [
    {
      prop4: [1, 2, 3],
      prop5: [
        '<<encrypted text>>',
        '<<encrypted text>>',
        '<<encrypted text>>'
      ],
    },
    {
      prop4: [4, 5, 6],
      prop5: [
        '<<encrypted text>>',
        '<<encrypted text>>',
        '<<encrypted text>>'
      ],
    },
  ],
}
*/
```

Finally, we can decrypt the properties we previously encrypted.

```typescript
laCrypta.decipherObject(["prop1", "nested.prop6", "nestedArray.prop5"], obj);

console.log(obj);
/*
{
  prop1: 'a',
  nested: {
    prop2: 1,
    prop3: ['a', 'b', 'c'],
    prop6: 'b',
  },
  nestedArray: [
    {
      prop4: [1, 2, 3],
      prop5: ['q', 'w', 'e'],
    },
    {
      prop4: [4, 5, 6],
      prop5: ['r', 't', 'y'],
    },
  ],
}
*/
```

### String array

We can also encrypt and decrypt a `string[]` by itself.

```typescript
const arr = ["one", "two", "three"];
const encrypted = laCrypta.cipherArray(arr);
// encrypted now is ['<<encrypted text>>', '<<encrypted text>>', '<<encrypted text>>']
const decrypted = laCrypta.decipherArray(encrypted);
// decrypted is equal to arr
```

### String

And encrypt and decrypt a `string` as well.

```typescript
const str = "hola";
const encrypted = laCrypta.cipherArray(arr);
// encrypted now is '<<encrypted text>>'
const decrypted = laCrypta.decipherArray(encrypted);
// decrypted is equal to str
```

## **API**

### Object

```typescript
cipherObject(fieldsToEncrypt: PropPath<T>[], document: T): T;
```

**Receives:**

- `fieldsToEncrypt`: an array of strings in which each string is a dotted path to an encryptable property in `document`.
- `document`: an object whose `fieldsToEncrypt` fields will be encrypted.

**Returns:**

- Nothing, because `document` is modified inplace.

```typescript
decipherObject(fieldsToDecrypt: PropPath<T>[], document: T): T;
```

**Receives:**

- `fieldsToDecrypt`: an array of strings in which each string is a dotted path to an decryptable property in `document`.
- `document`: an object whose `fieldsToDecrypt` fields will be decrypted.

**Returns:**

- Nothing, because `document` is modified inplace.

### String array

```typescript
cipherArray(values: string[]): string[];
```

**Receives:**

- `values`: an array of strings to encrypt.

**Returns:**

- `string[]`: `values` but with its contents encrypted.

```typescript
decipherArray(values: string[]): string[];
```

**Receives:**

- `values`: an array of strings to decrypt.

**Returns:**

- `string[]`: `values` but with its contests decrypted.

### String

```typescript
cipherValue(value: string): string;
```

**Receives:**

- `value`: a string to encrypt.

**Returns:**

- `value` but encrypted.

```typescript
decipherValue(value: string): string;
```

**Receives:**

- `value`: a string to decrypt.

**Returns:**

- `value` but decrypted.