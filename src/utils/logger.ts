import { Logger, LogLevel } from '@chris.araneo/logger';
import { getEnvOrExitProcess } from './get-env-or-exit-process';

const LOG_LEVEL = getEnvOrExitProcess('LOG_LEVEL');

export const logger = new Logger(LOG_LEVEL as LogLevel);
