// @license
// Copyright (c) 2025 tssuite
//
// Use of this source code is governed by terms that can be
// found in the LICENSE file in the root of this package.

import { JsonValue } from '@rljson/json';

import * as fs from 'fs/promises';
import * as path from 'path';

import { goldenDir } from './tools.ts';

// .............................................................................
/// Write golden file with JSON compatible data types
export async function writeGolden(
  fileName: string,
  data: JsonValue,
): Promise<void> {
  const goldensDir = await goldenDir();
  const filePath = path.join(goldensDir, fileName);

  // Stringify json
  const encoded =
    typeof data === 'string' ? data : JSON.stringify(data, null, 2);

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, encoded, 'utf8');
}

// .............................................................................
/// Write golden file with binary data
export async function writeBinaryGolden(
  fileName: string,
  data: Buffer | Uint8Array | number[],
): Promise<void> {
  const goldensDir = await goldenDir();
  const filePath = path.join(goldensDir, fileName);

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, Buffer.from(data));
}
