import * as fs from 'node:fs';

import { createDirectoryWhenDoesntExist } from './create-directory-when-doesnt-exist';

jest.mock('node:fs');
const MOCKED_FS = fs as jest.Mocked<typeof fs>;

describe('createDirectoryWhenDoesntExist', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when directory does not exist', () => {
    it('should create directory when path does not exist', () => {
      const directoryPath = '/path/to/new/directory';
      MOCKED_FS.existsSync.mockReturnValue(false);
      MOCKED_FS.mkdirSync.mockReturnValue('');

      createDirectoryWhenDoesntExist(directoryPath);

      expect(MOCKED_FS.existsSync).toHaveBeenCalledWith(directoryPath);
      expect(MOCKED_FS.mkdirSync).toHaveBeenCalledWith(
        directoryPath,
        expect.objectContaining({
          recursive: expect.any(Boolean),
        }),
      );
      expect(MOCKED_FS.existsSync).toHaveBeenCalledTimes(1);
      expect(MOCKED_FS.mkdirSync).toHaveBeenCalledTimes(1);
    });

    it('should create nested directory structure', () => {
      const directoryPath = '/very/deep/nested/directory/structure';
      MOCKED_FS.existsSync.mockReturnValue(false);
      MOCKED_FS.mkdirSync.mockReturnValue('');

      createDirectoryWhenDoesntExist(directoryPath);

      expect(MOCKED_FS.existsSync).toHaveBeenCalledWith(directoryPath);
      expect(MOCKED_FS.mkdirSync).toHaveBeenCalledWith(
        directoryPath,
        expect.any(Object),
      );
    });

    it('should create directory with relative path', () => {
      const directoryPath = './output/data';
      MOCKED_FS.existsSync.mockReturnValue(false);
      MOCKED_FS.mkdirSync.mockReturnValue('');

      createDirectoryWhenDoesntExist(directoryPath);

      expect(MOCKED_FS.existsSync).toHaveBeenCalledWith(directoryPath);
      expect(MOCKED_FS.mkdirSync).toHaveBeenCalledWith(
        directoryPath,
        expect.any(Object),
      );
    });

    it('should create directory with Windows-style path', () => {
      const directoryPath = String.raw`C:\Users\test\Documents\output`;
      MOCKED_FS.existsSync.mockReturnValue(false);
      MOCKED_FS.mkdirSync.mockReturnValue('');

      createDirectoryWhenDoesntExist(directoryPath);

      expect(MOCKED_FS.existsSync).toHaveBeenCalledWith(directoryPath);
      expect(MOCKED_FS.mkdirSync).toHaveBeenCalledWith(
        directoryPath,
        expect.any(Object),
      );
    });

    it('should create directory with recursive option set to true', () => {
      const directoryPath = '/path/to/new/directory';
      const expectedOptions = { recursive: true } as const;
      MOCKED_FS.existsSync.mockReturnValue(false);
      MOCKED_FS.mkdirSync.mockReturnValue('');

      createDirectoryWhenDoesntExist(directoryPath);

      expect(MOCKED_FS.existsSync).toHaveBeenCalledWith(directoryPath);
      expect(MOCKED_FS.mkdirSync).toHaveBeenCalledWith(
        directoryPath,
        expectedOptions,
      );
    });
  });

  describe('when directory already exists', () => {
    it('should not create directory when path already exists', () => {
      const directoryPath = '/existing/directory';
      MOCKED_FS.existsSync.mockReturnValue(true);
      MOCKED_FS.mkdirSync.mockReturnValue('');

      createDirectoryWhenDoesntExist(directoryPath);

      expect(MOCKED_FS.existsSync).toHaveBeenCalledWith(directoryPath);
      expect(MOCKED_FS.mkdirSync).not.toHaveBeenCalled();
      expect(MOCKED_FS.existsSync).toHaveBeenCalledTimes(1);
    });
  });

  describe('when handling edge cases', () => {
    it('should handle empty string path', () => {
      const directoryPath = '';
      MOCKED_FS.existsSync.mockReturnValue(false);
      MOCKED_FS.mkdirSync.mockReturnValue('');

      createDirectoryWhenDoesntExist(directoryPath);

      expect(MOCKED_FS.existsSync).toHaveBeenCalledWith(directoryPath);
      expect(MOCKED_FS.mkdirSync).toHaveBeenCalledWith(
        directoryPath,
        expect.any(Object),
      );
    });

    it('should handle path with spaces', () => {
      const directoryPath = '/path with spaces/another folder';
      MOCKED_FS.existsSync.mockReturnValue(false);
      MOCKED_FS.mkdirSync.mockReturnValue('');

      createDirectoryWhenDoesntExist(directoryPath);

      expect(MOCKED_FS.existsSync).toHaveBeenCalledWith(directoryPath);
      expect(MOCKED_FS.mkdirSync).toHaveBeenCalledWith(
        directoryPath,
        expect.any(Object),
      );
    });

    it('should handle path with special characters', () => {
      const directoryPath = '/path-with_special.chars/folder@123';
      MOCKED_FS.existsSync.mockReturnValue(false);
      MOCKED_FS.mkdirSync.mockReturnValue('');

      createDirectoryWhenDoesntExist(directoryPath);

      expect(MOCKED_FS.existsSync).toHaveBeenCalledWith(directoryPath);
      expect(MOCKED_FS.mkdirSync).toHaveBeenCalledWith(
        directoryPath,
        expect.any(Object),
      );
    });

    it('should handle very long path', () => {
      const directoryPath =
        '/very/long/path/with/many/nested/directories/that/goes/on/and/on/for/a/very/long/time';
      MOCKED_FS.existsSync.mockReturnValue(false);
      MOCKED_FS.mkdirSync.mockReturnValue('');

      createDirectoryWhenDoesntExist(directoryPath);

      expect(MOCKED_FS.existsSync).toHaveBeenCalledWith(directoryPath);
      expect(MOCKED_FS.mkdirSync).toHaveBeenCalledWith(
        directoryPath,
        expect.any(Object),
      );
    });
  });

  describe('when handling errors', () => {
    it('should propagate error when mkdirSync throws EACCES error', () => {
      const directoryPath = '/root/protected-directory';
      const testError = new Error('EACCES: permission denied');
      (testError as any).code = 'EACCES';
      MOCKED_FS.existsSync.mockReturnValue(false);
      MOCKED_FS.mkdirSync.mockImplementation(() => {
        throw testError;
      });

      expect(() => createDirectoryWhenDoesntExist(directoryPath)).toThrow(
        testError,
      );
      expect(MOCKED_FS.existsSync).toHaveBeenCalledWith(directoryPath);
      expect(MOCKED_FS.mkdirSync).toHaveBeenCalledWith(
        directoryPath,
        expect.any(Object),
      );
    });

    it('should propagate error when mkdirSync throws ENOSPC error', () => {
      const directoryPath = '/tmp/new-directory';
      const testError = new Error('ENOSPC: no space left on device');
      (testError as any).code = 'ENOSPC';
      MOCKED_FS.existsSync.mockReturnValue(false);
      MOCKED_FS.mkdirSync.mockImplementation(() => {
        throw testError;
      });

      expect(() => createDirectoryWhenDoesntExist(directoryPath)).toThrow(
        testError,
      );
      expect(MOCKED_FS.existsSync).toHaveBeenCalledWith(directoryPath);
      expect(MOCKED_FS.mkdirSync).toHaveBeenCalledWith(
        directoryPath,
        expect.any(Object),
      );
    });

    it('should propagate error when mkdirSync throws generic error', () => {
      const directoryPath = '/some/directory';
      const testError = new Error('Unknown filesystem error');
      MOCKED_FS.existsSync.mockReturnValue(false);
      MOCKED_FS.mkdirSync.mockImplementation(() => {
        throw testError;
      });

      expect(() => createDirectoryWhenDoesntExist(directoryPath)).toThrow(
        testError,
      );
      expect(MOCKED_FS.existsSync).toHaveBeenCalledWith(directoryPath);
      expect(MOCKED_FS.mkdirSync).toHaveBeenCalledWith(
        directoryPath,
        expect.any(Object),
      );
    });

    it('should propagate error when existsSync throws error', () => {
      const directoryPath = '/some/directory';
      const testError = new Error('Error checking if path exists');
      MOCKED_FS.existsSync.mockImplementation(() => {
        throw testError;
      });

      expect(() => createDirectoryWhenDoesntExist(directoryPath)).toThrow(
        testError,
      );
      expect(MOCKED_FS.existsSync).toHaveBeenCalledWith(directoryPath);
      expect(MOCKED_FS.mkdirSync).not.toHaveBeenCalled();
    });
  });

  describe('when verifying function behavior', () => {
    it('should call existsSync before mkdirSync', () => {
      const directoryPath = '/test/directory';
      const callOrder: string[] = [];

      MOCKED_FS.existsSync.mockImplementation(() => {
        callOrder.push('existsSync');
        return false;
      });

      MOCKED_FS.mkdirSync.mockImplementation(() => {
        callOrder.push('mkdirSync');
        return '';
      });

      createDirectoryWhenDoesntExist(directoryPath);

      expect(callOrder).toEqual(['existsSync', 'mkdirSync']);
    });

    it('should return void', () => {
      const directoryPath = '/test/directory';
      MOCKED_FS.existsSync.mockReturnValue(false);
      MOCKED_FS.mkdirSync.mockReturnValue('');

      const returnValue = createDirectoryWhenDoesntExist(directoryPath);

      expect(returnValue).toBeUndefined();
    });

    it('should use options object for mkdirSync', () => {
      const directoryPath = '/nested/path/structure';
      MOCKED_FS.existsSync.mockReturnValue(false);
      MOCKED_FS.mkdirSync.mockReturnValue('');

      createDirectoryWhenDoesntExist(directoryPath);

      expect(MOCKED_FS.mkdirSync).toHaveBeenCalledWith(
        directoryPath,
        expect.any(Object),
      );
    });
  });
});
