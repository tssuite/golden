// @license
// Copyright (c) 2025 tssuite
//
// Use of this source code is governed by terms that can be
// found in the LICENSE file in the root of this package.

import { existsSync } from 'fs';
import * as fs from 'fs/promises';
import * as path from 'path';

// .............................................................................
/// Returns the root of the current project
export async function projectRoot(
  filePath: string,
  depth = 10,
): Promise<string> {
  // Is path directory? If not, use parent directory
  const dir = (await fs.stat(filePath)).isFile()
    ? path.dirname(filePath)
    : filePath;

  const parent = dir.replaceAll('\\', '/').split('/');
  let restDepth = depth;
  while (
    parent.length > 0 &&
    !(parent.length == 1 && parent[0].trim().length == 0) &&
    restDepth > 0
  ) {
    const joined = parent.join('/');
    const packageJson = path.join(joined, 'package.json');

    if (existsSync(packageJson)) {
      return joined;
    }

    parent.pop();
    restDepth--;
  }

  throw new Error('No package.json found.');
}

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
): Promise<string> {
  stackTrace ??= new Error().stack!;
  const cp = callerPath(stackTrace!);

  const root = await projectRoot(cp);
  const relativePath = path.relative(root, cp).replace(/\\/g, '/');
  if (!/^test[\/\\]/.test(relativePath)) {
    throw new Error(
      'writeGolden(...) must only be called from files within test',
    );
  }

  // test/write_golden_test.dart -> write_golden
  const directory = relativePath.substring(5, relativePath.length - 8);
  const result = path
    .join(root, 'test', 'goldens', directory)
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
