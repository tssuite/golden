// @license
// Copyright (c) 2019 - 2024 Dr. Gabriel Gatzsche. All Rights Reserved.
//
// Use of this source code is governed by terms that can be
// found in the LICENSE file in the root of this package.

import { constants } from 'fs';
import { access, readFile } from 'fs/promises';
import { describe, expect, it } from 'vitest';

import { writeBinaryGolden, writeGolden } from '../src';

describe('writeGolden', () => {
  describe('writeGolden', () => {
    async function testGolden(
      fileName: string,
      contentIn: any,
      contentOutExpected: any,
    ) {
      await writeGolden(fileName, contentIn);

      const expectedPath = `test/goldens/golden/${fileName}`;
      await access(expectedPath, constants.F_OK);

      let contentOut: any;
      if (typeof contentOutExpected === 'string') {
        contentOut = await readFile(expectedPath, 'utf8');
      } else {
        contentOut = Array.from(await readFile(expectedPath));
      }

      expect(contentOut).toEqual(contentOutExpected);
    }

    it('writes json', async () => {
      await testGolden(
        'some_data.json',
        { some: 'data' },
        '{\n  "some": "data"\n}',
      );
    });

    it('writes numbers', async () => {
      await testGolden('numbers.json', 578, '578');
    });

    it('write strings', async () => {
      await testGolden('string.json', 'Some string', 'Some string');
    });

    it('writes booleans', async () => {
      await testGolden('numbers.json', true, 'true');
    });

    it('writes lists', async () => {
      await testGolden(
        'list.json',
        [true, false, 1, 'str', 1.0],
        '[\n' +
          '  true,\n' +
          '  false,\n' +
          '  1,\n' +
          '  "str",\n' +
          '  1\n' +
          ']',
      );
    });
  });

  describe('writeBinaryGolden', () => {
    it('writes binary data', async () => {
      const bytes = [0xde, 0xad, 0xbe, 0xef];
      await writeBinaryGolden('binary.dat', bytes);

      const expectedPath = 'test/goldens/golden/binary.dat';
      await access(expectedPath, constants.F_OK);

      const contentOut = Array.from(await readFile(expectedPath));
      expect(contentOut).toEqual(bytes);
    });
  });
});
