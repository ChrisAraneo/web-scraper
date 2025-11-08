/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable no-undefined */

import * as fs from 'node:fs';

import { noop } from 'lodash';

import { logger } from './logger';
import { writeFile } from './write-file';

jest.mock('node:fs');
const MOCKED_FS = fs as jest.Mocked<typeof fs>;

jest.mock('./logger');
const MOCKED_LOGGER = logger as jest.Mocked<typeof logger>;

describe('writeFile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('successful file writing', () => {
    it('should return true when writing simple object', async () => {
      const testData = { name: 'test', value: 123 };
      const filepath = 'test.json';
      MOCKED_FS.writeFileSync.mockImplementation(noop);

      const isSuccessful = await writeFile(testData, filepath);

      expect(isSuccessful).toBe(true);
      expect(MOCKED_FS.writeFileSync).toHaveBeenCalledWith(
        filepath,
        JSON.stringify(testData),
        'utf8',
      );
      expect(MOCKED_FS.writeFileSync).toHaveBeenCalledTimes(1);
    });

    it('should return true when writing array', async () => {
      const testData = [1, 2, 3, 4, 5];
      const filepath = 'numbers.json';
      MOCKED_FS.writeFileSync.mockImplementation(noop);

      const isSuccessful = await writeFile(testData, filepath);

      expect(isSuccessful).toBe(true);
      expect(MOCKED_FS.writeFileSync).toHaveBeenCalledWith(
        filepath,
        JSON.stringify(testData),
        'utf8',
      );
    });

    it('should return true when writing string', async () => {
      const testData = 'Hello, World!';
      const filepath = 'hello.json';
      MOCKED_FS.writeFileSync.mockImplementation(noop);

      const isSuccessful = await writeFile(testData, filepath);

      expect(isSuccessful).toBe(true);
      expect(MOCKED_FS.writeFileSync).toHaveBeenCalledWith(
        filepath,
        JSON.stringify(testData),
        'utf8',
      );
    });

    it('should return true when writing number', async () => {
      const testData = 42;
      const filepath = 'number.json';
      MOCKED_FS.writeFileSync.mockImplementation(noop);

      const isSuccessful = await writeFile(testData, filepath);

      expect(isSuccessful).toBe(true);
      expect(MOCKED_FS.writeFileSync).toHaveBeenCalledWith(
        filepath,
        JSON.stringify(testData),
        'utf8',
      );
    });

    it('should return true when writing boolean', async () => {
      const isBooleanData = true;
      const filepath = 'boolean.json';
      MOCKED_FS.writeFileSync.mockImplementation(noop);

      const isSuccessful = await writeFile(isBooleanData, filepath);

      expect(isSuccessful).toBe(true);
      expect(MOCKED_FS.writeFileSync).toHaveBeenCalledWith(
        filepath,
        JSON.stringify(isBooleanData),
        'utf8',
      );
    });

    it('should return true when writing null', async () => {
      const testData = null;
      const filepath = 'null.json';
      MOCKED_FS.writeFileSync.mockImplementation(noop);

      const isSuccessful = await writeFile(testData, filepath);

      expect(isSuccessful).toBe(true);
      expect(MOCKED_FS.writeFileSync).toHaveBeenCalledWith(
        filepath,
        JSON.stringify(testData),
        'utf8',
      );
    });

    it('should handle undefined data', async () => {
      const testData = undefined;
      const filepath = 'undefined.json';
      MOCKED_FS.writeFileSync.mockImplementation(noop);

      const isSuccessful = await writeFile(testData, filepath);

      expect(isSuccessful).toBe(true);
      expect(MOCKED_FS.writeFileSync).toHaveBeenCalledWith(
        filepath,
        JSON.stringify(testData),
        'utf8',
      );
    });
  });

  describe('file writing errors', () => {
    it('should return false and log error when fs.writeFileSync throws ENOENT error', async () => {
      const testData = { test: 'data' };
      const filepath = '/invalid/path/file.json';
      const testError = new Error('ENOENT: no such file or directory');
      (testError as any).code = 'ENOENT';
      MOCKED_FS.writeFileSync.mockImplementation(() => {
        throw testError;
      });

      const isSuccessful = await writeFile(testData, filepath);

      expect(isSuccessful).toBe(false);
      expect(MOCKED_LOGGER.error).toHaveBeenCalledWith(
        `Error saving file ${filepath}:`,
        testError,
      );
      expect(MOCKED_LOGGER.error).toHaveBeenCalledTimes(1);
    });

    it('should return false and log error when fs.writeFileSync throws EACCES error', async () => {
      const testData = { test: 'data' };
      const filepath = '/root/protected.json';
      const testError = new Error('EACCES: permission denied');
      (testError as any).code = 'EACCES';
      MOCKED_FS.writeFileSync.mockImplementation(() => {
        throw testError;
      });

      const isSuccessful = await writeFile(testData, filepath);

      expect(isSuccessful).toBe(false);
      expect(MOCKED_LOGGER.error).toHaveBeenCalledWith(
        `Error saving file ${filepath}:`,
        testError,
      );
    });

    it('should return false and log error when fs.writeFileSync throws ENOSPC error', async () => {
      const testData = { test: 'data' };
      const filepath = 'file.json';
      const testError = new Error('ENOSPC: no space left on device');
      (testError as any).code = 'ENOSPC';
      MOCKED_FS.writeFileSync.mockImplementation(() => {
        throw testError;
      });

      const isSuccessful = await writeFile(testData, filepath);

      expect(isSuccessful).toBe(false);
      expect(MOCKED_LOGGER.error).toHaveBeenCalledWith(
        `Error saving file ${filepath}:`,
        testError,
      );
    });

    it('should return false and log error for generic error', async () => {
      const testData = { test: 'data' };
      const filepath = 'file.json';
      const testError = new Error('Unknown error occurred');
      MOCKED_FS.writeFileSync.mockImplementation(() => {
        throw testError;
      });

      const isSuccessful = await writeFile(testData, filepath);

      expect(isSuccessful).toBe(false);
      expect(MOCKED_LOGGER.error).toHaveBeenCalledWith(
        `Error saving file ${filepath}:`,
        testError,
      );
    });
  });

  describe('JSON serialization edge cases', () => {
    it('should handle circular references gracefully', async () => {
      const testData: any = { name: 'test' };
      testData.self = testData;
      const filepath = 'circular.json';

      jest.spyOn(JSON, 'stringify').mockImplementation(() => {
        throw new TypeError('Converting circular structure to JSON');
      });

      MOCKED_FS.writeFileSync.mockImplementation(noop);

      const isSuccessful = await writeFile(testData, filepath);

      expect(isSuccessful).toBe(false);
      expect(MOCKED_LOGGER.error).toHaveBeenCalledWith(
        `Error saving file ${filepath}:`,
        expect.any(TypeError),
      );

      (JSON.stringify as jest.Mock).mockRestore();
    });
  });
});
