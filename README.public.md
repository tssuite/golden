<!--
@license
Copyright (c) 2025 tssuite

Use of this source code is governed by terms that can be
found in the LICENSE file in the root of this package.
-->

# @tssuite/golden

## `writeGolden`

Writes a JSON-serializable value to a golden file for snapshot testing.

- **Usage:**
  ```ts
  await writeGolden('path/to/file.json', value);
  ```
- **Parameters:**
  - `filePath`: Path to the golden file (should end with `.json`).
  - `value`: Any JSON-serializable value to write.

This method is typically used to store expected output for tests, making it easy
to compare actual results against the golden file.

## `writeBinaryGolden`

Writes binary data to a golden file for snapshot testing.

- **Usage:**
  ```ts
  await writeBinaryGolden('path/to/file.dat', buffer);
  ```
- **Parameters:**
  - `filePath`: Path to the golden file (should end with `.dat`).
  - `buffer`: A `Buffer` or `Uint8Array` containing binary data.

Use this method for tests that require binary output comparison, such as images
or custom binary formats.

---

### Golden File Location

Golden files are written to:

```
test/golden/<some-path-matching-test-file-path>/<filename>.json
```

The directory structure under `test/golden/` mirrors the path of the test file
that creates the golden file. This makes it easy to locate and manage golden
files for each test.

**Example:**

If your test file is located at:

```
test/myfeature/golden.spec.ts
```

and you call:

```ts
await writeGolden('output.json', value);
```

the golden file will be written to:

```
test/golden/myfeature/golden/output.json
```
