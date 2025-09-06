import * as fs from 'fs';
import { logger } from './logger';

export async function writeFile(data: any, filepath: string): Promise<boolean> {
  const content = data.map((item) => JSON.stringify(item)).join('\n');

  try {
    fs.writeFileSync(filepath, content, 'utf8');
    return true;
  } catch (error) {
    logger.error(`Error saving file ${filepath}:`, error);
    return false;
  }
}
