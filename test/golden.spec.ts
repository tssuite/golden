// @license
// Copyright (c) 2025 tssuite
//
// Use of this source code is governed by terms that can be
// found in the LICENSE file in the root of this package.

import { describe, expect, it } from 'vitest';

import { Golden } from '../src/golden';

describe('Golden', () => {
  it('should validate a template', () => {
    const golden = Golden.example;
    expect(golden).toBeDefined();
  });
});
