// @license
// Copyright (c) 2025 tssuite
//
// Use of this source code is governed by terms that can be
// found in the LICENSE file in the root of this package.

import * as fs from 'fs';
import { rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import * as path from 'path';
import { describe, expect, it } from 'vitest';

import { callerPath, goldenDir } from '../src/tools';

describe('Tools', () => {
  describe('callerPath(stackTrace)', () => {
    it('with the current test file', () => {
      expect(callerPath(new Error().stack!)).toMatch(/test\/tools.spec.ts$/);
    });

    it('with a windows path', () => {
      const dir = callerPath(
        ['Error:', 'at C:path\\toproject\\test\\tools.spec.ts:5:13'].join('\n'),
      );
      expect(dir).toBe('C:path/toproject/test/tools.spec.ts');
    });

    it('with a linux path', () => {
      const dir = callerPath(
        ['Error:', 'at /dev/tools_test/some.spec.ts:5:13'].join('\n'),
      );
      expect(dir).toBe('/dev/tools_test/some.spec.ts');
    });

    it('with special path', () => {
      const stackTrace = [
        'Error: ',
        '    at goldenDir (/Users/xyz/dev/tssuite/golden/src/tools.ts:72:18)',
        '    at writeGolden (/Users/xyz/dev/tssuite/golden/src/golden.ts:20:28)',
        '    at testGolden (/Users/xyz/dev/tssuite/golden/test/golden.spec.ts:20:13)',
        '    at /Users/xyz/dev/tssuite/golden/test/golden.spec.ts:36:13',
        '    at file:///Users/xyz/dev/tssuite/golden/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:155:11',
      ].join('\n');

      const dir = callerPath(stackTrace);
      expect(dir).toBe('/Users/xyz/dev/tssuite/golden/test/golden.spec.ts');
    });

    it('throws when no path is found', () => {
      let message: string[] = [];
      try {
        callerPath(['#0 a', '#1 main. file://b'].join('\n'));
      } catch (e: any) {
        message = e.message.toString().split('\n');
      }
      expect(message).toEqual([
        'write_golden: Could not find ".spec.ts" in call stack.',
        '  Please submit an error report to ',
        '  https://github.com/ggsuite/gg_golden/issues',
      ]);
    });
  });

  describe('goldenDir(stackTrace)', () => {
    describe('returns the goldens dir for the current test file', () => {
      it('with the current test file', async () => {
        const result = await goldenDir(new Error().stack || '');
        expect(result).toContain('golden/test/goldens/tools');
      });
    });

    describe('throws', () => {
      it('when stack trace does not contain a spec.ts file', async () => {
        let message: string[] = [];
        try {
          await goldenDir(['#0 a', '#1 b'].join('\n'));
        } catch (e: any) {
          message = e.message.toString().split('\n');
        }
        expect(message).toEqual([
          'write_golden: Could not find ".spec.ts" in call stack.',
          '  Please submit an error report to ',
          '  https://github.com/ggsuite/gg_golden/issues',
        ]);
      });

      it('when file is not in a test directory', async () => {
        let message: string[] = [];
        const tmpDir = fs.mkdtempSync(path.join(tmpdir(), 'tools_test_'));
        await writeFile(path.join(tmpDir, 'package.json'), '{}');
        const filePath = path.join(tmpDir, 'some_test.spec.ts');
        await writeFile(filePath, '{}');
        try {
          await goldenDir(`at ${filePath}`);
        } catch (e: any) {
          message = e.message.toString().split('\n');
        }
        expect(message).toEqual([
          'writeGolden(...) must only be called from files within test',
        ]);
        await rm(tmpDir, { recursive: true });
      });
    });
  });
});
