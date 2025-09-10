import * as fs from 'fs';

export function createDirWhenMissing(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
