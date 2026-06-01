// @license
// Copyright (c) 2025 tssuite
//
// Use of this source code is governed by terms that can be
// found in the LICENSE file in the root of this package.

import { projectRoot } from '@tssuite/project-root';

import * as path from 'path';

// .............................................................................
/// Derives the goldens directory from a stack trace
export function callerPath(stackTrace: string): string {
  const specTsFiles = stackTrace
    .replaceAll('at ', '')
    .replace('Error:', '')
    .trim()
    .split('\n')
    .filter((e) => e.indexOf('spec.ts') >= 0);

  if (specTsFiles.length === 0) {
    _throw('Could not find ".spec.ts" in call stack.');
  }

  const entry = specTsFiles[0];

  const callerFilePath = entry
    .substring(0, entry.indexOf('.ts') + 3)
    .replace(/\\/g, '/')
    .replace(/^.*\(/g, '')
    .trim();

  return callerFilePath;
}

// .............................................................................
/// Derives the goldens directory from a stack trace
export async function goldenDir(
  stackTrace: string | undefined = undefined,
  testProjectRoot?: string,
): Promise<string> {
  stackTrace ??= new Error().stack!;
  const cp = callerPath(stackTrace!);

  const root = testProjectRoot ?? (await projectRoot(cp));
  const relativePath = path.relative(root, cp).replace(/\\/g, '/');

  // The test directory may live directly in the project root, or inside any
  // subfolder (e.g. `typescript/test`). The goldens dir is rooted at whatever
  // path precedes the `test/` segment.
  const match = relativePath.match(/^(?:(.*)\/)?test\/(.*)$/);
  if (!match) {
    throw new Error(
      'writeGolden(...) must only be called from files within test',
    );
  }
  const prefix = match[1];
  const fileName = match[2];
  const testRoot = prefix ? path.join(root, prefix) : root;

  // test/write_golden_test.dart -> write_golden
  const directory = fileName.substring(0, fileName.length - 8);
  const result = path
    .join(testRoot, 'test', 'goldens', directory)
    .replace(/\\/g, '/');

  return result;
}

// .............................................................................
function _throw(error: string): never {
  throw new Error(
    [
      'write_golden: ' + error,
      '  Please submit an error report to ',
      '  https://github.com/ggsuite/gg_golden/issues',
    ].join('\n'),
  );
}
