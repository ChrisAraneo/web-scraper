import * as fs from 'fs';

export function createDirectoryWhenDoesntExist(directory: string): void {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}
