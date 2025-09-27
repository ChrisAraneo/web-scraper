/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable no-undefined */

import { getEnvOrExitProcess } from './get-env-or-exit-process';
import { logger } from './logger';

jest.mock('./logger');
const MOCKED_LOGGER = logger as jest.Mocked<typeof logger>;

const MOCK_PROCESS_EXIT = jest
  .spyOn(process, 'exit')
  .mockImplementation(() => undefined as never);

describe('getEnvOrExitProcess', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
    MOCK_PROCESS_EXIT.mockRestore();
  });

  describe('when environment variable exists', () => {
    it('should return the environment variable value', () => {
      const envKey = 'TEST_ENV_VAR';
      const envValue = 'test-value';
      process.env[envKey] = envValue;

      const result = getEnvOrExitProcess(envKey);

      expect(result).toBe(envValue);
      expect(MOCKED_LOGGER.error).not.toHaveBeenCalled();
      expect(MOCK_PROCESS_EXIT).not.toHaveBeenCalled();
    });

    it('should return empty string when environment variable is empty', () => {
      const envKey = 'EMPTY_ENV_VAR';
      const envValue = '';
      process.env[envKey] = envValue;

      const result = getEnvOrExitProcess(envKey);

      expect(result).toBe(envValue);
      expect(MOCKED_LOGGER.error).not.toHaveBeenCalled();
      expect(MOCK_PROCESS_EXIT).not.toHaveBeenCalled();
    });

    it('should return environment variable with special characters', () => {
      const envKey = 'SPECIAL_CHARS_ENV';
      const envValue = 'test@123!#$%^&*()';
      process.env[envKey] = envValue;

      const result = getEnvOrExitProcess(envKey);

      expect(result).toBe(envValue);
      expect(MOCKED_LOGGER.error).not.toHaveBeenCalled();
      expect(MOCK_PROCESS_EXIT).not.toHaveBeenCalled();
    });

    it('should return environment variable with spaces', () => {
      const envKey = 'SPACES_ENV_VAR';
      const envValue = 'value with spaces';
      process.env[envKey] = envValue;

      const result = getEnvOrExitProcess(envKey);

      expect(result).toBe(envValue);
      expect(MOCKED_LOGGER.error).not.toHaveBeenCalled();
      expect(MOCK_PROCESS_EXIT).not.toHaveBeenCalled();
    });

    it('should return environment variable with numeric value', () => {
      const envKey = 'NUMERIC_ENV_VAR';
      const envValue = '12345';
      process.env[envKey] = envValue;

      const result = getEnvOrExitProcess(envKey);

      expect(result).toBe(envValue);
      expect(MOCKED_LOGGER.error).not.toHaveBeenCalled();
      expect(MOCK_PROCESS_EXIT).not.toHaveBeenCalled();
    });
  });

  describe('when environment variable does not exist', () => {
    it('should log error and exit process when environment variable is undefined', () => {
      const envKey = 'UNDEFINED_ENV_VAR';
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete process.env[envKey];

      getEnvOrExitProcess(envKey);

      expect(MOCKED_LOGGER.error).toHaveBeenCalledWith(
        `${envKey} is not defined`,
      );
      expect(MOCKED_LOGGER.error).toHaveBeenCalledTimes(1);
      expect(MOCK_PROCESS_EXIT).toHaveBeenCalledWith(1);
      expect(MOCK_PROCESS_EXIT).toHaveBeenCalledTimes(1);
    });

    it('should log error and exit process when environment variable key does not exist', () => {
      const envKey = 'NON_EXISTENT_KEY';

      getEnvOrExitProcess(envKey);

      expect(MOCKED_LOGGER.error).toHaveBeenCalledWith(
        `${envKey} is not defined`,
      );
      expect(MOCKED_LOGGER.error).toHaveBeenCalledTimes(1);
      expect(MOCK_PROCESS_EXIT).toHaveBeenCalledWith(1);
      expect(MOCK_PROCESS_EXIT).toHaveBeenCalledTimes(1);
    });
  });

  describe('when handling edge cases', () => {
    it('should handle environment variable key with special characters', () => {
      const envKey = 'TEST_ENV_@#$';
      const envValue = 'special-key-value';
      process.env[envKey] = envValue;

      const result = getEnvOrExitProcess(envKey);

      expect(result).toBe(envValue);
      expect(MOCKED_LOGGER.error).not.toHaveBeenCalled();
      expect(MOCK_PROCESS_EXIT).not.toHaveBeenCalled();
    });

    it('should handle very long environment variable key', () => {
      const envKey = 'VERY_LONG_ENVIRONMENT_VARIABLE_KEY_THAT_GOES_ON_AND_ON';
      const envValue = 'long-key-value';
      process.env[envKey] = envValue;

      const result = getEnvOrExitProcess(envKey);

      expect(result).toBe(envValue);
      expect(MOCKED_LOGGER.error).not.toHaveBeenCalled();
      expect(MOCK_PROCESS_EXIT).not.toHaveBeenCalled();
    });

    it('should handle very long environment variable value', () => {
      const envKey = 'LONG_VALUE_ENV';
      const envValue = 'a'.repeat(1000);
      process.env[envKey] = envValue;

      const result = getEnvOrExitProcess(envKey);

      expect(result).toBe(envValue);
      expect(MOCKED_LOGGER.error).not.toHaveBeenCalled();
      expect(MOCK_PROCESS_EXIT).not.toHaveBeenCalled();
    });

    it('should handle environment variable key with numbers', () => {
      const envKey = 'ENV_VAR_123';
      const envValue = 'numeric-key-value';
      process.env[envKey] = envValue;

      const result = getEnvOrExitProcess(envKey);

      expect(result).toBe(envValue);
      expect(MOCKED_LOGGER.error).not.toHaveBeenCalled();
      expect(MOCK_PROCESS_EXIT).not.toHaveBeenCalled();
    });

    it('should handle environment variable with boolean-like string values', () => {
      const envKey = 'BOOLEAN_ENV_VAR';
      const envValue = 'true';
      process.env[envKey] = envValue;

      const result = getEnvOrExitProcess(envKey);

      expect(result).toBe(envValue);
      expect(MOCKED_LOGGER.error).not.toHaveBeenCalled();
      expect(MOCK_PROCESS_EXIT).not.toHaveBeenCalled();
    });
  });

  describe('when verifying function behavior', () => {
    it('should call logger.error before process.exit when environment variable is missing', () => {
      const envKey = 'MISSING_ENV_VAR';
      const callOrder: string[] = [];

      MOCKED_LOGGER.error.mockImplementation(() => {
        callOrder.push('logger.error');
      });

      MOCK_PROCESS_EXIT.mockImplementation(() => {
        callOrder.push('process.exit');
        return undefined as never;
      });

      getEnvOrExitProcess(envKey);

      expect(callOrder).toEqual(['logger.error', 'process.exit']);
    });

    it('should exit with code 1 when environment variable is missing', () => {
      const envKey = 'MISSING_ENV_VAR';

      getEnvOrExitProcess(envKey);

      expect(MOCK_PROCESS_EXIT).toHaveBeenCalledWith(1);
    });

    it('should return string type for existing environment variable', () => {
      const envKey = 'STRING_TYPE_ENV';
      const envValue = 'test-string';
      process.env[envKey] = envValue;

      const result = getEnvOrExitProcess(envKey);

      expect(typeof result).toBe('string');
      expect(result).toBe(envValue);
    });
  });
});
