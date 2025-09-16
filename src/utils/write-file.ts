import * as fs from 'fs';
import { logger } from './logger';

export async function writeFile<T>(data: T, filepath: string): Promise<boolean> {
  try {
    fs.writeFileSync(filepath, JSON.stringify(data), 'utf8');
    return true;
  } catch (error) {
    logger.error(`Error saving file ${filepath}:`, error);
    return false;
  }
}
