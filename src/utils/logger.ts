import { Logger, LogLevel } from '@chris.araneo/logger';

export const logger = new Logger(process.env['LOG_LEVEL'] as LogLevel || 'info');
