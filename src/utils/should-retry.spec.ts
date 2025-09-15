/* eslint-disable no-undefined */
/* eslint-disable unicorn/no-useless-undefined */

import { shouldRetry } from './should-retry';

describe('shouldRetry', () => {
  describe('when data has no status property', () => {
    it('should return true for undefined data', () => {
      expect(shouldRetry(undefined)).toBe(true);
    });

    it('should return true for null data', () => {
      expect(shouldRetry(null)).toBe(true);
    });

    it('should return true for empty object', () => {
      expect(shouldRetry({})).toBe(true);
    });

    it('should return true for object without status', () => {
      expect(shouldRetry({ message: 'error' })).toBe(true);
    });

    it('should return true when status is null', () => {
      expect(shouldRetry({ status: null })).toBe(true);
    });

    it('should return true when status is undefined', () => {
      expect(shouldRetry({ status: undefined })).toBe(true);
    });
  });

  describe('when status is 429 (Too Many Requests)', () => {
    it('should return true for status 429', () => {
      expect(shouldRetry({ status: 429 })).toBe(true);
    });
  });

  describe('when status is 5xx (Server Errors)', () => {
    it('should return true for status 500', () => {
      expect(shouldRetry({ status: 500 })).toBe(true);
    });

    it('should return true for status 501', () => {
      expect(shouldRetry({ status: 501 })).toBe(true);
    });

    it('should return true for status 502', () => {
      expect(shouldRetry({ status: 502 })).toBe(true);
    });

    it('should return true for status 503', () => {
      expect(shouldRetry({ status: 503 })).toBe(true);
    });

    it('should return true for status 504', () => {
      expect(shouldRetry({ status: 504 })).toBe(true);
    });

    it('should return true for status 599', () => {
      expect(shouldRetry({ status: 599 })).toBe(true);
    });
  });

  describe('when status indicates success or client error', () => {
    it('should return false for status 200 (OK)', () => {
      expect(shouldRetry({ status: 200 })).toBe(false);
    });

    it('should return false for status 201 (Created)', () => {
      expect(shouldRetry({ status: 201 })).toBe(false);
    });

    it('should return false for status 204 (No Content)', () => {
      expect(shouldRetry({ status: 204 })).toBe(false);
    });

    it('should return false for status 400 (Bad Request)', () => {
      expect(shouldRetry({ status: 400 })).toBe(false);
    });

    it('should return false for status 401 (Unauthorized)', () => {
      expect(shouldRetry({ status: 401 })).toBe(false);
    });

    it('should return false for status 403 (Forbidden)', () => {
      expect(shouldRetry({ status: 403 })).toBe(false);
    });

    it('should return false for status 404 (Not Found)', () => {
      expect(shouldRetry({ status: 404 })).toBe(false);
    });

    it('should return false for status 422 (Unprocessable Entity)', () => {
      expect(shouldRetry({ status: 422 })).toBe(false);
    });
  });

  describe('when argument is unexpected data type', () => {
    it('should handle string status codes', () => {
      expect(shouldRetry({ status: '500' })).toBe(true);
      expect(shouldRetry({ status: '429' })).toBe(true);
      expect(shouldRetry({ status: '200' })).toBe(false);
    });

    it('should handle floating point status codes', () => {
      expect(shouldRetry({ status: 500.5 })).toBe(true);
      expect(shouldRetry({ status: 429 })).toBe(true);
      expect(shouldRetry({ status: 200.1 })).toBe(true);
    });
  });

  describe('when working with complex data structures', () => {
    it('should work with nested status property', () => {
      const data = {
        response: {
          status: 429,
        },
        status: 429,
      };

      expect(shouldRetry(data)).toBe(true);
    });

    it('should work with axios-like error objects', () => {
      const axiosError = {
        status: 503,
        message: 'Service Unavailable',
        config: {},
        response: {
          data: {},
          status: 503,
          statusText: 'Service Unavailable',
        },
      };

      expect(shouldRetry(axiosError)).toBe(true);
    });

    it('should work with additional properties', () => {
      const data = {
        status: 429,
        message: 'Rate limit exceeded',
        retryAfter: 60,
        timestamp: Date.now(),
      };

      expect(shouldRetry(data)).toBe(true);
    });
  });
});
