import { isUndefined } from 'lodash';
import { logger } from './logger';

export function getEnvOrExitProcess(key: string): string {
  const value = process.env[key];

  if (isUndefined(value)) {
    logger.error(`${key} is not defined`);
    process.exit(1);
  }

  return value;
}
